import { UserSettingManager, UserSettingType } from '../../../settings';
import { Subject } from '../../../sub/Subject';
import { MapSystemContext } from '../MapSystemContext';
import { MapModuleSubjectKeys } from './MapModule';

/**
 * A data module for the map system that provides subscribable data.
 */
export abstract class AbstractMapModule {

  /** Whether or not this data module is currently syncing. */
  public isSyncing = false;

  /**
   * Creates an instance of a MapModule.
   * @param mapSystemContext The map system context that will be used by this module.
   */
  constructor(protected readonly mapSystemContext = MapSystemContext.Empty) { }

  /**
   * The list of IDs of other modules that are required by this data module.
   * @returns A list of other required data modules' IDs.
   */
  public requirements(): string[] {
    return [];
  }

  /**
   * Binds a peice of module data to a user setting via a settings manager.
   * @param dataKey The key of the data in this module to bind.
   * @param manager The settings manager to use to bind the setting.
   * @param settingKey The key of the setting to bind to the data.
   */
  public bindSetting<K extends MapModuleSubjectKeys<this, T[S]>, T extends Record<any, UserSettingType>, S extends keyof T>(
    dataKey: K, manager: UserSettingManager<T>, settingKey: S): void {

    const sub = this[dataKey] as unknown as Subject<T[S]>;
    sub.sub((v: T[S]) => manager.getSetting(settingKey).value = v);
    manager.whenSettingChanged(settingKey).handle((v: T[S]) => sub.set(v));
  }

  /**
   * Called when the module is installed into the map system.
   */
  public onInstall(): void { /* noop */ }

  /**
   * Starts the synchronization of module data from the event bus or other sources.
   */
  public startSync(): void {
    this.isSyncing = true;
  }

  /**
   * Stops the synchronization of module data from the event bus or other sources.
   */
  public stopSync(): void {
    this.isSyncing = false;
  }
}