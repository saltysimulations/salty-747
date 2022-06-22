/// <reference types="msfstypes/JS/simvar" />

import { EventBus, SimVarValueType } from '../../data';
import { ADCEvents } from '../../instruments';
import { PlaneDirector, DirectorState } from '../PlaneDirector';
import { APValues } from '../APConfig';

/**
 * An autopilot pitch director.
 */
export class APPitchDirector implements PlaneDirector {

  public state: DirectorState;

  /** A callback called when the director activates. */
  public onActivate?: () => void;

  /** A callback called when the director arms. */
  public onArm?: () => void;

  private selectedPitch = 0;
  private currentPitch = 0;

  /**
   * Creates an instance of the LateralDirector.
   * @param bus The event bus to use with this instance.
   * @param apValues are the AP Values subjects.
   */
  constructor(private readonly bus: EventBus, private readonly apValues: APValues) {
    this.state = DirectorState.Inactive;
    this.apValues.selectedPitch.sub((p) => {
      this.selectedPitch = p;
    });
    const adc = this.bus.getSubscriber<ADCEvents>();
    adc.on('pitch_deg').withPrecision(1).handle((p) => {
      this.currentPitch = p;
    });

  }

  /**
   * Activates this director.
   */
  public activate(): void {
    this.state = DirectorState.Active;
    if (this.onActivate !== undefined) {
      this.onActivate();
    }
    this.apValues.selectedPitch.set(this.currentPitch);
    SimVar.SetSimVarValue('AUTOPILOT PITCH HOLD', 'Bool', true);
  }

  /**
   * Arms this director.
   * This director has no armed mode, so it activates immediately.
   */
  public arm(): void {
    if (this.state == DirectorState.Inactive) {
      this.activate();
    }
  }

  /**
   * Deactivates this director.
   */
  public deactivate(): void {
    this.state = DirectorState.Inactive;
    SimVar.SetSimVarValue('AUTOPILOT PITCH HOLD', 'Bool', false);
  }

  /**
   * Updates this director.
   */
  public update(): void {
    if (this.state === DirectorState.Active) {
      this.setPitch(this.selectedPitch);
    }
  }

  /**
   * Sets the desired AP pitch angle.
   * @param targetPitch The desired AP pitch angle.
   */
  private setPitch(targetPitch: number): void {
    if (isFinite(targetPitch)) {
      SimVar.SetSimVarValue('AUTOPILOT PITCH HOLD REF', SimVarValueType.Degree, targetPitch);
    }
  }
}