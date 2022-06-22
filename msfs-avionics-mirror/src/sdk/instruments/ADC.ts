/// <reference types="msfstypes/JS/simvar" />

import { EventBus, EventBusMetaEvents } from '../data/EventBus';
import { PublishPacer } from '../data/EventBusPacer';
import { SimVarDefinition, SimVarValueType } from '../data/SimVars';
import { SimVarPublisher } from './BasePublishers';

/**
 * An interface that describes the possible ADC events
 * on the event bus.
 */
export interface ADCEvents {

    /** An indicated airspeed event, in knots. */
    ias: number;

    /** A true airspeed event, in knots. */
    tas: number;

    /** An indicated altitude (index 0) event, in feet. */
    alt: number;

    /** A radio altitude event, in feet. */
    radio_alt: number;

    /** A pressure altitude event, in feet. */
    pressure_alt: number;

    /** A vertical speed event, in feet per minute. */
    vs: number;

    /** A heading in degrees magnetic event. */
    hdg_deg: number;

    /** A heading in degrees true event */
    hdg_deg_true: number;

    /** A degrees of airplane pitch event. */
    pitch_deg: number;

    /** A degrees of airplane roll event. */
    roll_deg: number;

    /** A selected altimeter setting inHg. */
    kohlsman_setting_hg_1: number;

    /** A preselected altimeter setting inHg. */
    kohlsman_setting_hg_1_preselect: number;

    /** A selected altimeter setting mb. */
    kohlsman_setting_mb_1: number;

    /** A turn coordinator ball value. */
    turn_coordinator_ball: number;

    /** A delta heading value. */
    delta_heading_rate: number;

    /** An ambient temperature in Celsius. */
    ambient_temp_c: number;

    /** An ambient pressure in InHg. */
    ambient_press_in: number;

    /** An isa standard temperature in Celsius. */
    isa_temp_c: number;

    /** An rat temperature in Celsius. */
    rat_temp_c: number;

    /** The ambient wind velocity, in knots. */
    ambient_wind_velocity: number;

    /** The ambient wind direction, in degrees north. */
    ambient_wind_direction: number;

    /** Whether baro index 1 is set to STD (true=STD, false=set pressure). */
    baro_std_1: boolean;

    /** Whether the plane is on the ground. */
    on_ground: boolean;

    /** The angle of attack. */
    aoa: number;

    /** The stall aoa of the current aircraft configuration. */
    stall_aoa: number;

    /** The speed of the aircraft in mach. */
    mach_number: number;

    /**
     * The conversion factor from mach to knots indicated airspeed in the airplane's current environment. In other
     * words, the speed of sound in knots indicated airspeed.
     */
    mach_to_kias_factor: number;
}

/**
 * A publisher for basic ADC/AHRS information.
 */
export class ADCPublisher extends SimVarPublisher<ADCEvents> {
    private static simvars = new Map<keyof ADCEvents, SimVarDefinition>([
        ['ias', { name: 'AIRSPEED INDICATED', type: SimVarValueType.Knots }],
        ['tas', { name: 'AIRSPEED TRUE', type: SimVarValueType.Knots }],
        ['alt', { name: 'INDICATED ALTITUDE', type: SimVarValueType.Feet }],
        ['pressure_alt', { name: 'PRESSURE ALTITUDE', type: SimVarValueType.Feet }],
        ['radio_alt', { name: 'RADIO HEIGHT', type: SimVarValueType.Feet }],
        ['vs', { name: 'VERTICAL SPEED', type: SimVarValueType.FPM }],
        ['hdg_deg', { name: 'PLANE HEADING DEGREES MAGNETIC', type: SimVarValueType.Degree }],
        ['pitch_deg', { name: 'PLANE PITCH DEGREES', type: SimVarValueType.Degree }],
        ['roll_deg', { name: 'PLANE BANK DEGREES', type: SimVarValueType.Degree }],
        ['hdg_deg_true', { name: 'PLANE HEADING DEGREES TRUE', type: SimVarValueType.Degree }],
        ['kohlsman_setting_hg_1', { name: 'KOHLSMAN SETTING HG', type: SimVarValueType.InHG }],
        ['kohlsman_setting_hg_1_preselect', { name: 'L:XMLVAR_Baro1_SavedPressure', type: SimVarValueType.MB }],
        ['baro_std_1', { name: 'L:XMLVAR_Baro1_ForcedToSTD', type: SimVarValueType.Bool }],
        ['turn_coordinator_ball', { name: 'TURN COORDINATOR BALL', type: SimVarValueType.Number }],
        ['delta_heading_rate', { name: 'DELTA HEADING RATE', type: SimVarValueType.Degree }],
        ['ambient_temp_c', { name: 'AMBIENT TEMPERATURE', type: SimVarValueType.Celsius }],
        ['ambient_press_in', { name: 'AMBIENT PRESSURE', type: SimVarValueType.InHG }],
        ['isa_temp_c', { name: 'STANDARD ATM TEMPERATURE', type: SimVarValueType.Celsius }],
        ['rat_temp_c', { name: 'TOTAL AIR TEMPERATURE', type: SimVarValueType.Celsius }],
        ['ambient_wind_velocity', { name: 'AMBIENT WIND VELOCITY', type: SimVarValueType.Knots }],
        ['ambient_wind_direction', { name: 'AMBIENT WIND DIRECTION', type: SimVarValueType.Degree }],
        ['kohlsman_setting_mb_1', { name: 'KOHLSMAN SETTING MB', type: SimVarValueType.MB }],
        ['on_ground', { name: 'SIM ON GROUND', type: SimVarValueType.Bool }],
        ['aoa', { name: 'INCIDENCE ALPHA', type: SimVarValueType.Degree }],
        ['stall_aoa', { name: 'STALL ALPHA', type: SimVarValueType.Degree }],
        ['mach_number', { name: 'AIRSPEED MACH', type: SimVarValueType.Mach }],
    ]);

    /**
     * Updates the ADC publisher.
     */
    public onUpdate(): void {
        super.onUpdate();

        if (this.subscribed.has('mach_to_kias_factor')) {
            this.publish('mach_to_kias_factor', Simplane.getMachToKias(1), false, true);
        }
    }

    /**
     * Create an ADCPublisher
     * @param bus The EventBus to publish to
     * @param pacer An optional pacer to use to control the rate of publishing
     */
    public constructor(bus: EventBus, pacer: PublishPacer<ADCEvents> | undefined = undefined) {
        super(ADCPublisher.simvars, bus, pacer);

        bus.getSubscriber<EventBusMetaEvents>().on('event_bus_topic_first_sub').handle(
            (key: string) => {
                if (key === 'mach_to_kias_factor') {
                    this.subscribed.add('mach_to_kias_factor');
                }
            });
    }
}
