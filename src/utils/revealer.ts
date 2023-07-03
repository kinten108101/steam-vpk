import GObject from 'gi://GObject';
import Gtk from 'gi://Gtk';

import { gobjectClass, gobjectProp } from './decorator.js';

@gobjectClass({
  GTypeName: 'Gtk1Revealer',
  Properties: {
    'xTransitionType': GObject.ParamSpec.string(
      'xTransitionType', 'xTransitionType', 'xTransitionType',
      GObject.ParamFlags.READWRITE, 'GTK_REVEALER_TRANSITION_TYPE_NON'),
  },
})
export class Revealer extends Gtk.Revealer {
  @gobjectProp xTransitionType!: string;

  constructor(param = {}) {
    super(param);
    console.log(this.xTransitionType);
    const transitionType = String(this.xTransitionType);
    switch (transitionType) {
    case 'GTK_REVEALER_TRANSITION_TYPE_NONE':
      this.set_transition_type(Gtk.RevealerTransitionType.NONE);
      break;
    case 'GTK_REVEALER_TRANSITION_TYPE_CROSSFADE':
      this.set_transition_type(Gtk.RevealerTransitionType.CROSSFADE);
      break;
    case 'GTK_REVEALER_TRANSITION_TYPE_SLIDE_RIGHT':
      this.set_transition_type(Gtk.RevealerTransitionType.SLIDE_RIGHT);
      break;
    case 'GTK_REVEALER_TRANSITION_TYPE_SLIDE_LEFT':
      this.set_transition_type(Gtk.RevealerTransitionType.SLIDE_LEFT);
      break;
    case 'GTK_REVEALER_TRANSITION_TYPE_SLIDE_UP':
      this.set_transition_type(Gtk.RevealerTransitionType.SLIDE_UP);
      break;
    case 'GTK_REVEALER_TRANSITION_TYPE_SLIDE_DOWN':
      this.set_transition_type(Gtk.RevealerTransitionType.SLIDE_DOWN);
      break;
    default:
      console.log(`Encountered unknown enum option GtkRevealerTransitionType at Gtk1.Revealer. Received ${transitionType}`);
      break;
    }
  }
}
