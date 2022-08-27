class SaltyPayloadConstructor {
    constructor() {
        this.paxStations = {
            businessUpper: {
                name: 'ZONE UD',
                seats: 32,
                weight: 3328,
                pax: 0,
                paxTarget: 0,
                stationIndex: 1 + 1,
                position: -35.400535,
                seatsRange: [1, 32],
                simVar: "PAYLOAD STATION WEIGHT:2"
            },
            firstClass: {
                name: 'ZONE A',
                seats: 8,
                weight: 832,
                pax: 0,
                paxTarget: 0,
                stationIndex: 2 + 1,
                position: 0.04913,
                seatsRange: [33, 40],
                simVar: "PAYLOAD STATION WEIGHT:3"
            },
            businessMain: {
                name: 'ZONE B',
                seats: 48,
                weight: 5400,
                pax: 0,
                paxTarget: 0,
                stationIndex: 3 + 1,
                position: -44.383345,
                seatsRange: [41, 88],
                simVar: "PAYLOAD STATION WEIGHT:4"
            },
            premiumEconomy: {
                name: 'ZONE C',
                seats: 32,
                weight: 3328,
                pax: 0,
                paxTarget: 0,
                stationIndex: 4 + 1,
                position: -100.362841,
                seatsRange: [89, 120],
                simVar: "PAYLOAD STATION WEIGHT:5"
            },
            forwardEconomy: {
                name: 'ZONE D',
                seats: 36,
                weight: 3744,
                pax: 0,
                paxTarget: 0,
                stationIndex: 5 + 1,
                position: -81.274814,
                seatsRange: [121, 156],
                simVar: "PAYLOAD STATION WEIGHT:6"
            },
            rearEconomy: {
                name: 'ZONE E',
                seats: 208,
                weight: 21632,
                pax: 0,
                paxTarget: 0,
                stationIndex: 6 + 1,
                position: -148.319361,
                seatsRange: [157, 364],
                simVar: "PAYLOAD STATION WEIGHT:7"
            },
        };

        this.cargoStations = {
            fwdBag: {
                name: 'FORWARD_BAGGAGE',
                weight: 22225,
                load: 0,
                stationIndex: 7 + 1,
                position: -28.56284,
                visible: true,
                simVar: 'PAYLOAD STATION WEIGHT:8',
            },
            aftBag: {
                name: 'REAR_BAGGAGE',
                weight: 15875,
                load: 0,
                stationIndex: 8 + 1,
                position: -138.077047,
                visible: true,
                simVar: 'PAYLOAD STATION WEIGHT:9',
            },
            bulkBag: {
                name: 'BULK_BAGGAGE',
                weight: 5800,
                load: 0,
                stationIndex: 9 + 1,
                position: -138.077047,
                visible: true,
                simVar: 'PAYLOAD STATION WEIGHT:10',
            }
        };
    }
}

const payloadConstruct = new SaltyPayloadConstructor();
const paxStations = payloadConstruct.paxStations;
const cargoStations = payloadConstruct.cargoStations;

const MAX_SEAT_AVAILABLE = 364;
const PAX_WEIGHT = 84;
const BAG_WEIGHT = 20;

/**
 * Calculate %MAC ZWFCG of all stations
 */
function getZfwcg() {
    const currentPaxWeight = PAX_WEIGHT + BAG_WEIGHT;

    const leMacZ = -1.47; // Value from Debug Weight
    const macSize = 36.68; // Value from Debug Aircraft Sim Tunning

    const emptyWeight = 489656 * 0.453592; // Value from flight_model.cfg to kgs
    const emptyPosition = -98; // Value from flight_model.cfg
    const emptyMoment = emptyPosition * emptyWeight;

    const paxTotalMass = Object.values(paxStations)
        .map((station) => SimVar.GetSimVarValue(`L:${station.simVar}_DESIRED`, "Number") * currentPaxWeight)
        .reduce((acc, cur) => acc + cur, 0);
    const paxTotalMoment = Object.values(paxStations)
        .map((station) => SimVar.GetSimVarValue(`L:${station.simVar}_DESIRED`, "Number") * currentPaxWeight * station.position)
        .reduce((acc, cur) => acc + cur, 0);

    const cargoTotalMass = Object.values(cargoStations)
        .map((station) => SimVar.GetSimVarValue(`PAYLOAD STATION WEIGHT:${station.stationIndex}`, "Number"))
        .reduce((acc, cur) => acc + cur, 0);
    const cargoTotalMoment = Object.values(cargoStations)
        .map((station) => SimVar.GetSimVarValue(`PAYLOAD STATION WEIGHT:${station.stationIndex}`, "Number") * station.position)
        .reduce((acc, cur) => acc + cur, 0);

    const totalMass = emptyWeight + paxTotalMass + cargoTotalMass;
    const totalMoment = emptyMoment + paxTotalMoment + cargoTotalMoment;

    const cgPosition = totalMoment / totalMass;
    const cgPositionToLemac = cgPosition - leMacZ;
    const cgPercentMac = -10 * (cgPositionToLemac / macSize);

    return cgPercentMac;
}

/* Get total cargo weight */
function getTotalCargo() {
    return Object.values(cargoStations)
        .filter((station) => station.visible)
        .map((station) => SimVar.GetSimVarValue(`PAYLOAD STATION WEIGHT:${station.stationIndex}`, "Number"))
        .reduce((acc, cur) => acc + cur, 0);

    return cargoTotalMass;
}

/* Get total payload weight (pax + cargo) */
function getTotalPayload() {
    const currentPaxWeight = PAX_WEIGHT;

    const paxTotalMass = Object.values(paxStations)
        .map((station) => SimVar.GetSimVarValue(`L:${station.simVar}`, "Number") * currentPaxWeight)
        .reduce((acc, cur) => acc + cur, 0);
    const cargoTotalMass = getTotalCargo();

    return paxTotalMass + cargoTotalMass;
}

/* Get ZFW */
function getZfw() {
    const emptyWeight = 489656 * 0.453592; // Value from flight_model.cfg to kgs
    return emptyWeight + getTotalPayload();
}
