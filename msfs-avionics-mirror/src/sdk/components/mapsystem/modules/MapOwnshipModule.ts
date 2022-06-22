import { GeoPoint, GeoPointSubject, Subject } from '../../..';
import { ADCEvents, GNSSEvents } from '../../../instruments';
import { AbstractMapModule } from './AbstractMapModule';

/**
 * A map data module that controls the display of the map ownship icon.
 */
export class MapOwnshipModule extends AbstractMapModule {
  /** Whether or not the icon is visible. */
  public readonly isVisible = Subject.create(true);

  /** The geographical postion of the ownship icon. */
  public readonly position = GeoPointSubject.createFromGeoPoint(new GeoPoint(0, 0));

  /** The heading, in degrees true, that the icon should be pointing. */
  public readonly hdgTrue = Subject.create(0);

  private readonly subscriber = this.mapSystemContext.bus.getSubscriber<GNSSEvents & ADCEvents>();
  private readonly positionConsumer = this.subscriber.on('gps-position').atFrequency(this.mapSystemContext.refreshRate);
  private readonly headingConsumer = this.subscriber.on('hdg_deg_true').atFrequency(this.mapSystemContext.refreshRate);

  private readonly positionHandler = (p: LatLongAlt): void => this.position.set(p.lat, p.long);
  private readonly headingHandler = (v: number): void => this.hdgTrue.set(v);

  /** @inheritdoc */
  public startSync(): void {
    this.positionConsumer.handle(this.positionHandler);
    this.headingConsumer.handle(this.headingHandler);
  }

  /** @inheritdoc */
  public stopSync(): void {
    this.positionConsumer.off(this.positionHandler);
    this.headingConsumer.off(this.headingHandler);
  }
}