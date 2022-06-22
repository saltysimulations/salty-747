import { Unit, UnitFamily, UnitType } from '..';
import { ControlEvents, EventBus, EventSubscriber, KeyEvents, KeyInterceptManager, Publisher } from '../data';
import { SimVarValueType, SimVarDefinition } from '../data/SimVars';
import { SimVarPublisher } from './BasePublishers';


/** Data related to DH/DA */
interface DHSimVars {
  /** The current decision height in feet */
  decision_height_feet: number,
  /** The current decition altitude in feet */
  decision_altitude_feet: number
}

/** Events related to DH/DA */
export interface DHEvents {
  /** The current decision height  */
  decision_height: number,
  /** The current decision altitude */
  decision_altitude: number
}

/** A publisher for DH/DA simvar events. */
class DHSimVarPublisher extends SimVarPublisher<DHSimVars> {
  private static simvars = new Map<keyof DHSimVars, SimVarDefinition>([
    ['decision_height_feet', { name: 'DECISION HEIGHT', type: SimVarValueType.Feet }],
    ['decision_altitude_feet', { name: 'DECISION ALTITUDE MSL', type: SimVarValueType.Feet }]
  ]);

  /**
   * @inheritdoc
   */
  public constructor(bus: EventBus) {
    super(DHSimVarPublisher.simvars, bus);
  }
}

/**
 * A class that manages decision height and altitude data and events.
 */
export class DHManager {
  private bus: EventBus;
  private simVarPublisher: DHSimVarPublisher;
  private simVarSubscriber: EventSubscriber<DHSimVars>;
  private controlSubscriber: EventSubscriber<ControlEvents>;
  private publisher: Publisher<DHEvents>;
  private currentDH = 0;
  private currentDA = 0;
  private daDistanceUnit = UnitType.FOOT;
  private dhDistanceUnit = UnitType.FOOT;

  /**
   * Create a DHManager
   * @param bus The event bus
   */
  public constructor(bus: EventBus) {
    this.bus = bus;
    this.simVarPublisher = new DHSimVarPublisher(bus);
    this.simVarSubscriber = bus.getSubscriber<DHSimVars>();
    this.controlSubscriber = bus.getSubscriber<ControlEvents>();
    this.publisher = bus.getPublisher<DHEvents>();

    // Don't initialize with bogus data.
    SimVar.SetSimVarValue('K:SET_DECISION_HEIGHT', 'number', 0);
    SimVar.SetSimVarValue('K:SET_DECISION_ALTITUDE_MSL', 'number', 0);

    KeyInterceptManager.getManager(bus).then(manager => {
      manager.interceptKey('INCREASE_DECISION_HEIGHT', false);
      manager.interceptKey('DECREASE_DECISION_HEIGHT', false);
      manager.interceptKey('INCREASE_DECISION_ALTITUDE_MSL', false);
      manager.interceptKey('DECREASE_DECISION_ALTITUDE_MSL', false);
    });

    this.simVarSubscriber.on('decision_height_feet').whenChanged().handle((dh) => {
      this.currentDH = dh;
      this.publisher.pub('decision_height', this.currentDH, true, true);
    });

    this.simVarSubscriber.on('decision_altitude_feet').whenChanged().handle((da) => {
      this.currentDA = da;
      this.publisher.pub('decision_altitude', this.currentDA, true, true);
    });

    this.controlSubscriber.on('set_decision_height').handle((dh) => {
      SimVar.SetSimVarValue('K:SET_DECISION_HEIGHT', 'number', dh);
    });

    this.controlSubscriber.on('set_decision_altitude').handle((da) => {
      SimVar.SetSimVarValue('K:SET_DECISION_ALTITUDE_MSL', 'number', da);
    });

    this.controlSubscriber.on('set_dh_distance_unit').handle((unit) => {
      this.daDistanceUnit = unit == 'meters' ? UnitType.METER : UnitType.FOOT;
    });
    this.controlSubscriber.on('set_da_distance_unit').handle((unit) => {
      this.daDistanceUnit = unit == 'meters' ? UnitType.METER : UnitType.FOOT;
    });


    const sub = this.bus.getSubscriber<KeyEvents>();
    sub.on('key_intercept').handle((evt) => {
      let simvar: string | undefined;
      let curVal: number | undefined;
      let direction: 'up' | 'down' = 'up';
      let unit: Unit<UnitFamily.Distance> | undefined;
      if (evt.value !== undefined) {
        switch (evt.key) {
          case 'DECREASE_DECISION_HEIGHT':
            direction = 'down';
          // eslint-disable-next-line no-fallthrough
          case 'INCREASE_DECISION_HEIGHT':
            simvar = 'K:SET_DECISION_HEIGHT';
            unit = this.dhDistanceUnit;
            curVal = this.currentDH;
            break;
          case 'DECREASE_DECISION_ALTITUDE_MSL':
            direction = 'down';
          // eslint-disable-next-line no-fallthrough
          case 'INCREASE_DECISION_ALTITUDE_MSL':
            simvar = 'K:SET_DECISION_ALTITUDE_MSL';
            unit = this.daDistanceUnit;
            curVal = this.currentDA;
            break;
        }
        if (simvar !== undefined && curVal !== undefined && unit !== undefined) {
          // There is one flaw in this logic, but I'm not sure what can be done about
          // it.  You can set the inc/dec amount via the K event in feet or meters.
          // If your user preference unit is one, but the simvar call uses the other,
          // we have now way of knowing  about it so will force a conversion that's not
          // needed.This is a fairly minor flaw, but worth acknowledging until a
          // workaround can be found.
          const increment = unit.convertTo(evt.value, UnitType.FOOT) * (direction == 'down' ? -1 : 1);
          SimVar.SetSimVarValue(simvar, 'number', curVal + increment);
        }
      }
    });
  }

  /** Initialize the instrument. */
  public init(): void {
    this.simVarPublisher.startPublish();
  }

  /** Update our simvar publisher. */
  public onUpdate(): void {
    this.simVarPublisher.onUpdate();
  }
}