use crate::simulation::{Read, Reader, SimulationElement, SimulatorReader, Write, Writer};

#[derive(Copy, Clone, PartialEq, Debug)]
enum AntiIceMode {
    Off = 0,
    Auto = 1,
    On = 2,
}

read_write_enum!(AntiIceMode);

impl From<f64> for AntiIceMode {
    fn from(value: f64) -> Self {
        match value as u8 {
            1 => AntiIceMode::Auto,
            2 => AntiIceMode::On,
            _ => AntiIceMode::Off,
        }
    }
}

struct AntiIceSwitch {
    mode: AntiIceMode,
    mode_id: String,
}

impl AntiIceSwitch {
    fn new(mode_id: String) -> Self {
        Self {
            mode: AntiIceMode::Off,
            mode_id,
        }
    }

    #[cfg(test)]
    fn mode(&self) -> AntiIceMode {
        self.mode
    }
}

impl SimulationElement for AntiIceSwitch {
    fn read(&mut self, reader: &mut SimulatorReader) {
        self.mode = reader.read(&self.mode_id);
    }
}

#[cfg(test)]
mod anti_ice_switch_tests {
    use super::*;
    use crate::simulation::test::{SimulationTestBed, TestBed};

    #[test]
    fn changes_mode() {
        let mut test_bed =
            SimulationTestBed::from(AntiIceSwitch::new("OVHD_ANTI_ICE_ENG_1".into()));

        assert_eq!(test_bed.query_element(|e| e.mode()), AntiIceMode::Off);

        test_bed.write("OVHD_ANTI_ICE_ENG_1", 1.);
        test_bed.run();
        assert_eq!(test_bed.query_element(|e| e.mode()), AntiIceMode::Auto);

        test_bed.write("OVHD_ANTI_ICE_ENG_1", 2.);
        test_bed.run();
        assert_eq!(test_bed.query_element(|e| e.mode()), AntiIceMode::On);
    }
}
