import GObject from 'gi://GObject';
import Adw from 'gi://Adw';
import { UseSensitivitySemaphore, UseVisiblitySemaphore } from '../utils/use-semaphore.js';

export class ActionRow extends UseVisiblitySemaphore(UseSensitivitySemaphore(Adw.ActionRow)) {
  static {
    GObject.registerClass({
      GTypeName: 'StvpkActionRow',
    }, this);
  }
}

export class PreferencesRow extends UseSensitivitySemaphore(UseVisiblitySemaphore(Adw.PreferencesRow)) {
  static {
    GObject.registerClass({
      GTypeName: 'StvpkPreferencesRow',
    }, this);
  }
}
