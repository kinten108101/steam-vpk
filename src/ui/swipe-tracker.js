import GObject from 'gi://GObject';
import Gtk from 'gi://Gtk';
import Adw from 'gi://Adw';

/**
 * @typedef {import("../main").SwipeTracker} SwipeTracker
 */

/**
 * Custom swipe gesture tracker. Will use {@link Adw.SwipeTracker}
 * once I know how to use it
 *
 * @implements {SwipeTracker}
 */
export default class CustomSwipeTracker extends GObject.Object {
  static {
    GObject.registerClass({
      GTypeName: 'StvpkSwipeTracker',
      Properties: {
        swipeable: GObject.ParamSpec.object(
          'swipeable', '', '',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
          Gtk.Widget.$gtype),
      },
      Signals: {
        'begin-swipe': {},
        'end-swipe': {
          param_types: [GObject.TYPE_DOUBLE, GObject.TYPE_DOUBLE],
        },
        'update-swipe': {
          param_types: [GObject.TYPE_DOUBLE],
        }
      }
    }, this);
  }

  /**
   * @type {!Gtk.Widget}
   */
  // @ts-expect-error
  swipeable;

  _delta = 0;

  /**
   * @param {{
   *   swipeable: Gtk.Widget;
   * }} params
   */
  constructor(params) {
    super(params);
    this._setup();
  }

  _setup() {
    this.scroller = new Gtk.EventControllerScroll();
    this.scroller.set_flags(
      Gtk.EventControllerScrollFlags.KINETIC |
        Gtk.EventControllerScrollFlags.VERTICAL,
    );
    this.scroller.connect("scroll-begin", (_object) => {
      this.emit("begin-swipe");
    });
    this.scroller.connect("scroll-end", (_object) => {
      this.emit("end-swipe", this._delta, -1);
    });
    this.scroller.connect("scroll", (_object, _dx, dy) => {
      this._delta = dy;
      this.emit('update-swipe', this._delta);
    });
    this.swipeable.add_controller(this.scroller);
  }
}
