const cursorSizes = {
    largeBox: {
        width: 200,
        height: 45
    },
    smallBox: {
        width: 100,
        height: 45
    },
    items: {
        width: 550,
        height: 40
    },
    menuItems: {
        width: 300,
        height: 45
    }
}

let cursorMap = [];

const cursorPosTop = [
    0, 10,
    200, 10,
    400, 10,
];

let cursorPosBottom = [
    0, 540,
    100, 540,
    //200, 540,
    300, 540,
    400, 540,
    //500, 540
];

let cursorPosBottomMenu = [
    500, 540
];

const menus = [
    {
        menuTitle: "NORMAL MENU",
        items: [
            {
                name: "PREFLIGHT",
                y: "90"
            },
            {
                name: "BEFORE START",
                y: "135"
            },
            {
                name: "BEFORE TAXI",
                y: "180"
            },
            {
                name: "BEFORE TAKEOFF",
                y: "225"
            },
            {
                name: "AFTER TAKEOFF",
                y: "270"
            },
            {
                name: "DESCENT",
                y: "315"
            },
            {
                name: "APPROACH",
                y: "360"
            },
            {
                name: "LANDING",
                y: "405"
            },
            {
                name: "SHUTDOWN",
                y: "450"
            },
            {
                name: "SECURE",
                y: "495"
            },
        ]
    }
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
                name: "Oxygen............................Tested, 100%",
                conditionType: "open",
                y: "130"
            },
            {
                name: "Flight instruments....Heading __, Altimeter __",
                conditionType: "open",
                y: "170"
            },
            {
                name: "Parking brake..............................Set",
                conditionType: "closed",
                conditions: [
                    {
                        simvar: "BRAKE PARKING INDICATOR",
                        simvarType: "bool",
                        simvarTrueCondition: 1
                    }
                ],
                y: "210"
            },
            {
                name: "Fuel control switches...................CUTOFF",
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
                y: "250"
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
                name: "Flight deck door.............Closed and locked",
                conditionType: "open",
                y: "130"
            },
            {
                name: "Passenger signs.............................__",
                conditionType: "open",
                y: "170"
            },
            {
                name: "MCP......................V2 __, HDG __, ALT __",
                conditionType: "open",
                y: "210"
            },
            {
                name: "Takeoff speeds.............V1 __, VR __, V2 __",
                conditionType: "open",
                y: "250"
            },
            {
                name: "CDU preflight........................Completed",
                conditionType: "open",
                y: "290"
            },
            {
                name: "Trim............................__ Units, 0, 0",
                conditionType: "open",
                y: "330"
            },
            {
                name: "Taxi and takeoff briefing............Completed",
                conditionType: "open",
                y: "370"
            },
            {
                name: "Beacon....................................BOTH",
                conditionType: "open",
                y: "410"
            },
        ]
    },

    {
        checklistTitle: "BEFORE TAXI",
        checklistType: "normal",
        pageCount: 1,
        itemCount: 5,
        normalChecklistSequence: 2,
        checklistPriority: 0,
        items: [
            {
                name: "Anti-ice....................................__",
                conditionType: "open",
                y: "130"
            },
            {
                name: "Recall.................................Checked",
                conditionType: "open",
                y: "170"
            },
            {
                name: "Autobrake..................................RTO",
                conditionType: "closed",
                conditions: [
                    {
                        simvar: "AUTO BRAKE SWITCH CB",
                        simvarType: "enum",
                        simvarTrueCondition: 0
                    }
                ],
                y: "210"
            },
            {
                name: "Flight controls........................Checked",
                conditionType: "open",
                y: "250"
            },
            {
                name: "Ground equipment.........................Clear",
                conditionType: "open",
                y: "290"
            }
        ]
    },

    {
        checklistTitle: "BEFORE TAKEOFF",
        checklistType: "normal",
        pageCount: 1,
        itemCount: 1,
        normalChecklistSequence: 3,
        checklistPriority: 0,
        items: [
            {
                special: true,
                name: "Flaps.......................................--",
                conditionType: "closed",
                conditions: [
                    {
                        simvar: "TRAILING EDGE FLAPS LEFT ANGLE",
                        simvarType: "degrees",
                        specialCondition: "L:SALTY_TAKEOFF_FLAP_VALUE",
                        specialSimvarType: "number",
                    }
                ],
                y: "130"
            },
        ]
    },

    {
        checklistTitle: "AFTER TAKEOFF",
        checklistType: "normal",
        pageCount: 1,
        itemCount: 2,
        normalChecklistSequence: 4,
        checklistPriority: 0,
        items: [
            {
                name: "Landing gear................................UP",
                conditionType: "closed",
                conditions: [
                    {
                        simvar: "GEAR POSITION",
                        simvarType: "percent",
                        simvarTrueCondition: 0
                    }
                ],
                y: "130"
            },
            {
                name: "Flaps.......................................UP",
                conditionType: "closed",
                conditions: [
                    {
                        simvar: "TRAILING EDGE FLAPS LEFT PERCENT",
                        simvarType: "percent",
                        simvarTrueCondition: 0
                    }
                ],
                y: "170"
            },
        ]
    },

    {
        checklistTitle: "DESCENT",
        checklistType: "normal",
        pageCount: 1,
        itemCount: 5,
        normalChecklistSequence: 5,
        checklistPriority: 0,
        items: [
            {
                name: "Recall.................................Checked",
                conditionType: "open",
                y: "130"
            },
            {
                name: "Notes..................................Checked",
                conditionType: "open",
                y: "170"
            },
            {
                name: "Autobrake...................................__",
                conditionType: "open",
                y: "210"
            },
            {
                name: "Landing data..............VREF __, Minimums __",
                conditionType: "open",
                y: "250"
            },
            {
                name: "Approach briefing....................Completed",
                conditionType: "open",
                y: "290"
            },
        ]
    },

    {
        checklistTitle: "APPROACH",
        checklistType: "normal",
        pageCount: 1,
        itemCount: 1,
        normalChecklistSequence: 6,
        checklistPriority: 0,
        items: [
            {
                name: "Altimeters..................................__",
                conditionType: "open",
                y: "130"
            },
        ]
    },

    {
        checklistTitle: "LANDING",
        checklistType: "normal",
        pageCount: 1,
        itemCount: 3,
        normalChecklistSequence: 7,
        checklistPriority: 0,
        items: [
            {
                name: "Speedbrake...............................Armed",
                conditionType: "closed",
                conditions: [
                    {
                        simvar: "SPOILERS ARMED",
                        simvarType: "bool",
                        simvarTrueCondition: 1
                    }
                ],
                y: "130"
            },
            {
                name: "Landing gear..............................Down",
                conditionType: "closed",
                conditions: [
                    {
                        simvar: "GEAR POSITION",
                        simvarType: "percent",
                        simvarTrueCondition: 100
                    }
                ],
                y: "170"
            },
            {
                special: true,
                name: "Flaps.......................................--",
                conditionType: "closed",
                conditions: [
                    {
                        simvar: "TRAILING EDGE FLAPS LEFT ANGLE",
                        simvarType: "degrees",
                        specialCondition: "L:SALTY_SELECTED_APPROACH_FLAP",
                        specialSimvarType: "number",
                    }
                ],
                y: "210"
            },
        ]
    },

    {
        checklistTitle: "SHUTDOWN",
        checklistType: "normal",
        pageCount: 1,
        itemCount: 6,
        normalChecklistSequence: 9,
        checklistPriority: 0,
        items: [
            {
                name: "Hydraulic panel............................Set",
                conditionType: "open",
                y: "130"
            },
            {
                name: "Fuel pumps.................................Off",
                conditionType: "closed",
                conditions: [
                    {
                        simvar: "FUELSYSTEM PUMP SWITCH:1",
                        simvarType: "bool",
                        simvarTrueCondition: 0
                    },
                    {
                        simvar: "FUELSYSTEM PUMP SWITCH:2",
                        simvarType: "bool",
                        simvarTrueCondition: 0
                    },
                    {
                        simvar: "FUELSYSTEM PUMP SWITCH:3",
                        simvarType: "bool",
                        simvarTrueCondition: 0
                    },
                    {
                        simvar: "FUELSYSTEM PUMP SWITCH:4",
                        simvarType: "bool",
                        simvarTrueCondition: 0
                    },
                    {
                        simvar: "FUELSYSTEM PUMP SWITCH:5",
                        simvarType: "bool",
                        simvarTrueCondition: 0
                    },
                    {
                        simvar: "FUELSYSTEM PUMP SWITCH:6",
                        simvarType: "bool",
                        simvarTrueCondition: 0
                    },
                    {
                        simvar: "FUELSYSTEM PUMP SWITCH:7",
                        simvarType: "bool",
                        simvarTrueCondition: 0
                    },
                    {
                        simvar: "FUELSYSTEM PUMP SWITCH:8",
                        simvarType: "bool",
                        simvarTrueCondition: 0
                    },
                    {
                        simvar: "FUELSYSTEM PUMP SWITCH:9",
                        simvarType: "bool",
                        simvarTrueCondition: 0
                    },
                    {
                        simvar: "FUELSYSTEM PUMP SWITCH:10",
                        simvarType: "bool",
                        simvarTrueCondition: 0
                    },
                    {
                        simvar: "FUELSYSTEM PUMP SWITCH:11",
                        simvarType: "bool",
                        simvarTrueCondition: 0
                    },
                    {
                        simvar: "FUELSYSTEM PUMP SWITCH:12",
                        simvarType: "bool",
                        simvarTrueCondition: 0
                    },
                    {
                        simvar: "FUELSYSTEM PUMP SWITCH:13",
                        simvarType: "bool",
                        simvarTrueCondition: 0
                    },
                    {
                        simvar: "FUELSYSTEM PUMP SWITCH:14",
                        simvarType: "bool",
                        simvarTrueCondition: 0
                    },
                    {
                        simvar: "FUELSYSTEM PUMP SWITCH:15",
                        simvarType: "bool",
                        simvarTrueCondition: 0
                    },
                    {
                        simvar: "FUELSYSTEM PUMP SWITCH:16",
                        simvarType: "bool",
                        simvarTrueCondition: 0
                    }
                ],
                y: "170"
            },
            {
                name: "Flaps.......................................UP",
                conditionType: "closed",
                conditions: [
                    {
                        simvar: "TRAILING EDGE FLAPS LEFT PERCENT",
                        simvarType: "percent",
                        simvarTrueCondition: 0
                    }
                ],
                y: "210"
            },
            {
                name: "Parking brake...............................__",
                conditionType: "open",
                y: "250"
            },
            {
                name: "Fuel control switches...................CUTOFF",
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
                y: "290"
            },
            {
                name: "Weather radar..............................Off",
                conditionType: "closed",
                conditions: [
                    {
                        simvar: "L:BTN_WX_ACTIVE",
                        simvarType: "bool",
                        simvarTrueCondition: 0
                    },
                ],
                y: "330"
            },
        ]
    },
    {
        checklistTitle: "SECURE",
        checklistType: "normal",
        pageCount: 1,
        itemCount: 3,
        normalChecklistSequence: 10,
        checklistPriority: 0,
        items: [
            {
                name: "IRS........................................OFF",
                conditionType: "closed",
                conditions: [
                    {
                        simvar: "L:747_IRS_KNOB_1",
                        simvarType: "enum",
                        simvarTrueCondition: 0
                    },
                    {
                        simvar: "L:747_IRS_KNOB_2",
                        simvarType: "enum",
                        simvarTrueCondition: 0
                    },
                    {
                        simvar: "L:747_IRS_KNOB_3",
                        simvarType: "enum",
                        simvarTrueCondition: 0
                    },
                ],
                y: "130"
            },
            {
                name: "Emergency lights...........................OFF",
                conditionType: "open",
                y: "170"
            },
            {
                name: "Packs......................................OFF",
                conditionType: "open",
                y: "210"
            },
        ]
    },
]