"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcedureDetails = void 0;
/**
 * The details of procedures selected in the flight plan.
 */
class ProcedureDetails {
    constructor() {
        /** The index of the origin runway in the origin runway information. */
        this.originRunwayIndex = -1;
        /** The index of the departure in the origin airport information. */
        this.departureIndex = -1;
        /** The index of the departure transition in the origin airport departure information. */
        this.departureTransitionIndex = -1;
        /** The index of the selected runway in the original airport departure information. */
        this.departureRunwayIndex = -1;
        /** The index of the arrival in the destination airport information. */
        this.arrivalIndex = -1;
        /** The index of the arrival transition in the destination airport arrival information. */
        this.arrivalTransitionIndex = -1;
        /** The index of the selected runway transition at the destination airport arrival information. */
        this.arrivalRunwayIndex = -1;
        /** The index of the apporach in the destination airport information.*/
        this.approachIndex = -1;
        /** The index of the approach transition in the destination airport approach information.*/
        this.approachTransitionIndex = -1;
        /** The index of the destination runway in the destination runway information. */
        this.destinationRunwayIndex = -1;
        /** The length from the threshold of the runway extension fix. */
        this.destinationRunwayExtension = -1;
    }
}
exports.ProcedureDetails = ProcedureDetails;
//# sourceMappingURL=ProcedureDetails.js.map