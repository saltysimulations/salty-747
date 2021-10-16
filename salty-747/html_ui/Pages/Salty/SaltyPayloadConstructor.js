class SaltyPayloadConstructor {
    constructor() {
        this.paxStations = {
            businessUpper: {
                name: 'BUS UPPER',
                seats: 32,
                weight: 3328,
                pax: 0,
                paxTarget: 0,
                stationIndex: 0 + 1,
                position: -35.400535,
                seatsRange: [1, 32],
                simVar: "PAYLOAD STATION WEIGHT:1"
            },
            firstClass: {
                name: 'FIRST CLASS',
                seats: 8,
                weight: 832,
                pax: 0,
                paxTarget: 0,
                stationIndex: 1 + 1,
                position: 0.04913,
                seatsRange: [33, 40],
                simVar: "PAYLOAD STATION WEIGHT:2"
            },
            businessMain: {
                name: 'BUS MAIN',
                seats: 48,
                weight: 5400,
                pax: 0,
                paxTarget: 0,
                stationIndex: 2 + 1,
                position: -44.383345,
                seatsRange: [41, 88],
                simVar: "PAYLOAD STATION WEIGHT:3"
            },
            premiumEconomy: {
                name: 'PREMIUM ECO',
                seats: 32,
                weight: 3328,
                pax: 0,
                paxTarget: 0,
                stationIndex: 3 + 1,
                position: -100.362841,
                seatsRange: [89, 120],
                simVar: "PAYLOAD STATION WEIGHT:4"
            },
            fowardEconomy: {
                name: 'FORWARD ECO',
                seats: 36,
                weight: 3744,
                pax: 0,
                paxTarget: 0,
                stationIndex: 4 + 1,
                position: -81.274814,
                seatsRange: [121, 156],
                simVar: "PAYLOAD STATION WEIGHT:5"
            },
            rearEconomy: {
                name: 'REAR ECO',
                seats: 208,
                weight: 21632,
                pax: 0,
                paxTarget: 0,
                stationIndex: 5 + 1,
                position: -148.319361,
                seatsRange: [157, 364],
                simVar: "PAYLOAD STATION WEIGHT:6"
            },
        };

        this.cargoStations = {
            fwdBag: {
                name: 'FORWARD_BAGGAGE',
                weight: 8000,
                stationIndex: 6 + 1,
                position: -28.56284,
                visible: true,
                simVar: 'PAYLOAD STATION WEIGHT:7',
            },
            aftBag: {
                name: 'REAR_BAGGAGE',
                weight: 8000,
                stationIndex: 7 + 1,
                position: -138.077047,
                visible: true,
                simVar: 'PAYLOAD STATION WEIGHT:8',
            }
        };
    }
}