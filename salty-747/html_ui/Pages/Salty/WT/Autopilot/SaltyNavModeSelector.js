/**
 * A class that handles state transitions to the different autopilot modes of
 * the CJ4.
 */
 class CJ4NavModeSelector {

  /**
   * Creates a new instance of the CJ4NavModeSelector.
   * @param {FlightPlanManager} flightPlanManager The flight plan manager to use with this instance.
   */
  constructor(flightPlanManager) {

    /** The current flight plan manager. */
    this.flightPlanManager = flightPlanManager;

    /** The current flight plan version. */
    this.currentPlanVersion = 0;

    /** The current loaded approach index. */
    this.currentApproachIndex = undefined;

    /** The current loaded destination runway index. */
    this.currentDestinationRunwayIndex = undefined;

    /** The current active lateral nav mode. */
    this.currentLateralActiveState = LateralNavModeState.TO;

    /** The current armed lateral nav mode. */
    this.currentLateralArmedState = LateralNavModeState.NONE;

    /** The current active vertical nav mode. */
    this.currentVerticalActiveState = VerticalNavModeState.TO;

    /** The current armed altitude mode. */
    this.currentArmedAltitudeState = VerticalNavModeState.NONE;

    /** The current armed vnav mode. */
    this.currentArmedVnavState = VerticalNavModeState.NONE;

    /** The current armed approach mode. */
    this.currentArmedApproachVerticalState = VerticalNavModeState.NONE;

    /** The current autothrottle mode. */
    this.currentAutoThrottleStatus = AutoThrottleModeState.NONE;

    /** Whether or not VNAV is on. */
    this.isVNAVOn = false;

    /** The current VPath state. */
    this.vPathState = VnavPathStatus.NONE;

    /** The current RNAV Glidepath state. */
    this.glidepathState = GlidepathStatus.NONE;

    /** The current ILS Glideslope state. */
    this.glideslopeState = GlideslopeStatus.NONE;

    /** The current LNav mode state. */
    this.lNavModeState = LNavModeState.FMS;

    /** The current altitude slot index. */
    this.currentAltSlotIndex = 0;

    /** Whether or not altitude lock is currently active. */
    this.isAltitudeLocked = false;

    /** The selected altitude in altitude lock slot 1. */
    this.selectedAlt1 = 0;

    /** The selected altitude in altitude lock slot 2. */
    this.selectedAlt2 = 0;

    /** The currently selected approach type. */
    this.approachMode = WT_ApproachType.NONE;

    /** The vnav requested slot. */
    this.vnavRequestedSlot = undefined;

    /** The vnav managed altitude target. */
    this.managedAltitudeTarget = undefined;

    /** The current AP target altitude type. */
    this.currentAltitudeTracking = AltitudeState.SELECTED;

    /** The pressure/locked altitude value for WT Vertical AP. */
    this.pressureAltitudeTarget = undefined;

    /** Flag for Early VNAV Descent */
    this.isEarlyDescent = false;

    /**
     * The queue of state change events to process.
     * @type {string[]}
     */
    this._eventQueue = [];

    /** The current states of the input data. */
    this._inputDataStates = {
      altLocked: new ValueStateTracker(() => SimVar.GetSimVarValue("L:WT_CJ4_ALT_HOLD", "number") == 1, () => NavModeEvent.ALT_LOCK_CHANGED),
      simAltLocked: new ValueStateTracker(() => SimVar.GetSimVarValue("AUTOPILOT ALTITUDE LOCK", "Boolean"), () => NavModeEvent.SIM_ALT_LOCK_CHANGED),
      altSlot: new ValueStateTracker(() => SimVar.GetSimVarValue("AUTOPILOT ALTITUDE SLOT INDEX", "number"), () => NavModeEvent.ALT_SLOT_CHANGED),
      selectedAlt1: new ValueStateTracker(() => SimVar.GetSimVarValue("AUTOPILOT ALTITUDE LOCK VAR:3", "feet"), () => NavModeEvent.SELECTED_ALT1_CHANGED),
      selectedAlt2: new ValueStateTracker(() => SimVar.GetSimVarValue("AUTOPILOT ALTITUDE LOCK VAR:2", "feet"), () => NavModeEvent.SELECTED_ALT2_CHANGED),
      navmode: new ValueStateTracker(() => SimVar.GetSimVarValue("L:WT_CJ4_LNAV_MODE", "number"), () => NavModeEvent.NAV_MODE_CHANGED),
      hdg_lock: new ValueStateTracker(() => SimVar.GetSimVarValue("AUTOPILOT HEADING LOCK", "Boolean"), () => NavModeEvent.HDG_LOCK_CHANGED),
      toga: new ValueStateTracker(() => Simplane.getAutoPilotTOGAActive(), () => NavModeEvent.TOGA_CHANGED),
      grounded: new ValueStateTracker(() => Simplane.getIsGrounded(), () => NavModeEvent.GROUNDED),
      autopilot: new ValueStateTracker(() => Simplane.getAutoPilotActive(), () => NavModeEvent.AP_CHANGED),
      autothrottle: new ValueStateTracker(() => SimVar.GetSimVarValue("L:XMLVAR_AUTO_THROTTLE_ARM_0_STATE", "bool"), () => NavModeEvent.AT_CHANGED)
    };

    /** The event handlers for each event type. */
    this._handlers = {
      [`${NavModeEvent.VS_PRESSED}`]: this.handleVSPressed.bind(this),
      [`${NavModeEvent.NAV_PRESSED}`]: this.handleNAVPressed.bind(this),
      [`${NavModeEvent.NAV_MODE_CHANGED}`]: this.handleNAVModeChanged.bind(this),
      [`${NavModeEvent.HDG_PRESSED}`]: this.handleHDGPressed.bind(this),
      [`${NavModeEvent.HDG_HOLD_PRESSED}`]: this.handleHDGHOLDPressed.bind(this),
      [`${NavModeEvent.LOC_PRESSED}`]: this.handleLOCPressed.bind(this),
      [`${NavModeEvent.FLC_PRESSED}`]: this.handleFLCPressed.bind(this),
      [`${NavModeEvent.ALT_INT_PRESSED}`]: this.handleAltIntPressed.bind(this),
      [`${NavModeEvent.ALT_HOLD_PRESSED}`]: this.handleAltHoldPressed.bind(this),
      [`${NavModeEvent.VNAV_PRESSED}`]: this.handleVNAVPressed.bind(this),
      [`${NavModeEvent.ALT_LOCK_CHANGED}`]: this.handleAltLockChanged.bind(this),
      [`${NavModeEvent.SIM_ALT_LOCK_CHANGED}`]: this.handleSimAltLockChanged.bind(this),
      [`${NavModeEvent.ALT_CAPTURED}`]: this.handleAltCaptured.bind(this),
      [`${NavModeEvent.PATH_ACTIVE}`]: this.handleVPathActivate.bind(this),
      [`${NavModeEvent.GP_ACTIVE}`]: this.handleGPGSActivate.bind(this),
      [`${NavModeEvent.GS_ACTIVE}`]: this.handleGPGSActivate.bind(this),
      [`${NavModeEvent.ALT_SLOT_CHANGED}`]: this.handleAltSlotChanged.bind(this),
      [`${NavModeEvent.SELECTED_ALT1_CHANGED}`]: this.handleAlt1Changed.bind(this),
      [`${NavModeEvent.SELECTED_ALT2_CHANGED}`]: this.handleAlt2Changed.bind(this),
      [`${NavModeEvent.APPROACH_CHANGED}`]: this.handleApproachChanged.bind(this),
      [`${NavModeEvent.VNAV_REQUEST_SLOT_1}`]: this.handleVnavRequestSlot1.bind(this),
      [`${NavModeEvent.VNAV_REQUEST_SLOT_2}`]: this.handleVnavRequestSlot2.bind(this),
      [`${NavModeEvent.HDG_LOCK_CHANGED}`]: this.handleHeadingLockChanged.bind(this),
      [`${NavModeEvent.TOGA_CHANGED}`]: this.handleTogaChanged.bind(this),
      [`${NavModeEvent.GROUNDED}`]: this.handleGrounded.bind(this),
      [`${NavModeEvent.AP_CHANGED}`]: this.handleAPChanged.bind(this),
      [`${NavModeEvent.AT_CHANGED}`]: this.handleATChanged.bind(this),
      [`${NavModeEvent.LOC_ACTIVE}`]: this.handleLocActive.bind(this),
      [`${NavModeEvent.LNAV_ACTIVE}`]: this.handleLNAVActive.bind(this),
      [`${NavModeEvent.FD_TOGGLE}`]: this.handleFdToggle.bind(this),
      [`${NavModeEvent.ALT_PRESSED}`]: this.handleAltPressed.bind(this),
      [`${NavModeEvent.THROTTLE_TO_HOLD}`]: this.handleThrottleToHold.bind(this)
    };

    this.initialize();
  }

  /**
   * Initializes the nav mode selector and resets all autopilot modes to default.
   */
  initialize() {
    if (SimVar.GetSimVarValue("AUTOPILOT HEADING LOCK", "number") == 1) {
      SimVar.SetSimVarValue("K:AP_PANEL_HEADING_HOLD", "number", 1);
    }

    if (SimVar.GetSimVarValue("AUTOPILOT NAV1 LOCK", "number") == 1) {
      SimVar.SetSimVarValue("K:AP_NAV1_HOLD", "number", 0);
    }

    if (SimVar.GetSimVarValue("AUTOPILOT VERTICAL HOLD", "number") == 1) {
      SimVar.SetSimVarValue("K:AP_PANEL_VS_HOLD", "number", 0);
    }

    if (SimVar.GetSimVarValue("AUTOPILOT FLIGHT LEVEL CHANGE", "number") == 1) {
      SimVar.SetSimVarValue("K:FLIGHT_LEVEL_CHANGE", "number", 0);
    }

    if (SimVar.GetSimVarValue("AUTOPILOT APPROACH HOLD", "number") == 1 || SimVar.GetSimVarValue("AUTOPILOT GLIDESLOPE ARM", "number") == 1) {
      SimVar.SetSimVarValue("K:AP_APR_HOLD", "number", 0);
    }

    if (SimVar.GetSimVarValue("AUTOPILOT BACKCOURSE HOLD", "number") == 1) {
      SimVar.SetSimVarValue("K:AP_BC_HOLD", "number", 0);
    }

  }

  /**
   * Called when a AP button is pressed.
   * @param {string} evt
   */
  onNavChangedEvent(evt) {
    this.queueEvent(evt);
    this.processEvents();
  }

  /**
   * Geneates events from the changing of input data from various sources.
   */
  generateInputDataEvents() {
    for (var key in this._inputDataStates) {
      const event = this._inputDataStates[key].updateState();

      if (event !== undefined) {
        this.queueEvent(event);
      }
    }

    if (this.currentVerticalActiveState === VerticalNavModeState.ALTCAP ||
      this.currentVerticalActiveState === VerticalNavModeState.ALTSCAP || this.currentVerticalActiveState === VerticalNavModeState.ALTVCAP) {
      const currentAltitude = SimVar.GetSimVarValue("INDICATED ALTITUDE", "feet");
      const targetAltitude = SimVar.GetSimVarValue("AUTOPILOT ALTITUDE LOCK VAR:3", "feet");

      if (Math.abs(currentAltitude - targetAltitude) < 50) {
        this.queueEvent(NavModeEvent.ALT_CAPTURED);
      }
    }

    const planVersion = SimVar.GetSimVarValue("L:WT.FlightPlan.Version", "number");
    if (planVersion != this.currentPlanVersion) {
      this.currentPlanVersion = planVersion;

      const flightPlan = this.flightPlanManager.getFlightPlan(0);
      const approachIndex = flightPlan.procedureDetails.approachIndex;
      const destinationRunwayIndex = flightPlan.procedureDetails.destinationRunwayIndex;

      if (approachIndex !== this.currentApproachIndex) {
        this.currentApproachIndex = approachIndex;
        this.queueEvent(NavModeEvent.APPROACH_CHANGED);
      } else if (approachIndex === -1 && this.currentDestinationRunwayIndex !== destinationRunwayIndex) {
        this.currentDestinationRunwayIndex = destinationRunwayIndex;
        this.queueEvent(NavModeEvent.APPROACH_CHANGED);
      }
    }
  }

  /**
   * Processes queued state changes.
   */
  processEvents() {
    while (this._eventQueue.length > 0) {
      const event = this._eventQueue.shift();
      this._handlers[event]();
    }

    const getLateralAnnunciation = (mode, armed = false) => {
      if (mode === LateralNavModeState.APPR) {
        if (this.approachMode === WT_ApproachType.RNAV && this.lNavModeState === LNavModeState.FMS) {
          mode = "LNV1";
        } else {
          mode = "LOC1";
        } 
        mode = "APPR " + mode;
      }

      return mode;
    };

    const fmaValues = {
      approachActive: this.currentLateralActiveState === LateralNavModeState.APPR ? "APPR" : "",
      lateralMode: getLateralAnnunciation(this.currentLateralActiveState),
      lateralArmed: this.currentLateralArmedState !== LateralNavModeState.NONE ? getLateralAnnunciation(this.currentLateralArmedState, true) : "",
      verticalMode: `${this.isVNAVOn && this.currentVerticalActiveState != 'TO' ? "V" : ""}${this.currentVerticalActiveState}`,
      altitudeArmed: this.currentArmedAltitudeState !== VerticalNavModeState.NONE ? this.currentArmedAltitudeState : "",
      vnavArmed: this.currentArmedVnavState !== VerticalNavModeState.NONE ? this.currentArmedVnavState : "",
      approachVerticalArmed: this.currentArmedApproachVerticalState !== VerticalNavModeState.NONE ? this.currentArmedApproachVerticalState : "",
      autoThrottle: this.currentAutoThrottleStatus !== AutoThrottleModeState.NONE ? this.currentAutoThrottleStatus : "",
      approachType: this.approachMode !== WT_ApproachType.NONE ? this.approachMode : ""
    };
    //WTDataStore.set('CJ4_fmaValues', JSON.stringify(fmaValues));
    localStorage.setItem("CJ4_fmaValues", JSON.stringify(fmaValues));
  }

  /**
   * Queues an event with the mode selector state machine.
   * @param {string} event The event type to queue.
   */
  queueEvent(event) {
    this._eventQueue.push(event);
  }

  /**
   * Handles when the autopilot turns on or off.
   */
  handleAPChanged() {
    if (this._inputDataStates.autopilot.state) {
      if (this.currentLateralActiveState === LateralNavModeState.TO || this.currentLateralActiveState === LateralNavModeState.GA
        || this.currentVerticalActiveState === VerticalNavModeState.TO || this.currentVerticalActiveState === VerticalNavModeState.GA) {
        //SimVar.SetSimVarValue("K:AUTO_THROTTLE_TO_GA", "number", 0);
      }
    }
  }

  /**
   * Handles when the autothrottle turns on or off.
   */
  handleATChanged() {
    if (SimVar.GetSimVarValue("L:XMLVAR_AUTO_THROTTLE_ARM_0_STATE", "bool") && !Simplane.getIsGrounded()) {
      switch (this.currentAutoThrottleStatus)  {
        case AutoThrottleModeState.IDLE:
          this.activateIdleMode();
          break;
        case AutoThrottleModeState.THRREF:
          this.activateThrustRefMode();
          break;
        case AutoThrottleModeState.THR:
          this.activateThrustMode();
          break;
        case AutoThrottleModeState.HOLD:
          this.handleThrottleToHold();
          break;
        case AutoThrottleModeState.SPD:
          this.activateSpeedMode();
          break;
      }
    }
  }

  /**
   * Handles when APPR LOC mode goes active.
   */
  handleLocActive() {
    if (this.currentLateralArmedState === LateralNavModeState.APPR) {
      this.currentLateralArmedState = LateralNavModeState.NONE;
      this.currentLateralActiveState = LateralNavModeState.APPR;

      if (SimVar.GetSimVarValue("AUTOPILOT APPROACH HOLD", "number") != 1) {
        SimVar.SetSimVarValue("K:AP_LOC_HOLD_ON", "number", 1);
      }
      SimVar.SetSimVarValue("K:HEADING_SLOT_INDEX_SET", "number", 2);
      SimVar.SetSimVarValue("AUTOPILOT APPROACH ACTIVE", "bool", 1);
      SimVar.SetSimVarValue("L:WT_CJ4_LNAV_ON", "number", 0);
      SimVar.SetSimVarValue("L:AP_LNAV_ARMED", "number", 0);
      SimVar.SetSimVarValue("L:AP_HEADING_HOLD_ACTIVE", "number", 0);
      Coherent.call("HEADING_BUG_SET", 1, SimVar.GetSimVarValue(`NAV LOCALIZER:3`, 'Degrees'));
    }
  }

  /**
   * Handles when LNV1 or APPR LNV1 mode goes active.
   */
  handleLNAVActive() {
    if (this.currentLateralArmedState === LateralNavModeState.LNAV) {
      switch (this.currentLateralActiveState) {
        case LateralNavModeState.ROLL:
          SimVar.SetSimVarValue("L:WT_CJ4_NAV_ON", "number", 1);
          SimVar.SetSimVarValue("L:AP_LNAV_ACTIVE", "number", 1);
          this.changeToCorrectLNavForMode(true, false);
          break;
        case LateralNavModeState.LNAV:
        case LateralNavModeState.HDG:
        case LateralNavModeState.HDGHOLD:
        case LateralNavModeState.TO:
        case LateralNavModeState.GA:
          SimVar.SetSimVarValue("L:WT_CJ4_NAV_ON", "number", 1);
          SimVar.SetSimVarValue("L:AP_LNAV_ACTIVE", "number", 1);
          SimVar.SetSimVarValue("L:WT_CJ4_HDG_ON", "number", 0);
          this.changeToCorrectLNavForMode(false, false);
          SimVar.SetSimVarValue("K:AP_PANEL_HEADING_HOLD", "number", 1);
          break;
      }
      this.currentLateralArmedState = LateralNavModeState.NONE;
    }

    /*SimVar.SetSimVarValue("L:WT_CJ4_NAV_ON", "number", 1);
    SimVar.SetSimVarValue("L:WT_CJ4_HDG_ON", "number", 0);
    this.changeToCorrectLNavForMode(false, true);
    SimVar.SetSimVarValue("L:AP_LNAV_ARMED", "number", 1);
    SimVar.SetSimVarValue("L:AP_HEADING_HOLD_ACTIVE", "number", 0);
    break;*/

    if (this.currentLateralArmedState === LateralNavModeState.APPR) {
      SimVar.SetSimVarValue("K:HEADING_SLOT_INDEX_SET", "number", 2);
      if (SimVar.GetSimVarValue("AUTOPILOT HEADING LOCK", "number") == 0) {
        SimVar.SetSimVarValue("K:AP_PANEL_HEADING_HOLD", "number", 1);
      }

      this.currentLateralArmedState = LateralNavModeState.NONE;
      this.currentLateralActiveState = LateralNavModeState.APPR;
    }
  }

  /**
   * Handles when the plane changes from on ground to in air or in air to on ground.
   */
  handleGrounded() {
    // if (this._inputDataStates.grounded.state) {
    //   switch (this.currentLateralActiveState) {
    //     case LateralNavModeState.NAV:
    //       SimVar.SetSimVarValue("L:WT_CJ4_NAV_ON", "number", 0);
    //       SimVar.SetSimVarValue("K:AP_NAV1_HOLD", "number", 0);
    //       break;
    //     case LateralNavModeState.LNAV:
    //     case LateralNavModeState.HDG:
    //     case LateralNavModeState.TO:
    //     case LateralNavModeState.GA:
    //       SimVar.SetSimVarValue("L:WT_CJ4_HDG_ON", "number", 0);
    //       SimVar.SetSimVarValue("K:HEADING_SLOT_INDEX_SET", "number", 1);
    //       SimVar.SetSimVarValue("K:AP_PANEL_HEADING_HOLD", "number", 0);
    //       break;
    //     case LateralNavModeState.APPR:
    //       this.cancelApproachMode(true);
    //       SimVar.SetSimVarValue("K:HEADING_SLOT_INDEX_SET", "number", 1);
    //       SimVar.SetSimVarValue("L:WT_CJ4_HDG_ON", "number", 0);
    //       break;
    //     case LateralNavModeState.ROLL:
    //       break;
    //   }
    //   this.currentLateralActiveState = LateralNavModeState.ROLL;

    //   switch (this.currentVerticalActiveState) {
    //     case VerticalNavModeState.FLC:
    //       SimVar.SetSimVarValue("K:FLIGHT_LEVEL_CHANGE", "number", 0);
    //       break;
    //     case VerticalNavModeState.ALTCAP:
    //     case VerticalNavModeState.ALTVCAP:
    //     case VerticalNavModeState.ALTSCAP:
    //     case VerticalNavModeState.ALTV:
    //     case VerticalNavModeState.ALTS:
    //     case VerticalNavModeState.ALT:
    //       SimVar.SetSimVarValue("K:AP_PANEL_VS_HOLD", "number", 1);
    //       SimVar.SetSimVarValue("L:WT_CJ4_VS_ON", "number", 0);
    //       Coherent.call("AP_VS_VAR_SET_ENGLISH", 1, 0);
    //       SimVar.SetSimVarValue("K:AP_PANEL_VS_HOLD", "number", 0);
    //       break;
    //     case VerticalNavModeState.VS:
    //     case VerticalNavModeState.PATH:
    //     case VerticalNavModeState.GP:
    //       SimVar.SetSimVarValue("L:WT_CJ4_VS_ON", "number", 0);
    //       SimVar.SetSimVarValue("K:AP_PANEL_VS_HOLD", "number", 0);
    //       break;
    //     case VerticalNavModeState.PTCH:
    //       break;
    //   }
    //   this.currentVerticalActiveState = VerticalNavModeState.PTCH;
    //   if (this.isVNAVOn) {
    //     this.isVNAVOn = false;
    //     SimVar.SetSimVarValue("L:WT_CJ4_VNAV_ON", "number", 0);
    //   }
    //   SimVar.SetSimVarValue("K:VS_SLOT_INDEX_SET", "number", 1);

    // }
  }

  /**
   * Handles when the ALT button is pressed.
   */
  handleAltPressed() {
    switch (this.currentVerticalActiveState) {
      case VerticalNavModeState.TO:
      case VerticalNavModeState.GA:
        SimVar.SetSimVarValue("K:AUTO_THROTTLE_TO_GA", "number", 0);
      case VerticalNavModeState.PTCH:
      case VerticalNavModeState.FLC:
      case VerticalNavModeState.GS:
      case VerticalNavModeState.PATH:
      case VerticalNavModeState.GP:
      case VerticalNavModeState.VS:
        this.engagePitch();
        if (Simplane.getVerticalSpeed() > 500) {
          this.pressureAltitudeTarget = 100 * Math.ceil(Simplane.getAltitude() / 100);
        }
        else if (Simplane.getVerticalSpeed() < -500) {
          this.pressureAltitudeTarget = 100 * Math.floor(Simplane.getAltitude() / 100);
        }
        else {
          this.pressureAltitudeTarget = 100 * Math.round(Simplane.getAltitude() / 100);
        }
        this.currentVerticalActiveState = VerticalNavModeState.ALT;
        Coherent.call("AP_ALT_VAR_SET_ENGLISH", 1, this.pressureAltitudeTarget, true);
        SimVar.SetSimVarValue("L:AP_FLCH_ACTIVE", "number", 0);
        SimVar.SetSimVarValue("L:AP_VNAV_ARMED", "number", 0);
        break;
      case VerticalNavModeState.ALTCAP:
      case VerticalNavModeState.ALTVCAP:
      case VerticalNavModeState.ALTSCAP:
      case VerticalNavModeState.ALTV:
      case VerticalNavModeState.ALTS:
      case VerticalNavModeState.ALT:
        this.currentVerticalActiveState = VerticalNavModeState.PTCH;
        this.engagePitch();
                SimVar.SetSimVarValue("L:AP_VNAV_ARMED", "number", 0);
        break;
    }
    this.activateSpeedMode();
  }

  /**
   * Handles when the VS button is pressed.
   */
  handleVSPressed() {
    if (this.currentVerticalActiveState === VerticalNavModeState.GS) {
      return;
    }
    switch (this.currentVerticalActiveState) {
      case VerticalNavModeState.TO:
      case VerticalNavModeState.GA:
        SimVar.SetSimVarValue("K:AUTO_THROTTLE_TO_GA", "number", 0);
      case VerticalNavModeState.PTCH:
      case VerticalNavModeState.FLC:
      case VerticalNavModeState.ALTCAP:
      case VerticalNavModeState.ALTVCAP:
      case VerticalNavModeState.ALTSCAP:
      case VerticalNavModeState.ALTV:
      case VerticalNavModeState.ALTS:
      case VerticalNavModeState.ALT:
      case VerticalNavModeState.PATH:
      case VerticalNavModeState.GP:
        this.currentVerticalActiveState = VerticalNavModeState.VS;
        this.vnavOff();
        this.engageVerticalSpeed();
        SimVar.SetSimVarValue("L:AP_VS_ACTIVE", "number", 1);
        SimVar.SetSimVarValue("K:SPEED_SLOT_INDEX_SET", "number", 1);
        SimVar.SetSimVarValue("K:AP_MANAGED_SPEED_IN_MACH_OFF", "number", 1);
        SimVar.SetSimVarValue("L:XMLVAR_AirSpeedIsInMach", "bool", 0);
        break;
      case VerticalNavModeState.VS:
      case VerticalNavModeState.GS:
        break;
    }
    this.setProperAltitudeArmedState();
  }

  /**
 * Handles when the FLC button is pressed.
 */
  handleFLCPressed() {
    if (this.currentVerticalActiveState === VerticalNavModeState.GS) {
      return;
    }
    switch (this.currentVerticalActiveState) {
      case VerticalNavModeState.TO:
      case VerticalNavModeState.GA:
        //SimVar.SetSimVarValue("K:AUTO_THROTTLE_TO_GA", "number", 0);
        this.getFLCHSpeed();
        this.vnavOff();
        this.activateThrustMode();
        break;
      case VerticalNavModeState.PTCH:
      case VerticalNavModeState.VS:
      case VerticalNavModeState.ALTCAP:
      case VerticalNavModeState.ALTVCAP:
      case VerticalNavModeState.ALTSCAP:
      case VerticalNavModeState.ALTV:
      case VerticalNavModeState.ALTS:
      case VerticalNavModeState.ALT:
      case VerticalNavModeState.PATH:
      case VerticalNavModeState.GP:
        this.getFLCHSpeed();
        this.vnavOff();
        this.engageFlightLevelChange();
        break;
      case VerticalNavModeState.FLC:
        this.getFLCHSpeed();
        this.vnavOff();
        this.activateThrustMode();
        break;
      case VerticalNavModeState.GS:
        break;
    }
    SimVar.SetSimVarValue("K:SPEED_SLOT_INDEX_SET", "number", 1);
    SimVar.SetSimVarValue("K:AP_MANAGED_SPEED_IN_MACH_OFF", "number", 1);
    SimVar.SetSimVarValue("L:XMLVAR_AirSpeedIsInMach", "bool", 0);
    this.currentVerticalActiveState = VerticalNavModeState.FLC;
    SimVar.SetSimVarValue("L:AP_FLCH_ACTIVE", "number", 1);
    this.setProperAltitudeArmedState();
  }

 /**
  * Determines speed that FLCH should engage with when pushed.
  */
   getFLCHSpeed() {
    const fmcSpeed = SimVar.GetSimVarValue("AUTOPILOT AIRSPEED HOLD VAR:2", "knots");
    const mcpSpeed = SimVar.GetSimVarValue("AUTOPILOT AIRSPEED HOLD VAR:1", "knots");
    const speed = Simplane.getIndicatedSpeed();
     if (this.isVNAVOn) {
       if (SimVar.GetSimVarValue("L:AP_SPEED_INTERVENTION_ACTIVE", "number")) {
        Coherent.call("AP_SPD_VAR_SET", 1, mcpSpeed);
       }
       else if (isFinite(fmcSpeed)) {
        Coherent.call("AP_SPD_VAR_SET", 1, fmcSpeed);
       }
       else {
        Coherent.call("AP_SPD_VAR_SET", 1, speed);
      }
     }
     else {
      Coherent.call("AP_SPD_VAR_SET", 1, speed);
    }
   }

 /**
  * Switches off VNAV Vars.
  */
   vnavOff() {
     this.isVNAVOn = false;
     SimVar.SetSimVarValue("L:WT_CJ4_VNAV_ON", "number", 0);
     SimVar.SetSimVarValue("L:AP_VNAV_ACTIVE", "number", 0);
     SimVar.SetSimVarValue("L:AP_VNAV_ARMED", "number", 0);
     SimVar.SetSimVarValue("L:AP_SPEED_INTERVENTION_ACTIVE", "number", 0);
   }

 /**
  * Handles when the Altitude Intervention Knob is pressed.
  */
   handleAltIntPressed() {
     console.log(this.currentVerticalActiveState)
     switch (this.currentVerticalActiveState) {
       case VerticalNavModeState.ALTCAP:
       case VerticalNavModeState.ALTVCAP:
       case VerticalNavModeState.ALTSCAP:
       case VerticalNavModeState.ALTV:
       case VerticalNavModeState.ALTS:
       case VerticalNavModeState.ALT:
       case VerticalNavModeState.PATH:
        if (this.isVNAVOn) {
          this.currentVerticalActiveState = VerticalNavModeState.FLC;
          this.engageFlightLevelChange();
         }
        break;
       case VerticalNavModeState.FLC:
        break;
     }
     this.setProperAltitudeArmedState();
   }

    /**
  * Handles when the Altitude Intervention Knob is pressed.
  */
     handleAltHoldPressed() {
      if (this.currentVerticalActiveState === VerticalNavModeState.GS) {
        return;
      }
      switch (this.currentVerticalActiveState) {
        case VerticalNavModeState.TO:
        case VerticalNavModeState.GA:
        case VerticalNavModeState.PTCH:
        case VerticalNavModeState.VS:
        case VerticalNavModeState.ALTCAP:
        case VerticalNavModeState.ALTVCAP:
        case VerticalNavModeState.ALTSCAP:
        case VerticalNavModeState.ALTV:
        case VerticalNavModeState.ALTS:
        case VerticalNavModeState.ALT:
        case VerticalNavModeState.PATH:
        case VerticalNavModeState.FLC:
          this.vnavOff();
          SimVar.SetSimVarValue("L:WT_CJ4_VS_ON", "number", 0);
          SimVar.SetSimVarValue("L:WT_CJ4_FLC_ON", "number", 0);
          SimVar.SetSimVarValue("L:AP_FLCH_ACTIVE", "number", 0);
          SimVar.SetSimVarValue("L:AP_VS_ACTIVE", "number", 0);
          SimVar.SetSimVarValue("L:AP_ALT_HOLD_ACTIVE", "number", 1);
          SimVar.SetSimVarValue("K:SPEED_SLOT_INDEX_SET", "number", 1);
          SimVar.SetSimVarValue("K:ALTITUDE_SLOT_INDEX_SET", "number", 1);
          let altitude = Simplane.getAltitude();
          Coherent.call("AP_ALT_VAR_SET_ENGLISH", 1, altitude, this._forceNextAltitudeUpdate);
          this.currentVerticalActiveState = VerticalNavModeState.ALT;
          this.activateSpeedMode();
          break;
        case VerticalNavModeState.GS:
        case VerticalNavModeState.GP:
          break;
      }
    }

  /**
   * Check that VS is active.
   */
   checkVerticalSpeedActive() {
    if (SimVar.GetSimVarValue("AUTOPILOT VERTICAL HOLD", "number") != 1) {
      SimVar.SetSimVarValue("K:AP_PANEL_VS_HOLD", "number", 1);
    }
  }

  /**
   * Engage VS to Slot.
   * @param {number} vsslot is the slot to engage VS with.
   * @param {number} vs is the starting VS value to set.
   */
  engageVerticalSpeed(vsslot = 1, vs = Math.round(Simplane.getVerticalSpeed() / 100) * 100, annunciate = true) {
    if (annunciate) {
      SimVar.SetSimVarValue("L:WT_CJ4_VS_ON", "number", 1);
    } else {
      SimVar.SetSimVarValue("L:WT_CJ4_VS_ON", "number", 0);
    }
    SimVar.SetSimVarValue("L:WT_CJ4_FLC_ON", "number", 0);
    SimVar.SetSimVarValue("K:VS_SLOT_INDEX_SET", "number", vsslot);
    Coherent.call("AP_VS_VAR_SET_ENGLISH", vsslot, vs);
    if (!Simplane.getAutoPilotMachModeActive()) {
      if (!SimVar.GetSimVarValue("AUTOPILOT AIRSPEED HOLD", "Boolean")) {
        SimVar.SetSimVarValue("K:AP_PANEL_SPEED_HOLD", "Number", 1);
      }
    }
    else {
      if (!SimVar.GetSimVarValue("AUTOPILOT MACH HOLD", "Boolean")) {
        SimVar.SetSimVarValue("K:AP_PANEL_MACH_HOLD", "Number", 1);
      }
    }
    SimVar.SetSimVarValue("L:AP_SPD_ACTIVE", "number", 1);
    SimVar.SetSimVarValue("L:AP_ALT_HOLD_ACTIVE", "number", 0);
    SimVar.SetSimVarValue("L:AP_FLCH_ACTIVE", "number", 0);
    this.checkVerticalSpeedActive();
    this.activateSpeedMode();   
  }

  /**
   * Engage Pitch Mode (disengages all other vertical modes).
   */
  engagePitch() {
    //this.checkCorrectAltSlot();
    console.log("SimVar AUTOPILOT PITCH HOLD " + SimVar.GetSimVarValue("AUTOPILOT PITCH HOLD", "Boolean"));
    if (SimVar.GetSimVarValue("AUTOPILOT PITCH HOLD", "Boolean") == 0) {
      if (SimVar.GetSimVarValue("AUTOPILOT VERTICAL HOLD", "number") == 1) {
        SimVar.SetSimVarValue("K:AP_PANEL_VS_HOLD", "number", 0);
      } else if (SimVar.GetSimVarValue("AUTOPILOT FLIGHT LEVEL CHANGE", "Boolean") == 1) {
        SimVar.SetSimVarValue("K:FLIGHT_LEVEL_CHANGE_ON", "Number", 0);
      }
    }
    SimVar.SetSimVarValue("L:WT_CJ4_VS_ON", "number", 0);
    SimVar.SetSimVarValue("L:WT_CJ4_FLC_ON", "number", 0);

    //TODO: ADD APPR MODE AFTER WE INTEGRATE ILS WITH NEW LNAV/VNAV
  }

  /**
   * Engage FLC to Speed.
   * @param {number} speed is the speed to set FLC with.
   */
  engageFlightLevelChange(speed = undefined) {
    SimVar.SetSimVarValue("L:WT_CJ4_FLC_ON", "number", 1);
    SimVar.SetSimVarValue("L:AP_FLCH_ACTIVE", "number", 1);
    SimVar.SetSimVarValue("L:WT_CJ4_VS_ON", "number", 0);
    this.checkCorrectAltSlot();

    if (!SimVar.GetSimVarValue("AUTOPILOT VERTICAL HOLD", "Boolean")) {
      SimVar.SetSimVarValue("K:AP_PANEL_VS_HOLD", "number", 1);
    }
    if (SimVar.GetSimVarValue("AUTOPILOT FLIGHT LEVEL CHANGE", "Boolean")) {
    }
    else if (!SimVar.GetSimVarValue("AUTOPILOT FLIGHT LEVEL CHANGE", "Boolean")) {
      SimVar.SetSimVarValue("K:FLIGHT_LEVEL_CHANGE_ON", "Number", 1);
    }
    SimVar.SetSimVarValue("L:AP_SPD_ACTIVE", "number", 0);
    SimVar.SetSimVarValue("L:AP_VS_ACTIVE", "number", 0);
    SimVar.SetSimVarValue("L:AP_ALT_HOLD_ACTIVE", "number", 0);

    this.activateThrustMode();
  }

  /**
   * Handles when the VNAV button is pressed.
   */
  handleVNAVPressed() {
    if (this.currentVerticalActiveState === VerticalNavModeState.GS) {
      return;
    }
    if (this.currentVerticalActiveState !== VerticalNavModeState.GP && this.currentVerticalActiveState !== VerticalNavModeState.GS) {
      if (Simplane.getIsGrounded()) {
        this.isVNAVOn = !this.isVNAVOn;
      }
      else {
        if (this.isVNAVOn){
          return;
        }
        this.isVNAVOn = true;
        SimVar.SetSimVarValue("K:SPEED_SLOT_INDEX_SET", "number", 2);
      }
      SimVar.SetSimVarValue("L:AP_SPEED_INTERVENTION_ACTIVE", "number", 0);
      SimVar.SetSimVarValue("L:WT_CJ4_VNAV_ON", "number", this.isVNAVOn ? 1 : 0);
      SimVar.SetSimVarValue("L:AP_VNAV_ACTIVE", "number", this.isVNAVOn ? 1 : 0);
      SimVar.SetSimVarValue("L:AP_VNAV_ARMED", "number", this.isVNAVOn ? 1 : 0);
      
      if (SimVar.GetSimVarValue("L:SALTY_VNAV_CLB_MODE", "number") == 1) {
        SimVar.SetSimVarValue("L:SALTY_VNAV_CLB_MODE", "number", 0);
      }
      if (SimVar.GetSimVarValue("L:SALTY_VNAV_CRZ_MODE", "number") == 1) {
        SimVar.SetSimVarValue("L:SALTY_VNAV_CRZ_MODE", "number", 0);
      }
      if (SimVar.GetSimVarValue("L:SALTY_VNAV_DES_MODE", "number") == 1) {
        SimVar.SetSimVarValue("L:SALTY_VNAV_DES_MODE", "number", 0);
      }

      if (this.currentVerticalActiveState === VerticalNavModeState.ALTCAP || this.currentVerticalActiveState === VerticalNavModeState.ALTS
        || this.currentVerticalActiveState === VerticalNavModeState.ALTSCAP || this.currentVerticalActiveState === VerticalNavModeState.ALTV
        || this.currentVerticalActiveState === VerticalNavModeState.ALTVCAP) {
      }
      else if (this.currentVerticalActiveState === VerticalNavModeState.TO || this.currentVerticalActiveState === VerticalNavModeState.GA 
        || this.currentVerticalActiveState === VerticalNavModeState.FLC) {
        this.currentVerticalActiveState = VerticalNavModeState.FLC;
        this.activateThrustMode();
      }
      else {
        this.currentVerticalActiveState = VerticalNavModeState.FLC;
        this.engageFlightLevelChange();
      }
      this.currentAltitudeTracking = AltitudeState.SELECTED;
    }
    this.setProperAltitudeArmedState();
  }

  /**
   * Handles when the active altitude slot changes in the sim.
   */
  handleAltSlotChanged() {
    this.currentAltSlotIndex = this._inputDataStates.altSlot.state;
  }

  /**
   * Handles when the selected altitude in altitude lock slot 1 changes in the sim.
   */
  handleAlt1Changed() {
    if (this._inputDataStates.selectedAlt1.state < 0) {
      this.selectedAlt1 = 0;
      Coherent.call("AP_ALT_VAR_SET_ENGLISH", 1, 0, true);
    } else if (this._inputDataStates.selectedAlt1.state > 45000) {
      this.selectedAlt1 = 45000;
      Coherent.call("AP_ALT_VAR_SET_ENGLISH", 1, 45000, true);
    } else {
      this.selectedAlt1 = this._inputDataStates.selectedAlt1.state;
    }

    switch (this.currentVerticalActiveState) {
      case VerticalNavModeState.ALTV:
      case VerticalNavModeState.ALTS:
      case VerticalNavModeState.ALT:
        this.checkCorrectAltMode();
    }

    //this.setProperAltitudeArmedState();
  }

  /**
   * Handles when the selected altitude in altitude lock slot 2 changes in the sim.
   */
  handleAlt2Changed() {
    this.selectedAlt2 = this._inputDataStates.selectedAlt2.state;
    this.checkCorrectAltMode();
  }

  /**
   * Checks the altitude configuration to set the correct altitude hold type
   * between ALTV (MANAGED), ALTS (SELECTED) and ALT (PRESSURE).
   */
  checkCorrectAltMode() {
    if (this.currentVerticalActiveState === VerticalNavModeState.ALTS || this.currentVerticalActiveState === VerticalNavModeState.ALTV
      || this.currentVerticalActiveState === VerticalNavModeState.ALT) {
      let newValue = VerticalNavModeState.ALT;
      if (Math.floor(this.pressureAltitudeTarget) == Math.floor(this.selectedAlt1)) {
        newValue = VerticalNavModeState.ALTS;
      } else if (Math.floor(this.pressureAltitudeTarget) == Math.floor(this.managedAltitudeTarget)) {
        newValue = VerticalNavModeState.ALTV;
      }
      if (this.currentVerticalActiveState !== newValue) {
        this.currentVerticalActiveState = newValue;
      }
    }
  }

  checkCorrectAltSlot() {
    // if (this.currentVerticalActiveState === VerticalNavModeState.ALTS || this.currentVerticalActiveState === VerticalNavModeState.ALTV 
    //   || this.currentVerticalActiveState === VerticalNavModeState.ALT) {
    //   SimVar.SetSimVarValue("K:ALTITUDE_SLOT_INDEX_SET", "number", 3);
    // } else {
    //   SimVar.SetSimVarValue("K:ALTITUDE_SLOT_INDEX_SET", "number", 2);
    // }
  }

  /**
   * Handles when the pitch ref changes in the sim.
   */
  handleTogaChanged(atOff = false) {
    //SET THROTTLE INTO THR REF
    this.setAPSpeedHoldMode();
    Coherent.call("GENERAL_ENG_THROTTLE_MANAGED_MODE_SET", ThrottleMode.TOGA);
    this.activateThrustRefMode();
    if (Simplane.getIsGrounded()) {
      this.togaPushedForTO = true;
    }

    if (SimVar.GetSimVarValue("L:AIRLINER_FLIGHT_PHASE", "number") === 2) {
      this.setProperAltitudeArmedState();
      return;
    }
    if (this._inputDataStates.toga.state || atOff == true) {
      const flightDirector = SimVar.GetSimVarValue("AUTOPILOT FLIGHT DIRECTOR ACTIVE", "Boolean") == 1;
      if (!flightDirector) {
        SimVar.SetSimVarValue("K:TOGGLE_FLIGHT_DIRECTOR", "number", 1);
      }
      if (Simplane.getIsGrounded()) { //PLANE IS ON THE GROUND?
        this.currentVerticalActiveState = VerticalNavModeState.TO;

        //SET LATERAL
        SimVar.SetSimVarValue("K:HEADING_SLOT_INDEX_SET", "number", 2);
        SimVar.SetSimVarValue("K:AP_PANEL_HEADING_HOLD", "number", 1);
        this.currentLateralActiveState = LateralNavModeState.TO;
      } else {
        if (this.isVNAVOn) {
          this.vnavOff();
          SimVar.SetSimVarValue("K:ALTITUDE_SLOT_INDEX_SET", "number", 2);
          SimVar.SetSimVarValue("K:VS_SLOT_INDEX_SET", "number", 1);
        }
        this.currentVerticalActiveState = VerticalNavModeState.GA;
        
        SimVar.SetSimVarValue("L:AP_APP_ARMED", "bool", 0);
        SimVar.SetSimVarValue("L:AP_LOC_ARMED", "bool", 0);
        SimVar.SetSimVarValue("L:AP_LNAV_ARMED", "bool", 0);
        SimVar.SetSimVarValue("L:AP_FLCH_ACTIVE", "bool", 0);
        SimVar.SetSimVarValue("L:AP_ALT_HOLD_ACTIVE", "number", 0);
        SimVar.SetSimVarValue("L:AP_VS_ACTIVE", "bool", 0);
        SimVar.SetSimVarValue("L:AP_SPD_ACTIVE", "bool", 0);
        SimVar.SetSimVarValue("L:AP_HEADING_HOLD_ACTIVE", "number", 0);

        //SET LATERAL
        if (SimVar.GetSimVarValue("AUTOPILOT HEADING LOCK", "number") != 1) {
          SimVar.SetSimVarValue("K:AP_PANEL_HEADING_HOLD", "number", 1);
        }
        SimVar.SetSimVarValue("K:HEADING_SLOT_INDEX_SET", "number", 2);
        Coherent.call("HEADING_BUG_SET", 2, SimVar.GetSimVarValue('PLANE HEADING DEGREES MAGNETIC', 'Degrees'));
        this.currentLateralActiveState = LateralNavModeState.GA;

        const activeWaypoint = this.flightPlanManager.getActiveWaypoint();
        if (activeWaypoint && activeWaypoint.isRunway) {
          this.flightPlanManager.setActiveWaypointIndex(this.flightPlanManager.getActiveWaypointIndex() + 1);
        }
      }

    } else {
      //SET LATERAL
      if (this.currentLateralActiveState === LateralNavModeState.TO || this.currentLateralActiveState === LateralNavModeState.GA) {
        if (SimVar.GetSimVarValue("L:WT_CJ4_HDG_ON", "number") == 1) {
          SimVar.SetSimVarValue("L:WT_CJ4_HDG_ON", "number", 0);
        }
        if (SimVar.GetSimVarValue("AUTOPILOT HEADING LOCK", "number") == 1) {
          SimVar.SetSimVarValue("K:AP_PANEL_HEADING_HOLD", "number", 0);
          SimVar.SetSimVarValue("K:HEADING_SLOT_INDEX_SET", "number", 1);
        }
        this.currentLateralActiveState = LateralNavModeState.ROLL;
      }
    }
    this.setProperAltitudeArmedState();
  }

  /**
   * Sets the armed vnav state.
   */
  setArmedVnavState(state = false) {
    if (state) {
      if (this.currentArmedVnavState !== state) {
        this.currentArmedVnavState = state;
      }
    } else {
      this.currentArmedVnavState = VerticalNavModeState.NONE;
    }
  }

  /**
   * Sets the armed approach vertical state.
   */
  setArmedApproachVerticalState(state = false) {
    if (state) {
      if (this.currentArmedApproachVerticalState !== state) {
        this.currentArmedApproachVerticalState = state;
      }
    } else {
      this.currentArmedApproachVerticalState = VerticalNavModeState.NONE;
    }
  }

  /**
   * Sets the armed altitude state.
   */
  setArmedAltitudeState(state = false) {
    if (state) {
      if (this.currentArmedAltitudeState !== state) {
        this.currentArmedAltitudeState = state;
      }
    } else {
      this.currentArmedAltitudeState = VerticalNavModeState.NONE;
    }
  }

  /**
   * Sets the proper armed altitude state.
   */
  setProperAltitudeArmedState() {
    // if (this.currentVerticalActiveState === VerticalNavModeState.PATH) {
    //   switch (this.currentAltitudeTracking) {
    //     case AltitudeState.MANAGED:
    //       this.setArmedAltitudeState(VerticalNavModeState.ALTV);
    //       break;
    //     default:
    //       this.setArmedAltitudeState(VerticalNavModeState.ALTS);
    //   }
    // } else if (this.isVNAVOn && (this.currentVerticalActiveState === VerticalNavModeState.VS
    //   || this.currentVerticalActiveState === VerticalNavModeState.FLC)) {
    //   switch (this.currentAltitudeTracking) {
    //     case AltitudeState.MANAGED:
    //       this.setArmedAltitudeState(VerticalNavModeState.ALTV);
    //       break;
    //     default:
    //       this.setArmedAltitudeState(VerticalNavModeState.ALTS);
    //   }
    // } else if (this.currentVerticalActiveState === VerticalNavModeState.VS || this.currentVerticalActiveState === VerticalNavModeState.FLC) {
    //   this.setArmedAltitudeState(VerticalNavModeState.ALTS);
    // } else {
    //   this.setArmedAltitudeState();
    // }
  }

  /**
   * Handles when the HDG button is pressed.
   */
  handleHDGPressed() {
    if (this.currentVerticalActiveState === VerticalNavModeState.GS) {
      return;
    }
    switch (this.currentLateralActiveState) {
      case LateralNavModeState.ROLL:
      case LateralNavModeState.NAV:
        SimVar.SetSimVarValue("L:WT_CJ4_NAV_ON", "number", 0);
        SimVar.SetSimVarValue("L:WT_CJ4_HDG_ON", "number", 1);
        SimVar.SetSimVarValue("K:HEADING_SLOT_INDEX_SET", "number", 1);
        SimVar.SetSimVarValue("K:AP_PANEL_HEADING_HOLD", "number", 1);
        this.currentLateralActiveState = LateralNavModeState.HDG;
        SimVar.SetSimVarValue("L:AP_LNAV_ARMED", "number", 0);
        SimVar.SetSimVarValue("L:AP_LNAV_ACTIVE", "number", 0);
        break;
      case LateralNavModeState.LNAV:
      case LateralNavModeState.HDGHOLD:
      case LateralNavModeState.TO:
      case LateralNavModeState.GA:
        if (SimVar.GetSimVarValue("AUTOPILOT HEADING LOCK", "number") == 0) {
          SimVar.SetSimVarValue("K:AP_PANEL_HEADING_HOLD", "number", 1);
        }
        SimVar.SetSimVarValue("L:WT_CJ4_NAV_ON", "number", 0);
        SimVar.SetSimVarValue("L:WT_CJ4_HDG_ON", "number", 1);
        SimVar.SetSimVarValue("K:HEADING_SLOT_INDEX_SET", "number", 1);
        this.currentLateralActiveState = LateralNavModeState.HDG;
        SimVar.SetSimVarValue("L:AP_LNAV_ARMED", "number", 0);
        SimVar.SetSimVarValue("L:AP_LNAV_ACTIVE", "number", 0);
        SimVar.SetSimVarValue("L:AP_HEADING_HOLD_ACTIVE", "number", 0);
        break;
      case LateralNavModeState.HDG:
      case LateralNavModeState.APPR:
        if (this.approachMode !== WT_ApproachType.ILS) {
          this.cancelApproachMode(false);
          SimVar.SetSimVarValue("K:HEADING_SLOT_INDEX_SET", "number", 1);
          SimVar.SetSimVarValue("L:WT_CJ4_HDG_ON", "number", 1);
          SimVar.SetSimVarValue("L:AP_HEADING_HOLD_ACTIVE", "number", 0);
  
          if (this.approachMode === WT_ApproachType.ILS || this.approachMode === WT_ApproachType.NONE) {
            SimVar.SetSimVarValue("K:AP_PANEL_HEADING_HOLD", "number", 1);
          }
  
          this.currentLateralActiveState = LateralNavModeState.HDG;
        }
        break;
    }
  }
  handleHDGHOLDPressed() {
    if (this.currentVerticalActiveState === VerticalNavModeState.GS) {
      return;
    }
    this._headingHoldValue = Simplane.getHeadingMagnetic();
    switch (this.currentLateralActiveState) {
      case LateralNavModeState.ROLL:
        SimVar.SetSimVarValue("L:WT_CJ4_HDG_ON", "number", 1);
        SimVar.SetSimVarValue("K:HEADING_SLOT_INDEX_SET", "number", 3);
        Coherent.call("HEADING_BUG_SET", 3, this._headingHoldValue);
        SimVar.SetSimVarValue("L:AP_HEADING_HOLD_ACTIVE", "number", 1);
        this.currentLateralActiveState = LateralNavModeState.HDGHOLD;
        break;
      case LateralNavModeState.NAV:
        SimVar.SetSimVarValue("L:WT_CJ4_NAV_ON", "number", 0);
        SimVar.SetSimVarValue("L:WT_CJ4_HDG_ON", "number", 1);
        SimVar.SetSimVarValue("K:HEADING_SLOT_INDEX_SET", "number", 3);
        Coherent.call("HEADING_BUG_SET", 3, this._headingHoldValue);
        SimVar.SetSimVarValue("L:AP_HEADING_HOLD_ACTIVE", "number", 1);
        SimVar.SetSimVarValue("L:AP_LNAV_ARMED", "number", 0);
        SimVar.SetSimVarValue("L:AP_LNAV_ACTIVE", "number", 0);
        this.currentLateralActiveState = LateralNavModeState.HDGHOLD;
        break;
      case LateralNavModeState.LNAV:
      case LateralNavModeState.TO:
      case LateralNavModeState.GA:
        if (SimVar.GetSimVarValue("AUTOPILOT HEADING LOCK", "number") == 0) {
          SimVar.SetSimVarValue("K:AP_PANEL_HEADING_HOLD", "number", 1);
        }
        SimVar.SetSimVarValue("L:WT_CJ4_NAV_ON", "number", 0);
        SimVar.SetSimVarValue("L:WT_CJ4_HDG_ON", "number", 1);
        SimVar.SetSimVarValue("K:HEADING_SLOT_INDEX_SET", "number", 3);
        Coherent.call("HEADING_BUG_SET", 3, this._headingHoldValue);
        SimVar.SetSimVarValue("L:AP_HEADING_HOLD_ACTIVE", "number", 1);
        SimVar.SetSimVarValue("L:AP_LNAV_ARMED", "number", 0);
        SimVar.SetSimVarValue("L:AP_LNAV_ACTIVE", "number", 0);
        this.currentLateralActiveState = LateralNavModeState.HDGHOLD;
        break;
      case LateralNavModeState.HDGHOLD:
      case LateralNavModeState.HDG:
        SimVar.SetSimVarValue("L:WT_CJ4_HDG_ON", "number", 1);
        SimVar.SetSimVarValue("K:HEADING_SLOT_INDEX_SET", "number", 3);
        Coherent.call("HEADING_BUG_SET", 3, this._headingHoldValue);
        SimVar.SetSimVarValue("L:AP_HEADING_HOLD_ACTIVE", "number", 1);
        this.currentLateralActiveState = LateralNavModeState.HDGHOLD;
        break;
      case LateralNavModeState.APPR:
        if (this.approachMode !== WT_ApproachType.ILS) {
          SimVar.SetSimVarValue("K:AP_PANEL_HEADING_HOLD", "number", 1);
          this.cancelApproachMode(false);
          SimVar.SetSimVarValue("K:HEADING_SLOT_INDEX_SET", "number", 1);
          SimVar.SetSimVarValue("L:WT_CJ4_HDG_ON", "number", 1);
          SimVar.SetSimVarValue("K:HEADING_SLOT_INDEX_SET", "number", 3);
          Coherent.call("HEADING_BUG_SET", 3, this._headingHoldValue);
          SimVar.SetSimVarValue("L:AP_HEADING_HOLD_ACTIVE", "number", 1);
          this.currentLateralActiveState = LateralNavModeState.HDGHOLD;
        }
        break;
    }
  }

  /**
   * Handles when the NAV button is pressed.
   */
  handleNAVPressed() {
    if (this.currentVerticalActiveState === VerticalNavModeState.GS) {
      return;
    }
    if (this.currentLateralArmedState !== LateralNavModeState.LNAV) {
      switch (this.currentLateralActiveState) {
        case LateralNavModeState.ROLL:
          SimVar.SetSimVarValue("L:WT_CJ4_NAV_ON", "number", 1);
          this.changeToCorrectLNavForMode(true, true);
          SimVar.SetSimVarValue("L:AP_LNAV_ARMED", "number", 1);
          break;
        case LateralNavModeState.HDG:
        case LateralNavModeState.HDGHOLD:
        case LateralNavModeState.TO:
        case LateralNavModeState.GA:
        case LateralNavModeState.LNAV:
          SimVar.SetSimVarValue("L:WT_CJ4_NAV_ON", "number", 1);
          SimVar.SetSimVarValue("L:WT_CJ4_HDG_ON", "number", 0);
          this.changeToCorrectLNavForMode(false, true);
          SimVar.SetSimVarValue("L:AP_LNAV_ARMED", "number", 1);
          SimVar.SetSimVarValue("L:AP_HEADING_HOLD_ACTIVE", "number", 0);
          break;
        case LateralNavModeState.NAV:
          SimVar.SetSimVarValue("L:AP_LNAV_ARMED", "number", 0);
          break;
        case LateralNavModeState.APPR:
          break;
      }
    } else {
      this.currentLateralArmedState = LateralNavModeState.NONE;
      SimVar.SetSimVarValue("L:AP_LNAV_ARMED", "number", 0);
    }
  }

  /**
   * Handles when the active nav source changes to follow the nav radio.
   */
  handleNAVModeChanged() {
    const value = this._inputDataStates.navmode.state;
    switch (value) {
      case 0:
        this.lNavModeState = LNavModeState.FMS;
        break;
      case 1:
        this.lNavModeState = LNavModeState.NAV1;
        break;
      case 2:
        this.lNavModeState = LNavModeState.NAV2;
        break;
    }

    if (this.currentLateralActiveState === LateralNavModeState.NAV || this.currentLateralActiveState === LateralNavModeState.LNAV) {
      this.changeToCorrectLNavForMode(true, false);
    }
  }

  /**
   * Changes to the correct nav mode given the current LNAV mode state.
   * @param {boolean} activateHeadingHold Whether or not to toggle the heading hold when switching modes.
   * @param {boolean} arm Whether or not to arm LNV1 only.
   */
  changeToCorrectLNavForMode(activateHeadingHold, arm) {
    if (this.lNavModeState === LNavModeState.FMS) {
      if (!arm) {
        SimVar.SetSimVarValue("K:HEADING_SLOT_INDEX_SET", "number", 2);
        if (activateHeadingHold) {
          SimVar.SetSimVarValue("K:AP_PANEL_HEADING_HOLD", "number", 1);
        }
        this.currentLateralActiveState = LateralNavModeState.LNAV;
      } else {
        this.currentLateralArmedState = LateralNavModeState.LNAV;
      }
    } else {
      SimVar.SetSimVarValue("K:HEADING_SLOT_INDEX_SET", "number", 1);
      if (this.lNavModeState === LNavModeState.NAV1) {
        SimVar.SetSimVarValue('K:AP_NAV_SELECT_SET', 'number', 1);
      } else {
        SimVar.SetSimVarValue('K:AP_NAV_SELECT_SET', 'number', 2);
      }

      if (this.currentLateralActiveState !== LateralNavModeState.NAV) {
        const apOnGPS = SimVar.GetSimVarValue('GPS DRIVES NAV1', 'Bool');
        if (apOnGPS) {
          SimVar.SetSimVarValue('K:TOGGLE_GPS_DRIVES_NAV1', 'number', 0);
        }

        SimVar.SetSimVarValue("K:AP_NAV1_HOLD", "number", 1);
      }

      this.currentLateralActiveState = LateralNavModeState.NAV;
    }
  }

  /**
   * Handles when the LOC button is pressed.
   */
  handleLOCPressed() {

    const setProperApprState = () => {
      switch (this.approachMode) {
        case WT_ApproachType.ILS:
        case WT_ApproachType.RNAV:
          this.currentLateralArmedState = this.currentLateralArmedState !== LateralNavModeState.APPR ? LateralNavModeState.APPR : LateralNavModeState.NONE;
          break;
        case WT_ApproachType.NONE:
        case WT_ApproachType.VISUAL:
            const navSource = 3;
            if (SimVar.GetSimVarValue(`NAV HAS LOCALIZER:` + navSource, 'Bool') !== 0) {
              this.currentLateralArmedState = this.currentLateralArmedState !== LateralNavModeState.APPR ? LateralNavModeState.APPR : LateralNavModeState.NONE;
            }
          break;
      }
    };

    switch (this.currentLateralActiveState) {
      case LateralNavModeState.ROLL:
        setProperApprState();
        break;
      case LateralNavModeState.HDG:
      case LateralNavModeState.HDGHOLD:
      case LateralNavModeState.handleFLCPressed:
      case LateralNavModeState.TO:
      case LateralNavModeState.GA:
        SimVar.SetSimVarValue("L:WT_CJ4_HDG_ON", "number", 0);
        SimVar.SetSimVarValue("L:AP_HEADING_HOLD_ACTIVE", "number", 0);
        setProperApprState();
        break;
      case LateralNavModeState.NAV:
        SimVar.SetSimVarValue("L:WT_CJ4_NAV_ON", "number", 0);
        setProperApprState();
        break;
      case LateralNavModeState.LNAV:
        SimVar.SetSimVarValue("L:WT_CJ4_NAV_ON", "number", 0);
        setProperApprState();
        break;
      case LateralNavModeState.APPR:
        break;
    }
  }

  /**
   * Cancels approach mode.
   * @param {boolean} cancelHeadingHold Whether or not to cancel heading mode while disabling approach mode.
   */
  cancelApproachMode(cancelHeadingHold) {
    SimVar.SetSimVarValue("K:HEADING_SLOT_INDEX_SET", "number", 1);

    if (this.approachMode === WT_ApproachType.RNAV && this.approachMode === WT_ApproachType.ILS) {
      this.isVNAVOn = false;
      this.currentVerticalActiveState = VerticalNavModeState.PTCH;

      if (this.glidepathState === GlidepathStatus.GP_ACTIVE || this.glideslopeState === GlideslopeStatus.GS_ACTIVE) {
        SimVar.SetSimVarValue("K:VS_SLOT_INDEX_SET", "number", 1);
        SimVar.SetSimVarValue("K:AP_PANEL_VS_HOLD", "number", 0);
      }

      if (cancelHeadingHold) {
        SimVar.SetSimVarValue("K:AP_PANEL_HEADING_HOLD", "number", 0);
      }
    }
  }

  /**
 * Handles when the altitude lock state has changed.
 */
    handleAltLockChanged() {
    this.isAltitudeLocked = this._inputDataStates.altLocked.state;
    console.log("this.isAltitudeLocked " + this.isAltitudeLocked);

    if (this.isAltitudeLocked) {

      if (this.currentVerticalActiveState === VerticalNavModeState.TO || this.currentVerticalActiveState === VerticalNavModeState.GA) {
        SimVar.SetSimVarValue("K:AUTO_THROTTLE_TO_GA", "number", 0);
      }
      if (this.currentLateralActiveState === LateralNavModeState.TO || this.currentLateralActiveState === LateralNavModeState.GA) {
        if (SimVar.GetSimVarValue("AUTOPILOT HEADING LOCK", "number") == 0) {
          SimVar.SetSimVarValue("K:AP_PANEL_HEADING_HOLD", "number", 1);
          SimVar.SetSimVarValue("K:AP_PANEL_HEADING_HOLD", "number", 0);
        }
        SimVar.SetSimVarValue("L:WT_CJ4_NAV_ON", "number", 0);
        SimVar.SetSimVarValue("L:WT_CJ4_HDG_ON", "number", 0);
        SimVar.SetSimVarValue("K:HEADING_SLOT_INDEX_SET", "number", 1);
        this.currentLateralActiveState = LateralNavModeState.ROLL;
      }

      // switch (this.currentAltitudeTracking) {
      //   case AltitudeState.SELECTED:
      //     this.currentVerticalActiveState = VerticalNavModeState.ALTSCAP;
      //     break;
      //   case AltitudeState.MANAGED:
      //     this.currentVerticalActiveState = VerticalNavModeState.ALTVCAP;
      //     break;
      //   default:
      //     this.currentVerticalActiveState = VerticalNavModeState.ALTCAP;
      //     break;
      // }
    }
  }

  /**
   * Handles when the altitude lock state has changed.
   */
  handleSimAltLockChanged() {
    if (this._inputDataStates.simAltLocked.state === true) {
      console.log("simAltLocked.state === true ");
      switch (this.currentVerticalActiveState) {
        case VerticalNavModeState.TO:
        case VerticalNavModeState.GA:
          SimVar.SetSimVarValue("K:AUTO_THROTTLE_TO_GA", "number", 1);
          break;
        case VerticalNavModeState.PTCH:
          this.engagePitch();
          break;
        case VerticalNavModeState.VS:
          this.engageVerticalSpeed(1);
          break;
        case VerticalNavModeState.ALTCAP:
        case VerticalNavModeState.ALTVCAP:
        case VerticalNavModeState.ALTSCAP:
        case VerticalNavModeState.ALTV:
        case VerticalNavModeState.ALTS:
        case VerticalNavModeState.ALT:
        case VerticalNavModeState.GS:
        case VerticalNavModeState.PATH:
        case VerticalNavModeState.GP:
          this.engageVerticalSpeed(2);
          break;
        case VerticalNavModeState.FLC:
          this.engageFlightLevelChange();
          break;
        }
    }
  }

  /**
   * Handles when the plane has fully captured the assigned lock altitude.
   */
  handleAltCaptured() {
    // if (this.isAltitudeLocked) {

    //   if (this.currentVerticalActiveState === VerticalNavModeState.ALTSCAP || this.currentVerticalActiveState === VerticalNavModeState.ALTVCAP
    //     || this.currentVerticalActiveState === VerticalNavModeState.ALTCAP) {
    //     const altLockValue = Math.floor(Simplane.getAutoPilotDisplayedAltitudeLockValue());
    //     if (altLockValue == Math.floor(this.selectedAlt1)) {
    //       this.currentVerticalActiveState = VerticalNavModeState.ALTS;
    //     } else if (altLockValue == Math.floor(this.selectedAlt2) || altLockValue == Math.floor(this.managedAltitudeTarget)) {
    //       this.currentVerticalActiveState = VerticalNavModeState.ALTV;
    //     } else {
    //       this.currentVerticalActiveState = VerticalNavModeState.ALT;
    //     }
    //   }

    //   if (SimVar.GetSimVarValue("AUTOPILOT VS SLOT INDEX", "number") != 1) {
    //     SimVar.SetSimVarValue("K:VS_SLOT_INDEX_SET", "number", 1);
    //   }
    //   if (SimVar.GetSimVarValue("AUTOPILOT ALTITUDE SLOT INDEX", "number") != 3) {
    //     SimVar.SetSimVarValue("K:ALTITUDE_SLOT_INDEX_SET", "number", 3);
    //   }

    //   //MOVED SETTING 0 VS rates from ALT CAP TO ALT CAPTURED
    //   if (SimVar.GetSimVarValue("AUTOPILOT VERTICAL HOLD VAR:1", "feet per minute") != 0) {
    //     Coherent.call("AP_VS_VAR_SET_ENGLISH", 1, 0);
    //   }
    //   if (SimVar.GetSimVarValue("AUTOPILOT VERTICAL HOLD VAR:2", "feet per minute") != 0) {
    //     Coherent.call("AP_VS_VAR_SET_ENGLISH", 2, 0);
    //   }
    // }
  }

  /**
   * Handles when autopilot heading lock changes.
   */
  handleHeadingLockChanged() {
    const isLocked = this._inputDataStates.hdg_lock.state;
    if (!isLocked) {
      switch (this.currentLateralActiveState) {
        case LateralNavModeState.APPR:
          if (this.approachMode === WT_ApproachType.RNAV || this.approachMode === WT_ApproachType.VISUAL) {
            SimVar.SetSimVarValue('K:AP_PANEL_HEADING_HOLD', 'number', 1);
          }
          break;
        case LateralNavModeState.LNAV:
          if (SimVar.GetSimVarValue("AUTOPILOT APPROACH ARM", "bool") !== 1 && SimVar.GetSimVarValue("AUTOPILOT GLIDESLOPE ARM", "bool") !== 1) {
            SimVar.SetSimVarValue('K:AP_PANEL_HEADING_HOLD', 'number', 1);
          }
          break;
        case LateralNavModeState.HDG:
          if (SimVar.GetSimVarValue("AUTOPILOT APPROACH ARM", "bool") !== 1 && SimVar.GetSimVarValue("AUTOPILOT GLIDESLOPE ARM", "bool") !== 1) {
            SimVar.SetSimVarValue('K:AP_PANEL_HEADING_HOLD', 'number', 1);
          }
          break;
      }
    }
  }

  /**
   * Handles when the Glidepath state changes.
   */
  handleGPGSActivate() {

    if (this.glidepathState === GlidepathStatus.GP_ACTIVE && !SimVar.GetSimVarValue("AUTOPILOT VERTICAL HOLD", "Boolean")) {
      SimVar.SetSimVarValue("K:AP_PANEL_VS_HOLD", "number", 1);
    } else if (this.glideslopeState === GlideslopeStatus.GS_ACTIVE) {
      SimVar.SetSimVarValue("K:AP_APR_HOLD_ON", "bool", 1);
    }
    SimVar.SetSimVarValue("L:AP_VNAV_ARMED", "number", 0);
    SimVar.SetSimVarValue("L:AP_FLCH_ACTIVE", "number", 0);
    SimVar.SetSimVarValue("L:AP_VS_ACTIVE", "number", 0);
    SimVar.SetSimVarValue("L:AP_ALT_HOLD_ACTIVE", "number", 0);
    this.activateSpeedMode();
  }

  /**
   * Handles when the VPath state changes.
   */
  handleVPathActivate() {

    switch (this.vPathState) {
      case VnavPathStatus.PATH_ACTIVE:
        if (!SimVar.GetSimVarValue("AUTOPILOT VERTICAL HOLD", "Boolean")) {
          SimVar.SetSimVarValue("K:AP_PANEL_VS_HOLD", "number", 1);
        }
        this.activateSpeedMode();
        break;
    }
  }

  /**
   * Handles when the currently loaded approach has been changed.
   */
  handleApproachChanged() {

    let approach = undefined;

    const flightPlan = this.flightPlanManager.getFlightPlan(0);
    const destination = flightPlan.destinationAirfield;
    if (destination) {
      approach = destination.infos.approaches[flightPlan.procedureDetails.approachIndex];
    }

    const approachName = approach ? approach.name : '';

    if (approachName.startsWith('RN') || (approachName.startsWith('NDB') 
    || (approachName.startsWith('LOC') || (approachName.startsWith('VOR'))))) {
      this.approachMode = WT_ApproachType.RNAV;
      if (this.currentLateralActiveState === LateralNavModeState.APPR) {
        this.isVNAVOn = false;
      }

      if (this.currentVerticalActiveState === VerticalNavModeState.GS) {
        this.currentVerticalActiveState = VerticalNavModeState.GP;
      }

      // if (this.currentArmedVnavState === VerticalNavModeState.GS) {
      //   this.currentArmedVnavState = VerticalNavModeState.GP;
      // }
    } else if (approachName.startsWith('ILS') || approachName.startsWith('LDA')) {
      this.approachMode = WT_ApproachType.ILS;
      if (this.currentLateralActiveState === LateralNavModeState.APPR) {
        this.isVNAVOn = false;
      }

      if (this.currentVerticalActiveState === VerticalNavModeState.GP) {
        this.currentVerticalActiveState = VerticalNavModeState.GS;
      }
    } else {
      this.approachMode = WT_ApproachType.NONE;
    }
  }

  /**
   * Handles when vnav autopilot requests alt slot 1 in the sim autopilot.
   * @param {boolean} force set to true to force the slot even if in one of the protected ALT states.
   */
  handleVnavRequestSlot1(force = false) {
    this.currentAltitudeTracking = AltitudeState.SELECTED;
    if (force) {
      console.log("forcing alt slot 2");
      this.setSimAltSlot(1);
    }
  }

  /**
   * Handles when vnav autopilot requests alt slot 2 in the sim autopilot.
   * @param {boolean} force set to true to force the slot even if in one of the protected ALT states.
   */
  handleVnavRequestSlot2(force = false) {
    this.currentAltitudeTracking = AltitudeState.MANAGED;
    if (force) {
      console.log("forcing alt slot 2");
      this.setSimAltSlot(2);
    }
  }

  /**
   * Handles when vnav autopilot requests alt slot 3 in the sim autopilot.
   * @param {boolean} force set to true to force the slot even if in one of the protected ALT states.
   */
  handleVnavRequestSlot3(force = false) {
    this.currentAltitudeTracking = AltitudeState.LOCKED;
    if (force) {
      console.log("forcing alt slot 3");
      this.setSimAltSlot(3);
    }
  }

  /**
   * Method to actually set the altitude slot (added with WT Altitude Manager).
   */
  setSimAltSlot(slot) {
    SimVar.SetSimVarValue("K:ALTITUDE_SLOT_INDEX_SET", "number", slot);
  }

  /**
   * Method to actually set the altitude slot (added with WT Altitude Manager).
   */
  setSimAltitude(slot, altitude) {
    Coherent.call("AP_ALT_VAR_SET_ENGLISH", slot, altitude, true);
  }

  /**
   * Method to actually set the altitude slot (added with WT Altitude Manager).
   */
  cancelAltHold() {
    this.setSimAltitude(2, -5000);
    this.setSimAltSlot(2);
  }  

  /**
   * Handles when FD is turned off to cancel vertical and lateral modes.
   * On ground, sets TO/GA roll and pitch modes.
   * In air, sets HDG HOLD and V/S modes.
   */
   handleFdToggle() {
     const apOn = SimVar.GetSimVarValue("AUTOPILOT MASTER", "boolean");
     const fdOn = SimVar.GetSimVarValue("AUTOPILOT FLIGHT DIRECTOR ACTIVE", "Boolean");
     if (!apOn && fdOn) {
       switch (this.currentLateralActiveState) {
         case LateralNavModeState.ROLL:
           break;
         case LateralNavModeState.HDG:
           if (SimVar.GetSimVarValue("AUTOPILOT HEADING LOCK", "number") == 1) {
             SimVar.SetSimVarValue("K:AP_PANEL_HEADING_HOLD", "number", 0);
           }
           SimVar.SetSimVarValue("L:WT_CJ4_HDG_ON", "number", 0);
           SimVar.SetSimVarValue("K:HEADING_SLOT_INDEX_SET", "number", 1);
           break;
         case LateralNavModeState.TO:
         case LateralNavModeState.GA:
           break;
         case LateralNavModeState.NAV:
           SimVar.SetSimVarValue("L:WT_CJ4_NAV_ON", "number", 0);
           SimVar.SetSimVarValue("K:HEADING_SLOT_INDEX_SET", "number", 1);
           SimVar.SetSimVarValue("K:AP_NAV1_HOLD", "number", 0);
           break;
         case LateralNavModeState.LNAV:
           SimVar.SetSimVarValue("L:WT_CJ4_NAV_ON", "number", 0);
           SimVar.SetSimVarValue("K:HEADING_SLOT_INDEX_SET", "number", 1);
           SimVar.SetSimVarValue("K:AP_PANEL_HEADING_HOLD", "number", 0);
           break;
         case LateralNavModeState.APPR:
           this.cancelApproachMode(true);
           SimVar.SetSimVarValue("L:WT_CJ4_NAV_ON", "number", 0);
           SimVar.SetSimVarValue("K:HEADING_SLOT_INDEX_SET", "number", 1);
           SimVar.SetSimVarValue("K:AP_PANEL_HEADING_HOLD", "number", 0);
           break;
       }
       SimVar.SetSimVarValue("L:AP_APP_ARMED", "bool", 0);
       SimVar.SetSimVarValue("L:AP_LOC_ARMED", "bool", 0);
       SimVar.SetSimVarValue("L:AP_VNAV_ARMED", "bool", 0);
       SimVar.SetSimVarValue("L:AP_VNAV_ACTIVE", "bool", 0);
       SimVar.SetSimVarValue("L:AP_LNAV_ACTIVE", "bool", 0);
       SimVar.SetSimVarValue("L:AP_LNAV_ARMED", "bool", 0);
       SimVar.SetSimVarValue("K:TOGGLE_FLIGHT_DIRECTOR", "number", 0);
     } else {
       SimVar.SetSimVarValue("K:TOGGLE_FLIGHT_DIRECTOR", "number", 1);
       if (Simplane.getIsGrounded()) {
         this.currentVerticalActiveState = VerticalNavModeState.TO;
         this.currentLateralActiveState = LateralNavModeState.TO;
         this.currentLateralArmedState = LateralNavModeState.NONE;
       }
       else {
         this.currentVerticalActiveState = VerticalNavModeState.VS;
         this.engageVerticalSpeed();
         this.currentLateralActiveState = LateralNavModeState.HDGHOLD;
       }
       this.currentArmedAltitudeState = VerticalNavModeState.NONE;
       this.currentArmedVnavState = VerticalNavModeState.NONE;
       this.currentArmedApproachVerticalState = VerticalNavModeState.NONE;
       this.isVNAVOn = false;
     }
   }

   activateThrustMode() {
     let mcpAlt = Simplane.getAutoPilotDisplayedAltitudeLockValue();
     let altitude = Simplane.getAltitude();
     if (mcpAlt > altitude) {
      if (this.isVNAVOn) {
        if (this.currentAutoThrottleStatus !== AutoThrottleModeState.THRREF)  {
          this.activateThrustRefMode();
        }
        return;
      }
      this.currentAutoThrottleStatus = AutoThrottleModeState.THR;
      SimVar.SetSimVarValue("K:AP_N1_REF_SET", "number", 80);
      SimVar.SetSimVarValue("K:AP_N1_HOLD", "bool", 1);
     }
     else if (mcpAlt < altitude) {
        setTimeout(() => {
          if (this.currentAutoThrottleStatus === AutoThrottleModeState.THR || this.currentAutoThrottleStatus === AutoThrottleModeState.IDLE) {
            this.handleThrottleToHold();
          }
        }, 20000);
        if (this.isEarlyDescent === true) {
          SimVar.SetSimVarValue("K:AP_N1_REF_SET", "number", 47.5);
          SimVar.SetSimVarValue("K:AP_N1_HOLD", "bool", 1);
          this.isEarlyDescent = false;
          }
        else {
          this.activateIdleMode();
        }
      }
    }

   activateSpeedMode() {
     let slot = 1;
     if (this.isVNAVOn) {
      slot = 2;
     }
     this.currentAutoThrottleStatus = AutoThrottleModeState.SPD;
     SimVar.SetSimVarValue("K:AP_N1_HOLD", "bool", 0);
     SimVar.SetSimVarValue("L:AP_SPD_ACTIVE", "number", 1);
     if (Simplane.getAutoPilotMachModeActive()) {
       let currentMach = Simplane.getAutoPilotMachHoldValue();
       Coherent.call("AP_MACH_VAR_SET", slot, currentMach);
       SimVar.SetSimVarValue("K:AP_MANAGED_SPEED_IN_MACH_ON", "number", 1);
     }
     else {
       let currentSpeed = Simplane.getAutoPilotAirspeedHoldValue();
       Coherent.call("AP_SPD_VAR_SET", slot, currentSpeed);
       SimVar.SetSimVarValue("K:AP_MANAGED_SPEED_IN_MACH_OFF", "number", 1);
     }
     this.setAPSpeedHoldMode();
     Coherent.call("GENERAL_ENG_THROTTLE_MANAGED_MODE_SET", ThrottleMode.AUTO);
     SimVar.SetSimVarValue("K:AP_PANEL_SPEED_ON", "Number", 1);	
   }

   activateThrustRefMode() {
     this.currentAutoThrottleStatus = AutoThrottleModeState.THRREF;
     Coherent.call("GENERAL_ENG_THROTTLE_MANAGED_MODE_SET", ThrottleMode.CLIMB);
     SimVar.SetSimVarValue("K:AP_N1_REF_SET", "number", 90);
     SimVar.SetSimVarValue("K:AP_N1_HOLD", "bool", 1);
   }

   handleThrottleToHold() {
     this.currentAutoThrottleStatus = AutoThrottleModeState.HOLD;
     if(SimVar.GetSimVarValue("L:AIRLINER_FLIGHT_PHASE", "number") !== 2) {
        SimVar.SetSimVarValue("K:AP_N1_HOLD", "bool", 0);
     }
     Coherent.call("GENERAL_ENG_THROTTLE_MANAGED_MODE_SET", ThrottleMode.HOLD);
   }

   activateIdleMode() {
     this.currentAutoThrottleStatus = AutoThrottleModeState.IDLE;
     SimVar.SetSimVarValue("K:AP_N1_REF_SET", "number", 23.2);
     SimVar.SetSimVarValue("K:AP_N1_HOLD", "bool", 1);
   }

   setAPSpeedHoldMode() {
    if (!Simplane.getAutoPilotMachModeActive()) {
        if (!SimVar.GetSimVarValue("AUTOPILOT AIRSPEED HOLD", "Boolean")) {
            SimVar.SetSimVarValue("K:AP_PANEL_SPEED_HOLD", "Number", 1);
        }
    }
    else {
        if (!SimVar.GetSimVarValue("AUTOPILOT MACH HOLD", "Boolean")) {
            SimVar.SetSimVarValue("K:AP_PANEL_MACH_HOLD", "Number", 1);
        }
    }
}
}

class AutoThrottleModeState { }
AutoThrottleModeState.NONE = 'NONE';
AutoThrottleModeState.THRREF = 'THRREF';
AutoThrottleModeState.THR = 'THR';
AutoThrottleModeState.SPD = 'SPD';
AutoThrottleModeState.IDLE = 'IDLE';
AutoThrottleModeState.HOLD = 'HOLD';

class LateralNavModeState { }
LateralNavModeState.NONE = 'NONE';
LateralNavModeState.ROLL = 'ROLL';
LateralNavModeState.LNAV = 'LNV1';
LateralNavModeState.NAV = 'NAV';
LateralNavModeState.HDG = 'HDG';
LateralNavModeState.APPR = 'APPR';
LateralNavModeState.TO = 'TO';
LateralNavModeState.GA = 'GA';
LateralNavModeState.HDGHOLD = 'HDGHOLD';

class VerticalNavModeState { }
VerticalNavModeState.NONE = 'NONE';
VerticalNavModeState.PTCH = 'PTCH';
VerticalNavModeState.FLC = 'FLC';
VerticalNavModeState.VS = 'VS';
VerticalNavModeState.GS = 'GS';
VerticalNavModeState.GP = 'GP';
VerticalNavModeState.ALT = 'ALT';
VerticalNavModeState.ALTCAP = 'ALT CAP';
VerticalNavModeState.ALTS = 'ALTS';
VerticalNavModeState.ALTSCAP = 'ALTS CAP';
VerticalNavModeState.ALTV = 'ALTV';
VerticalNavModeState.ALTVCAP = 'ALTV CAP';
VerticalNavModeState.PATH = 'PATH';
VerticalNavModeState.NOPATH = 'NOPATH';
VerticalNavModeState.TO = 'TO';
VerticalNavModeState.GA = 'GA';

class LNavModeState { }
LNavModeState.FMS = 'fms';
LNavModeState.NAV1 = 'nav1';
LNavModeState.NAV2 = 'nav2';

class NavModeEvent { }
NavModeEvent.ALT_LOCK_CHANGED = 'alt_lock_changed';
NavModeEvent.SIM_ALT_LOCK_CHANGED = 'sim_alt_lock_changed';
NavModeEvent.ALT_CAPTURED = 'alt_captured';
NavModeEvent.NAV_PRESSED = 'NAV_PRESSED';
NavModeEvent.NAV_MODE_CHANGED = 'nav_mode_changed_to_nav';
NavModeEvent.NAV_MODE_CHANGED_TO_FMS = 'nav_mode_changed_to_fms';
NavModeEvent.HDG_PRESSED = 'HDG_PRESSED';
NavModeEvent.HDG_HOLD_PRESSED = 'HDG_HOLD_PRESSED';
NavModeEvent.LOC_PRESSED = 'LOC_PRESSED';
NavModeEvent.FLC_PRESSED = 'FLC_PRESSED';
NavModeEvent.ALT_INT_PRESSED = 'ALT_INT_PRESSED';
NavModeEvent.ALT_HOLD_PRESSED = 'ALT_HOLD_PRESSED';
NavModeEvent.VS_PRESSED = 'VS_PRESSED';
NavModeEvent.BC_PRESSED = 'BC_PRESSED';
NavModeEvent.VNAV_PRESSED = 'VNAV_PRESSED';
NavModeEvent.ALT_SLOT_CHANGED = 'alt_slot_changed';
NavModeEvent.SELECTED_ALT1_CHANGED = 'selected_alt1_changed';
NavModeEvent.SELECTED_ALT2_CHANGED = 'selected_alt2_changed';
NavModeEvent.APPROACH_CHANGED = 'approach_changed';
NavModeEvent.VNAV_REQUEST_SLOT_1 = 'vnav_request_slot_1';
NavModeEvent.VNAV_REQUEST_SLOT_2 = 'vnav_request_slot_2';
NavModeEvent.HDG_LOCK_CHANGED = 'hdg_lock_changed';
NavModeEvent.TOGA_CHANGED = 'toga_changed';
NavModeEvent.GROUNDED = 'grounded';
NavModeEvent.PATH_NONE = 'path_none';
NavModeEvent.PATH_ARM = 'path_arm';
NavModeEvent.PATH_ACTIVE = 'path_active';
NavModeEvent.GP_NONE = 'gp_none';
NavModeEvent.GP_ARM = 'gp_arm';
NavModeEvent.GP_ACTIVE = 'gp_active';
NavModeEvent.GS_NONE = 'gs_none';
NavModeEvent.GS_ARM = 'gs_arm';
NavModeEvent.GS_ACTIVE = 'gs_active';
NavModeEvent.AP_CHANGED = 'ap_changed';
NavModeEvent.AT_CHANGED = 'at_changed';
NavModeEvent.LOC_ACTIVE = 'loc_active';
NavModeEvent.LNAV_ACTIVE = 'lnav_active';
NavModeEvent.FD_TOGGLE = 'FD_TOGGLE';
NavModeEvent.ALT_PRESSED = 'ALT_PRESSED';
NavModeEvent.THROTTLE_TO_HOLD = 'throttle_to_hold';

class WT_ApproachType { }
WT_ApproachType.NONE = 'none';
WT_ApproachType.ILS = 'ils';
WT_ApproachType.RNAV = 'rnav';
WT_ApproachType.VISUAL = 'visual';

class AltitudeState { }
AltitudeState.SELECTED = 'SELECTED';
AltitudeState.MANAGED = 'MANAGED';
AltitudeState.PRESSURE = 'PRESSURE';
AltitudeState.LOCKED = 'LOCKED';
AltitudeState.NONE = 'NONE';

class ValueStateTracker {
  constructor(valueGetter, handler) {
    this._valueGetter = valueGetter;
    this._currentState = 0;
    this._handler = handler;
  }

  /** @type {any} */
  get state() {
    return this._currentState;
  }

  updateState() {
    const value = this._valueGetter();
    const isChanged = value !== this._currentState;

    this._currentState = value;
    if (isChanged) {
      return this._handler(value);
    }
  }
}
