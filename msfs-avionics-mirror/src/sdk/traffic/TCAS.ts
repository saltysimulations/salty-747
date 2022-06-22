import { ConsumerSubject, EventSubscriber } from '../data';
import { Consumer } from '../data/Consumer';
import { EventBus, Publisher } from '../data/EventBus';
import { ADCEvents, ClockEvents, GNSSEvents, TrafficContact, TrafficEvents, TrafficInstrument } from '../instruments';
import { GeoPoint, GeoPointInterface, GeoPointReadOnly } from '../geo/GeoPoint';
import { GeoPointSubject } from '../geo/GeoPointSubject';
import { NumberUnit, NumberUnitInterface, NumberUnitReadOnly, UnitFamily, UnitType } from '../math/NumberUnit';
import { NumberUnitSubject } from '../math/NumberUnitSubject';
import { ReadonlyFloat64Array, Vec2Math, Vec3Math } from '../math/VecMath';
import { Subject } from '../sub/Subject';
import { Subscribable } from '../sub/Subscribable';
import { BitFlags } from '../math/BitFlags';

/**
 * TCAS operating modes.
 */
export enum TCASOperatingMode {
  Standby,
  TAOnly,
  TA_RA
}

/**
 * TCAS alert level.
 */
export enum TCASAlertLevel {
  None,
  ProximityAdvisory,
  TrafficAdvisory,
  ResolutionAdvisory
}

/**
 * A time-of-closest-approach prediction made by TCAS.
 */
export interface TCASTcaPrediction {
  /** Whether this prediction is valid. */
  readonly isValid: boolean;

  /** The time at which this prediction was most recently updated, as a UNIX timestamp in milliseconds. */
  readonly time: number;

  /** The predicted time-to-closest-approach at the time of the most recent update. */
  readonly tca: NumberUnitReadOnly<UnitFamily.Duration>;

  /**
   * The predicted 3D displacement vector from own airplane to this prediction's intruder at time of closest approach.
   * Each component is expressed in units of meters.
   */
  readonly tcaDisplacement: ReadonlyFloat64Array;

  /**
   * The cylindrical norm of the predicted displacement vector between this prediction's intruder and own airplane at
   * time of closest approach. A value less than or equal to 1 indicates the intruder will be inside the protected
   * zone. Larger values correspond to greater separation.
   */
  readonly tcaNorm: number;

  /** The predicted horizontal separation between this prediction's intruder and own airplane at time of closest approach. */
  readonly tcaHorizontalSep: NumberUnitReadOnly<UnitFamily.Distance>;

  /** The predicted vertical separation between this prediction's intruder and own airplane at time of closest approach. */
  readonly tcaVerticalSep: NumberUnitReadOnly<UnitFamily.Distance>;
}

/**
 * An intruder tracked by TCAS.
 */
export interface TCASIntruder {
  /** The traffic contact associated with this intruder. */
  readonly contact: TrafficContact;

  /** A subscribable which provides the alert level assigned to this intruder. */
  readonly alertLevel: Subscribable<TCASAlertLevel>;

  /** The position of this intruder at the time of the most recent update. */
  readonly position: GeoPointReadOnly;

  /** The altitude of this intruder at the time of the most recent update. */
  readonly altitude: NumberUnitReadOnly<UnitFamily.Distance>;

  /** The true ground track of this intruder at the time of the most recent update. */
  readonly groundTrack: number;

  /** The ground speed of this intruder at the time of the most recent update. */
  readonly groundSpeed: NumberUnitReadOnly<UnitFamily.Speed>;

  /** The vertical speed of this intruder at the time of the most recent update. */
  readonly verticalSpeed: NumberUnitReadOnly<UnitFamily.Speed>;

  /**
   * The 3D position vector of this intruder at the time of the last update. Each component is expressed in units of
   * meters. The coordinate system is an Euclidean approximation of the geodetic space around the own airplane such
   * that the z-coordinate represents orthometric height and the x- and y-coordinates represent an east-
   * counterclockwise equirectangular projection of latitude and longitude, with the origin at the location of the own
   * airplane.
   */
  readonly positionVec: ReadonlyFloat64Array;

  /**
   * The 3D velocity vector of this intruder at the time of the last update. Each component is expressed in units of
   * meters per second. The coordinate system is defined the same as for position vectors.
   */
  readonly velocityVec: ReadonlyFloat64Array;

  /** The 3D position vector of this intruder relative to own airplane. */
  readonly relativePositionVec: ReadonlyFloat64Array;

  /** The 3D velocity vector of this intruder relative to own airplane. */
  readonly relativeVelocityVec: ReadonlyFloat64Array;

  /** Whether there is a valid prediction for this intruder's position and velocity. */
  readonly isPredictionValid: boolean;

  /** A time-of-closest-approach prediction for this intruder using sensitivity settings for traffic advisories. */
  readonly tcaTA: TCASTcaPrediction;

  /** A time-of-closest-approach prediction for this intruder using sensitivity settings for resolution advisories. */
  readonly tcaRA: TCASTcaPrediction;

  /**
   * Calculates the predicted 3D displacement vector from own airplane to this intruder at a specified time based on
   * the most recent available data. If insufficient data is available to calculate the prediction, NaN will be written
   * to the result.
   * @param simTime The sim time at which to calculate the separation, as a UNIX timestamp in milliseconds.
   * @param out A Float64Array object to which to write the result.
   * @returns The predicted displacement vector from own airplane to this intruder at the specified time.
   */
  predictDisplacement(simTime: number, out: Float64Array): Float64Array;

  /**
   * Calculates the predicted separation between this intruder and own airplane at a specified time based on the most
   * recent available data and stores the results in the supplied WT_NumberUnit objects. If insufficient data is
   * available to calculate the prediction, NaN will be written to the results.
   * @param simTime The sim time at which to calculate the separation, as a UNIX timestamp in milliseconds.
   * @param horizontalOut A NumberUnit object to which to write the horizontal separation.
   * @param verticalOut A NumberUnit object to which to write the vertical separation.
   */
  predictSeparation(simTime: number, horizontalOut: NumberUnit<UnitFamily.Distance>, verticalOut: NumberUnit<UnitFamily.Distance>): void;
}

/**
 * TCAS parameters for advisories defining the protected zone around the own airplane.
 */
export interface TCASAdvisoryParameters {
  /** A subscribable which provides the radius of the own airplane's protected zone. */
  readonly protectedRadius: Subscribable<NumberUnitInterface<UnitFamily.Distance>>;

  /** A subscribable which provides the half-height of the own airplane's protected zone. */
  readonly protectedHeight: Subscribable<NumberUnitInterface<UnitFamily.Distance>>;
}

/**
 * TCAS parameters for time-of-closest-approach calculations.
 */
export interface TCASTcaParameters extends TCASAdvisoryParameters {
  /** A subscribable which provides the lookahead time for TCA calculations. */
  readonly lookaheadTime: Subscribable<NumberUnitInterface<UnitFamily.Duration>>;
}

/**
 * TCAS parameters for resolution advisories.
 */
export interface TCASRAParameters extends TCASTcaParameters {
  /** A subscribable which provides the minimum vertical separation from intruders targeted by resolution advisories. */
  readonly alim: Subscribable<NumberUnitInterface<UnitFamily.Distance>>;
}

/**
 * Sensitivity settings for TCAS.
 */
export interface TCASSensitivity {
  /**
   * Protected zone parameters for proximity advisories. If any parameters have a value of `NaN`, proximity advisories
   * will not be issued.
   */
  readonly parametersPA: TCASAdvisoryParameters;

  /**
   * Parameters for time-of-closest-approach calculations for traffic advisories. If any parameters have a value of
   * `NaN`, traffic advisories will not be issued.
   */
  readonly parametersTA: TCASTcaParameters;

  /**
   * Parameters for time-of-closest-approach calculations for resolution advisories. If any parameters have a value of
   * `NaN`, resolution advisories will not be issued.
   */
  readonly parametersRA: TCASRAParameters;
}

/**
 * Bit flags describing TCAS resolution advisories.
 */
export enum TCASResolutionAdvisoryFlags {
  /** An initial resolution advisory. */
  Initial = 1 << 0,

  /** A corrective resolution advisory. Requires a change in the own airplane's vertical speed. */
  Corrective = 1 << 1,

  /** An upward sense resolution advisory. Commands a vertical speed above a certain value. */
  UpSense = 1 << 2,

  /** A downward sense resolution advisory. Commands a vertical speed below a certain value. */
  DownSense = 1 << 3,

  /** A resolution advisory which crosses an intruder's altitude. */
  Crossing = 1 << 4,

  /** A CLIMB resolution advisory. Commands a positive vertical speed above 1500 FPM. */
  Climb = 1 << 5,

  /** A DESCEND resolution advisory. Commands a negative vertical speed below -1500 FPM. */
  Descend = 1 << 6,

  /** An INCREASE CLIMB or INCREASE DESCENT resolution advisory. Commands a vertical speed above 2500 FPM or below -2500 FPM. */
  Increase = 1 << 7,

  /** A corrective REDUCE CLIMB resolution advisory. Commands a vertical speed of 0 FPM or less. */
  ReduceClimb = 1 << 8,

  /** A corrective REDUCE DESCENT resolution advisory. Commands a vertical speed of 0 FPM or more. */
  ReduceDescent = 1 << 9,

  /** A preventative DO NOT CLIMB resolution advisory. Commands a non-positive vertical speed. */
  DoNotClimb = 1 << 10,

  /** A preventative DO NOT DESCEND resolution advisory. Commands a non-negative vertical speed. */
  DoNotDescend = 1 << 11
}

/**
 * A TCAS resolution advisory.
 */
export interface TCASResolutionAdvisory {
  /** This resolution advisory's active intruders, sorted in order of increasing time to closest approach. */
  readonly intruders: readonly TCASIntruder[];

  /** The upper vertical speed limit placed by this resolution advisory. A value of `NaN` indicates no limit. */
  readonly maxVerticalSpeed: NumberUnitReadOnly<UnitFamily.Speed>;

  /** The lower vertical speed limit placed by this resolution advisory. A value of `NaN` indicates no limit. */
  readonly minVerticalSpeed: NumberUnitReadOnly<UnitFamily.Speed>;

  /** A combination of {@link TCASResolutionAdvisoryFlags} entries describing this resolution advisory. */
  readonly flags: number;
}

/**
 * TCAS events.
 */
export interface TCASEvents {
  /** The TCAS operating mode changed. */
  tcas_operating_mode: TCASOperatingMode;

  /** A new intruder was created. */
  tcas_intruder_added: TCASIntruder;

  /** The alert level of an intruder was changed. */
  tcas_intruder_alert_changed: TCASIntruder;

  /** An intruder was removed. */
  tcas_intruder_removed: TCASIntruder;

  /** The number of intruders associated with active traffic advisories. */
  tcas_ta_intruder_count: number;

  /** The number of intruders associated with an active resolution advisory. */
  tcas_ra_intruder_count: number;

  /** An initial resolution advisory has been issued. */
  tcas_ra_issued: TCASResolutionAdvisory;

  /** An active resolution advisory has been updated. */
  tcas_ra_updated: TCASResolutionAdvisory;

  /** A resolution advisory has been canceled. */
  tcas_ra_canceled: void;
}

/**
 * Options to adjust how resolution advisories are calculated by TCAS.
 */
export type TCASResolutionAdvisoryOptions = {
  /** The assumed response time of the own airplane following an initial resolution advisory. */
  readonly initialResponseTime: NumberUnitInterface<UnitFamily.Duration>;

  /** The assumed acceleration of the own airplane following an initial resolution advisory. */
  readonly initialAcceleration: NumberUnitInterface<UnitFamily.Acceleration>;

  /** The assumed response time of the own airplane following an updated resolution advisory. */
  readonly subsequentResponseTime: NumberUnitInterface<UnitFamily.Duration>;

  /** The assumed acceleration of the own airplane following an updated resolution advisory. */
  readonly subsequentAcceleration: NumberUnitInterface<UnitFamily.Acceleration>;

  /** A function which determines whether to allow a CLIMB resolution advisory. */
  allowClimb: (simTime: number) => boolean;

  /** A function which determines whether to allow an INCREASE CLIMB resolution advisory. */
  allowIncreaseClimb: (simTime: number) => boolean;

  /** A function which determines whether to allow a DESCEND resolution advisory. */
  allowDescend: (simTime: number) => boolean;

  /** A function which determines whether to allow an INCREASE DESCENT resolution advisory. */
  allowIncreaseDescent: (simTime: number) => boolean;
};

/**
 * A TCAS-II-like system.
 */
export abstract class TCAS<I extends AbstractTCASIntruder = AbstractTCASIntruder, S extends TCASSensitivity = TCASSensitivity> {
  private static readonly DEFAULT_RA_OPTIONS = {
    initialResponseTime: UnitType.SECOND.createNumber(5),
    initialAcceleration: UnitType.G_ACCEL.createNumber(0.25),
    subsequentResponseTime: UnitType.SECOND.createNumber(2.5),
    subsequentAcceleration: UnitType.G_ACCEL.createNumber(0.35)
  };

  protected readonly operatingModeSub = Subject.create(TCASOperatingMode.Standby);

  protected readonly sensitivity: S;

  protected readonly ownAirplane: OwnAirplane;

  protected readonly intrudersSorted: I[] = [];
  protected intrudersFiltered: I[] = [];

  protected readonly intrudersRA = new Set<I>();
  protected readonly resolutionAdvisory: TCASResolutionAdvisoryClass;

  private contactCreatedConsumer: Consumer<number> | undefined;
  private contactRemovedConsumer: Consumer<number> | undefined;

  private readonly contactCreatedHandler = this.onContactAdded.bind(this);
  private readonly contactRemovedHandler = this.onContactRemoved.bind(this);

  protected readonly ownAirplaneSubs = {
    position: GeoPointSubject.createFromGeoPoint(new GeoPoint(0, 0)),
    altitude: NumberUnitSubject.createFromNumberUnit(UnitType.FOOT.createNumber(0)),
    groundTrack: ConsumerSubject.create(null, 0),
    groundSpeed: NumberUnitSubject.createFromNumberUnit(UnitType.KNOT.createNumber(0)),
    verticalSpeed: NumberUnitSubject.createFromNumberUnit(UnitType.FPM.createNumber(0)),
    radarAltitude: NumberUnitSubject.createFromNumberUnit(UnitType.FOOT.createNumber(0)),
    isOnGround: ConsumerSubject.create(null, false)
  };

  protected readonly simTime = ConsumerSubject.create(null, 0);

  protected lastUpdateSimTime = 0;
  protected lastUpdateRealTime = 0;

  private readonly alertLevelHandlers = new Map<I, () => void>();

  private readonly eventPublisher = this.bus.getPublisher<TCASEvents>();
  private readonly eventSubscriber = this.bus.getSubscriber<TCASEvents>();

  /**
   * Constructor.
   * @param bus The event bus.
   * @param tfcInstrument The traffic instrument which provides traffic contacts for this TCAS.
   * @param maxIntruderCount The maximum number of intruders tracked at any one time by this TCAS.
   * @param realTimeUpdateFreq The maximum update frequency (Hz) in real time.
   * @param simTimeUpdateFreq The maximum update frequency (Hz) in sim time.
   * @param raOptions Options to adjust how resolution advisories are calculated.
   */
  constructor(
    protected readonly bus: EventBus,
    protected readonly tfcInstrument: TrafficInstrument,
    protected readonly maxIntruderCount: number,
    protected readonly realTimeUpdateFreq: number,
    protected readonly simTimeUpdateFreq: number,
    raOptions?: Partial<TCASResolutionAdvisoryOptions>
  ) {
    this.sensitivity = this.createSensitivity();
    this.ownAirplane = new OwnAirplane(this.ownAirplaneSubs);

    const fullRAOptions: TCASResolutionAdvisoryOptions = {
      initialResponseTime: (raOptions?.initialResponseTime ?? TCAS.DEFAULT_RA_OPTIONS.initialResponseTime).copy(),
      initialAcceleration: (raOptions?.initialAcceleration ?? TCAS.DEFAULT_RA_OPTIONS.initialAcceleration).copy(),
      subsequentResponseTime: (raOptions?.subsequentResponseTime ?? TCAS.DEFAULT_RA_OPTIONS.subsequentResponseTime).copy(),
      subsequentAcceleration: (raOptions?.subsequentAcceleration ?? TCAS.DEFAULT_RA_OPTIONS.subsequentAcceleration).copy(),

      allowClimb: raOptions?.allowClimb ?? ((): boolean => true),
      allowIncreaseClimb: raOptions?.allowIncreaseClimb ?? ((): boolean => true),
      allowDescend: raOptions?.allowDescend ?? (
        (): boolean => this.ownAirplaneSubs.radarAltitude.get().asUnit(UnitType.FOOT) >= 1100
      ),
      allowIncreaseDescent: raOptions?.allowIncreaseDescent ?? (
        (): boolean => this.ownAirplaneSubs.radarAltitude.get().asUnit(UnitType.FOOT) >= 1450
      )
    };

    this.resolutionAdvisory = new TCASResolutionAdvisoryClass(bus, fullRAOptions, this.ownAirplane);
  }

  /**
   * Creates a TCAS sensitivity object.
   * @returns A TCAS sensitivity object.
   */
  protected abstract createSensitivity(): S;

  /**
   * Gets this system's operating mode.
   * @returns This system's operating mode.
   */
  public getOperatingMode(): TCASOperatingMode {
    return this.operatingModeSub.get();
  }

  /**
   * Sets this system's operating mode.
   * @param mode The new operating mode.
   */
  public setOperatingMode(mode: TCASOperatingMode): void {
    this.operatingModeSub.set(mode);
  }

  /**
   * Gets an array of all currently tracked intruders. The intruders are sorted in order of decreasing threat.
   * @returns an array of all currently tracked intruders.
   */
  public getIntruders(): readonly TCASIntruder[] {
    return this.intrudersFiltered;
  }

  /**
   * Gets an event bus subscriber for TCAS events.
   * @returns an event bus subscriber for TCAS events..
   */
  public getEventSubscriber(): EventSubscriber<TCASEvents> {
    return this.eventSubscriber;
  }

  /**
   * Initializes this system.
   */
  public init(): void {
    // init contact listeners
    const sub = this.bus.getSubscriber<TrafficEvents & GNSSEvents & ADCEvents & ClockEvents>();
    this.contactCreatedConsumer = sub.on('traffic_contact_added');
    this.contactRemovedConsumer = sub.on('traffic_contact_removed');

    this.contactCreatedConsumer.handle(this.contactCreatedHandler);
    this.contactRemovedConsumer.handle(this.contactRemovedHandler);

    // add all existing contacts
    this.tfcInstrument.forEachContact(contact => { this.onContactAdded(contact.uid); });

    // init own airplane subjects
    sub.on('gps-position').atFrequency(this.realTimeUpdateFreq).handle(lla => { this.ownAirplaneSubs.position.set(lla.lat, lla.long); });
    sub.on('ground_speed').whenChanged().atFrequency(this.realTimeUpdateFreq).handle(gs => { this.ownAirplaneSubs.groundSpeed.set(gs); });
    sub.on('alt').whenChanged().atFrequency(this.realTimeUpdateFreq).handle(alt => { this.ownAirplaneSubs.altitude.set(alt); });
    sub.on('vs').whenChanged().atFrequency(this.realTimeUpdateFreq).handle(vs => { this.ownAirplaneSubs.verticalSpeed.set(vs); });
    sub.on('radio_alt').whenChanged().atFrequency(this.realTimeUpdateFreq).handle(alt => { this.ownAirplaneSubs.radarAltitude.set(alt); });
    this.ownAirplaneSubs.groundTrack.setConsumer(sub.on('track_deg_true'));
    this.ownAirplaneSubs.isOnGround.setConsumer(sub.on('on_ground'));

    // init sim time subject
    this.simTime.setConsumer(sub.on('simTime'));

    // init operating mode notifier
    this.operatingModeSub.sub(mode => { this.bus.pub('tcas_operating_mode', mode, false, true); }, true);

    // init update loop
    sub.on('simTime').whenChanged().handle(this.onSimTimeChanged.bind(this));
  }

  /**
   * Sorts two intruders.
   * @param a The first intruder.
   * @param b The second intruder.
   * @returns A negative number if `a` is to be sorted before `b`, a positive number if `b` is to be sorted before `a`,
   * and zero if the two are equal.
   */
  protected intruderComparator(a: I, b: I): number {
    // always sort intruders with valid predictions first
    if (a.isPredictionValid && !b.isPredictionValid) {
      return -1;
    } else if (!a.isPredictionValid && b.isPredictionValid) {
      return 1;
    } else if (a.isPredictionValid) {
      let tcaPredictionA: TCASTcaPrediction | undefined, tcaPredictionB: TCASTcaPrediction | undefined;

      // Always sort intruders predicted to violate RA protected zone first, then TA protected zone

      if (a.tcaRA.isValid && b.tcaRA.isValid) {
        if (a.tcaRA.tcaNorm <= 1 && b.tcaRA.tcaNorm > 1) {
          return -1;
        } else if (a.tcaRA.tcaNorm > 1 && b.tcaRA.tcaNorm <= 1) {
          return 1;
        } else if (a.tcaRA.tcaNorm <= 1 && b.tcaRA.tcaNorm <= 1) {
          tcaPredictionA = a.tcaRA;
          tcaPredictionB = b.tcaRA;
        }
      }

      if (!tcaPredictionA || !tcaPredictionB) {
        if (a.tcaTA.isValid && b.tcaTA.isValid) {
          if (a.tcaTA.tcaNorm <= 1 && b.tcaTA.tcaNorm > 1) {
            return -1;
          } else if (a.tcaTA.tcaNorm > 1 && b.tcaTA.tcaNorm <= 1) {
            return 1;
          } else {
            tcaPredictionA = a.tcaTA;
            tcaPredictionB = b.tcaTA;
          }
        }
      }

      if (!tcaPredictionA || !tcaPredictionB) {
        if ((a.tcaRA.isValid || a.tcaTA.isValid) && !b.tcaRA.isValid && !b.tcaTA.isValid) {
          return -1;
        } else if ((b.tcaRA.isValid || b.tcaTA.isValid) && !a.tcaRA.isValid && !a.tcaTA.isValid) {
          return 1;
        } else {
          return 0;
        }
      }

      // If both are predicted to violate the RA or TA protected zone, sort by TCA.
      // Otherwise sort by how close they approach the TA protected zone at TCA.
      const tcaComparison = tcaPredictionA.tca.compare(tcaPredictionB.tca);
      const normComparison = tcaPredictionA.tcaNorm - tcaPredictionB.tcaNorm;
      let firstComparison;
      let secondComparison;
      if (tcaPredictionA.tcaNorm <= 1) {
        firstComparison = tcaComparison;
        secondComparison = normComparison;
      } else {
        firstComparison = normComparison;
        secondComparison = tcaComparison;
      }
      if (firstComparison === 0) {
        return secondComparison;
      } else {
        return firstComparison;
      }
    } else {
      return 0;
    }
  }

  /**
   * Creates a TCAS intruder entry from a traffic contact.
   * @param contact A traffic contact.
   */
  protected abstract createIntruderEntry(contact: TrafficContact): I;

  /**
   * A callback which is called when a new traffic contact is added by this system's traffic instrument.
   * @param uid The ID number of the new contact.
   */
  private onContactAdded(uid: number): void {
    const contact = this.tfcInstrument.getContact(uid) as TrafficContact;
    const intruder = this.createIntruderEntry(contact);
    this.intrudersSorted.push(intruder);
  }

  /**
   * A callback which is called when a traffic contact is removed by this system's traffic instrument.
   * @param uid The ID number of the removed contact.
   */
  private onContactRemoved(uid: number): void {
    const sortedIndex = this.intrudersSorted.findIndex(intruder => intruder.contact.uid === uid);
    const culledIndex = this.intrudersFiltered.findIndex(intruder => intruder.contact.uid === uid);
    if (sortedIndex >= 0) {
      this.intrudersSorted.splice(sortedIndex, 1);
    }
    if (culledIndex >= 0) {
      const removed = this.intrudersFiltered[culledIndex];
      this.intrudersFiltered.splice(culledIndex, 1);
      this.cleanUpIntruder(removed);
    }
  }

  /**
   * A callback which is called when the sim time changes.
   * @param simTime The current sim time.
   */
  private onSimTimeChanged(simTime: number): void {
    if (this.operatingModeSub.get() === TCASOperatingMode.Standby) {
      return;
    }

    const realTime = Date.now();
    if (
      Math.abs(simTime - this.lastUpdateSimTime) < 1000 / this.simTimeUpdateFreq
      || Math.abs(realTime - this.lastUpdateRealTime) < 1000 / this.realTimeUpdateFreq) {
      return;
    }

    this.doUpdate(simTime);
    this.lastUpdateSimTime = simTime;
    this.lastUpdateRealTime = realTime;
  }

  /**
   * Executes an update.
   * @param simTime The current sim time, as a UNIX timestamp in milliseconds.
   */
  protected doUpdate(simTime: number): void {
    this.updateSensitivity();
    this.updateIntruderPredictions(simTime);
    this.updateIntruderArrays();
    this.updateFilteredIntruderAlertLevels(simTime);
    this.updateResolutionAdvisory(simTime);
  }

  protected abstract updateSensitivity(): void;

  /**
   * Updates the TCA predictions for all intruders tracked by this system.
   * @param simTime The current sim time, as a UNIX timestamp in milliseconds.
   */
  protected updateIntruderPredictions(simTime: number): void {
    this.ownAirplane.update(simTime);

    const len = this.intrudersSorted.length;
    for (let i = 0; i < len; i++) {
      this.intrudersSorted[i].updatePrediction(simTime, this.ownAirplane, this.sensitivity);
    }
  }

  /**
   * Updates the arrays of intruders tracked by this system.
   */
  protected updateIntruderArrays(): void {
    this.intrudersSorted.sort(this.intruderComparator.bind(this));
    const oldCulled = this.intrudersFiltered;

    this.intrudersFiltered = [];
    const len = this.intrudersSorted.length;
    for (let i = 0; i < len; i++) {
      const intruder = this.intrudersSorted[i];
      if (i < this.maxIntruderCount && intruder.isPredictionValid) {
        this.intrudersFiltered.push(intruder);
        if (!oldCulled.includes(intruder)) {
          this.initIntruder(intruder);
        }
      } else {
        if (oldCulled.includes(intruder)) {
          this.cleanUpIntruder(intruder);
        }
      }
    }
  }

  /**
   * Updates the alert levels for all intruders tracked by this system that have not been filtered out.
   * @param simTime The current sim time, as a UNIX timestamp in milliseconds.
   */
  protected updateFilteredIntruderAlertLevels(simTime: number): void {
    let taCount = 0, raCount = 0;

    const len = this.intrudersFiltered.length;
    for (let i = 0; i < len; i++) {
      const intruder = this.intrudersFiltered[i];
      this.updateIntruderAlertLevel(simTime, intruder);

      switch (intruder.alertLevel.get()) {
        case TCASAlertLevel.TrafficAdvisory:
          taCount++;
          break;
        case TCASAlertLevel.ResolutionAdvisory:
          raCount++;
          break;
      }
    }

    this.eventPublisher.pub('tcas_ta_intruder_count', taCount, false, true);
    this.eventPublisher.pub('tcas_ra_intruder_count', raCount, false, true);
  }

  protected readonly paSeparationCache = {
    horizontal: UnitType.NMILE.createNumber(0),
    vertical: UnitType.FOOT.createNumber(0)
  };

  /**
   * Updates an intruder's alert level.
   * @param simTime The current sim time, as a UNIX timestamp in milliseconds.
   * @param intruder An intruder.
   */
  protected updateIntruderAlertLevel(simTime: number, intruder: I): void {
    const currentAlertLevel = intruder.alertLevel.get();

    if (intruder.tcaRA.isValid && intruder.tcaRA.tcaNorm <= 1) {
      if (this.canIssueResolutionAdvisory(simTime, intruder)) {
        intruder.alertLevel.set(TCASAlertLevel.ResolutionAdvisory);
        return;
      } else if (currentAlertLevel === TCASAlertLevel.ResolutionAdvisory && !this.canCancelResolutionAdvisory(simTime, intruder)) {
        return;
      }
    }

    if (
      currentAlertLevel === TCASAlertLevel.ResolutionAdvisory
      && (!intruder.tcaRA.isValid || intruder.tcaRA.tcaNorm > 1)
      && !this.canCancelResolutionAdvisory(simTime, intruder)
    ) {
      return;
    }

    if (intruder.tcaTA.isValid && intruder.tcaTA.tcaNorm <= 1) {
      if (this.canIssueTrafficAdvisory(simTime, intruder)) {
        intruder.alertLevel.set(TCASAlertLevel.TrafficAdvisory);
        return;
      } else if (currentAlertLevel === TCASAlertLevel.TrafficAdvisory && !this.canCancelTrafficAdvisory(simTime, intruder)) {
        return;
      }
    }

    if (
      currentAlertLevel === TCASAlertLevel.TrafficAdvisory
      && (!intruder.tcaTA.isValid || intruder.tcaTA.tcaNorm > 1)
      && !this.canCancelTrafficAdvisory(simTime, intruder)
    ) {
      return;
    }

    if (intruder.isPredictionValid) {
      const radius = this.sensitivity.parametersPA.protectedRadius.get();
      const height = this.sensitivity.parametersPA.protectedHeight.get();

      if (!radius.isNaN() && !height.isNaN() && this.canIssueProximityAdvisory(simTime, intruder)) {
        const paParameters = this.sensitivity.parametersPA;
        intruder.predictSeparation(simTime, this.paSeparationCache.horizontal, this.paSeparationCache.vertical);
        if (
          this.paSeparationCache.horizontal.compare(paParameters.protectedRadius.get()) <= 0
          && this.paSeparationCache.vertical.compare(paParameters.protectedHeight.get()) <= 0
        ) {
          intruder.alertLevel.set(TCASAlertLevel.ProximityAdvisory);
          return;
        }
      }
    }

    if (currentAlertLevel === TCASAlertLevel.ProximityAdvisory && !this.canCancelProximityAdvisory(simTime, intruder)) {
      return;
    }

    intruder.alertLevel.set(TCASAlertLevel.None);
  }

  /**
   * Checks whether a resolution advisory can be issued for an intruder.
   * @param simTime The current sim time, as a UNIX timestamp in milliseconds.
   * @param intruder An intruder.
   * @returns Whether a resolution advisory can be issued for the intruder.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected canIssueResolutionAdvisory(simTime: number, intruder: I): boolean {
    return this.operatingModeSub.get() === TCASOperatingMode.TA_RA
      && intruder.tcaRA.isValid
      && intruder.tcaRA.tca.number > 0;
  }

  /**
   * Checks whether a resolution advisory can be canceled for an intruder.
   * @param simTime The current sim time, as a UNIX timestamp in milliseconds.
   * @param intruder An intruder.
   * @returns Whether a resolution advisory can be issued for the intruder.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected canCancelResolutionAdvisory(simTime: number, intruder: I): boolean {
    return true;
  }

  /**
   * Checks whether a traffic advisory can be issued for an intruder.
   * @param simTime The current sim time, as a UNIX timestamp in milliseconds.
   * @param intruder An intruder.
   * @returns Whether a traffic advisory can be issued for the intruder.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected canIssueTrafficAdvisory(simTime: number, intruder: I): boolean {
    return true;
  }

  /**
   * Checks whether a traffic advisory can be canceled for an intruder.
   * @param simTime The current sim time, as a UNIX timestamp in milliseconds.
   * @param intruder An intruder.
   * @returns Whether a traffic advisory can be canceled for the intruder.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected canCancelTrafficAdvisory(simTime: number, intruder: I): boolean {
    return true;
  }

  /**
   * Checks whether a proximity advisory can be issued for an intruder.
   * @param simTime The current sim time, as a UNIX timestamp in milliseconds.
   * @param intruder An intruder.
   * @returns Whether a proximity advisory can be issued for the intruder.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected canIssueProximityAdvisory(simTime: number, intruder: I): boolean {
    return true;
  }

  /**
   * Checks whether a proximity advisory can be canceled for an intruder.
   * @param simTime The current sim time, as a UNIX timestamp in milliseconds.
   * @param intruder An intruder.
   * @returns Whether a proximity advisory can be canceled for the intruder.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected canCancelProximityAdvisory(simTime: number, intruder: I): boolean {
    return true;
  }

  /**
   * Updates this TCAS's resolution advisory.
   * @param simTime The current sim time, as a UNIX timestamp in milliseconds.
   */
  protected updateResolutionAdvisory(simTime: number): void {
    this.resolutionAdvisory.update(simTime, this.sensitivity.parametersRA.alim.get(), this.intrudersRA);
  }

  /**
   * Executes initialization code when an intruder is added.
   * @param intruder The newly added intruder.
   */
  private initIntruder(intruder: I): void {
    const handler = this.onAlertLevelChanged.bind(this, intruder);
    this.alertLevelHandlers.set(intruder, handler);
    intruder.alertLevel.sub(handler);
    this.eventPublisher.pub('tcas_intruder_added', intruder, false, false);
  }

  /**
   * Executes cleanup code when an intruder is removed.
   * @param intruder The intruder that was removed.
   */
  private cleanUpIntruder(intruder: I): void {
    if (intruder.alertLevel.get() === TCASAlertLevel.ResolutionAdvisory) {
      this.intrudersRA.delete(intruder);
    }

    const handler = this.alertLevelHandlers.get(intruder);
    handler && intruder.alertLevel.unsub(handler);
    this.eventPublisher.pub('tcas_intruder_removed', intruder, false, false);
  }

  /**
   * A callback which is called when an intruder's alert level changes.
   * @param intruder The intruder whose alert level changed.
   */
  private onAlertLevelChanged(intruder: I): void {
    if (intruder.alertLevel.get() === TCASAlertLevel.ResolutionAdvisory) {
      this.intrudersRA.add(intruder);
    } else {
      this.intrudersRA.delete(intruder);
    }

    this.eventPublisher.pub('tcas_intruder_alert_changed', intruder, false, false);
  }
}

/**
 * Subscribables which provide data related to the own airplane.
 */
type TCASOwnAirplaneSubs = {
  /** A subscribable which provides the own airplane's position. */
  position: Subscribable<GeoPointInterface>;

  /** A subscribable which provides the own airplane's altitude. */
  altitude: Subscribable<NumberUnitInterface<UnitFamily.Distance>>;

  /** A subscribable which provides the own airplane's ground track. */
  groundTrack: Subscribable<number>;

  /** A subscribable which provides the own airplane's ground speed. */
  groundSpeed: Subscribable<NumberUnitInterface<UnitFamily.Speed>>;

  /** A subscribable which provides the own airplane's vertical speed. */
  verticalSpeed: Subscribable<NumberUnitInterface<UnitFamily.Speed>>;

  /** A subscribable which provides the own airplane's radar altitude. */
  radarAltitude: Subscribable<NumberUnitInterface<UnitFamily.Distance>>;

  /** A subscribable which provides whether the own airplane is on the ground. */
  isOnGround: Subscribable<boolean>;
};

/**
 * An airplane managed by TCAS.
 */
abstract class TCASAirplane {
  protected readonly _position = new GeoPoint(0, 0);
  /** The position of this airplane at the time of the most recent update. */
  public readonly position = this._position.readonly;

  /** The altitude of this airplane at the time of the most recent update. */
  protected readonly _altitude = UnitType.FOOT.createNumber(0);
  public readonly altitude = this._altitude.readonly;

  protected _groundTrack = 0;
  // eslint-disable-next-line jsdoc/require-returns
  /** The true ground track of this airplane at the time of the most recent update. */
  public get groundTrack(): number {
    return this._groundTrack;
  }

  /** The ground speed of this airplane at the time of the most recent update. */
  protected readonly _groundSpeed = UnitType.KNOT.createNumber(0);
  public readonly groundSpeed = this._groundSpeed.readonly;

  /** The vertical speed of this airplane at the time of the most recent update. */
  protected readonly _verticalSpeed = UnitType.FPM.createNumber(0);
  public readonly verticalSpeed = this._verticalSpeed.readonly;

  /**
   * The 3D position vector of this airplane at the time of the last update. Each component is expressed in units of
   * meters. The coordinate system is an Euclidean approximation of the geodetic space around the own airplane such
   * that the z-coordinate represents orthometric height and the x- and y-coordinates represent an east-
   * counterclockwise equirectangular projection of latitude and longitude, with the origin at the location of the own
   * airplane.
   */
  public readonly positionVec = new Float64Array(3);

  /**
   * The 3D velocity vector of this airplane at the time of the last update. Each component is expressed in units of
   * meters per second. The coordinate system is defined the same as for position vectors.
   */
  public readonly velocityVec = new Float64Array(3);

  protected lastUpdateTime = 0;
}

/**
 * The own airplane managed by TCAS.
 */
class OwnAirplane extends TCASAirplane {
  /** The radar altitude of this airplane at the time of the most recent update. */
  protected readonly _radarAltitude = UnitType.FOOT.createNumber(0);
  public readonly radarAltitude = this._radarAltitude.readonly;

  private _isOnGround = false;
  // eslint-disable-next-line jsdoc/require-returns
  /** Whether this airplane is on the ground. */
  public get isOnGround(): boolean {
    return this._isOnGround;
  }

  /**
   * Constructor.
   * @param subs Subscribables which provide data related to this airplane.
   */
  constructor(private readonly subs: TCASOwnAirplaneSubs) {
    super();
  }

  /**
   * Calculates the predicted 3D position vector of this airplane at a specified time based on the most recent
   * available data. Each component of the vector is expressed in units of meters, and the origin lies at the most
   * recent updated position of this airplane.
   * @param simTime The sim time at which to calculate the position, as a UNIX timestamp in milliseconds.
   * @param out A Float64Array object to which to write the result.
   * @returns The predicted position vector of this airplane at the specified time.
   */
  public predictPosition(simTime: number, out: Float64Array): Float64Array {
    const dt = (simTime - this.lastUpdateTime) / 1000;
    return Vec3Math.add(this.positionVec, Vec3Math.multScalar(this.velocityVec, dt, out), out);
  }

  /**
   * Updates this airplane's position and velocity data.
   * @param simTime The current sim time, as a UNIX millisecond timestamp.
   */
  public update(simTime: number): void {
    this.updateParameters();
    this.updateVectors();
    this.lastUpdateTime = simTime;
  }

  /**
   * Updates this airplane's position, altitude, ground track, ground speed, vertical speed, and whether it is on the ground.
   */
  private updateParameters(): void {
    this._position.set(this.subs.position.get());
    this._altitude.set(this.subs.altitude.get());
    this._groundTrack = this.subs.groundTrack.get();
    this._groundSpeed.set(this.subs.groundSpeed.get());
    this._verticalSpeed.set(this.subs.verticalSpeed.get());
    this._radarAltitude.set(this.subs.radarAltitude.get());
    this._isOnGround = this.subs.isOnGround.get();
  }

  /**
   * Updates this airplane's position and velocity vectors.
   */
  private updateVectors(): void {
    Vec2Math.setFromPolar(this._groundSpeed.asUnit(UnitType.MPS), (90 - this._groundTrack) * Avionics.Utils.DEG2RAD, this.velocityVec);
    const verticalVelocity = this._verticalSpeed.asUnit(UnitType.MPS);
    this.velocityVec[2] = verticalVelocity;
  }
}

/**
 * A TCA solution.
 */
type TcaSolution = {
  /** The TCA, in seconds from the present. */
  tca: number;

  /** The intruder displacement vector from own airplane at TCA. */
  displacement: Float64Array;

  /** The cylindrical norm of the TCA displacement vector. */
  norm: number;
};

/**
 * An abstract implementation of {@link TCASIntruder}.
 */
export abstract class AbstractTCASIntruder extends TCASAirplane implements TCASIntruder {
  private static readonly MIN_GROUND_SPEED = UnitType.KNOT.createNumber(30);

  private static readonly vec3Cache = [new Float64Array(3), new Float64Array(3)];

  public readonly alertLevel = Subject.create(TCASAlertLevel.None);

  /** The 3D position vector of this intruder relative to own airplane. */
  public readonly relativePositionVec = new Float64Array(3);

  /** The 3D velocity vector of this intruder relative to own airplane. */
  public readonly relativeVelocityVec = new Float64Array(3);

  private _isPredictionValid = false;
  // eslint-disable-next-line jsdoc/require-returns
  /** Whether there is a valid prediction for time of closest approach between this intruder and own airplane. */
  public get isPredictionValid(): boolean {
    return this._isPredictionValid;
  }

  /** @inheritdoc */
  public readonly tcaTA: TCASTcaPredictionClass = new TCASTcaPredictionClass(this);

  /** @inheritdoc */
  public readonly tcaRA: TCASTcaPredictionClass = new TCASTcaPredictionClass(this);

  /**
   * Constructor.
   * @param contact The traffic contact associated with this intruder.
   */
  constructor(public readonly contact: TrafficContact) {
    super();
  }

  /** @inheritdoc */
  public predictDisplacement(simTime: number, out: Float64Array): Float64Array {
    if (!this._isPredictionValid) {
      return Vec3Math.set(NaN, NaN, NaN, out);
    }

    const dt = (simTime - this.contact.lastContactTime) / 1000;
    return Vec3Math.add(this.relativePositionVec, Vec3Math.multScalar(this.relativeVelocityVec, dt, out), out);
  }

  /** @inheritdoc */
  public predictSeparation(simTime: number, horizontalOut: NumberUnit<UnitFamily.Distance>, verticalOut: NumberUnit<UnitFamily.Distance>): void {
    if (!this._isPredictionValid) {
      horizontalOut.set(NaN);
      verticalOut.set(NaN);
      return;
    }

    const displacement = this.predictDisplacement(simTime, AbstractTCASIntruder.vec3Cache[0]);
    AbstractTCASIntruder.displacementToHorizontalSeparation(displacement, horizontalOut);
    AbstractTCASIntruder.displacementToVerticalSeparation(displacement, verticalOut);
  }

  /**
   * Updates this intruder's predicted TCA and related data.
   * @param simTime The current sim time, as a UNIX timestamp in milliseconds.
   * @param ownAirplane Own airplane.
   * @param sensitivity The TCAS sensitivity parameters to use when calculating predictions.
   */
  public updatePrediction(
    simTime: number,
    ownAirplane: OwnAirplane,
    sensitivity: TCASSensitivity
  ): void {
    this.updateParameters(simTime, ownAirplane);

    if (this.isPredictionValid) {
      const taParams = sensitivity.parametersTA;
      const raParams = sensitivity.parametersRA;
      this.tcaTA.update(simTime, taParams.lookaheadTime.get(), taParams.protectedRadius.get(), taParams.protectedHeight.get());
      this.tcaRA.update(simTime, raParams.lookaheadTime.get(), raParams.protectedRadius.get(), raParams.protectedHeight.get());
    } else {
      this.invalidatePredictions();
    }

    this.lastUpdateTime = simTime;
  }

  /**
   * Updates this intruder's position and velocity data.
   * @param simTime The current sim time, as a UNIX timestamp in milliseconds.
   * @param ownAirplane The own airplane.
   */
  private updateParameters(simTime: number, ownAirplane: OwnAirplane): void {
    if (isNaN(this.contact.groundTrack) || this.contact.groundSpeed.compare(AbstractTCASIntruder.MIN_GROUND_SPEED) < 0) {
      this._isPredictionValid = false;
      this._position.set(NaN, NaN);
      this._altitude.set(NaN);
      this._groundTrack = NaN;
      this._groundSpeed.set(NaN);
      this._verticalSpeed.set(NaN);
      Vec3Math.set(NaN, NaN, NaN, this.positionVec);
      Vec3Math.set(NaN, NaN, NaN, this.velocityVec);
      Vec3Math.set(NaN, NaN, NaN, this.relativePositionVec);
      Vec3Math.set(NaN, NaN, NaN, this.relativeVelocityVec);
    } else {
      this.updatePosition(simTime, ownAirplane);
      this.updateVelocity(ownAirplane);
      this._groundSpeed.set(this.contact.groundSpeed);
      this._verticalSpeed.set(this.contact.verticalSpeed);
      this._isPredictionValid = true;
    }
  }

  /**
   * Updates this intruder's position.
   * @param simTime The current sim time, as a UNIX timestamp in milliseconds.
   * @param ownAirplane The own airplane.
   */
  private updatePosition(simTime: number, ownAirplane: OwnAirplane): void {
    this.contact.predict(simTime, this._position, this._altitude);
    this._groundTrack = this._position.equals(this.contact.lastPosition) ? this.contact.groundTrack : this._position.bearingFrom(this.contact.lastPosition);

    const distance = UnitType.GA_RADIAN.convertTo(this._position.distance(ownAirplane.position), UnitType.METER);
    const bearing = ownAirplane.position.bearingTo(this._position);
    Vec2Math.setFromPolar(distance, (90 - bearing) * Avionics.Utils.DEG2RAD, this.positionVec);
    const verticalPosition = this._altitude.asUnit(UnitType.METER) - ownAirplane.altitude.asUnit(UnitType.METER);
    this.positionVec[2] = verticalPosition;

    Vec3Math.sub(this.positionVec, ownAirplane.positionVec, this.relativePositionVec);
  }

  /**
   * Updates this intruder's velocity.
   * @param ownAirplane The own airplane.
   */
  private updateVelocity(ownAirplane: OwnAirplane): void {
    Vec2Math.setFromPolar(this.contact.groundSpeed.asUnit(UnitType.MPS), (90 - this.contact.groundTrack) * Avionics.Utils.DEG2RAD, this.velocityVec);
    const verticalVelocity = this.contact.verticalSpeed.asUnit(UnitType.MPS);
    this.velocityVec[2] = verticalVelocity;

    Vec3Math.sub(this.velocityVec, ownAirplane.velocityVec, this.relativeVelocityVec);
  }

  /**
   * Invalidates this intruder's predicted TCA and related data.
   */
  private invalidatePredictions(): void {
    this.tcaTA.invalidate();
    this.tcaRA.invalidate();
  }

  /**
   * Converts a 3D displacement vector to a horizontal separation distance.
   * @param displacement A displacement vector, in meters.
   * @param out A NumberUnit object to which to write the result.
   * @returns The horizontal separation distance corresponding to the displacement vector.
   */
  public static displacementToHorizontalSeparation(displacement: Float64Array, out: NumberUnit<UnitFamily.Distance>): NumberUnit<UnitFamily.Distance> {
    return out.set(Math.hypot(displacement[0], displacement[1]), UnitType.METER);
  }

  /**
   * Converts a 3D displacement vector to a vertical separation distance.
   * @param displacement A displacement vector, in meters.
   * @param out A NumberUnit object to which to write the result.
   * @returns The vertical separation distance corresponding to the displacement vector.
   */
  public static displacementToVerticalSeparation(displacement: Float64Array, out: NumberUnit<UnitFamily.Distance>): NumberUnit<UnitFamily.Distance> {
    return out.set(Math.abs(displacement[2]), UnitType.METER);
  }
}

/**
 * An default implementation of {@link TCASIntruder}.
 */
export class DefaultTCASIntruder extends AbstractTCASIntruder {
}

/**
 * A time-of-closest-approach prediction made by TCAS.
 */
class TCASTcaPredictionClass implements TCASTcaPrediction {
  private static readonly vec2Cache = [new Float64Array(2), new Float64Array(2)];
  private static readonly solutionCache: TcaSolution[] = [
    {
      tca: 0,
      displacement: new Float64Array(3),
      norm: 0
    },
    {
      tca: 0,
      displacement: new Float64Array(3),
      norm: 0
    }
  ];

  private _isValid = false;
  /** @inheritdoc */
  public get isValid(): boolean {
    return this._isValid;
  }

  private _time = NaN;
  /** @inheritdoc */
  public get time(): number {
    return this._time;
  }

  private readonly _tca = UnitType.SECOND.createNumber(NaN);
  /** @inheritdoc */
  public readonly tca = this._tca.readonly;

  private _tcaNorm = NaN;
  // eslint-disable-next-line jsdoc/require-returns
  /** @inheritdoc */
  public get tcaNorm(): number {
    return this._tcaNorm;
  }

  /** @inheritdoc */
  public readonly tcaDisplacement = new Float64Array(3);

  private readonly _tcaHorizontalSep = UnitType.NMILE.createNumber(0);
  /** @inheritdoc */
  public readonly tcaHorizontalSep = this._tcaHorizontalSep.readonly;

  private readonly _tcaVerticalSep = UnitType.FOOT.createNumber(0);
  /** @inheritdoc */
  public readonly tcaVerticalSep = this._tcaVerticalSep.readonly;

  /**
   * Constructor.
   * @param intruder The intruder associated with this prediction.
   */
  constructor(private readonly intruder: TCASIntruder) {
  }

  /**
   * Updates the time-to-closest-approach (TCA) and related data of this intruder.
   * @param simTime The current sim time, as a UNIX timestamp in milliseconds.
   * @param lookaheadTime The maximum lookahead time.
   * @param protectedRadius The radius of the own airplane's protected zone.
   * @param protectedHeight The half-height of the own airplane's protected zone.
   */
  public update(
    simTime: number,
    lookaheadTime: NumberUnitInterface<UnitFamily.Duration>,
    protectedRadius: NumberUnitInterface<UnitFamily.Distance>,
    protectedHeight: NumberUnitInterface<UnitFamily.Distance>
  ): void {
    this._time = simTime;

    if (lookaheadTime.isNaN() || protectedRadius.isNaN() || protectedHeight.isNaN()) {
      this.invalidate();
      return;
    }

    // Source: Munoz, CA and Narkawicz, AJ. "Time of Closest Approach in Three-Dimensional Airspace." 2010.
    // https://ntrs.nasa.gov/api/citations/20100037766/downloads/20100037766.pdf
    const s = this.intruder.relativePositionVec;
    const v = this.intruder.relativeVelocityVec;
    const sHoriz = Vec2Math.set(s[0], s[1], TCASTcaPredictionClass.vec2Cache[0]);
    const vHoriz = Vec2Math.set(v[0], v[1], TCASTcaPredictionClass.vec2Cache[0]);
    const h = protectedHeight.asUnit(UnitType.METER);
    const r = protectedRadius.asUnit(UnitType.METER);

    const vHorizSquared = Vec2Math.dot(vHoriz, vHoriz);
    const sHorizSquared = Vec2Math.dot(sHoriz, sHoriz);
    const hSquared = h * h;
    const rSquared = r * r;
    const a = (v[2] * v[2]) / hSquared - vHorizSquared / rSquared;
    const b = 2 * s[2] * v[2] / hSquared - 2 * Vec2Math.dot(sHoriz, vHoriz) / rSquared;
    const c = (s[2] * s[2]) / hSquared - sHorizSquared / rSquared;

    const solution = TCASTcaPredictionClass.calculateSolution(0, s, v, r, h, TCASTcaPredictionClass.solutionCache[0]);
    if (vHorizSquared !== 0) {
      const t = -Vec2Math.dot(sHoriz, vHoriz) / vHorizSquared;
      if (t > 0) {
        TCASTcaPredictionClass.evaluateCandidate(t, s, v, r, h, solution, TCASTcaPredictionClass.solutionCache[1]);
      }
    }
    if (v[2] !== 0) {
      const t = -s[2] / v[2];
      if (t > 0) {
        TCASTcaPredictionClass.evaluateCandidate(t, s, v, r, h, solution, TCASTcaPredictionClass.solutionCache[1]);
      }
    }
    const discriminant = b * b - 4 * a * c;
    if (a !== 0 && discriminant >= 0) {
      const sqrt = Math.sqrt(discriminant);
      let t = (-b + sqrt) / (2 * a);
      if (t > 0) {
        TCASTcaPredictionClass.evaluateCandidate(t, s, v, r, h, solution, TCASTcaPredictionClass.solutionCache[1]);
      }
      t = (-b - sqrt) / (2 * a);
      if (t > 0) {
        TCASTcaPredictionClass.evaluateCandidate(t, s, v, r, h, solution, TCASTcaPredictionClass.solutionCache[1]);
      }
    } else if (a === 0 && b !== 0) {
      const t = -c / b;
      if (t > 0) {
        TCASTcaPredictionClass.evaluateCandidate(t, s, v, r, h, solution, TCASTcaPredictionClass.solutionCache[1]);
      }
    }

    const lookaheadTimeSeconds = lookaheadTime.asUnit(UnitType.SECOND);
    if (solution.tca > lookaheadTimeSeconds) {
      TCASTcaPredictionClass.calculateSolution(lookaheadTimeSeconds, s, v, r, h, solution);
    }

    this._tca.set(solution.tca);
    this._tcaNorm = solution.norm;
    Vec3Math.copy(solution.displacement, this.tcaDisplacement);
    AbstractTCASIntruder.displacementToHorizontalSeparation(solution.displacement, this._tcaHorizontalSep);
    AbstractTCASIntruder.displacementToVerticalSeparation(solution.displacement, this._tcaVerticalSep);

    this._isValid = true;
  }

  /**
   * Invalidates this intruder's predicted TCA and related data.
   */
  public invalidate(): void {
    this._isValid = false;
    this._tca.set(NaN);
    this._tcaNorm = NaN;
    Vec3Math.set(NaN, NaN, NaN, this.tcaDisplacement);
    this._tcaHorizontalSep.set(NaN);
    this._tcaVerticalSep.set(NaN);
  }

  /**
   * Evaluates a TCA candidate against the best existing solution, and if the candidate produces a smaller cylindrical
   * norm, replaces the best existing solution with the candidate.
   * @param t The candidate TCA time, in seconds.
   * @param s The relative position vector of the intruder, in meters.
   * @param v The relative velocity vector of the intruder, in meters per second.
   * @param r The radius of the own airplane's protected zone, in meters.
   * @param h The half-height of the own airplane's protected zone, in meters.
   * @param best The best existing solution.
   * @param candidate A TcaSolution object to which to temporarily write the candidate solution.
   */
  private static evaluateCandidate(t: number, s: ReadonlyFloat64Array, v: ReadonlyFloat64Array, r: number, h: number, best: TcaSolution, candidate: TcaSolution): void {
    TCASTcaPredictionClass.calculateSolution(t, s, v, r, h, candidate);
    if (candidate.norm < best.norm) {
      TCASTcaPredictionClass.copySolution(candidate, best);
    }
  }

  /**
   * Calculates a TCA solution.
   * @param t The candidate TCA time, in seconds.
   * @param s The relative position vector of the intruder, in meters.
   * @param v The relative velocity vector of the intruder, in meters per second.
   * @param r The radius of the own airplane's protected zone, in meters.
   * @param h The half-height of the own airplane's protected zone, in meters.
   * @param out A TcaSolution object to which to write the result.
   * @returns A TCA solution.
   */
  private static calculateSolution(t: number, s: ReadonlyFloat64Array, v: ReadonlyFloat64Array, r: number, h: number, out: TcaSolution): TcaSolution {
    out.tca = t;
    TCASTcaPredictionClass.calculateDisplacementVector(s, v, t, out.displacement);
    out.norm = TCASTcaPredictionClass.calculateCylindricalNorm(out.displacement, r, h);
    return out;
  }

  /**
   * Copies a TCA solution.
   * @param from The solution from which to copy.
   * @param to The solution to which to copy.
   */
  private static copySolution(from: TcaSolution, to: TcaSolution): void {
    to.tca = from.tca;
    Vec3Math.copy(from.displacement, to.displacement);
    to.norm = from.norm;
  }

  /**
   * Calculates a time-offset displacement vector given an initial displacement, a velocity vector, and elapsed time.
   * @param initial The initial displacement vector.
   * @param velocity A velocity vector.
   * @param elapsedTime The elapsed time.
   * @param out A Float64Array object to which to write the result.
   * @returns The time-offset displacement vector.
   */
  private static calculateDisplacementVector(initial: ReadonlyFloat64Array, velocity: ReadonlyFloat64Array, elapsedTime: number, out: Float64Array): Float64Array {
    return Vec3Math.add(initial, Vec3Math.multScalar(velocity, elapsedTime, out), out);
  }

  /**
   * Calculates a cylindrical norm.
   * @param vector A displacement vector.
   * @param radius The radius of the protected zone.
   * @param halfHeight The half-height of the protected zone.
   * @returns A cylindrical norm.
   */
  private static calculateCylindricalNorm(vector: ReadonlyFloat64Array, radius: number, halfHeight: number): number {
    const horizLength = Math.hypot(vector[0], vector[1]);
    return Math.max(Math.abs(vector[2]) / halfHeight, horizLength / radius);
  }
}

/**
 * A candidate resolution advisory.
 */
type ResolutionAdvisorySenseCandidate = {
  /** The sense of this candidate. */
  sense: 1 | -1;

  /** The target altitude of this candidate at time of closest approach, in meters. */
  targetAltTca: number;

  /** The target vertical speed of this candidate, in meters per second. */
  targetVS: number;

  /**
   * Whether the target vertical speed of this candidate allows the own airplane to reach the target altitude at time
   * of closest approach.
   */
  doesReachTargetAlt: boolean;
};

/**
 * A TCAS resolution advisory.
 */
class TCASResolutionAdvisoryClass implements TCASResolutionAdvisory {
  private static readonly CLIMB_DESC_VS_MPS = UnitType.FPM.convertTo(1500, UnitType.MPS);
  private static readonly INC_CLIMB_DESC_VS_MPS = UnitType.FPM.convertTo(2500, UnitType.MPS);

  private static readonly VSL_MAX_VS_MPS = UnitType.FPM.convertTo(2000, UnitType.MPS);
  private static readonly VSL_VS_STEP_MPS = UnitType.FPM.convertTo(500, UnitType.MPS);

  private static readonly INTRUDER_SORT_FUNC = (a: TCASIntruder, b: TCASIntruder): number => {
    if (a.tcaRA.tca < b.tcaRA.tca) {
      return -1;
    } else if (a.tcaRA.tca > b.tcaRA.tca) {
      return 1;
    } else if (a.tcaRA.tcaNorm < b.tcaRA.tcaNorm) {
      return -1;
    } else if (a.tcaRA.tcaNorm > b.tcaRA.tcaNorm) {
      return 1;
    } else {
      return 0;
    }
  };

  private static readonly vec3Cache = [new Float64Array(3)];
  private static readonly senseCandidateCache: ResolutionAdvisorySenseCandidate[] = [{ sense: -1, targetAltTca: 0, targetVS: 0, doesReachTargetAlt: false }];

  public readonly intruders: TCASIntruder[] = [];

  private readonly _maxVerticalSpeed = UnitType.FPM.createNumber(NaN);
  /** @inheritdoc */
  public readonly maxVerticalSpeed = this._maxVerticalSpeed.readonly;

  private readonly _minVerticalSpeed = UnitType.FPM.createNumber(NaN);
  /** @inheritdoc */
  public readonly minVerticalSpeed = this._minVerticalSpeed.readonly;

  private _flags = 0;
  /** @inheritdoc */
  public get flags(): number {
    return this._flags;
  }

  private isActive = false;
  private timeUpdated = 0;
  private canReverseSense = true;

  private readonly publisher: Publisher<TCASEvents>;

  /**
   * Constructor.
   * @param bus The event bus.
   * @param options Options to adjust how this resolution advisory should be calculated.
   * @param ownAirplane The own airplane of this resolution advisory.
   */
  constructor(bus: EventBus, private readonly options: TCASResolutionAdvisoryOptions, private readonly ownAirplane: OwnAirplane) {
    this.publisher = bus.getPublisher<TCASEvents>();
  }

  /**
   * Updates this resolution advisory.
   * @param simTime The current sim time, as a UNIX timestamp in milliseconds.
   * @param alim The required vertical separation between own airplane and intruders.
   * @param intruders The set of active intruders to be tracked by this resolution advisory.
   */
  public update(simTime: number, alim: NumberUnitInterface<UnitFamily.Distance>, intruders: ReadonlySet<TCASIntruder>): void {
    if (this.intruders.length === 0 && intruders.size === 0) {
      return;
    }

    if (intruders.size === 0) {
      this.cancel();
    } else if (this.intruders.length === 0) {
      this.activate(simTime, alim, intruders);
    } else {
      this.updateActive(simTime, alim, intruders);
    }
  }

  /**
   * Activates this resolution advisory.
   * @param simTime The current sim time, as a UNIX timestamp in milliseconds.
   * @param alim The required vertical separation between own airplane and intruders.
   * @param intruders The set of active intruders to be tracked by this resolution advisory.
   */
  private activate(simTime: number, alim: NumberUnitInterface<UnitFamily.Distance>, intruders: ReadonlySet<TCASIntruder>): void {
    this.updateIntrudersArray(intruders);

    // TODO: Support multiple intruders
    const intruder = this.intruders[0];
    const t0 = intruder.tcaRA.time;
    const tca = intruder.tcaRA.tca;
    const tcaSeconds = tca.asUnit(UnitType.SECOND);
    const vertDisplMeters = intruder.tcaRA.tcaDisplacement[2];
    const ownAirplaneAltMeters = this.ownAirplane.predictPosition(t0, TCASResolutionAdvisoryClass.vec3Cache[0])[2];
    const ownAirplaneVSMPS = this.ownAirplane.verticalSpeed.asUnit(UnitType.MPS);
    const ownAirplaneAltTcaMeters = this.ownAirplane.predictPosition(t0 + tca.asUnit(UnitType.MILLISECOND), TCASResolutionAdvisoryClass.vec3Cache[0])[2];
    const intruderAltTcaMeters = ownAirplaneAltTcaMeters + vertDisplMeters;
    const alimMeters = alim.asUnit(UnitType.METER);
    const responseTimeSeconds = this.options.initialResponseTime.asUnit(UnitType.SECOND);
    const accel = this.options.initialAcceleration.asUnit(UnitType.MPS_PER_SEC);

    const senseCandidate = this.selectSense(
      simTime, tcaSeconds, alimMeters,
      responseTimeSeconds, accel,
      ownAirplaneAltMeters, ownAirplaneVSMPS, ownAirplaneAltTcaMeters, intruderAltTcaMeters,
      TCASResolutionAdvisoryClass.senseCandidateCache[0]
    );

    this.apply(
      simTime,
      senseCandidate.sense,
      senseCandidate.targetVS,
      ownAirplaneAltMeters,
      Math.sign(ownAirplaneAltMeters - intruderAltTcaMeters) === -senseCandidate.sense
    );

    this.publisher.pub('tcas_ra_issued', this, false, false);
  }

  /**
   * Updates this resolution advisory while it is active.
   * @param simTime The current sim time, as a UNIX timestamp in milliseconds.
   * @param alim The required vertical separation between own airplane and intruders.
   * @param intruders The set of active intruders to be tracked by this resolution advisory.
   */
  private updateActive(simTime: number, alim: NumberUnitInterface<UnitFamily.Distance>, intruders: ReadonlySet<TCASIntruder>): void {
    this.updateIntrudersArray(intruders);

    // TODO: Support multiple intruders
    const intruder = this.intruders[0];
    const t0 = intruder.tcaRA.time;
    const tca = intruder.tcaRA.tca;
    const tcaSeconds = tca.asUnit(UnitType.SECOND);
    const vertDisplMeters = intruder.tcaRA.tcaDisplacement[2];
    const ownAirplaneAltMeters = this.ownAirplane.predictPosition(t0, TCASResolutionAdvisoryClass.vec3Cache[0])[2];
    const ownAirplaneVSMPS = this.ownAirplane.verticalSpeed.asUnit(UnitType.MPS);
    const ownAirplaneAltTcaMeters = this.ownAirplane.predictPosition(t0 + tca.asUnit(UnitType.MILLISECOND), TCASResolutionAdvisoryClass.vec3Cache[0])[2];
    const intruderAltTcaMeters = ownAirplaneAltTcaMeters + vertDisplMeters;
    const alimMeters = alim.asUnit(UnitType.METER);
    const isInitial = BitFlags.isAll(this._flags, TCASResolutionAdvisoryFlags.Initial);
    const responseTimeSeconds = (isInitial ? this.options.initialResponseTime : this.options.subsequentResponseTime).asUnit(UnitType.SECOND);
    const accel = (isInitial ? this.options.initialAcceleration : this.options.subsequentAcceleration).asUnit(UnitType.MPS_PER_SEC);

    const minAlimMeters = intruderAltTcaMeters - alimMeters;
    const maxAlimMeters = intruderAltTcaMeters + alimMeters;

    const minAlimSense = Math.sign(minAlimMeters - ownAirplaneAltTcaMeters);
    const maxAlimSense = Math.sign(maxAlimMeters - ownAirplaneAltTcaMeters);

    const minDescendVSMPS = -TCASResolutionAdvisoryClass.CLIMB_DESC_VS_MPS;
    const maxClimbVSMPS = TCASResolutionAdvisoryClass.CLIMB_DESC_VS_MPS;

    const minIncDescendVSMPS = -TCASResolutionAdvisoryClass.INC_CLIMB_DESC_VS_MPS;
    const maxIncClimbVSMPS = TCASResolutionAdvisoryClass.INC_CLIMB_DESC_VS_MPS;

    const maxDownVslVSMPS = TCASResolutionAdvisoryClass.VSL_MAX_VS_MPS;
    const minUpVslVSMPS = -TCASResolutionAdvisoryClass.VSL_MAX_VS_MPS;

    const sense = this._maxVerticalSpeed.isNaN() ? 1 : -1;
    const isCrossing = Math.sign(ownAirplaneAltMeters - intruderAltTcaMeters) === -sense;

    let requiredVSMPS = NaN;
    let needCheckSenseReversal = false;
    let allowClimb: boolean | undefined, allowIncreaseClimb: boolean | undefined;
    let allowDescend: boolean | undefined, allowIncreaseDescent: boolean | undefined;

    if (sense === 1) {
      // upward sense

      const currentVSTargetMPS = this._minVerticalSpeed.asUnit(UnitType.MPS);
      const maxVS = currentVSTargetMPS > 0 ? maxIncClimbVSMPS : maxClimbVSMPS;

      if (maxAlimSense === 1) {
        requiredVSMPS = TCASResolutionAdvisoryClass.calculateVSToTargetAlt(
          tcaSeconds, ownAirplaneAltMeters, ownAirplaneVSMPS,
          Math.max(responseTimeSeconds - (simTime - this.timeUpdated) / 1000, 0), accel, maxAlimMeters
        );

        needCheckSenseReversal = isNaN(requiredVSMPS);
      } else {
        requiredVSMPS = (maxAlimMeters - ownAirplaneAltMeters) / tcaSeconds;
      }

      if (!isNaN(requiredVSMPS)) {
        if (requiredVSMPS > 0) {
          if (requiredVSMPS > maxVS) {
            needCheckSenseReversal = true;
          } else if (requiredVSMPS <= maxClimbVSMPS) {
            requiredVSMPS = maxClimbVSMPS;
          } else {
            requiredVSMPS = maxIncClimbVSMPS;
          }
        } else {
          requiredVSMPS = Math.ceil(Math.max(requiredVSMPS, minUpVslVSMPS) / TCASResolutionAdvisoryClass.VSL_VS_STEP_MPS) * TCASResolutionAdvisoryClass.VSL_VS_STEP_MPS;
        }

        if (!needCheckSenseReversal) {
          // Check if we need to strengthen the RA
          if (requiredVSMPS > currentVSTargetMPS + 1e-7) {
            if (
              requiredVSMPS <= 0
              || (requiredVSMPS === maxClimbVSMPS && (allowClimb ??= this.options.allowClimb(simTime)))
              || (requiredVSMPS === maxIncClimbVSMPS && (allowIncreaseClimb ??= this.options.allowIncreaseClimb(simTime)))
            ) {
              this.apply(simTime, 1, requiredVSMPS, ownAirplaneVSMPS, isCrossing);
              this.publisher.pub('tcas_ra_updated', this, false, false);
              return;
            } else {
              needCheckSenseReversal = true;
            }
          }

          // Check if we can weaken the RA (vertical speed limit RAs can never be weakened)
          if (currentVSTargetMPS > 0 && requiredVSMPS < currentVSTargetMPS - 1e-7) {
            this.apply(simTime, 1, requiredVSMPS, ownAirplaneVSMPS, isCrossing);
            this.publisher.pub('tcas_ra_updated', this, false, false);
            return;
          }
        }
      }
    } else {
      // downward sense

      const currentVSTargetMPS = this._maxVerticalSpeed.asUnit(UnitType.MPS);
      const minVS = currentVSTargetMPS < 0 ? minIncDescendVSMPS : minDescendVSMPS;

      if (minAlimSense === -1) {
        requiredVSMPS = TCASResolutionAdvisoryClass.calculateVSToTargetAlt(
          tcaSeconds, ownAirplaneAltMeters, ownAirplaneVSMPS,
          Math.max(responseTimeSeconds - (simTime - this.timeUpdated) / 1000, 0), accel, minAlimMeters
        );

        needCheckSenseReversal = isNaN(requiredVSMPS);
      } else {
        requiredVSMPS = (minAlimMeters - ownAirplaneAltMeters) / tcaSeconds;
      }

      if (!isNaN(requiredVSMPS)) {
        if (requiredVSMPS < 0) {
          if (requiredVSMPS < minVS) {
            needCheckSenseReversal = true;
          } else if (requiredVSMPS >= minDescendVSMPS) {
            requiredVSMPS = minDescendVSMPS;
          } else {
            requiredVSMPS = minIncDescendVSMPS;
          }
        } else {
          requiredVSMPS = Math.floor(Math.min(requiredVSMPS, maxDownVslVSMPS) / TCASResolutionAdvisoryClass.VSL_VS_STEP_MPS) * TCASResolutionAdvisoryClass.VSL_VS_STEP_MPS;
        }

        if (!needCheckSenseReversal) {
          // Check if we need to strengthen the RA
          if (requiredVSMPS < currentVSTargetMPS - 1e-7) {
            if (
              requiredVSMPS >= 0
              || (requiredVSMPS === minDescendVSMPS && (allowDescend ??= this.options.allowDescend(simTime)))
              || (requiredVSMPS === minIncDescendVSMPS && (allowIncreaseDescent ??= this.options.allowIncreaseDescent(simTime)))
            ) {
              this.apply(simTime, -1, requiredVSMPS, ownAirplaneVSMPS, isCrossing);
              this.publisher.pub('tcas_ra_updated', this, false, false);
              return;
            } else {
              needCheckSenseReversal = true;
            }
          }

          // Check if we can weaken the RA (vertical speed limit RAs can never be weakened)
          if (currentVSTargetMPS < 0 && requiredVSMPS > currentVSTargetMPS + 1e-7) {
            this.apply(simTime, -1, requiredVSMPS, ownAirplaneVSMPS, isCrossing);
            this.publisher.pub('tcas_ra_updated', this, false, false);
            return;
          }
        }
      }
    }

    if (needCheckSenseReversal) {
      if (this.canReverseSense) {
        const senseCandidate = this.selectSense(
          simTime, tcaSeconds, alimMeters,
          this.options.subsequentResponseTime.asUnit(UnitType.SECOND), this.options.subsequentAcceleration.asUnit(UnitType.MPS_PER_SEC),
          ownAirplaneAltMeters, ownAirplaneVSMPS, ownAirplaneAltTcaMeters, intruderAltTcaMeters,
          TCASResolutionAdvisoryClass.senseCandidateCache[0]
        );

        // Only reverse sense if doing so will achieve ALIM vertical separation at TCA, otherwise command the vertical
        // speed target limit for the current sense
        if (senseCandidate.sense !== sense && senseCandidate.doesReachTargetAlt) {
          this.canReverseSense = false;
          this.apply(simTime, senseCandidate.sense, senseCandidate.targetVS, ownAirplaneVSMPS, !isCrossing);
          this.publisher.pub('tcas_ra_updated', this, false, false);
          return;
        }
      }

      if (sense === 1) {
        const currentVSTargetMPS = this._minVerticalSpeed.asUnit(UnitType.MPS);
        const maxVS = currentVSTargetMPS > 0 ? maxIncClimbVSMPS : maxClimbVSMPS;

        if (
          (isNaN(requiredVSMPS) || requiredVSMPS > maxVS)
          && maxVS > currentVSTargetMPS + 1e-7
          && (
            (maxVS === maxClimbVSMPS && (allowClimb ??= this.options.allowClimb(simTime)))
            || (maxVS === maxIncClimbVSMPS && (allowIncreaseClimb ??= this.options.allowIncreaseClimb(simTime)))
          )
        ) {
          this.apply(simTime, 1, maxVS, ownAirplaneVSMPS, isCrossing);
          this.publisher.pub('tcas_ra_updated', this, false, false);
        }
      } else {
        const currentVSTargetMPS = this._maxVerticalSpeed.asUnit(UnitType.MPS);
        const minVS = currentVSTargetMPS < 0 ? minIncDescendVSMPS : minDescendVSMPS;

        if (
          (isNaN(requiredVSMPS) || requiredVSMPS < minVS)
          && minVS < currentVSTargetMPS - 1e-7
          && (
            (minVS === minDescendVSMPS && (allowDescend ??= this.options.allowDescend(simTime)))
            || (minVS === minIncDescendVSMPS && (allowIncreaseDescent ??= this.options.allowIncreaseDescent(simTime)))
          )
        ) {
          this.apply(simTime, -1, minVS, ownAirplaneVSMPS, isCrossing);
          this.publisher.pub('tcas_ra_updated', this, false, false);
        }
      }
    }

    // Check if we need to convert a CLIMB/DESCEND RA to a DO NOT DESCEND/DO NOT CLIMB RA.
    if (sense === 1 && this._minVerticalSpeed.number > 0 && !(allowClimb ??= this.options.allowClimb(simTime))) {
      this.apply(simTime, 1, 0, ownAirplaneVSMPS, isCrossing);
      this.publisher.pub('tcas_ra_updated', this, false, false);
      return;
    } else if (sense === -1 && this._maxVerticalSpeed.number < 0 && !(allowDescend ??= this.options.allowDescend(simTime))) {
      this.apply(simTime, -1, 0, ownAirplaneVSMPS, isCrossing);
      this.publisher.pub('tcas_ra_updated', this, false, false);
      return;
    }

    // Update corrective and crossing flags

    const isCorrective = (!this._minVerticalSpeed.isNaN() && this._minVerticalSpeed.compare(ownAirplaneVSMPS, UnitType.MPS) > 0)
      || (!this._maxVerticalSpeed.isNaN() && this._maxVerticalSpeed.compare(ownAirplaneVSMPS, UnitType.MPS) < 0);

    if (
      BitFlags.isAll(this._flags, TCASResolutionAdvisoryFlags.Corrective) !== isCorrective
      || BitFlags.isAll(this._flags, TCASResolutionAdvisoryFlags.Crossing) !== isCrossing
    ) {
      this._flags &= ~(TCASResolutionAdvisoryFlags.Corrective | TCASResolutionAdvisoryFlags.Crossing);
      this._flags |= (
        (isCorrective ? TCASResolutionAdvisoryFlags.Corrective : 0)
        | (isCrossing ? TCASResolutionAdvisoryFlags.Crossing : 0)
      );
      this.publisher.pub('tcas_ra_updated', this, false, false);
    }
  }

  /**
   * Updates this resolution advisory's array of active intruders.
   * @param intruders The set of active intruders to be tracked by this resolution advisory.
   */
  private updateIntrudersArray(intruders: ReadonlySet<TCASIntruder>): void {
    this.intruders.length = 0;

    for (const intruder of intruders) {
      this.intruders.push(intruder);
    }

    this.intruders.sort(TCASResolutionAdvisoryClass.INTRUDER_SORT_FUNC);
  }

  /**
   * Applies a vertical speed target to this resolution advisory.
   * @param simTime The current sim time, as a UNIX timestamp in milliseconds.
   * @param sense The sense of the vertical speed target.
   * @param targetVS The vertical speed target, in meters per second.
   * @param ownAirplaneVS The current vertical speed of the own airplane, in meters per second.
   * @param isCrossing Whether the applied sense crosses an intruder's altitude.
   */
  private apply(simTime: number, sense: 1 | -1, targetVS: number, ownAirplaneVS: number, isCrossing: boolean): void {
    let isCorrective;

    if (sense === 1) {
      isCorrective = ownAirplaneVS < targetVS;

      if (isCorrective && targetVS < 0) {
        // This is a corrective vertical speed limit RA -> change to level off RA
        targetVS = 0;
      }

      this._minVerticalSpeed.set(targetVS, UnitType.MPS);
      this._maxVerticalSpeed.set(NaN);
    } else {
      isCorrective = ownAirplaneVS > targetVS;

      if (isCorrective && targetVS > 0) {
        // This is a corrective vertical speed limit RA -> change to level off RA
        targetVS = 0;
      }

      this._minVerticalSpeed.set(NaN);
      this._maxVerticalSpeed.set(targetVS, UnitType.MPS);
    }

    // Resolve flags
    this._flags = (
      (isCorrective ? TCASResolutionAdvisoryFlags.Corrective : 0)
      | (this.isActive ? 0 : TCASResolutionAdvisoryFlags.Initial)
      | (sense === 1
        ? (
          TCASResolutionAdvisoryFlags.UpSense
          | (targetVS > 0
            ? TCASResolutionAdvisoryFlags.Climb
            : (isCorrective ? TCASResolutionAdvisoryFlags.ReduceDescent : TCASResolutionAdvisoryFlags.DoNotDescend)
          )
        )
        : (
          TCASResolutionAdvisoryFlags.DownSense
          | (
            targetVS < 0
              ? TCASResolutionAdvisoryFlags.Descend
              : (isCorrective ? TCASResolutionAdvisoryFlags.ReduceClimb : TCASResolutionAdvisoryFlags.DoNotClimb)
          )
        )
      )
      | (targetVS * sense >= TCASResolutionAdvisoryClass.INC_CLIMB_DESC_VS_MPS - 1e-7 ? TCASResolutionAdvisoryFlags.Increase : 0)
      | (isCrossing ? TCASResolutionAdvisoryFlags.Crossing : 0)
    );

    this.isActive = true;
    this.timeUpdated = simTime;
  }

  /**
   * Cancels this resolution advisory.
   */
  private cancel(): void {
    this.intruders.length = 0;
    this._maxVerticalSpeed.set(NaN);
    this._minVerticalSpeed.set(NaN);
    this._flags = 0;
    this.isActive = false;
    this.canReverseSense = true;

    this.publisher.pub('tcas_ra_canceled', undefined, false, false);
  }

  /**
   * Selects the best sense and vertical speed target for a resolution advisory. If the non-crossing sense is able to
   * achieve the target vertical separation, it will be selected. Otherwise, the sense that achieves the greatest
   * vertical separation at time of closest approach will be selected.
   * @param simTime The current sim time, as a UNIX timestamp in milliseconds.
   * @param tca The time to closest approach, in seconds.
   * @param alim The minimum target vertical separation, in meters, between the own airplane and intruders at the time
   * of closest approach.
   * @param responseTime The response time of the own airplane, in seconds.
   * @param accel The acceleration of the own airplane, in meters per second squared.
   * @param ownAirplaneAlt The current altitude of the own airplane, in meters.
   * @param ownAirplaneVS The current vertical speed of the own airplane, in meters per second.
   * @param ownAirplaneAltTca The predicted altitude of the own airplane at the time of closest approach, in meters.
   * @param intruderAltTca The predicted altitude of the intruder at the time of closest approach, in meters.
   * @param out The object to which to write the results.
   * @returns Information on the selected sense and vertical speed target.
   */
  private selectSense(
    simTime: number,
    tca: number,
    alim: number,
    responseTime: number,
    accel: number,
    ownAirplaneAlt: number,
    ownAirplaneVS: number,
    ownAirplaneAltTca: number,
    intruderAltTca: number,
    out: ResolutionAdvisorySenseCandidate
  ): ResolutionAdvisorySenseCandidate {
    let sense: 1 | -1 | undefined;
    let targetVS: number | undefined;
    let doesReachTargetAlt = true;

    const minDescendVS = -TCASResolutionAdvisoryClass.CLIMB_DESC_VS_MPS;
    const maxClimbVS = TCASResolutionAdvisoryClass.CLIMB_DESC_VS_MPS;

    const maxDownVslVS = TCASResolutionAdvisoryClass.VSL_MAX_VS_MPS;
    const minUpVslVS = -TCASResolutionAdvisoryClass.VSL_MAX_VS_MPS;

    const minAlim = intruderAltTca - alim;
    const maxAlim = intruderAltTca + alim;

    const minAlimSense = Math.sign(minAlim - ownAirplaneAltTca);
    const maxAlimSense = Math.sign(maxAlim - ownAirplaneAltTca);

    // We need to model both senses to select the best one

    let downVS: number, upVS: number;

    if (minAlimSense === -1) {
      // Own airplane needs to adjust vertical speed in the negative direction in order to pass below the intruder with
      // ALIM vertical separation at TCA
      downVS = responseTime < tca
        ? TCASResolutionAdvisoryClass.calculateVSToTargetAlt(tca, ownAirplaneAlt, ownAirplaneVS, responseTime, accel, minAlim)
        : NaN;
    } else {
      // Own airplane is already on track to pass below the intruder with ALIM vertical separation at TCA.
      downVS = (minAlim - ownAirplaneAlt) / tca;
    }
    if (maxAlimSense === 1) {
      // Own airplane needs to adjust vertical speed in the positive direction in order to pass above the intruder with
      // ALIM vertical separation at TCA
      upVS = responseTime < tca
        ? TCASResolutionAdvisoryClass.calculateVSToTargetAlt(tca, ownAirplaneAlt, ownAirplaneVS, responseTime, accel, maxAlim)
        : NaN;
    } else {
      // Own airplane is already on track to pass above the intruder with ALIM vertical separation at TCA.
      upVS = (maxAlim - ownAirplaneAlt) / tca;
    }

    if (!isNaN(downVS)) {
      if (downVS < minDescendVS) {
        downVS = NaN;
      } else if (downVS > maxDownVslVS) {
        downVS = maxDownVslVS;
      }
    }
    if (!isNaN(upVS)) {
      if (upVS < maxClimbVS) {
        upVS = NaN;
      } else if (upVS < minUpVslVS) {
        upVS = minUpVslVS;
      }
    }

    let canChooseDownSense = !isNaN(downVS) && (downVS >= 0 || this.options.allowDescend(simTime));
    let canChooseUpSense = !isNaN(upVS) && (upVS <= 0 || this.options.allowClimb(simTime));

    // Select the non-crossing sense if it achieves ALIM vertical separation.
    // If both senses are non-crossing, select the one that gives the greatest vertical separation with the least change in VS.
    // Otherwise, select the sense that achieves ALIM vertical separation.

    const nonCrossingSense = Math.sign(ownAirplaneAlt - intruderAltTca);
    const nonCrossingSenseVS = nonCrossingSense === 0 ? NaN : nonCrossingSense === 1 ? upVS : downVS;
    const canChooseNonCrossingSense = nonCrossingSense !== 0 && (nonCrossingSense === 1 ? canChooseUpSense : canChooseDownSense);

    if (canChooseNonCrossingSense) {
      sense = nonCrossingSense as 1 | -1;
      targetVS = nonCrossingSenseVS;
    } else {
      if (canChooseUpSense && !canChooseDownSense) {
        sense = 1;
        targetVS = upVS;
      } else if (!canChooseUpSense && canChooseDownSense) {
        sense = -1;
        targetVS = downVS;
      } else if (canChooseUpSense && canChooseDownSense) {
        if (Math.abs(upVS - ownAirplaneVS) < Math.abs(downVS - ownAirplaneVS)) {
          sense = 1;
          targetVS = upVS;
        } else {
          sense = -1;
          targetVS = downVS;
        }
      } else if (!isNaN(downVS) || !isNaN(upVS)) {
        // At least one of the upward or downward sense RAs is viable, but is inhibited -> select the
        // sense that is viable (or the one that gives the greatest vertical separation if both are viable)
        // and set the target vertical speed to 0 to avoid a CLIMB or DESCEND RA.

        if (isNaN(downVS)) {
          sense = 1;
        } else if (isNaN(upVS)) {
          sense = -1;
        } else {
          if (Math.abs(upVS - ownAirplaneVS) < Math.abs(downVS - ownAirplaneVS)) {
            sense = 1;
          } else {
            sense = -1;
          }
        }

        targetVS = 0;
        doesReachTargetAlt = false;
      }
    }

    if (sense === undefined) {
      // If sense has not been selected yet, it means neither sense achieves ALIM vertical separation, so we will
      // simply choose the sense that gives the greatest potential vertical separation.

      const requiredDownVS = (minAlim - ownAirplaneAlt) / tca;
      const requiredUpVS = (maxAlim - ownAirplaneAlt) / tca;
      downVS = Utils.Clamp(requiredDownVS, minDescendVS, maxDownVslVS);
      upVS = Utils.Clamp(requiredUpVS, minUpVslVS, maxClimbVS);

      canChooseDownSense = downVS >= 0 || this.options.allowDescend(simTime);
      canChooseUpSense = upVS <= 0 || this.options.allowClimb(simTime);

      if (canChooseUpSense && (!canChooseDownSense || Math.abs(requiredUpVS - ownAirplaneVS) < Math.abs(requiredDownVS - ownAirplaneVS))) {
        sense = 1;
        targetVS = upVS;
      } else if (canChooseDownSense) {
        sense = -1;
        targetVS = downVS;
      } else {
        // Both senses are inhibited -> we will set the target vertical speed to 0 and choose the non-crossing sense

        if (ownAirplaneAlt > intruderAltTca) {
          sense = 1;
        } else {
          sense = -1;
        }
        targetVS = 0;
      }

      doesReachTargetAlt = false;
    }

    if (targetVS !== undefined) {
      if (sense === 1) {
        if (targetVS < 0) {
          targetVS = Math.ceil(targetVS / TCASResolutionAdvisoryClass.VSL_VS_STEP_MPS) * TCASResolutionAdvisoryClass.VSL_VS_STEP_MPS;
        } else if (targetVS > 0) {
          targetVS = maxClimbVS;
        }
      } else {
        if (targetVS > 0) {
          targetVS = Math.floor(targetVS / TCASResolutionAdvisoryClass.VSL_VS_STEP_MPS) * TCASResolutionAdvisoryClass.VSL_VS_STEP_MPS;
        } else if (targetVS < 0) {
          targetVS = minDescendVS;
        }
      }
    }

    out.sense = sense;
    out.targetAltTca = sense === 1 ? maxAlim : minAlim;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    out.targetVS = targetVS!;
    out.doesReachTargetAlt = doesReachTargetAlt;

    return out;
  }

  /**
   * Calculates the vertical speed required to achieve a desired altitude target at time of closest approach.
   * @param tca The time to closest approach from the present, in seconds.
   * @param currentAlt The current altitude of the own airplane, in meters.
   * @param vs The current vertical speed of the own airplane, in meters per second.
   * @param responseTime The response time of the own airplane, in seconds.
   * @param accel The acceleration of the own airplane, in meters per second squared.
   * @param targetAlt The target altitude of the own airplane at time of closest approach, in meters.
   * @returns The vertical speed, in meters per second, required to achieve a desired altitude target at time of
   * closest approach. A value of `NaN` indicates the altitude target cannot be reached with the specified parameters.
   */
  private static calculateVSToTargetAlt(
    tca: number,
    currentAlt: number,
    vs: number,
    responseTime: number,
    accel: number,
    targetAlt: number
  ): number {
    const signedAccel = accel * Math.sign(targetAlt - (currentAlt + vs * tca));

    if (signedAccel === 0) {
      return vs;
    }

    const y0 = currentAlt + vs * responseTime;
    const tc = tca - responseTime;

    const a = signedAccel / 2;
    const b = -signedAccel * tc;
    const c = targetAlt - y0 - vs * tc;

    const discriminant = b * b - 4 * a * c;
    if (discriminant < 0) {
      return NaN;
    }

    const sqrtDiscr = Math.sqrt(discriminant);
    const t1 = (-b + sqrtDiscr) / (2 * a);
    const t2 = (-b - sqrtDiscr) / (2 * a);

    if (t1 <= tc && t1 >= 0) {
      return vs + signedAccel * t1;
    }
    if (t2 <= tc && t2 >= 0) {
      return vs + signedAccel * t2;
    }

    return NaN;
  }
}

/**
 * An abstract implementation of {@link TCASSensitivity}.
 */
export abstract class AbstractTCASSensitivity implements TCASSensitivity {
  public readonly parametersPA = {
    protectedRadius: NumberUnitSubject.createFromNumberUnit(UnitType.NMILE.createNumber(NaN)),
    protectedHeight: NumberUnitSubject.createFromNumberUnit(UnitType.FOOT.createNumber(NaN))
  };

  public readonly parametersTA = {
    lookaheadTime: NumberUnitSubject.createFromNumberUnit(UnitType.SECOND.createNumber(NaN)),
    protectedRadius: NumberUnitSubject.createFromNumberUnit(UnitType.NMILE.createNumber(NaN)),
    protectedHeight: NumberUnitSubject.createFromNumberUnit(UnitType.FOOT.createNumber(NaN))
  };

  public readonly parametersRA = {
    lookaheadTime: NumberUnitSubject.createFromNumberUnit(UnitType.SECOND.createNumber(NaN)),
    protectedRadius: NumberUnitSubject.createFromNumberUnit(UnitType.NMILE.createNumber(NaN)),
    protectedHeight: NumberUnitSubject.createFromNumberUnit(UnitType.FOOT.createNumber(NaN)),
    alim: NumberUnitSubject.createFromNumberUnit(UnitType.FOOT.createNumber(NaN)),
  };
}

/**
 * TCAS sensitivity settings which update based on the altitude of the own airplane to standard values defined in the
 * TCAS II specification.
 */
export class DefaultTCASSensitivity extends AbstractTCASSensitivity {
  // TA sensitivity levels (seconds/NM/feet).
  private static readonly TA_LEVELS = [
    {
      lookaheadTime: 20,
      protectedRadius: 0.3,
      protectedHeight: 850
    },
    {
      lookaheadTime: 25,
      protectedRadius: 0.33,
      protectedHeight: 850
    },
    {
      lookaheadTime: 30,
      protectedRadius: 0.48,
      protectedHeight: 850
    },
    {
      lookaheadTime: 40,
      protectedRadius: 0.75,
      protectedHeight: 850
    },
    {
      lookaheadTime: 45,
      protectedRadius: 1,
      protectedHeight: 850
    },
    {
      lookaheadTime: 48,
      protectedRadius: 1.3,
      protectedHeight: 850
    },
    {
      lookaheadTime: 48,
      protectedRadius: 1.3,
      protectedHeight: 1200
    }
  ];

  // RA sensitivity levels (seconds/NM/feet/feet).
  private static readonly RA_LEVELS = [
    {
      lookaheadTime: 15,
      protectedRadius: 0.2,
      protectedHeight: 600,
      alim: 300
    },
    {
      lookaheadTime: 15,
      protectedRadius: 0.2,
      protectedHeight: 600,
      alim: 300
    },
    {
      lookaheadTime: 20,
      protectedRadius: 0.35,
      protectedHeight: 600,
      alim: 300
    },
    {
      lookaheadTime: 25,
      protectedRadius: 0.55,
      protectedHeight: 600,
      alim: 350
    },
    {
      lookaheadTime: 30,
      protectedRadius: 0.8,
      protectedHeight: 600,
      alim: 400
    },
    {
      lookaheadTime: 35,
      protectedRadius: 1.1,
      protectedHeight: 700,
      alim: 600
    },
    {
      lookaheadTime: 35,
      protectedRadius: 1.1,
      protectedHeight: 800,
      alim: 700
    }
  ];

  /** @inheritdoc */
  constructor() {
    super();

    this.parametersPA.protectedRadius.set(6, UnitType.NMILE);
    this.parametersPA.protectedHeight.set(1200, UnitType.FOOT);
  }

  /**
   * Updates the sensitivity level.
   * @param altitude The indicated altitude of the own airplane.
   * @param radarAltitude The radar altitude of the own airplane.
   */
  public update(altitude: NumberUnitInterface<UnitFamily.Distance>, radarAltitude: NumberUnitInterface<UnitFamily.Distance>): void {
    const altFeet = altitude.asUnit(UnitType.FOOT);
    const radarAltFeet = radarAltitude.asUnit(UnitType.FOOT);

    let level: number;
    if (radarAltFeet > 2350) {
      if (altFeet > 42000) {
        level = 6;
      } else if (altFeet > 20000) {
        level = 5;
      } else if (altFeet > 10000) {
        level = 4;
      } else if (altFeet > 5000) {
        level = 3;
      } else {
        level = 2;
      }
    } else if (radarAltFeet > 1000) {
      level = 1;
    } else {
      level = 0;
    }

    const parametersTA = DefaultTCASSensitivity.TA_LEVELS[level];
    this.parametersTA.lookaheadTime.set(parametersTA.lookaheadTime, UnitType.SECOND);
    this.parametersTA.protectedRadius.set(parametersTA.protectedRadius, UnitType.NMILE);
    this.parametersTA.protectedHeight.set(parametersTA.protectedHeight, UnitType.FOOT);

    const parametersRA = DefaultTCASSensitivity.RA_LEVELS[level];
    this.parametersRA.lookaheadTime.set(parametersRA.lookaheadTime, UnitType.SECOND);
    this.parametersRA.protectedRadius.set(parametersRA.protectedRadius, UnitType.NMILE);
    this.parametersRA.protectedHeight.set(parametersRA.protectedHeight, UnitType.FOOT);
    this.parametersRA.alim.set(parametersRA.alim, UnitType.FOOT);
  }
}