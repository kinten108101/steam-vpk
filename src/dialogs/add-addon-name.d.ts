import Adw from 'gi://Adw';
import { AsyncSignalMethods } from "../utils/async-signals";

type Signals = 'setup';

export default interface AddAddonName extends AsyncSignalMethods<Signals> {
  connect_signal(signal: 'setup', callback: ($obj: this) => Promise<boolean>): ($obj: this) => Promise<boolean>;
  _emit_signal(signal: 'setup'): Promise<boolean>;
}

export default class extends Adw.Window {}
