/**
 * Copyright (C) 2022 Salty Simulations and its contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import { EventBus, SimVarDefinition, SimVarValueType, SimVarPublisher } from "msfssdk";

export interface PFDSimvars {
    pitch: number;
    roll: number;
    sideslip: number;
    altitude: number;
    airspeed: number;
    groundSpeed: number;
    verticalSpeed: number;
    maneuveringSpeed: number;
    machSpeed: number;
    maxSpeed: number;
    minSpeed: number;
    flapsHandle: number;
    actualFlapAngle: number;
    landingFlaps: number;
    takeoffFlaps: number;
    altAboveGround: number;
    incidenceAlpha: number;
    stallAlpha: number;
    fdPitch: number;
    fdRoll: number;
    fdOn: boolean;
    irsState: number;
    verticalVelocity: number;
    horizontalVelocity: number;
    trueHeading: number;
    magneticHeading: number;
    trueTrack: number;
    magneticTrack: number;
    fpvOn: boolean;
    markerBeaconState: number;
    vsActive: boolean;
    selectedVs: number;
    selectedHeading: number;
    selectedSpeed: number;
    selectedMachSpeed: number;
    selectedAltitude: number;
    v1: number;
    vR: number;
    v2: number;
    vRef25: number;
    vRef30: number;
    vRef: number;
    flightPhase: number;
    onGround: boolean;
    isInMach: boolean;
    altAlertStatus: number;
    originElevation: number;
    destinationElevation: number;
    passedHalfway: boolean;
    baroMinimums: number;
    radioMinimums: number;
    isMetresOn: boolean;
    isStd: boolean;
    baroUnits: boolean;
    baroHg: number;
    preselBaroVisible: boolean;
    preselBaro: number;
    inboundLocCourse: number;
    locRadial: number;
    locSignal: boolean;
    locFrequency: number;
    gsSignal: boolean;
    gsError: number;
    ilsIdent: string;
    locCourse: number;
    dmeSignal: boolean;
    dmeDistance: number;
    afdsStatus: number;
    autothrottleMode: number;
    autothrottleArmed: boolean;
    activeRollMode: number;
    armedRollMode: number;
    apOn: boolean;
    activePitchMode: number;
    armedPitchMode: number;
    acceleration: number;
}

export enum PFDVars {
    pitch = "PLANE PITCH DEGREES",
    roll = "PLANE BANK DEGREES",
    sideslip = "INCIDENCE BETA",
    altitude = "INDICATED ALTITUDE",
    airspeed = "AIRSPEED INDICATED",
    groundSpeed = "GROUND VELOCITY",
    maneuveringSpeed = "L:74S_ADC_MANEUVERING_SPEED",
    machSpeed = "L:74S_ADC_MACH_NUMBER",
    maxSpeed = "L:74S_ADC_MAXIMUM_SPEED",
    minSpeed = "L:74S_ADC_MINIMUM_SPEED",
    flapsHandle = "FLAPS HANDLE INDEX",
    actualFlapAngle = "TRAILING EDGE FLAPS LEFT ANGLE",
    landingFlaps = "L:SALTY_SELECTED_APPROACH_FLAP",
    takeoffFlaps = "L:SALTY_TAKEOFF_FLAP_VALUE",
    altAboveGround = "PLANE ALT ABOVE GROUND MINUS CG",
    incidenceAlpha = "INCIDENCE ALPHA",
    stallAlpha = "STALL ALPHA",
    fdPitch = "AUTOPILOT FLIGHT DIRECTOR PITCH",
    fdRoll = "AUTOPILOT FLIGHT DIRECTOR BANK",
    irsState = "L:SALTY_IRS_STATE",
    fdOn = "AUTOPILOT FLIGHT DIRECTOR ACTIVE:1",
    verticalVelocity = "VELOCITY WORLD Y",
    horizontalVelocity = "VELOCITY BODY Z",
    trueHeading = "PLANE HEADING DEGREES TRUE",
    magneticHeading = "PLANE HEADING DEGREES MAGNETIC",
    trueTrack = "GPS GROUND TRUE TRACK",
    magneticTrack = "GPS GROUND MAGNETIC TRACK",
    fpvOn = "L:SALTY_FPV_ON",
    markerBeaconState = "MARKER BEACON STATE",
    verticalSpeed = "VERTICAL SPEED",
    vsActive = "L:AP_VS_ACTIVE",
    selectedVs = "AUTOPILOT VERTICAL HOLD VAR",
    selectedHeading = "AUTOPILOT HEADING LOCK DIR:1",
    selectedSpeed = "AUTOPILOT AIRSPEED HOLD VAR",
    selectedMachSpeed = "AUTOPILOT MACH HOLD VAR",
    selectedAltitude = "AUTOPILOT ALTITUDE LOCK VAR:3",
    v1 = "L:AIRLINER_V1_SPEED",
    vR = "L:AIRLINER_VR_SPEED",
    v2 = "L:AIRLINER_V2_SPEED",
    vRef25 = "L:SALTY_VREF25",
    vRef30 = "L:SALTY_VREF30",
    vRef = "L:AIRLINER_VREF_SPEED",
    flightPhase = "L:AIRLINER_FLIGHT_PHASE",
    onGround = "SIM ON GROUND",
    isInMach = "L:XMLVAR_AirSpeedIsInMach",
    altAlertStatus = "L:74S_ALT_ALERT",
    originElevation = "L:74S_FMC_ORIGIN_ELEVATION",
    destinationElevation = "L:74S_FMC_DEST_ELEVATION",
    passedHalfway = "L:74S_FMC_PASSED_HALFWAY",
    baroMinimums = "L:74S_MINS_BARO",
    radioMinimums = "L:74S_MINS_RADIO",
    isMetresOn = "L:74S_EFIS_METRES_ON",
    isStd = "L:XMLVAR_Baro1_ForcedToSTD",
    baroUnits = "L:XMLVAR_Baro_Selector_HPA_1",
    baroHg = "KOHLSMAN SETTING HG",
    preselBaroVisible = "L:74S_BARO_PRESEL_VISIBLE",
    preselBaro = "L:XMLVAR_Baro1_SavedPressure",
    inboundLocCourse = "NAV LOCALIZER:3",
    locRadial = "NAV RADIAL:3",
    locSignal = "NAV HAS NAV:3",
    locFrequency = "NAV ACTIVE FREQUENCY:3",
    gsSignal = "NAV GS FLAG:3",
    gsError = "NAV GLIDE SLOPE ERROR:3",
    ilsIdent = "NAV IDENT:3",
    locCourse = "L:FLIGHTPLAN_APPROACH_COURSE",
    dmeSignal = "NAV HAS DME:3",
    dmeDistance = "NAV DME:3",
    afdsStatus = "L:74S_AFDS_STATUS",
    autothrottleMode = "L:74S_AUTOTHROTTLE_MODE_ACTIVE",
    autothrottleArmed = "AUTOPILOT THROTTLE ARM",
    activeRollMode = "L:74S_ROLL_MODE_ACTIVE",
    armedRollMode = "L:74S_ROLL_MODE_ARMED",
    apOn = "AUTOPILOT MASTER",
    activePitchMode = "L:74S_PITCH_MODE_ACTIVE",
    armedPitchMode = "L:74S_PITCH_MODE_ARMED",
    acceleration = "ACCELERATION BODY Z",
}

export class PFDSimvarPublisher extends SimVarPublisher<PFDSimvars> {
    public static simvars = new Map<keyof PFDSimvars, SimVarDefinition>([
        ["pitch", { name: PFDVars.pitch, type: SimVarValueType.Degree }],
        ["roll", { name: PFDVars.roll, type: SimVarValueType.Degree }],
        ["sideslip", { name: PFDVars.sideslip, type: SimVarValueType.Degree }],
        ["altitude", { name: PFDVars.altitude, type: SimVarValueType.Feet }],
        ["airspeed", { name: PFDVars.airspeed, type: SimVarValueType.Knots }],
        ["groundSpeed", { name: PFDVars.groundSpeed, type: SimVarValueType.Knots }],
        ["verticalSpeed", { name: PFDVars.verticalSpeed, type: SimVarValueType.FPM }],
        ["maneuveringSpeed", { name: PFDVars.maneuveringSpeed, type: SimVarValueType.Knots }],
        ["machSpeed", { name: PFDVars.machSpeed, type: SimVarValueType.Number }],
        ["maxSpeed", { name: PFDVars.maxSpeed, type: SimVarValueType.Knots }],
        ["minSpeed", { name: PFDVars.minSpeed, type: SimVarValueType.Knots }],
        ["flapsHandle", { name: PFDVars.flapsHandle, type: SimVarValueType.Number }],
        ["landingFlaps", { name: PFDVars.landingFlaps, type: SimVarValueType.Number }],
        ["takeoffFlaps", { name: PFDVars.takeoffFlaps, type: SimVarValueType.Number }],
        ["actualFlapAngle", { name: PFDVars.actualFlapAngle, type: SimVarValueType.Degree }],
        ["altAboveGround", { name: PFDVars.altAboveGround, type: SimVarValueType.Feet }],
        ["incidenceAlpha", { name: PFDVars.incidenceAlpha, type: SimVarValueType.Degree }],
        ["stallAlpha", { name: PFDVars.stallAlpha, type: SimVarValueType.Degree }],
        ["fdPitch", { name: PFDVars.fdPitch, type: SimVarValueType.Degree }],
        ["fdRoll", { name: PFDVars.fdRoll, type: SimVarValueType.Degree }],
        ["fdOn", { name: PFDVars.fdOn, type: SimVarValueType.Bool }],
        ["irsState", { name: PFDVars.irsState, type: SimVarValueType.Enum }],
        ["verticalVelocity", { name: PFDVars.verticalVelocity, type: SimVarValueType.FPM }],
        ["horizontalVelocity", { name: PFDVars.horizontalVelocity, type: SimVarValueType.FPM }],
        ["trueHeading", { name: PFDVars.trueHeading, type: SimVarValueType.Degree }],
        ["magneticHeading", { name: PFDVars.magneticHeading, type: SimVarValueType.Degree }],
        ["trueTrack", { name: PFDVars.trueTrack, type: SimVarValueType.Degree }],
        ["magneticTrack", { name: PFDVars.magneticTrack, type: SimVarValueType.Degree }],
        ["fpvOn", { name: PFDVars.fpvOn, type: SimVarValueType.Bool }],
        ["markerBeaconState", { name: PFDVars.markerBeaconState, type: SimVarValueType.Enum }],
        ["vsActive", { name: PFDVars.vsActive, type: SimVarValueType.Bool }],
        ["selectedVs", { name: PFDVars.selectedVs, type: SimVarValueType.FPM }],
        ["selectedHeading", { name: PFDVars.selectedHeading, type: SimVarValueType.Degree }],
        ["selectedSpeed", { name: PFDVars.selectedSpeed, type: SimVarValueType.Knots }],
        ["selectedMachSpeed", { name: PFDVars.selectedMachSpeed, type: SimVarValueType.Number }],
        ["selectedAltitude", { name: PFDVars.selectedAltitude, type: SimVarValueType.Feet }],
        ["v1", { name: PFDVars.v1, type: SimVarValueType.Knots }],
        ["vR", { name: PFDVars.vR, type: SimVarValueType.Knots }],
        ["v2", { name: PFDVars.v2, type: SimVarValueType.Knots }],
        ["vRef25", { name: PFDVars.vRef25, type: SimVarValueType.Knots }],
        ["vRef30", { name: PFDVars.vRef30, type: SimVarValueType.Knots }],
        ["vRef", { name: PFDVars.vRef, type: SimVarValueType.Knots }],
        ["flightPhase", { name: PFDVars.flightPhase, type: SimVarValueType.Number }],
        ["onGround", { name: PFDVars.onGround, type: SimVarValueType.Bool }],
        ["isInMach", { name: PFDVars.isInMach, type: SimVarValueType.Bool }],
        ["altAlertStatus", { name: PFDVars.altAlertStatus, type: SimVarValueType.Number }],
        ["originElevation", { name: PFDVars.originElevation, type: SimVarValueType.Number }],
        ["destinationElevation", { name: PFDVars.destinationElevation, type: SimVarValueType.Number }],
        ["passedHalfway", { name: PFDVars.passedHalfway, type: SimVarValueType.Bool }],
        ["baroMinimums", { name: PFDVars.baroMinimums, type: SimVarValueType.Feet }],
        ["radioMinimums", { name: PFDVars.radioMinimums, type: SimVarValueType.Feet }],
        ["isMetresOn", { name: PFDVars.isMetresOn, type: SimVarValueType.Bool }],
        ["isStd", { name: PFDVars.isStd, type: SimVarValueType.Bool }],
        ["baroUnits", { name: PFDVars.baroUnits, type: SimVarValueType.Bool }],
        ["baroHg", { name: PFDVars.baroHg, type: SimVarValueType.InHG }],
        ["preselBaroVisible", { name: PFDVars.preselBaroVisible, type: SimVarValueType.Bool }],
        ["preselBaro", { name: PFDVars.preselBaro, type: SimVarValueType.Number }],
        ["inboundLocCourse", { name: PFDVars.inboundLocCourse, type: SimVarValueType.Degree }],
        ["locRadial", { name: PFDVars.locRadial, type: SimVarValueType.Degree }],
        ["locSignal", { name: PFDVars.locSignal, type: SimVarValueType.Bool }],
        ["locFrequency", { name: PFDVars.locFrequency, type: SimVarValueType.MHz }],
        ["gsSignal", { name: PFDVars.gsSignal, type: SimVarValueType.Bool }],
        ["gsError", { name: PFDVars.gsError, type: SimVarValueType.Degree }],
        ["ilsIdent", { name: PFDVars.ilsIdent, type: SimVarValueType.String }],
        ["locCourse", { name: PFDVars.locCourse, type: SimVarValueType.Number }],
        ["dmeSignal", { name: PFDVars.dmeSignal, type: SimVarValueType.Bool }],
        ["dmeDistance", { name: PFDVars.dmeDistance, type: SimVarValueType.NM }],
        ["afdsStatus", { name: PFDVars.afdsStatus, type: SimVarValueType.Enum }],
        ["autothrottleMode", { name: PFDVars.autothrottleMode, type: SimVarValueType.Enum }],
        ["autothrottleArmed", { name: PFDVars.autothrottleArmed, type: SimVarValueType.Bool }],
        ["activeRollMode", { name: PFDVars.activeRollMode, type: SimVarValueType.Enum }],
        ["armedRollMode", { name: PFDVars.armedRollMode, type: SimVarValueType.Enum }],
        ["apOn", { name: PFDVars.apOn, type: SimVarValueType.Bool }],
        ["activePitchMode", { name: PFDVars.activePitchMode, type: SimVarValueType.Enum }],
        ["armedPitchMode", { name: PFDVars.armedPitchMode, type: SimVarValueType.Enum }],
        ["acceleration", { name: PFDVars.acceleration, type: SimVarValueType.FPM }],
    ]);

    public constructor(bus: EventBus) {
        super(PFDSimvarPublisher.simvars, bus);
    }
}
