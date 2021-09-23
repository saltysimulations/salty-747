#![allow(clippy::suspicious_operation_groupings)]

mod electrical;
mod power_consumption;

use electrical::A320Electrical;
use power_consumption::A320PowerConsumption;
use systems::{
    electrical::Electricity,
    simulation::{Aircraft, SimulationElement, SimulationElementVisitor, UpdateContext},
};

// Ignore all the a320 electrical stuff for now
pub struct B748 {
    electrical: A320Electrical,
    power_consumption: A320PowerConsumption,
}
impl B748 {
    pub fn new(electricity: &mut Electricity) -> Self {
        Self {
            electrical: A320Electrical::new(electricity),
            power_consumption: A320PowerConsumption::new(),
        }
    }
}
impl Aircraft for B748 {
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
impl SimulationElement for B748 {
    fn accept<T: SimulationElementVisitor>(&mut self, visitor: &mut T) {
        self.electrical.accept(visitor);
        self.power_consumption.accept(visitor);

        visitor.visit(self);
    }
}
