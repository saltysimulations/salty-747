#![cfg(any(target_arch = "wasm32", doc))]
use b748_systems::B748;
use msfs::sim_connect::{SimConnectRecv, SIMCONNECT_OBJECT_ID_USER};
use msfs::{legacy::NamedVariable, sim_connect::SimConnect, sys};
use std::{
    pin::Pin,
    time::{Duration, Instant},
};
use systems::failures::FailureType;
use systems::simulation::Simulation;
use systems_wasm::{
    electrical::{MsfsAuxiliaryPowerUnit, MsfsElectricalBuses},
    f64_to_sim_connect_32k_pos,
    failures::Failures,
    sim_connect_32k_pos_to_f64, MsfsAircraftVariableReader, MsfsNamedVariableReaderWriter,
    MsfsSimulationHandler, SimulatorAspect,
};

#[msfs::gauge(name=systems)]
async fn systems(mut gauge: msfs::Gauge) -> Result<(), Box<dyn std::error::Error>> {
    let mut sim_connect = gauge.open_simconnect("systems")?;

    let mut simulation = Simulation::new(|_| B748::new());
    let mut msfs_simulation_handler = MsfsSimulationHandler::new(
        vec![
            Box::new(create_aircraft_variable_reader()?),
            Box::new(MsfsNamedVariableReaderWriter::new("SALTY_")),
        ],
        create_failures(),
    );

    println!("bruh");

    while let Some(event) = gauge.next_event().await {
        msfs_simulation_handler.handle(event, &mut simulation, &mut sim_connect.as_mut())?;
    }

    Ok(())
}

fn create_aircraft_variable_reader(
) -> Result<MsfsAircraftVariableReader, Box<dyn std::error::Error>> {
    let mut reader = MsfsAircraftVariableReader::new();
    reader.add("AMBIENT TEMPERATURE", "celsius", 0)?;
    reader.add("TOTAL AIR TEMPERATURE", "celsius", 0)?;
    reader.add_with_additional_names(
        "EXTERNAL POWER AVAILABLE",
        "Bool",
        1,
        &vec!["OVHD_ELEC_EXT_PWR_PB_IS_AVAILABLE"],
    )?;
    reader.add("GEAR CENTER POSITION", "Percent", 0)?;
    reader.add("GEAR ANIMATION POSITION", "Percent", 0)?;
    reader.add("GEAR ANIMATION POSITION", "Percent", 1)?;
    reader.add("GEAR ANIMATION POSITION", "Percent", 2)?;
    reader.add("GEAR HANDLE POSITION", "Bool", 0)?;
    reader.add("TURB ENG CORRECTED N1", "Percent", 1)?;
    reader.add("TURB ENG CORRECTED N1", "Percent", 2)?;
    reader.add("TURB ENG CORRECTED N2", "Percent", 1)?;
    reader.add("TURB ENG CORRECTED N2", "Percent", 2)?;
    reader.add("AIRSPEED INDICATED", "Knots", 0)?;
    reader.add("INDICATED ALTITUDE", "Feet", 0)?;
    reader.add("AIRSPEED MACH", "Mach", 0)?;
    reader.add("AIRSPEED TRUE", "Knots", 0)?;
    reader.add("VELOCITY WORLD Y", "feet per minute", 0)?;
    reader.add("AMBIENT WIND DIRECTION", "Degrees", 0)?;
    reader.add("AMBIENT WIND VELOCITY", "Knots", 0)?;
    reader.add("GPS GROUND SPEED", "Knots", 0)?;
    reader.add("GPS GROUND MAGNETIC TRACK", "Degrees", 0)?;
    reader.add("PLANE PITCH DEGREES", "Degrees", 0)?;
    reader.add("PLANE BANK DEGREES", "Degrees", 0)?;
    reader.add("PLANE HEADING DEGREES MAGNETIC", "Degrees", 0)?;
    reader.add("FUEL TANK LEFT MAIN QUANTITY", "Pounds", 0)?;
    reader.add("UNLIMITED FUEL", "Bool", 0)?;
    reader.add("INDICATED ALTITUDE", "Feet", 0)?;
    reader.add("AMBIENT PRESSURE", "inHg", 0)?;
    reader.add("SEA LEVEL PRESSURE", "Millibars", 0)?;
    reader.add("SIM ON GROUND", "Bool", 0)?;
    reader.add("GENERAL ENG STARTER ACTIVE", "Bool", 1)?;
    reader.add("GENERAL ENG STARTER ACTIVE", "Bool", 2)?;
    reader.add("EXIT OPEN", "Percent", 5)?;
    // TODO It is the catering door for now.
    reader.add("EXIT OPEN", "Percent", 3)?;
    reader.add("PUSHBACK ANGLE", "Radian", 0)?;
    reader.add("PUSHBACK STATE", "Enum", 0)?;
    reader.add("ANTISKID BRAKES ACTIVE", "Bool", 0)?;
    reader.add("ACCELERATION BODY Z", "feet per second squared", 0)?;

    reader.add_with_additional_names(
        "APU GENERATOR SWITCH",
        "Bool",
        0,
        &vec!["OVHD_ELEC_APU_GEN_PB_IS_ON"],
    )?;
    reader.add_with_additional_names(
        "EXTERNAL POWER ON",
        "Bool",
        1,
        &vec!["OVHD_ELEC_EXT_PWR_PB_IS_ON"],
    )?;
    reader.add_with_additional_names(
        "GENERAL ENG MASTER ALTERNATOR",
        "Bool",
        1,
        &vec!["OVHD_ELEC_ENG_GEN_1_PB_IS_ON"],
    );
    reader.add_with_additional_names(
        "GENERAL ENG MASTER ALTERNATOR",
        "Bool",
        2,
        &vec!["OVHD_ELEC_ENG_GEN_2_PB_IS_ON"],
    );
    reader.add("PLANE LATITUDE", "degree latitude", 0)?;
    reader.add("PLANE LONGITUDE", "degree longitude", 0)?;
    reader.add("TRAILING EDGE FLAPS LEFT PERCENT", "Percent", 0)?;
    reader.add("TRAILING EDGE FLAPS RIGHT PERCENT", "Percent", 0)?;

    Ok(reader)
}

fn create_electrical_buses() -> MsfsElectricalBuses {
    let mut buses = MsfsElectricalBuses::new();
    // The numbers used here are those defined for buses in the systems.cfg [ELECTRICAL] section.
    buses.add("AC_1", 1, 2);
    buses.add("AC_2", 1, 3);
    buses.add("AC_ESS", 1, 4);
    buses.add("AC_ESS_SHED", 1, 5);
    buses.add("AC_STAT_INV", 1, 6);
    buses.add("AC_GND_FLT_SVC", 1, 14);
    buses.add("DC_1", 1, 7);
    buses.add("DC_2", 1, 8);
    buses.add("DC_ESS", 1, 9);
    buses.add("DC_ESS_SHED", 1, 10);
    buses.add("DC_BAT", 1, 11);
    buses.add("DC_HOT_1", 1, 12);
    buses.add("DC_HOT_2", 1, 13);
    buses.add("DC_GND_FLT_SVC", 1, 15);

    buses
}

fn create_failures() -> Failures {
    let mut failures = Failures::new(
        NamedVariable::from("A32NX_FAILURE_ACTIVATE"),
        NamedVariable::from("A32NX_FAILURE_DEACTIVATE"),
    );

    failures.add(24_000, FailureType::TransformerRectifier(1));
    failures.add(24_001, FailureType::TransformerRectifier(2));
    failures.add(24_002, FailureType::TransformerRectifier(3));

    failures
}
