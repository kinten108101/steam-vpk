import GObject from 'gi://GObject';
import Gtk from 'gi://Gtk';

export default class InstallButton extends Gtk.Button {
  static {
    GObject.registerClass({
      GTypeName: 'StvpkInstallButton',
      Properties: {
        // FIXME(kinten): use enum
        install_state: GObject.ParamSpec.string(
          'install-state', '', '',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
          'installed'),
      },
    }, this);
  }

  /**
   * @type {'installed' | 'not-installed' | null}
   */
  // @ts-expect-error
  install_state;

  constructor(params = {}) {
    super(params);
    this.connect('notify::install-state', this._on_update_install_state.bind(this));
    this._on_update_install_state();
  }

  vfunc_realize() {
    super.vfunc_realize();
    this._on_update_install_state();
  }

  _on_update_install_state() {
    switch (this.install_state) {
    case 'installed':
      this.set_label('Installed');
      this.remove_css_class('suggested-action');
      this.set_sensitive(false);
      break;
    case null:
    default:
    case 'not-installed':
      this.set_label('Install');
      this.add_css_class('suggested-action');
      this.set_sensitive(true);
      break;
    }
  }
}
