class Approach {
    constructor() {
        this.transitions = [];
        this.wayPoints = [];
        this.transitions = [];
    }
    isLocalizer() {
        let type = Simplane.getAutoPilotApproachType();
        if (type == ApproachType.APPROACH_TYPE_ILS || type == ApproachType.APPROACH_TYPE_LOCALIZER || type == ApproachType.APPROACH_TYPE_LOCALIZER_BACK_COURSE)
            return true;
        return false;
    }
}
class ApproachWayPoint extends WayPoint {
}
class Transition {
    constructor() {
        this.waypoints = [];
    }
}
//# sourceMappingURL=Approach.js.map