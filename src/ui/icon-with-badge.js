import GObject from 'gi://GObject';
import Gtk from 'gi://Gtk';

class Badge extends Gtk.Label {
  static {
    GObject.registerClass({
      GTypeName: 'StvpkBadge',
      CssName: 'badge',
    }, this);
  }
}

export default class IconWithBadge extends Gtk.Box {
  static {
    GObject.registerClass({
      GTypeName: 'StvpkIconWithBadge',
      Properties: {
        icon_name: GObject.ParamSpec.string(
          'icon-name', '', '',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
          null),
        icon_size: GObject.ParamSpec.enum(
          'icon-size', '', '',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
          (/** @type {typeof GObject.Object} */ (/** @type {unknown} */ (Gtk.IconSize))).$gtype,
          /** @type {boolean} */ (/** @type {unknown} */ (Gtk.IconSize.INHERIT))),
        pixel_size: GObject.ParamSpec.int(
          'pixel-size', '', '',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
          -1, 1024,
          -1),
        count: GObject.ParamSpec.int(
          'count', '', '',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
          -65535, 65535,
          0),
        show_badge: GObject.ParamSpec.boolean(
          'show-badge', '', '',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
          true),
      },
    }, this);
  }

  /** @type {?string} */
  // @ts-expect-error
  icon_name;

  /** @type {!Gtk.IconSize} */
  // @ts-expect-error
  icon_size;

  /** @type {!number} */
  // @ts-expect-error
  pixel_size;

  /**
   * int64 cannot be edited by GTK Inspector, so int instead of int64
   * @type {!number}
   */
  // @ts-expect-error
  count;

  /**
   * @type {boolean}
   */
  // @ts-expect-error
  show_badge;

  /**
   * @type {Badge}
   */
  _badge;

  /**
   * @param {{
   *  icon_name?: string,
   *  icon_size?: Gtk.IconSize,
   *  pixel_size?: number,
   *  count?: number,
   *  show_badge?: boolean,
   * }} params
   */
  constructor(params) {
    super({
      // @ts-expect-error
      icon_name: params.icon_name || null,
      icon_size: params.icon_size || null,
      pixel_size: params.pixel_size || null,
      count: params.count || null,
      show_badge: params.show_badge || null,
    });
    const overlay = new Gtk.Overlay();

    const image = new Gtk.Image();
    this.bind_property('icon-name', image, 'icon-name',
      GObject.BindingFlags.SYNC_CREATE);
    this.bind_property('icon-size', image, 'icon-size',
      GObject.BindingFlags.SYNC_CREATE);
    this.bind_property('pixel-size', image, 'pixel-size',
      GObject.BindingFlags.SYNC_CREATE);
    overlay.set_child(image);

    const overlay_layer = new Gtk.Box();
    overlay_layer.set_valign(Gtk.Align.START);
    overlay_layer.set_halign(Gtk.Align.END);
    this._badge = new Badge();
    overlay_layer.append(this._badge);

    this.connect('notify::count', this.update_badge.bind(this));
    this.connect('notify::show-badge', this.update_badge.bind(this));
    this.update_badge();

    overlay.add_overlay(overlay_layer);

    const layout = new Gtk.BinLayout();
    this.set_layout_manager(layout);
    this.append(overlay);
  }

  update_badge() {
    const from = this.count;
    if (!this.show_badge) {
      this._badge.set_visible(false);
      this._badge.set_label('');
    } else {
      this._badge.set_visible(true);
      let text = String(from);
      if (text.length > 2) text = '...';
      this._badge.set_label(text);
    }
  }
}
