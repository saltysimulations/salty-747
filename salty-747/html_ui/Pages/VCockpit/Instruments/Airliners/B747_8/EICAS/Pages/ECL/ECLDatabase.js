const cursorSizes = {
    largeBox: {
        width: 190,
        height: 35
    },
    smallBox: {
        width: 95,
        height: 35
    },
    items: {
        width: 550,
        height: 45
    }
}

let cursorMap = [];

let cursorPosTop = [
    0, 10,
    200, 10,
    400, 10,
];

let cursorPosBottom = [
    0, 545,
    100, 545,
    200, 545,
    300, 545,
    400, 545,
    500, 545
];

const normalChecklists = [
    {
        checklistTitle: "PREFLIGHT",
        checklistType: "normal",
        pageCount: 1,
        itemCount: 4,
        normalChecklistSequence: 0,
        checklistPriority: 0,
        items: [
            {
                name: "OXYGEN.......................................SET",
                conditionName: "SET",
                conditionType: "open",
                y: "130"
            },
            {
                name: "FLIGHT INSTRUMENTS......HEADING---, ALTIMETER---",
                conditionName: "HEADING__, ALTIMETER__",
                conditionType: "open",
                y: "180"
            },
            {
                name: "PARKING BRAKE................................SET",
                conditionName: "SET",
                conditionType: "closed",
                conditions: [
                    {
                        simvar: "BRAKE PARKING INDICATOR",
                        simvarType: "bool",
                        simvarTrueCondition: 1
                    }
                ],
                y: "230"
            },
            {
                name: "FUEL CONTROL SWITCHES.....................CUTOFF",
                conditionName: "CUTOFF",
                conditionType: "closed",
                conditions: [
                    {
                        simvar: "FUELSYSTEM VALVE OPEN:5",
                        simvarType: "bool",
                        simvarTrueCondition: 0
                    },
                    {
                        simvar: "FUELSYSTEM VALVE OPEN:6",
                        simvarType: "bool",
                        simvarTrueCondition: 0
                    },
                    {
                        simvar: "FUELSYSTEM VALVE OPEN:7",
                        simvarType: "bool",
                        simvarTrueCondition: 0
                    },
                    {
                        simvar: "FUELSYSTEM VALVE OPEN:8",
                        simvarType: "bool",
                        simvarTrueCondition: 0
                    }
                ],
                y: "280"
            }
        ]
    },

    {
        checklistTitle: "BEFORE START",
        checklistType: "normal",
        pageCount: 1,
        itemCount: 8,
        normalChecklistSequence: 1,
        checklistPriority: 0,
        items: [
            {
                name: "GEAR PINS AND COVERS.....................REMOVED",
                conditionType: "open",
                y: "130"
            },
            {
                name: "SEAT BELTS....................................ON",
                conditionType: "open",
                y: "180"
            },
            {
                name: "MCP....................V2---, HDG/TRK---, ALT---",
                conditionType: "open",
                y: "230"
            },
            {
                name: "TAKEOFF SPEEDS...............V1---, VR---, V2---",
                conditionType: "open",
                y: "280"
            },
            {
                name: "CDU PREFLIGHT..........................COMPLETED",
                conditionType: "open",
                y: "330"
            },
            {
                name: "TRIM.............................--- UNITS, 0, 0",
                conditionType: "open",
                y: "380"
            },
            {
                name: "TAXI AND TAKEOFF BRIEFING..............COMPLETED",
                conditionType: "open",
                y: "430"
            },
            {
                name: "BEACON........................................ON",
                conditionType: "closed",
                conditions: [
                    {
                        simvar: "LIGHT BEACON ON",
                        simvarType: "bool",
                        simvarTrueCondition: 1
                    },
                ],
                y: "480"
            },
        ]
    }
]