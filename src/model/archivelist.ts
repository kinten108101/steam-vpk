import GObject from 'gi://GObject';
import {
  param_spec_string,
  registerClass,
} from '../steam-vpk-utils/utils.js';

export class ArchiveListObj extends GObject.Object {
  static [GObject.properties] = {
    name: param_spec_string({ name: 'name' }),
  };

  static {
    registerClass({}, this);
  }

  [child: string]: any;
}
