import { SubEvent, Subject } from '../../..';
import {
  FlightPlan, FlightPlanActiveLegEvent, FlightPlanCalculatedEvent, FlightPlanCopiedEvent, FlightPlanIndicationEvent, FlightPlanner, FlightPlannerEvents
} from '../../../flightplan';
import { MapSystemContext } from '../MapSystemContext';
import { AbstractMapModule } from './AbstractMapModule';

/** An event created when a flight plan changes. */
type PlanChangeEvent = {
  /** The index of the plan that changed. */
  planIndex: number;
}

/**
 * A map data module that handles the display of flight plan data.
 */
export class MapFlightPlanModule extends AbstractMapModule {

  private readonly plans: PlanSubjects[] = [];

  /**
   * Creates an instance of a MapFlightPlanModule.
   * @param flightPlanner The flight planner to use with this module.
   * @param context The context to use with this module
   */
  constructor(private readonly flightPlanner: FlightPlanner, context: MapSystemContext) {
    super(context);
  }

  private planCopiedHandler = (evt: FlightPlanCopiedEvent): void => {
    this.getPlanSubjects(evt.targetPlanIndex).flightPlan.set(this.flightPlanner.getFlightPlan(evt.targetPlanIndex));
    this.getPlanSubjects(evt.targetPlanIndex).planChanged.notify(this);
  };

  private planCreatedHandler = (evt: FlightPlanIndicationEvent): void => {
    this.getPlanSubjects(evt.planIndex).flightPlan.set(this.flightPlanner.getFlightPlan(evt.planIndex));
  };

  private planDeletedHandler = (evt: FlightPlanIndicationEvent): void => {
    this.getPlanSubjects(evt.planIndex).flightPlan.set(undefined);
  };

  private planChangeHandler = (evt: PlanChangeEvent): void => {
    this.getPlanSubjects(evt.planIndex).planChanged.notify(this);
  };

  private planCalculatedHandler = (evt: FlightPlanCalculatedEvent): void => {
    this.getPlanSubjects(evt.planIndex).planCalculated.notify(this);
  };

  private activeLegChangedHandler = (evt: FlightPlanActiveLegEvent): void => {
    this.getPlanSubjects(evt.planIndex).activeLeg.set(evt.legIndex);
  };

  private readonly subscriber = this.mapSystemContext.bus.getSubscriber<FlightPlannerEvents>();
  private fplCopied = this.subscriber.on('fplCopied');
  private fplCreated = this.subscriber.on('fplCreated');
  private fplDeleted = this.subscriber.on('fplDeleted');
  private fplDirectToDataChanged = this.subscriber.on('fplDirectToDataChanged');
  private fplLoaded = this.subscriber.on('fplLoaded');
  private fplOriginDestChanged = this.subscriber.on('fplOriginDestChanged');
  private fplProcDetailsChanged = this.subscriber.on('fplProcDetailsChanged');
  private fplSegmentChange = this.subscriber.on('fplSegmentChange');
  private fplUserDataDelete = this.subscriber.on('fplUserDataDelete');
  private fplUserDataSet = this.subscriber.on('fplUserDataSet');
  private fplActiveLegChange = this.subscriber.on('fplActiveLegChange');
  private fplCalculated = this.subscriber.on('fplCalculated');

  /**
   * Gets the flight plan subjects for a specified flight plan.
   * @param index The index of the flight plan.
   * @returns The subject for the specified plan index.
   */
  public getPlanSubjects(index: number): PlanSubjects {
    let planSubject = this.plans[index];
    if (planSubject === undefined) {
      planSubject = new PlanSubjects();
      this.plans[index] = planSubject;
    }

    return planSubject;
  }

  /** @inheritdoc */
  public startSync(): void {
    this.fplCopied.handle(this.planCopiedHandler);
    this.fplCreated.handle(this.planCreatedHandler);
    this.fplDeleted.handle(this.planDeletedHandler);
    this.fplDirectToDataChanged.handle(this.planChangeHandler);
    this.fplLoaded.handle(this.planCreatedHandler);
    this.fplOriginDestChanged.handle(this.planChangeHandler);
    this.fplProcDetailsChanged.handle(this.planChangeHandler);
    this.fplSegmentChange.handle(this.planChangeHandler);
    this.fplUserDataDelete.handle(this.planChangeHandler);
    this.fplUserDataSet.handle(this.planChangeHandler);
    this.fplActiveLegChange.handle(this.activeLegChangedHandler);
    this.fplCalculated.handle(this.planCalculatedHandler);

    super.startSync();
  }

  /** @inheritdoc */
  public stopSync(): void {
    this.fplCopied.off(this.planCopiedHandler);
    this.fplCreated.off(this.planCreatedHandler);
    this.fplDeleted.off(this.planDeletedHandler);
    this.fplDirectToDataChanged.off(this.planChangeHandler);
    this.fplLoaded.off(this.planCreatedHandler);
    this.fplOriginDestChanged.off(this.planChangeHandler);
    this.fplProcDetailsChanged.off(this.planChangeHandler);
    this.fplSegmentChange.off(this.planChangeHandler);
    this.fplUserDataDelete.off(this.planChangeHandler);
    this.fplUserDataSet.off(this.planChangeHandler);
    this.fplActiveLegChange.off(this.activeLegChangedHandler);
    this.fplCalculated.off(this.planCalculatedHandler);

    super.stopSync();
  }
}

/**
 * A collection of subjects for consuming flight plan data in the flight plan module.
 */
export class PlanSubjects {
  /** The current flight plan to display, if any. */
  public flightPlan = Subject.create<FlightPlan | undefined>(undefined);

  /** An event that fires when the plan is changed. */
  public planChanged = new SubEvent<any, void>();

  /** An event that fired when the flight path of the plan is recalculated. */
  public planCalculated = new SubEvent<any, void>();

  /** The active leg index currently being navigated to. */
  public activeLeg = Subject.create(0);
}