import { BitFlags } from '../math/BitFlags';
import { Subject } from '../sub/Subject';
import { UnitType } from '../math/NumberUnit';
import { EventBus, SimVarValueType } from '../data';
import { FlightPlan, FlightPlanner, FlightPlannerEvents, FlightPlanSegmentType, LegDefinition, LegDefinitionFlags } from '../flightplan';
import { ADCEvents, GNSSEvents } from '../instruments';
import { AdditionalApproachType, FacilityLoader, FacilityType, FixTypeFlags, LegTurnDirection, LegType } from '../navigation';
import { LNavEvents } from './LNavEvents';
import { LNavDataEvents } from './LNavDataEvents';
import { VNavEvents } from './VNavEvents';

/**
 * A class that synchronizes the local NXi state to the sim GPS system.
 */
export class GpsSynchronizer {

  private magvar = 0;
  private distanceToCurrentLeg = -1;
  private groundSpeed = 0;
  private trueTrack = 0;
  private zuluTime = 0;
  private numPlanLegs = Subject.create<number>(0);
  private hasReachedDestination = Subject.create<boolean>(false);
  private isDestinationLegActive = Subject.create<boolean>(false);
  private isDirectToActive = Subject.create<boolean>(false);



  /**
   * Creates an instance of GpsSynchronizer.
   * @param bus The bus to source events from.
   * @param flightPlanner An instance of the flight planner.
   * @param facLoader An instance of the facility loader.
   */
  constructor(private bus: EventBus, private flightPlanner: FlightPlanner, private readonly facLoader: FacilityLoader) {
    const lnav = bus.getSubscriber<LNavEvents & LNavDataEvents>();
    lnav.on('lnavdata_dtk_mag').handle(this.onDtkChanged.bind(this));
    lnav.on('lnavdata_xtk').handle(this.onXtkChanged.bind(this));
    lnav.on('lnavdata_waypoint_distance').handle(this.onLnavDistanceChanged.bind(this));
    lnav.on('lnavdata_waypoint_bearing_mag').handle(this.onLnavBearingChanged.bind(this));
    lnav.on('lnavdata_destination_distance').handle(this.onLnavDistanceToDestinationChanged.bind(this));
    lnav.on('lnav_course_to_steer').handle(this.onLNavCourseToSteerChanged.bind(this));

    const adc = bus.getSubscriber<ADCEvents>();
    adc.on('hdg_deg_true').handle(this.onTrueHeadingChanged.bind(this));

    const vnav = bus.getSubscriber<VNavEvents>();
    vnav.on('vnav_required_vs').handle(this.requiredVsChanged.bind(this));

    const gnss = bus.getSubscriber<GNSSEvents>();
    gnss.on('gps-position').handle(this.onPositionChanged.bind(this));
    gnss.on('zulu_time').handle(t => this.zuluTime = t);
    gnss.on('track_deg_true').handle(this.onTrackTrueChanged.bind(this));
    gnss.on('ground_speed').handle(this.onGroundSpeedChanged.bind(this));
    gnss.on('magvar').handle(this.onMagvarChanged.bind(this));

    const plan = bus.getSubscriber<FlightPlannerEvents>();
    plan.on('fplActiveLegChange').handle(() => {
      this.hasReachedDestination.set(false);
      if (this.flightPlanner.hasActiveFlightPlan()) {
        const activeFlightplan = this.flightPlanner.getActiveFlightPlan();
        this.checkDestinationLegActive(activeFlightplan);
        this.checkDirectToState(activeFlightplan);
        this.onIsPrevLegChanged(activeFlightplan);
        this.onWaypointIndexChanged(activeFlightplan);
      }
    });

    plan.on('fplSegmentChange').handle(this.onPlanChanged.bind(this));
    plan.on('fplIndexChanged').handle(this.onPlanChanged.bind(this));

    this.numPlanLegs.sub(this.onNumLegsChanged.bind(this));
  }

  /**
   * Updates the GpsSynchronizer.
   */
  public update(): void {
    const isGpsOverridden = SimVar.GetSimVarValue('GPS OVERRIDDEN', SimVarValueType.Bool);
    if (!isGpsOverridden) {
      SimVar.SetSimVarValue('GPS OVERRIDDEN', SimVarValueType.Bool, true);
    }

    let numPlanLegs = 0;
    if (this.flightPlanner.hasActiveFlightPlan()) {
      const plan = this.flightPlanner.getActiveFlightPlan();
      numPlanLegs = plan.length;
    }
    this.numPlanLegs.set(numPlanLegs);
  }

  /**
   * Handles when the active plan segments are changed.
   */
  private onPlanChanged(): void {
    const plan = this.flightPlanner.getActiveFlightPlan();
    const approachSegments = [...plan.segmentsOfType(FlightPlanSegmentType.Approach)];

    if (approachSegments && approachSegments.length > 0) {
      SimVar.SetSimVarValue('GPS IS APPROACH LOADED', SimVarValueType.Bool, true);
      //SimVar.SetSimVarValue('GPS APPROACH WP COUNT', SimVarValueType.Number, approachSegments[0].legs.length);

    } else {
      SimVar.SetSimVarValue('GPS IS APPROACH LOADED', SimVarValueType.Bool, false);
      //SimVar.SetSimVarValue('GPS APPROACH WP COUNT', SimVarValueType.Number, 0);
    }

    //SimVar.SetSimVarValue('GPS APPROACH APPROACH INDEX', SimVarValueType.Number, plan.procedureDetails.approachIndex);
    //SimVar.SetSimVarValue('GPS APPROACH TRANSITION INDEX', SimVarValueType.Number, plan.procedureDetails.approachTransitionIndex);

    this.checkApproachTypeAndTimezone(plan, plan.procedureDetails.approachIndex);

    this.hasReachedDestination.set(false);
    this.checkDestinationLegActive(plan);
    this.checkDirectToState(plan);
    this.onIsPrevLegChanged(plan);
    this.onWaypointIndexChanged(plan);
  }

  /**
   * Handles when the course steered by LNAV changes.
   * @param course The course steered by LNAV, in degrees true.
   */
  private onLNavCourseToSteerChanged(course: number): void {
    SimVar.SetSimVarValue('GPS COURSE TO STEER', SimVarValueType.Degree, course);
  }

  /**
   * Checks to see if we are in a direct to state.
   * @param plan The Active Flight Plan.
   */
  private checkDirectToState(plan: FlightPlan): void {
    let isDirectToActive = false;
    if (plan.activeLateralLeg >= 0 && plan.activeLateralLeg < plan.length) {
      const activeLeg = plan.getLeg(plan.activeLateralLeg);
      isDirectToActive = BitFlags.isAll(activeLeg.flags, LegDefinitionFlags.DirectTo);
    }
    this.isDirectToActive.set(isDirectToActive);
  }

  /**
   * Checks to see if we have reached the plan destination.
   * @param plan The Active Flight Plan
   */
  private checkDestinationLegActive(plan: FlightPlan): void {

    if (plan.length > 1) {
      const finalSegment = plan.getSegment(plan.getSegmentIndex(plan.length - 1));
      const isApproachActive = plan.activeLateralLeg >= finalSegment.offset && finalSegment.segmentType === FlightPlanSegmentType.Approach;

      SimVar.SetSimVarValue('GPS IS APPROACH ACTIVE', SimVarValueType.Bool, isApproachActive);
      let destinationLegIndex = plan.length - 1;
      let fafIndex = -1;

      if (isApproachActive) {
        for (let i = finalSegment.legs.length - 1; i >= 0; i--) {
          const leg = finalSegment.legs[i];
          if (!BitFlags.isAll(leg.flags, LegDefinitionFlags.MissedApproach)) {
            destinationLegIndex = i + finalSegment.offset;
          }
          if (leg.leg.fixTypeFlags === FixTypeFlags.FAF) {
            fafIndex = i + finalSegment.offset;
            break;
          }
        }
      }

      this.checkApproachMode(plan, isApproachActive, fafIndex);
      if (!this.hasReachedDestination.get() && destinationLegIndex === plan.activeLateralLeg) {
        this.isDestinationLegActive.set(true);
        return;
      }
    } else {
      this.checkApproachMode(plan, false, -1);
    }

    this.isDestinationLegActive.set(false);
  }

  /**
   * Checks the approach mode on leg change.
   * @param plan The Active Flight Plan.
   * @param isApproachActive Whether the approach is active.
   * @param fafIndex The destination leg index.
   */
  private checkApproachMode(plan: FlightPlan, isApproachActive: boolean, fafIndex: number): void {
    let approachMode = 0;
    let currentLeg: LegDefinition | undefined;
    if (isApproachActive && plan.activeLateralLeg >= 0 && plan.activeLateralLeg < plan.length) {
      currentLeg = plan.getLeg(plan.activeLateralLeg);
      if (BitFlags.isAll(currentLeg.flags, LegDefinitionFlags.MissedApproach)) {
        approachMode = 3;
      } else if (fafIndex > -1 && plan.activeLateralLeg >= fafIndex) {
        approachMode = 2;
      } else {
        approachMode = 1;
      }
    }
    this.checkApproachWaypointType(currentLeg);
    SimVar.SetSimVarValue('GPS APPROACH MODE', SimVarValueType.Number, approachMode);
    SimVar.SetSimVarValue('GPS APPROACH IS FINAL', SimVarValueType.Bool, approachMode === 2);
  }

  /**
   * Handles when the active leg index changes.
   * @param plan The Active Flight Plan.
   */
  private onWaypointIndexChanged(plan: FlightPlan): void {
    if (plan.activeLateralLeg >= 0 && plan.activeLateralLeg < plan.length) {
      const leg = plan.getLeg(plan.activeLateralLeg);
      SimVar.SetSimVarValue('GPS WP NEXT ID', SimVarValueType.String, leg.name ?? '');

      if (leg?.calculated) {
        SimVar.SetSimVarValue('GPS WP NEXT LAT', SimVarValueType.Degree, leg.calculated.endLat);
        SimVar.SetSimVarValue('GPS WP NEXT LON', SimVarValueType.Degree, leg.calculated.endLon);
      }
    }
  }

  /**
   * Handles when the number of active plan legs changes.
   * @param numLegs The number of active plan legs.
   */
  private onNumLegsChanged(numLegs: number): void {
    SimVar.SetSimVarValue('GPS IS ACTIVE FLIGHT PLAN', SimVarValueType.Bool, numLegs > 0);
    SimVar.SetSimVarValue('GPS IS ACTIVE WAY POINT', SimVarValueType.Bool, numLegs > 1);
    //SimVar.SetSimVarValue('GPS FLIGHT PLAN WP COUNT', SimVarValueType.Number, numLegs);

    if (this.flightPlanner.hasActiveFlightPlan()) {
      const plan = this.flightPlanner.getActiveFlightPlan();
      this.onIsPrevLegChanged(plan);
    }

  }

  /**
   * Handles when the previous leg changes.
   * @param plan The Active Flight Plan
   */
  private onIsPrevLegChanged(plan: FlightPlan): void {
    const numLegs = this.numPlanLegs.get();
    if (numLegs > 1 && plan.activeLateralLeg > 0 && plan.activeLateralLeg < plan.length) {
      const prevLeg = plan.getLeg(plan.activeLateralLeg - 1);

      if (prevLeg.leg.type !== LegType.Discontinuity && prevLeg.leg.type !== LegType.ThruDiscontinuity) {
        SimVar.SetSimVarValue('GPS WP PREV VALID', SimVarValueType.Bool, true);
        if (prevLeg.calculated) {
          SimVar.SetSimVarValue('GPS WP PREV LAT', SimVarValueType.Degree, prevLeg.calculated.endLat);
          SimVar.SetSimVarValue('GPS WP PREV LON', SimVarValueType.Degree, prevLeg.calculated.endLon);
        }
      }
    }
  }

  /**
   * Handles when the LNAV Distance to Destination Changes.
   * @param dis The new distance to destination.
   */
  private onLnavDistanceToDestinationChanged(dis: number): void {
    const eteSeconds = 3600 * dis / this.groundSpeed;
    if (isNaN(eteSeconds)) { return; }

    SimVar.SetSimVarValue('GPS ETE', SimVarValueType.Seconds, eteSeconds);
    SimVar.SetSimVarValue('GPS ETA', SimVarValueType.Seconds, eteSeconds + this.zuluTime);
  }

  /**
   * Handles when the LNAV DTK changes.
   * @param dtk The new DTK.
   */
  private onDtkChanged(dtk: number): void {
    SimVar.SetSimVarValue('GPS WP DESIRED TRACK', SimVarValueType.Radians, UnitType.DEGREE.convertTo(dtk, UnitType.RADIAN));
  }

  /**
   * Handles when the LNAV XTK changes.
   * @param xtk The new XTK.
   */
  private onXtkChanged(xtk: number): void {
    SimVar.SetSimVarValue('GPS WP CROSS TRK', SimVarValueType.Meters, UnitType.NMILE.convertTo(xtk, UnitType.METER) * -1);
  }

  /**
   * Handles when the LNAV DIS to WP changes.
   * @param dis The distance.
   */
  private onLnavDistanceChanged(dis: number): void {
    if (this.isDestinationLegActive.get() && dis < 1000) {
      this.hasReachedDestination.set(true);
    }
    const distanceMeters = UnitType.NMILE.convertTo(dis, UnitType.METER);
    SimVar.SetSimVarValue('GPS WP DISTANCE', SimVarValueType.Meters, distanceMeters);

    const eteSeconds = 3600 * dis / this.groundSpeed;

    SimVar.SetSimVarValue('GPS WP ETE', SimVarValueType.Seconds, eteSeconds);
    SimVar.SetSimVarValue('GPS WP ETA', SimVarValueType.Seconds, eteSeconds + this.zuluTime);
  }

  /**
   * Handles when the LNAV Bearing to WP changes.
   * @param brg The bearing.
   */
  private onLnavBearingChanged(brg: number): void {
    SimVar.SetSimVarValue('GPS WP BEARING', SimVarValueType.Radians, UnitType.DEGREE.convertTo(brg, UnitType.RADIAN));
  }

  /**
   * Handles when the True Ground Track Changes.
   * @param trk The true track.
   */
  private onTrackTrueChanged(trk: number): void {
    SimVar.SetSimVarValue('GPS GROUND TRUE TRACK', SimVarValueType.Radians, UnitType.DEGREE.convertTo(trk, UnitType.RADIAN));
  }

  /**
   * Handles when the Ground Speed changes.
   * @param gs The current ground speed.
   */
  private onGroundSpeedChanged(gs: number): void {
    this.groundSpeed = gs;
    SimVar.SetSimVarValue('GPS GROUND SPEED', SimVarValueType.MetersPerSecond, UnitType.KNOT.convertTo(gs, UnitType.MPS));
  }

  /**
   * Handles when the true heading changes.
   * @param hdg The true heading.
   */
  private onTrueHeadingChanged(hdg: number): void {
    SimVar.SetSimVarValue('GPS GROUND TRUE HEADING', SimVarValueType.Radians, UnitType.DEGREE.convertTo(hdg, UnitType.RADIAN));
  }

  /**
   * Handles when the magvar changes.
   * @param magvar The new magvar.
   */
  private onMagvarChanged(magvar: number): void {
    this.magvar = magvar;
    SimVar.SetSimVarValue('GPS MAGVAR', SimVarValueType.Radians, UnitType.DEGREE.convertTo(magvar, UnitType.RADIAN));
  }

  /**
   * Handles when the VNAV required VS changes.
   * @param vs The required vertical speed.
   */
  private requiredVsChanged(vs: number): void {
    SimVar.SetSimVarValue('GPS WP VERTICAL SPEED', SimVarValueType.FPM, vs);
  }

  /**
   * Handles when the plane position changes.
   * @param pos The new plane position.
   */
  private onPositionChanged(pos: LatLongAlt): void {
    SimVar.SetSimVarValue('GPS POSITION LAT', SimVarValueType.Degree, pos.lat);
    SimVar.SetSimVarValue('GPS POSITION LON', SimVarValueType.Degree, pos.long);
    SimVar.SetSimVarValue('GPS POSITION ALT', SimVarValueType.Meters, pos.alt);
  }

  /**
   * Handles checking the approach type and timezone.
   * @param plan The active flight plan.
   * @param approachIndex The approach index in the active plan.
   */
  private async checkApproachTypeAndTimezone(plan: FlightPlan, approachIndex: number): Promise<void> {
    let approachType = 0;
    if (plan.getUserData<any>('visual_approach') !== undefined) {
      approachType = ApproachType.APPROACH_TYPE_RNAV;
    } else if (approachIndex > -1 && plan.destinationAirport) {
      const facility = await this.facLoader.getFacility(FacilityType.Airport, plan.destinationAirport);

      approachType = facility.approaches[approachIndex].approachType;
      if (approachType === AdditionalApproachType.APPROACH_TYPE_VISUAL) {
        approachType = ApproachType.APPROACH_TYPE_RNAV;
      }

      // TODO: Find a way to get the timezone from the facility or by lat/lon?
    }
    SimVar.SetSimVarValue('GPS APPROACH APPROACH TYPE', SimVarValueType.Number, approachType);
  }

  /**
   * Handles checking the approach waypoint type.
   * @param leg The active lateral leg.
   */
  private checkApproachWaypointType(leg?: LegDefinition): void {
    let legType = 0;
    let segmentType = 0;
    if (leg) {
      switch (leg.leg.type) {
        case LegType.AF:
          legType = leg.leg.turnDirection === LegTurnDirection.Left ? 4 : 5;
          segmentType = leg.leg.turnDirection === LegTurnDirection.Left ? 2 : 1;
          break;
        case LegType.RF:
          legType = 1;
          segmentType = leg.leg.turnDirection === LegTurnDirection.Left ? 2 : 1;
          break;
        case LegType.CA:
        case LegType.FA:
        case LegType.VA:
          legType = 9;
          break;
        case LegType.FM:
        case LegType.VM:
          legType = 10;
          break;
        case LegType.CD:
        case LegType.FD:
        case LegType.VD:
          legType = 8;
          break;
        case LegType.PI:
          legType = leg.leg.turnDirection === LegTurnDirection.Left ? 2 : 3;
          break;
        case LegType.HA:
        case LegType.HM:
        case LegType.HF:
          legType = leg.leg.turnDirection === LegTurnDirection.Left ? 6 : 7;
          break;
        default:
          legType = 1;
      }
    }
    SimVar.SetSimVarValue('GPS APPROACH WP TYPE', SimVarValueType.Number, legType);
    SimVar.SetSimVarValue('GPS APPROACH SEGMENT TYPE', SimVarValueType.Number, segmentType);
    SimVar.SetSimVarValue('GPS APPROACH IS WP RUNWAY', SimVarValueType.Bool, leg?.leg.fixIcao[0] === 'R');
  }
}