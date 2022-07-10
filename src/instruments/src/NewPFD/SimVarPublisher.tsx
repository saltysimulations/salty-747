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
}

export class PFDSimvarPublisher extends SimVarPublisher<PFDSimvars> {
    private static simvars = new Map<keyof PFDSimvars, SimVarDefinition>([
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
        ["selectedMachSpeed", { name: PFDVars.selectedMachSpeed, type: SimVarValueType.Knots }],
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
    ]);

    public constructor(bus: EventBus) {
        super(PFDSimvarPublisher.simvars, bus);
    }
}
