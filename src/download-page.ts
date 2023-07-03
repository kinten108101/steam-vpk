import Gtk from 'gi://Gtk?version=4.0';

import { Config } from './config.js';
import { gobjectClass } from './utils/decorator.js';

@gobjectClass({
  Template: `resource://${Config.config.app_rdnn}/ui/download-page-row.ui`,
})
export class DownloadPageRow extends Gtk.ListBoxRow {

}

@gobjectClass({
  Template: `resource://${Config.config.app_rdnn}/ui/download-page.ui`,
})
export class DownloadPage extends Gtk.Box {

}
