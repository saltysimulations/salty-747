import { Subject } from '../../..';
import { UserSettingManager, UserSettingType } from '../../../settings';

/**
 * A data module for the map system that provides subscribable data.
 */
export interface MapModule {
  /** Whether or not the map module is presently syncing. */
  isSyncing: boolean;

  /**
   * The list of IDs of other modules that are required by this data module.
   * @returns A list of other required data modules' IDs.
   */
  requirements(): string[];

  /**
   * Binds a peice of module data to a user setting via a settings manager.
   * @param dataKey The key of the data in this module to bind.
   * @param manager The settings manager to use to bind the setting.
   * @param settingKey The key of the setting to bind to the data.
   */
  bindSetting<K extends MapModuleSubjectKeys<this, T[S]>, T extends Record<any, UserSettingType>, S extends keyof T>(
    dataKey: K, manager: UserSettingManager<T>, settingKey: S): void;

  /**
   * Called when the module is installed into the map system.
   */
  onInstall(): void;

  /**
   * Starts the synchronization of module data from the event bus or other sources.
   */
  startSync(): void;

  /**
   * Stops the synchronization of module data from the event bus or other sources.
   */
  stopSync(): void;
}

/**
 * A set of keys in a map data module that have subject values.
 */
export type MapModuleSubjectKeys<T, U> = Extract<keyof {
  [K in keyof T as T[K] extends Subject<U> ? K : never]: T[K]
}, string>
