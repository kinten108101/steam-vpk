import Gtk from 'gi://Gtk';

import {
  GtkChildren,
  GtkTemplate,
  registerClass,
} from '../steam-vpk-utils/utils.js';
import { APP_RDNN } from '../utils/const.js';

export class ArchiveListRow extends Gtk.ListBoxRow {
  static [GtkTemplate] =
`resource://${APP_RDNN}/ui/addon-details-archive-list-row.ui`;
  static [GtkChildren] = ['title'];

  static {
    registerClass({}, this);
  }

  title!: Gtk.Label;
}
