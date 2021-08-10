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

let cursorBoxCoords = [
    0, 10,
    200, 10,
    400, 10,
    0, 550,
    100, 550,
    200, 550,
    300, 550,
    400, 550,
    500, 550
]

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
                name: "FLIGHT INSTRUMENTS..........HEADING__, ALTIMETER__",
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
    }
]