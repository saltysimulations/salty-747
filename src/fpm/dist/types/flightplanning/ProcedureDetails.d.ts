/**
 * The details of procedures selected in the flight plan.
 */
export declare class ProcedureDetails {
    /** The index of the origin runway in the origin runway information. */
    originRunwayIndex: number;
    /** The index of the departure in the origin airport information. */
    departureIndex: number;
    /** The index of the departure transition in the origin airport departure information. */
    departureTransitionIndex: number;
    /** The index of the selected runway in the original airport departure information. */
    departureRunwayIndex: number;
    /** The index of the arrival in the destination airport information. */
    arrivalIndex: number;
    /** The index of the arrival transition in the destination airport arrival information. */
    arrivalTransitionIndex: number;
    /** The index of the selected runway transition at the destination airport arrival information. */
    arrivalRunwayIndex: number;
    /** The index of the apporach in the destination airport information.*/
    approachIndex: number;
    /** The index of the approach transition in the destination airport approach information.*/
    approachTransitionIndex: number;
    /** The index of the destination runway in the destination runway information. */
    destinationRunwayIndex: number;
    /** The length from the threshold of the runway extension fix. */
    destinationRunwayExtension: number;
}
