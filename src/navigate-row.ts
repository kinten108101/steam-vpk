import Adw from 'gi://Adw';

import { registerClass } from './utils.js';
import { APP_RDNN } from './const';

registerClass({
  GTypeName: 'StvpkNavigateRow',
  Template: `resource://${APP_RDNN}/ui/navigate-row.ui`,
}, class extends Adw.ActionRow {});
