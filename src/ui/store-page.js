import GObject from 'gi://GObject';
import Gtk from 'gi://Gtk';
import InstallButton from './store-page/install-button.js';

export default class StorePage extends Gtk.Box {
  static {
    GObject.registerClass({
      GTypeName: 'StvpkStorePage',
      Properties: {
        title: GObject.ParamSpec.string(
          'title', '', '',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
          null),
        subtitle: GObject.ParamSpec.string(
          'subtitle', '', '',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
          null),
        description: GObject.ParamSpec.string(
          'description', '', '',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
          null),
      },
      Template: 'resource:///com/github/kinten108101/SteamVPK/ui/store-page.ui',
      Children: [
        'install_button',
      ],
      InternalChildren: [
        'page_title',
        'page_subtitle',
        'page_description',
        'description_group',
      ],
    }, this);
  }

  /**
   * @type {?string}
   */
  // @ts-expect-error
  title;

  /**
   * @type {?string}
   */
  // @ts-expect-error
  subtitle;

  /**
   * @type {?string}
   */
  // @ts-expect-error
  description;

  /**
   * @type {!InstallButton}
   */
  // @ts-expect-error
  install_button;

  /**
   * @type {!Gtk.Label}
   */
  // @ts-expect-error
  _page_title;

  /**
   * @type {!Gtk.Label}
   */
  // @ts-expect-error
  _page_subtitle;

  /**
   * @type {!Gtk.Label}
   */
  // @ts-expect-error
  _page_description;

  /**
   * @type {!Gtk.Box}
   */
  // @ts-expect-error
  _description_group;

  constructor(params = {}) {
    super(params);
    this._setup();
  }

  _setup() {
    this.bind_property_full('title', this._page_title, 'label',
      GObject.BindingFlags.SYNC_CREATE,
      /**
       * @param {string | null} from
       * @returns { [boolean, string] }
       */
      (_binding, from) => {
        if (!from) return [true, 'No title'];
        return [true, from];
      },
      () => {});

    this.connect('notify::subtitle', this._on_update_subtitle.bind(this));
    this._on_update_subtitle();

    this.connect('notify::description', this._on_update_description.bind(this));
    this._on_update_description();
  }

  _on_update_subtitle() {
    if (!this.subtitle) this._page_subtitle.set_visible(false);
    else {
      this._page_subtitle.set_label(this.subtitle);
      this._page_subtitle.set_visible(true);
    }
  }

  _on_update_description() {
    if (!this.description) this._description_group.set_visible(false);
    else {
      this._page_description.set_label(this.description);
      this._description_group.set_visible(true);
    }
  }
}
