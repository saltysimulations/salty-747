#![allow(clippy::suspicious_operation_groupings)]

mod electrical;

use systems::{
    anti_ice::AntiIce,
    electrical::Electricity,
    simulation::{Aircraft, SimulationElement, SimulationElementVisitor, UpdateContext},
};

pub struct B748 {
    anti_ice: AntiIce,
}
impl B748 {
    pub fn new() -> Self {
        Self {
            anti_ice: AntiIce::default(),
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

    fn update_after_power_distribution(&mut self, context: &UpdateContext) {}
}
impl SimulationElement for B748 {
    fn accept<T: SimulationElementVisitor>(&mut self, visitor: &mut T) {
        visitor.visit(self);
    }
}
