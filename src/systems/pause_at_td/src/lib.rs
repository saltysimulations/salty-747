#![cfg(any(target_arch = "wasm32"))]

use msfs::{legacy::NamedVariable, sim_connect::SIMCONNECT_OBJECT_ID_USER, MSFSEvent};

#[msfs::gauge(name=pause_at_td)]
async fn pause(mut gauge: msfs::Gauge) -> Result<(), Box<dyn std::error::Error>> {
    let mut simconnect = gauge.open_simconnect("pause_at_td")?;
    let pause_event = simconnect.map_client_event_to_sim_event("PAUSE_ON", false)?;

    while let Some(event) = gauge.next_event().await {
        match event {
            MSFSEvent::PostInitialize => {
                println!("WASM: Salty pause on T/D loaded");
            }
            MSFSEvent::PostDraw(_) => {
                let paused = NamedVariable::from("SALTY_PAUSED_AT_TD");
                let distance_till_tod =
                    NamedVariable::from("WT_CJ4_TOD_REMAINING").get_value::<f64>();

                if NamedVariable::from("SALTY_PAUSE_AT_TD").get_value::<f64>() == 1.
                    && paused.get_value::<f64>() == 0.
                    && distance_till_tod < 3.
                    && distance_till_tod > 1.
                {
                    simconnect.transmit_client_event(SIMCONNECT_OBJECT_ID_USER, pause_event, 0);
                    paused.set_value(1.);
                }
            }
            _ => {}
        }
    }

    Ok(())
}
