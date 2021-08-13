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
                name: "AFTER LANDING",
                y: "450"
            },
            {
                name: "SHUTDOWN",
                y: "495"
            },
            {
                name: "SECURE",
                y: "540"
            }
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
                name: "OXYGEN.......................................SET",
                conditionType: "open",
                y: "130"
            },
            {
                name: "FLIGHT INSTRUMENTS......HEADING___, ALTIMETER___",
                conditionType: "open",
                y: "170"
            },
            {
                name: "PARKING BRAKE................................SET",
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
                name: "FUEL CONTROL SWITCHES.....................CUTOFF",
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
                name: "FLIGHT DECK DOOR...............CLOSED AND LOCKED",
                conditionType: "open",
                y: "130"
            },
            {
                name: "PASSENGER SIGNS...............................__",
                conditionType: "open",
                y: "170"
            },
            {
                name: "MCP...........................V2__, HDG__, ALT__",
                conditionType: "open",
                y: "210"
            },
            {
                name: "TAKEOFF SPEEDS..................V1__, VR__, V2__",
                conditionType: "open",
                y: "250"
            },
            {
                name: "CDU PREFLIGHT..........................COMPLETED",
                conditionType: "open",
                y: "290"
            },
            {
                name: "TRIM..............................__ UNITS, 0, 0",
                conditionType: "open",
                y: "330"
            },
            {
                name: "TAXI AND TAKEOFF BRIEFING..............COMPLETED",
                conditionType: "open",
                y: "370"
            },
            {
                name: "BEACON........................................ON",
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
                name: "ANTI-ICE......................................__",
                conditionType: "open",
                y: "130"
            },
            {
                name: "RECALL...................................CHECKED",
                conditionType: "open",
                y: "170"
            },
            {
                name: "AUTOBRAKE....................................RTO",
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
                name: "FLIGHT CONTROLS..........................CHECKED",
                conditionType: "open",
                y: "250"
            },
            {
                name: "GROUND EQUIPMENT...........................CLEAR",
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
                name: "FLAPS.........................................--",
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
                name: "LANDING GEAR..................................UP",
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
                name: "FLAPS.........................................UP",
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
                name: "RECALL...................................CHECKED",
                conditionType: "open",
                y: "130"
            },
            {
                name: "NOTES....................................CHECKED",
                conditionType: "open",
                y: "170"
            },
            {
                name: "AUTOBRAKE....................................SET",
                conditionType: "open",
                y: "210"
            },
            {
                name: "LANDING DATA..................VREF__, MINIMUMS__",
                conditionType: "open",
                y: "250"
            },
            {
                name: "APPROACH BRIEFING......................COMPLETED",
                conditionType: "open",
                y: "290"
            },
        ]
    },

    {
        checklistTitle: "APPROACH",
        checklistType: "normal",
        pageCount: 1,
        itemCount: 2,
        normalChecklistSequence: 6,
        checklistPriority: 0,
        items: [
            {
                name: "ALTIMETERS...................................SET",
                conditionType: "open",
                y: "130"
            },
            {
                name: "PASSENGER SIGNS...............................__",
                conditionType: "open",
                y: "170"
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
                name: "SPEEDBRAKE.................................ARMED",
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
                name: "LANDING GEAR................................DOWN",
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
                name: "FLAPS.........................................--",
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
        checklistTitle: "AFTER LANDING",
        checklistType: "normal",
        pageCount: 1,
        itemCount: 8,
        normalChecklistSequence: 8,
        checklistPriority: 0,
        items: [
            {
                name: "SPEEDBRAKE LEVER............................DOWN",
                conditionType: "closed",
                conditions: [
                    {
                        simvar: "SPOILERS HANDLE POSITION",
                        simvarType: "percent",
                        simvarTrueCondition: 0
                    }
                ],
                y: "130"
            },
            {
                name: "APU SELECTOR..................................__",
                conditionType: "open",
                y: "170"
            },
            {
                name: "ENG ANTI-ICE..................................__",
                conditionType: "open",
                y: "210"
            },
            {
                name: "EXTERIOR LIGHTS...............................__",
                conditionType: "open",
                y: "250"
            },
            {
                name: "WXR/TERR.....................................OFF",
                conditionType: "closed",
                conditions: [
                    {
                        simvar: "L:BTN_WX_ACTIVE",
                        simvarType: "bool",
                        simvarTrueCondition: 0
                    },
                    {
                        simvar: "L:BTN_TERRONND_ACTIVE",
                        simvarType: "bool",
                        simvarTrueCondition: 0
                    }
                ],
                y: "290"
            },
            {
                name: "AUTOBRAKE....................................OFF",
                conditionType: "closed",
                conditions: [
                    {
                        simvar: "AUTO BRAKE SWITCH CB",
                        simvarType: "enum",
                        simvarTrueCondition: 1
                    }
                ],
                y: "330"
            },
            {
                name: "FLAPS.........................................UP",
                conditionType: "closed",
                conditions: [
                    {
                        simvar: "TRAILING EDGE FLAPS LEFT PERCENT",
                        simvarType: "percent",
                        simvarTrueCondition: 0
                    }
                ],
                y: "370"
            },
            {
                name: "TRANSPONDER MODE SELECTOR.....................__",
                conditionType: "open",
                y: "410"
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
                name: "HYDRAULIC PANEL..............................SET",
                conditionType: "open",
                y: "130"
            },
            {
                name: "FUEL PUMPS...................................OFF",
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
                name: "FLAPS.........................................UP",
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
                name: "PARKING BRAKE.................................__",
                conditionType: "open",
                y: "250"
            },
            {
                name: "FUEL CONTROL SWITCHES.....................CUTOFF",
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
                name: "WEATHER RADAR................................OFF",
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
                name: "IRS SWITCHES.................................OFF",
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
                name: "EMERGENCY LIGHTS.............................OFF",
                conditionType: "open",
                y: "170"
            },
            {
                name: "PACKS........................................OFF",
                conditionType: "open",
                y: "210"
            },
        ]
    },
]