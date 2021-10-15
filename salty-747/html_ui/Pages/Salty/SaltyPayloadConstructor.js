class SaltyPayloadConstructor {
    constructor() {
        this.paxStations = {
            businessUpper: {
                name: 'BUSINESS UPPER',
                seats: 32,
                weight: 3328,
                pax: 0,
                paxTarget: 0,
                stationIndex: 2 + 1,
                position: -35.400535,
                seatsRange: [1, 36],
                simVar: "PAYLOAD STATION WEIGHT:3"
            },
            firstClass: {
                name: 'FIRST CLASS',
                seats: 8,
                weight: 832,
                pax: 0,
                paxTarget: 0,
                stationIndex: 3 + 1,
                position: 0.04913,
                seatsRange: [37, 78],
                simVar: "PAYLOAD STATION WEIGHT:4"
            },
            businessMain: {
                name: 'BUSINESS MAIN',
                seats: 48,
                weight: 5400,
                pax: 0,
                paxTarget: 0,
                stationIndex: 4 + 1,
                position: -44.383345,
                seatsRange: [79, 126],
                simVar: "PAYLOAD STATION WEIGHT:5"
            },
            premiumEconomy: {
                name: 'PREMIUM ECONOMY',
                seats: 32,
                weight: 3328,
                pax: 0,
                paxTarget: 0,
                stationIndex: 5 + 1,
                position: -100.362841,
                seatsRange: [127, 174],
                simVar: "PAYLOAD STATION WEIGHT:6"
            },
            fowardEconomy: {
                name: 'FORWARD ECONOMY',
                seats: 36,
                weight: 3744,
                pax: 0,
                paxTarget: 0,
                stationIndex: 6 + 1,
                position: -81.274814,
                seatsRange: [127, 174],
                simVar: "PAYLOAD STATION WEIGHT:7"
            },
            rearEconomy: {
                name: 'REAR ECONOMY',
                seats: 208,
                weight: 21632,
                pax: 0,
                paxTarget: 0,
                stationIndex: 7 + 1,
                position: -148.319361,
                seatsRange: [127, 174],
                simVar: "PAYLOAD STATION WEIGHT:8"
            },
        };

        this.payloadStations = {
            pilot: {
                name: 'PILOT',
                weight: 84,
                stationIndex: 0 + 1,
                position: -2.964119,
                visible: false,
                simVar: 'PAYLOAD STATION WEIGHT:1',
            },
            firstOfficer: {
                name: 'FIRST OFFICER',
                weight: 84,
                stationIndex: 1 + 1,
                position: -2.964119,
                visible: false,
                simVar: 'PAYLOAD STATION WEIGHT:2',
            },
            fwdBag: {
                name: 'FORWARD_BAGGAGE',
                weight: 8000,
                stationIndex: 8 + 1,
                position: -28.56284,
                visible: true,
                simVar: 'PAYLOAD STATION WEIGHT:9',
            },
            aftBag: {
                name: 'REAR_BAGGAGE',
                weight: 8000,
                stationIndex: 9 + 1,
                position: -138.077047,
                visible: true,
                simVar: 'PAYLOAD STATION WEIGHT:10',
            },
            crew: {
                name: 'CREW',
                weight: 2110,
                stationIndex: 10 + 1,
                position: -81.274814,
                visible: true,
                simVar: 'PAYLOAD STATION WEIGHT:11',
            },
        };
    }
}