/**
 * A class that manages localizer lateral guidance for APPR mode.
 */
class LocDirector {
  /**
   * Creates an instance of a LocDirector.
   * @param {CJ4NavModeSelector} navModeSelector The current nav mode selector.
   */
  constructor(navModeSelector) {
    /** The current director state. */
    this.state = LocDirectorState.NONE;

    /** The current radio index. */
    this.radioIndex = 3;

    /** The current nav mode selector. */
    this.navModeSelector = navModeSelector;

    /** The previous lateral deviation. */
    this.previousDeviation = 0;

    /** The previous captured time. */
    this.previousTime = Date.now();
  }

  /**
   * Updates the localizer director.
   */
  update() {
    const navSource = SimVar.GetSimVarValue('L:WT_CJ4_LNAV_MODE', 'number');
    this.radioIndex = 3;

    const radioState = this.getRadioState();
    switch (this.state) {
      case LocDirectorState.NONE:
        this.handleNone();
        //console.log("LOC DIRECTOR OFF");
        break;
      case LocDirectorState.ARMED:
        this.handleArmed(radioState);
        //console.log("LOC DIRECTOR ARMED");
        break;
      case LocDirectorState.ACTIVE:
        this.handleActive(radioState);
        //console.log("LOC DIRECTOR ACTIVE");
        break;
    }
  }

  /**
   * Handles the inactive localizer director state.
   */
  handleNone() {
    if (this.navModeSelector.currentLateralArmedState === LateralNavModeState.APPR) {
      this.state = LocDirectorState.ARMED;
    }
  }

  /**
   * Handles the armed state.
   * @param {LocRadioState} radioState The current localizer radio state.
   */
  handleArmed(radioState) {
    if (radioState.hasLocSignal) {
      if (Math.abs(radioState.lateralDevation) < 120) {
        this.state = LocDirectorState.ACTIVE;
        this.navModeSelector.queueEvent(NavModeEvent.LOC_ACTIVE);
      }
    }
    else {
      this.state = LocDirectorState.NONE;
    }
  }

  /**
   * Handles the armed state.
   * @param {LocRadioState} radioState The current localizer radio state.
   */
  handleActive(radioState) {
    if (radioState.hasLocSignal && this.navModeSelector.currentLateralActiveState === LateralNavModeState.APPR) {

    }
    else {
      this.state = LocDirectorState.NONE;
    }
  }

  /**
   * Gets the current localizer radio state.
   * @returns {LocRadioState} The current localizer radio state.
   */
  getRadioState() {
    const radioState = new LocRadioState();

    radioState.frequency = SimVar.GetSimVarValue(`NAV ACTIVE FREQUENCY:${this.radioIndex}`, 'MHz');
    radioState.hasNavSignal = SimVar.GetSimVarValue(`NAV HAS NAV:${this.radioIndex}`, 'Bool') !== 0;
    radioState.hasLocSignal = SimVar.GetSimVarValue(`NAV HAS LOCALIZER:${this.radioIndex}`, 'Bool') !== 0;
    radioState.hasGlideslopeSignal = SimVar.GetSimVarValue(`NAV HAS GLIDE SLOPE:${this.radioIndex}`, 'Bool') !== 0;
    radioState.course = SimVar.GetSimVarValue(`NAV LOCALIZER:${this.radioIndex}`, 'Degrees');
    radioState.lateralDevation = SimVar.GetSimVarValue(`NAV CDI:${this.radioIndex}`, 'Number');

    return radioState;
  }
}

class LocDirectorState { }
LocDirectorState.NONE = 'NONE';
LocDirectorState.ARMED = 'ARMED';
LocDirectorState.ACTIVE = 'ACTIVE';

class LocRadioState {
  constructor() {
    this.frequency = NaN;

    this.hasNavSignal = false;

    this.hasLocSignal = false;

    this.hasGlideslopeSignal = false;

    this.course = NaN;

    this.lateralDevation = NaN;
  }
}