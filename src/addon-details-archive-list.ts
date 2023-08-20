import GObject from 'gi://GObject';
import Gtk from 'gi://Gtk';

import { GtkChildren, GtkTemplate, param_spec_string, registerClass } from './steam-vpk-utils/utils.js';
import { APP_RDNN } from './const.js';

export class ArchiveListObj extends GObject.Object {
  static [GObject.properties] = {
    name: param_spec_string({ name: 'name' }),
  };

  static {
    registerClass({}, this);
  }

  [child: string]: any;
}

export class ArchiveListRow extends Gtk.ListBoxRow {
  static [GtkTemplate] = `resource://${APP_RDNN}/ui/addon-details-archive-list-row.ui`;
  static [GtkChildren] = ['title'];

  static {
    registerClass({}, this);
  }

  [child: string]: any;

  get_typed_template_child<T extends GObject.Object>(name: string): T | undefined {
    return this[name] as T | undefined;
  }
}
