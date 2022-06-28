import { EventBus, SimVarDefinition, SimVarValueType, SimVarPublisher } from "msfssdk";

export interface PFDSimvars {
    pitch: number;
    roll: number;
    sideslip: number;
    airspeed: number;
    groundSpeed: number;
    maneuveringSpeed: number;
    flapsHandle: number;
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
    trueTrack: number;
    fpvOn: boolean;
}

export enum PFDVars {
    pitch = "PLANE PITCH DEGREES",
    roll = "PLANE BANK DEGREES",
    sideslip = "INCIDENCE BETA",
    airspeed = "AIRSPEED INDICATED",
    groundSpeed = "GROUND VELOCITY",
    maneuveringSpeed = "L:SALTY_MANEUVERING_SPEED",
    flapsHandle = "FLAPS HANDLE INDEX",
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
    trueTrack = "GPS GROUND TRUE TRACK",
    fpvOn = "L:SALTY_FPV_ON",
}

export class PFDSimvarPublisher extends SimVarPublisher<PFDSimvars> {
    private static simvars = new Map<keyof PFDSimvars, SimVarDefinition>([
        ["pitch", { name: PFDVars.pitch, type: SimVarValueType.Degree }],
        ["roll", { name: PFDVars.roll, type: SimVarValueType.Degree }],
        ["sideslip", { name: PFDVars.sideslip, type: SimVarValueType.Degree }],
        ["airspeed", { name: PFDVars.airspeed, type: SimVarValueType.Knots }],
        ["groundSpeed", { name: PFDVars.groundSpeed, type: SimVarValueType.Knots }],
        ["maneuveringSpeed", { name: PFDVars.maneuveringSpeed, type: SimVarValueType.Knots }],
        ["flapsHandle", { name: PFDVars.flapsHandle, type: SimVarValueType.Number }],
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
        ["trueTrack", { name: PFDVars.trueTrack, type: SimVarValueType.Degree }],
        ["fpvOn", { name: PFDVars.fpvOn, type: SimVarValueType.Bool }],
    ]);

    public constructor(bus: EventBus) {
        super(PFDSimvarPublisher.simvars, bus);
    }
}
