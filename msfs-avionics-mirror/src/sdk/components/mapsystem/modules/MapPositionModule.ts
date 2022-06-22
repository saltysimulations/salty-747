import { GeoPoint, GeoPointSubject, MagVar, Subject, UnitType } from '../../..';
import { ADCEvents, GNSSEvents } from '../../../instruments';
import { MapProjectionParameters } from '../../map';
import { AbstractMapModule } from './AbstractMapModule';

/**
 * A module that acquires the position and rotation of the map via the current aircraft properties.
 */
export class MapPositionModule extends AbstractMapModule {
  /** The airplane's position. */
  public readonly position = GeoPointSubject.createFromGeoPoint(new GeoPoint(0, 0));

  /** The airplane's true heading, in degrees. */
  public readonly hdgTrue = Subject.create(0);

  /** The airplane's true ground track, in degrees. */
  public readonly trackTrue = Subject.create(0);

  /** Whether the airplane is on the ground. */
  public readonly isOnGround = Subject.create(true);

  /** The magnetic variation at the airplane's position. */
  public readonly magVar = Subject.create(0);

  /** Whether or not the map rotation should be degrees true. */
  public readonly isRotationTrue = Subject.create(false);

  /** The type of map rotation to use. */
  public readonly rotationType = Subject.create(MapRotation.HeadingUp);

  /** The current source for the map position. */
  public readonly positionSource = Subject.create(MapPositionSource.OwnAirplane);

  private readonly projectionParams: MapProjectionParameters = {
    target: this.position.get(),
    rotation: 0
  };

  private readonly positionHandler = (pos: LatLongAlt): void => this.position.set(pos.lat, pos.long);
  private readonly headingHandler = (v: number): void => this.hdgTrue.set(v);
  private readonly trackHandler = (v: number): void => this.trackTrue.set(v);
  private readonly onGroundHandler = (v: boolean): void => this.isOnGround.set(v);
  private readonly magVarHandler = (v: number): void => this.magVar.set(v);

  private readonly subscriber = this.mapSystemContext.bus.getSubscriber<GNSSEvents & ADCEvents>();

  private positionConsumer = this.subscriber.on('gps-position').atFrequency(this.mapSystemContext.refreshRate);
  private headingConsumer = this.subscriber.on('hdg_deg_true').atFrequency(this.mapSystemContext.refreshRate);
  private trackConsumer = this.subscriber.on('track_deg_true').atFrequency(this.mapSystemContext.refreshRate);
  private onGroundConsumer = this.subscriber.on('on_ground').atFrequency(this.mapSystemContext.refreshRate);
  private magVarConsumer = this.subscriber.on('magvar').atFrequency(this.mapSystemContext.refreshRate);

  private isBusWired = false;

  /**
   * Handles when the map position source is changed.
   * @param source The new map position source.
   */
  private onSourceChanged = (source: MapPositionSource): void => {
    if (this.isSyncing) {
      if (source === MapPositionSource.OwnAirplane) {
        this.wireToBus();
      } else {
        this.unwireFromBus();
      }
    }
  };

  /** @inheritdoc */
  public startSync(): void {
    this.stopSync();

    this.positionSource.sub(this.onSourceChanged, true);
    this.rotationType.sub(this.updateProjection, true);
    this.isRotationTrue.sub(this.updateProjection, true);

    this.position.sub(this.updateProjection, true);
    this.hdgTrue.sub(this.updateProjection, true);
    this.trackTrue.sub(this.updateProjection, true);
    this.magVar.sub(this.updateProjection, true);
    this.isOnGround.sub(this.updateProjection, true);

    if (this.positionSource.get() === MapPositionSource.OwnAirplane) {
      this.wireToBus();
    }

    this.isSyncing = true;
  }

  /**
   * Wires the bus handlers to the data subjects.
   */
  private wireToBus(): void {
    if (!this.isBusWired) {
      this.positionConsumer.handle(this.positionHandler);
      this.headingConsumer.handle(this.headingHandler);
      this.trackConsumer.handle(this.trackHandler);
      this.onGroundConsumer.handle(this.onGroundHandler);
      this.magVarConsumer.handle(this.magVarHandler);

      this.isBusWired = true;
      this.updateProjection();
    }
  }

  /**
   * Unwires the bus handlers from the data subjects.
   */
  private unwireFromBus(): void {
    if (this.isBusWired) {
      this.positionConsumer.off(this.positionHandler);
      this.headingConsumer.off(this.headingHandler);
      this.trackConsumer.off(this.trackHandler);
      this.onGroundConsumer.off(this.onGroundHandler);
      this.magVarConsumer.off(this.magVarHandler);

      this.isBusWired = false;
    }
  }

  /**
   * Updates the map's projection with the position information.
   */
  private updateProjection = (): void => {
    let rotation = 0;
    switch (this.rotationType.get()) {
      case MapRotation.HeadingUp:
        rotation = this.hdgTrue.get();
        break;
      case MapRotation.TrackUp:
        if (this.isOnGround.get()) {
          rotation = this.hdgTrue.get();
        } else {
          rotation = this.trackTrue.get();
        }
        break;
    }

    if (this.isRotationTrue.get()) {
      rotation = MagVar.trueToMagnetic(rotation, -this.magVar.get());
    }

    this.projectionParams.rotation = UnitType.DEGREE.convertTo(-rotation, UnitType.RADIAN);
    this.projectionParams.target = this.position.get();

    this.mapSystemContext.projection.setQueued(this.projectionParams);
  };

  /** @inheritdoc */
  public stopSync(): void {
    if (!this.isSyncing) {
      return;
    }

    this.positionSource.unsub(this.onSourceChanged);
    this.rotationType.unsub(this.updateProjection);
    this.isRotationTrue.unsub(this.updateProjection);

    this.position.unsub(this.updateProjection);
    this.hdgTrue.unsub(this.updateProjection);
    this.trackTrue.unsub(this.updateProjection);
    this.magVar.unsub(this.updateProjection);
    this.isOnGround.unsub(this.updateProjection);

    this.unwireFromBus();
    this.isSyncing = false;
  }
}

/**
 * An enumeration of possible map rotation types.
 */
export enum MapRotation {
  /** Map rotation points towards north up. */
  NorthUp = 'NorthUp',

  /** Map up position points towards the current airplane track. */
  TrackUp = 'TrackUp',

  /** Map up position points towards the current airplane heading. */
  HeadingUp = 'HeadingUp',

  /** Map up position points towards the current nav desired track. */
  DtkUp = 'DtkUp'
}

/**
 * An enumeration of possible map position sources.
 */
export enum MapPositionSource {
  /** Map position will be sourced from the player aircraft. */
  OwnAirplane = 'OwnAirplane',

  /** Map position will be supplied externally and player aircraft position updates will be ignored. */
  External = 'External'
}