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
        'profile_label',
        'switch_button',
        'primary_button',
      ],
    }, this);
  };

  status_request!: string;

  profile_label!: Gtk.Label;
  switch_button!: Gtk.Button;
  primary_button!: Gtk.ToggleButton;

  constructor(params = {}) {
    super(params);
    this._setup_status();
    this._setup_active_style();
  }

  _setup_status() {
    this.bind_property_full('status_request', this.profile_label, 'label',
      GObject.BindingFlags.SYNC_CREATE,
      (_binding, from: string | null) => {
        if (from === null) {
          return [false, ''];
        }
        return [true, from === '' ? 'no profile' : from];
      },
      null as unknown as GObject.TClosure);
  }

  _setup_active_style() {
    const buttons: Gtk.ToggleButton[] = [
      this.primary_button,
    ];

    buttons.forEach(x => {
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
