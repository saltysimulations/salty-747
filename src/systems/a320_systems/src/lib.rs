#![allow(clippy::suspicious_operation_groupings)]

mod electrical;
mod power_consumption;

use electrical::{
    A320Electrical, A320ElectricalOverheadPanel, A320EmergencyElectricalOverheadPanel,
    APU_START_MOTOR_BUS_TYPE,
};
use power_consumption::A320PowerConsumption;
use systems::{
    electrical::{Electricity, ElectricitySource, ExternalPowerSource},
    shared::ElectricalBusType,
    simulation::{Aircraft, SimulationElement, SimulationElementVisitor, UpdateContext},
};

pub struct A320 {
    electrical_overhead: A320ElectricalOverheadPanel,
    emergency_electrical_overhead: A320EmergencyElectricalOverheadPanel,
    electrical: A320Electrical,
    power_consumption: A320PowerConsumption,
    ext_pwr: ExternalPowerSource,
}
impl A320 {
    pub fn new(electricity: &mut Electricity) -> A320 {
        A320 {
            electrical_overhead: A320ElectricalOverheadPanel::new(),
            emergency_electrical_overhead: A320EmergencyElectricalOverheadPanel::new(),
            electrical: A320Electrical::new(electricity),
            power_consumption: A320PowerConsumption::new(),
            ext_pwr: ExternalPowerSource::new(electricity),
        }
    }
}
impl Aircraft for A320 {
    fn update_before_power_distribution(
        &mut self,
        context: &UpdateContext,
        electricity: &mut Electricity,
    ) {
        self.electrical_overhead
            .update_after_electrical(&self.electrical, electricity);
        self.emergency_electrical_overhead
            .update_after_electrical(context, &self.electrical);
    }

    fn update_after_power_distribution(&mut self, context: &UpdateContext) {
        self.power_consumption.update(context);
    }
}
impl SimulationElement for A320 {
    fn accept<T: SimulationElementVisitor>(&mut self, visitor: &mut T) {
        self.electrical_overhead.accept(visitor);
        self.emergency_electrical_overhead.accept(visitor);
        self.electrical.accept(visitor);
        self.power_consumption.accept(visitor);
        self.ext_pwr.accept(visitor);

        visitor.visit(self);
    }
}
