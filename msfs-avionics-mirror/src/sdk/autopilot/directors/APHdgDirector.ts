/// <reference types="msfstypes/JS/simvar" />

import { NavMath } from '../..';
import { EventBus } from '../../data';
import { ADCEvents } from '../../instruments';
import { PlaneDirector, DirectorState } from '../PlaneDirector';
import { APValues } from '../APConfig';
import { LinearServo } from '../../utils/controllers';

/**
 * A heading autopilot director.
 */
export class APHdgDirector implements PlaneDirector {

  public state: DirectorState;

  /** A callback called when the director activates. */
  public onActivate?: () => void;

  /** A callback called when the director arms. */
  public onArm?: () => void;

  private currentBankRef = 0;
  private currentHeading = 0;
  private selectedHeading = 0;

  private readonly bankServo = new LinearServo(10);


  /**
   * Creates an instance of the LateralDirector.
   * @param bus The event bus to use with this instance.
   * @param apValues The AP Values from the Autopilot.
   */
  constructor(private readonly bus: EventBus, apValues: APValues) {
    this.state = DirectorState.Inactive;

    apValues.selectedHeading.sub((h) => {
      this.selectedHeading = h;
    });

    const adc = this.bus.getSubscriber<ADCEvents>();
    adc.on('hdg_deg').withPrecision(0).handle((h) => {
      this.currentHeading = h;
    });
  }

  /**
   * Activates this director.
   */
  public activate(): void {
    if (this.onActivate !== undefined) {
      this.onActivate();
    }
    SimVar.SetSimVarValue('AUTOPILOT HEADING LOCK', 'Bool', true);
    this.state = DirectorState.Active;
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
  public async deactivate(): Promise<void> {
    await SimVar.SetSimVarValue('AUTOPILOT HEADING LOCK', 'Bool', false);
    this.state = DirectorState.Inactive;
  }

  /**
   * Updates this director.
   */
  public update(): void {
    if (this.state === DirectorState.Active) {
      // let bankAngle = this.desiredBank(NavMath.normalizeHeading(this.dtk + interceptAngle), this.xtk);

      this.setBank(this.desiredBank(this.selectedHeading));
    }
  }

  /**
   * Gets a desired bank from a Target Selected Heading.
   * @param targetHeading The target heading.
   * @returns The desired bank angle.
   */
  private desiredBank(targetHeading: number): number {
    const turnDirection = NavMath.getTurnDirection(this.currentHeading, targetHeading);
    const headingDiff = Math.abs(NavMath.diffAngle(this.currentHeading, targetHeading));

    let baseBank = Math.min(1.25 * headingDiff, 25);
    baseBank *= (turnDirection === 'left' ? 1 : -1);

    return baseBank;
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