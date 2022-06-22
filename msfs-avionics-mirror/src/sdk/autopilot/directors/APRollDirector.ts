/// <reference types="msfstypes/JS/simvar" />

import { EventBus } from '../../data';
import { ADCEvents } from '../../instruments';
import { LinearServo } from '../../utils/controllers';
import { PlaneDirector, DirectorState } from '../PlaneDirector';

/**
 * Options for control of the roll director.
 */
export interface RollDirectorOptions {
  /** The minimum bank angle under which the roll director will go to wings level. */
  minimumBankAngle: number,

  /** The maximum bank angle that the roll director will not exceed. */
  maximumBankAngle: number
}

/**
 * An autopilot roll director.
 */
export class APRollDirector implements PlaneDirector {

  public state: DirectorState;

  /** A callback called when the LNAV director activates. */
  public onActivate?: () => void;

  /** A callback called when the LNAV director arms. */
  public onArm?: () => void;

  private currentBankRef = 0;
  private desiredBank = 0;
  private actualBank = 0;

  private readonly bankServo = new LinearServo(10);


  /**
   * Creates an instance of the LateralDirector.
   * @param bus The event bus to use with this instance.
   * @param options Options to set on the roll director for bank angle limitations.
   */
  constructor(private readonly bus: EventBus, private readonly options?: RollDirectorOptions) {
    this.state = DirectorState.Inactive;

    const adc = this.bus.getSubscriber<ADCEvents>();
    adc.on('roll_deg').withPrecision(1).handle((roll) => {
      this.actualBank = roll;
    });
  }

  /**
   * Activates this director.
   */
  public activate(): void {
    this.state = DirectorState.Active;

    if (this.options !== undefined) {
      if (this.actualBank <= this.options.minimumBankAngle) {
        this.desiredBank = 0;
      } else if (this.actualBank > this.options.maximumBankAngle) {
        this.desiredBank = this.options.maximumBankAngle;
      } else {
        this.desiredBank = this.actualBank;
      }
    } else {
      this.desiredBank = this.actualBank;
    }

    if (this.onActivate !== undefined) {
      this.onActivate();
    }

    SimVar.SetSimVarValue('AUTOPILOT BANK HOLD', 'Bool', true);
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
    this.desiredBank = 0;
    SimVar.SetSimVarValue('AUTOPILOT BANK HOLD', 'Bool', false);
  }

  /**
   * Updates this director.
   */
  public update(): void {
    if (this.state === DirectorState.Active) {
      this.setBank(this.desiredBank);
    }
  }


  /**
   * Sets the desired AP bank angle.
   * @param bankAngle The desired AP bank angle.
   */
  private setBank(bankAngle: number): void {
    if (isFinite(bankAngle)) {
      this.currentBankRef = this.bankServo.drive(this.currentBankRef, bankAngle);
      SimVar.SetSimVarValue('AUTOPILOT BANK HOLD REF', 'degrees', this.currentBankRef);
    }
  }
}