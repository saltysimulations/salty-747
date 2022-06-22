import { NumberUnitSubject, Subject, Subscribable, UnitType } from '../../..';
import { WxrMode } from '../../bing';
import { AbstractMapModule } from './AbstractMapModule';

/**
 * A map data module that handles a horizontal sweeping weather radar display
 * parameters.
 */
export class MapWxrModule extends AbstractMapModule {
  /** Whether or not the weather radar is enable */
  public enabled = Subject.create(false);

  /** The current map weather radar arc sweep angle in degrees. */
  public weatherRadarArc = NumberUnitSubject.createFromNumberUnit(UnitType.DEGREE.createNumber(90));

  /** The current weather radar mode. */
  public weatherRadarMode = Subject.create<EWeatherRadar.HORIZONTAL | EWeatherRadar.VERTICAL | EWeatherRadar.TOPVIEW>(EWeatherRadar.HORIZONTAL);

  private _wxrMode = Subject.create<WxrMode>({
    mode: this.enabled.get() ? this.weatherRadarMode.get() : EWeatherRadar.OFF,
    arcRadians: this.weatherRadarArc.get().asUnit(UnitType.RADIAN),
  });

  /**
   * A subscribable containing the combined WxrMode from the mode and arc subjects,
   * suitable for consumption in a MapBingLayer.
   * @returns The WxrMode subscribable.
   */
  public get wxrMode(): Subscribable<WxrMode> {
    return this._wxrMode;
  }

  /** @inheritdoc */
  public onInstall(): void {
    this.enabled.sub(v => {
      this._wxrMode.get().mode = v ? this.weatherRadarMode.get() : EWeatherRadar.OFF;
      this._wxrMode.notify();
    });

    this.weatherRadarArc.sub(v => {
      this._wxrMode.get().arcRadians = v.asUnit(UnitType.RADIAN);
      this._wxrMode.notify();
    });

    this.weatherRadarMode.sub(v => {
      this._wxrMode.get().mode = this.enabled.get() ? v : EWeatherRadar.OFF;
      this._wxrMode.notify();
    });
  }
}