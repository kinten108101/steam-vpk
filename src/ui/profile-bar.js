import GObject from 'gi://GObject';
import Gtk from 'gi://Gtk';
import Adw from 'gi://Adw';

export class ProfileBar extends Adw.Bin {
  static {
    GObject.registerClass({
      GTypeName: 'StvpkProfileBar',
      Properties: {
        primary_button: GObject.ParamSpec.object(
          'primary-button', '', '',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
          Gtk.ToggleButton.$gtype),
        status_request: GObject.ParamSpec.string(
          'status-request', '', '',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
          ''),
      },
      Template: `resource:///com/github/kinten108101/SteamVPK/ui/profile-bar.ui`,
      CssName: 'profile-bar',
      Children: [
        'primary_button',
      ],
      InternalChildren: [
        'profile_label',
      ],
    }, this);
  };

  /**
   * @type {!Gtk.ToggleButton}
   */
  // @ts-expect-error
  primary_button;

  /**
   * @type {!string}
   */
  // @ts-expect-error
  status_request;

  /**
   * @type {!Gtk.Label}
   */
  // @ts-expect-error
  _profile_label;

  constructor(params = {}) {
    super(params);
    this._setup_status();
    this._setup_active_style();
  }

  _setup_status() {
    this.bind_property_full('status_request', this._profile_label, 'label',
      GObject.BindingFlags.SYNC_CREATE,
      /**
       * @param {string | null} from
       */
      (_binding, from) => {
        if (from === null) {
          return [false, ''];
        }
        return [true, from === '' ? 'no profile' : from];
      }, () => {});
  }

  _setup_active_style() {
    [
      this.primary_button,
    ].forEach(x => {
      const update = () => {
        if (x.active) {
          this.add_css_class('active');
        } else {
          this.remove_css_class('active');
        }
      };
      x.connect('notify::active', update);
      update();
    });
  }
}
