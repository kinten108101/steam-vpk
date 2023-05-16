import Gio from 'gi://Gio';
import { SCHEMA_ID } from './const';

const LAST_PROFILE = 'last-profile';

let _settingsManager: SettingsManager | null = null;

export function getSettingsManager(): SettingsManager {
  if (_settingsManager === null ) throw new Error('Have not init Settings Manager!');
  return _settingsManager;
}

export function initSettingsManager(): void {
  // Was having with schema, why it was not recognized. Turns out the xml was faulty, the blob was compiled only halfway. Wtf was the test for??
  if (_settingsManager !== null ) throw new Error('Cannot reinit Settings Manager!');
  _settingsManager = new SettingsManager;
}

export class SettingsManager {
  private _gsettings !: Gio.Settings;

  constructor() {
    this._gsettings = new Gio.Settings({
      schema_id: SCHEMA_ID,
    });
  }

}


