"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LegType = void 0;
/**
 * ARINC 424 Leg Types
 */
var LegType;
(function (LegType) {
    /**
     * A non-AIRAC discontinuity leg type.
     */
    LegType[LegType["DIS"] = 0] = "DIS";
    /**
     * An arc-to-fix leg. This indicates a DME arc leg to a specified fix.
     */
    LegType[LegType["AF"] = 1] = "AF";
    /**
     * A course-to-altitude leg.
     */
    LegType[LegType["CA"] = 2] = "CA";
    /**
     * A course-to-DME-distance leg. This leg is flown on a wind corrected course
     * to a specific DME distance from another fix.
     */
    LegType[LegType["CD"] = 3] = "CD";
    /**
     * A course-to-fix leg.
     */
    LegType[LegType["CF"] = 4] = "CF";
    /**
     * A course-to-intercept leg.
     */
    LegType[LegType["CI"] = 5] = "CI";
    /**
     * A course-to-radial intercept leg.
     */
    LegType[LegType["CR"] = 6] = "CR";
    /**
    * A direct-to-fix leg, from an unspecified starting position.
    */
    LegType[LegType["DF"] = 7] = "DF";
    /**
     * A fix-to-altitude leg. A FA leg is flown on a track from a fix to a
     * specified altitude.
     */
    LegType[LegType["FA"] = 8] = "FA";
    /**
     * A fix-to-distance leg. This leg is flown on a track from a fix to a
     * specific distance from the fix.
     */
    LegType[LegType["FC"] = 9] = "FC";
    /**
     * A fix to DME distance leg. This leg is flown on a track from a fix to
     * a specific DME distance from another fix.
     */
    LegType[LegType["FD"] = 10] = "FD";
    /**
     * A course-to-manual-termination leg.
     */
    LegType[LegType["CM"] = 11] = "CM";
    /**
     * A hold-to-altitude leg. The hold is flown until a specified altitude is reached.
     */
    LegType[LegType["HA"] = 12] = "HA";
    /**
     * A hold-to-fix leg. This indicates one time around the hold circuit and
     * then an exit.
     */
    LegType[LegType["HF"] = 13] = "HF";
    /**
     * A hold-to-manual-termination leg.
     */
    LegType[LegType["HM"] = 14] = "HM";
    /**
     * Initial procedure fix.
     */
    LegType[LegType["IF"] = 15] = "IF";
    /**
     * A procedure turn leg.
     */
    LegType[LegType["PT"] = 16] = "PT";
    /**
     * A radius-to-fix leg, with endpoint fixes, a center fix, and a radius.
     */
    LegType[LegType["RF"] = 17] = "RF";
    /**
     * A track-to-fix leg, from the previous fix to the terminator.
     */
    LegType[LegType["TF"] = 18] = "TF";
    /**
     * A heading-to-altitude leg.
     */
    LegType[LegType["VA"] = 19] = "VA";
    /**
     * A heading-to-DME-distance leg.
     */
    LegType[LegType["VD"] = 20] = "VD";
    /**
     * A heading-to-intercept leg.
     */
    LegType[LegType["VI"] = 21] = "VI";
    /**
     * A heading-to-manual-termination leg.
     */
    LegType[LegType["VM"] = 22] = "VM";
    /**
     * A heading-to-radial intercept leg.
     */
    LegType[LegType["VR"] = 23] = "VR";
})(LegType = exports.LegType || (exports.LegType = {}));
//# sourceMappingURL=LegType.js.map