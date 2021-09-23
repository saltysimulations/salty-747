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
    electrical: A320Electrical,
    power_consumption: A320PowerConsumption,
}
impl A320 {
    pub fn new(electricity: &mut Electricity) -> A320 {
        A320 {
            electrical: A320Electrical::new(electricity),
            power_consumption: A320PowerConsumption::new(),
        }
    }
}
impl Aircraft for A320 {
    fn update_before_power_distribution(
        &mut self,
        context: &UpdateContext,
        electricity: &mut Electricity,
    ) {
    }

    fn update_after_power_distribution(&mut self, context: &UpdateContext) {
        self.power_consumption.update(context);
    }
}
impl SimulationElement for A320 {
    fn accept<T: SimulationElementVisitor>(&mut self, visitor: &mut T) {
        self.electrical.accept(visitor);
        self.power_consumption.accept(visitor);

        visitor.visit(self);
    }
}
