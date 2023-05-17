import GObject from 'gi://GObject';
import Gtk from 'gi://Gtk';
import Adw from 'gi://Adw';

function generate_id_from_name(name: string): string {
  return name.replaceAll(' ', '-').replaceAll('_', '-');
}

export interface NewProfileDialogResponse {
  status: Gtk.ResponseType;
  content: null | {
    profile_id: string;
    profile_name: string;
    use_all_available_addons: boolean;
  }
}

export class NewProfileDialog extends Adw.Window {

  /**
   * @return Gtk.ResponseType
   *
   */
  static async get_content_async(parent_window: Gtk.Window): Promise<NewProfileDialogResponse> {
    const dialog = new NewProfileDialog({
      transient_for: parent_window,
    });
    const res: NewProfileDialogResponse = await dialog.get_content_async()
      .finally(() =>{
        dialog.destroy();
      });
    return res;
  }

  // @ts-ignore
  private _name_row!: Adw.EntryRow = this._name_row;
  // @ts-ignore
  private _id_row!: Adw.EntryRow = this._id_row;
  // @ts-ignore
  private _use_all_switch!: Gtk.Switch = this._use_all_switch;

  private resolve: ((value: NewProfileDialogResponse) => void) | undefined = undefined;
  private reject: ((reason?: any) => void) | undefined = undefined;

  static {
    GObject.registerClass({
      GTypeName: 'NewProfile',
      // @ts-ignore
      Template: 'resource:///com/github/kinten108101/SteamVpk/ui/new-profile.ui',
      InternalChildren: [
        'name_row',
        'id_row',
        'use_all_switch',
      ],
    }, this);
  }

  constructor(params={}) {
    super(params);

    this._name_row.connect('apply', () => {
      const name = this._name_row.text;
      if (name === null) return;
      this._id_row.set_text(generate_id_from_name(name));
    });
    this.connect('close-request', this.on_cancel_clicked);
  }

  async get_content_async(): Promise<NewProfileDialogResponse> {
    const res: NewProfileDialogResponse = await new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
      this.set_visible(true);
    });
    return res;
  }

  on_ok_clicked() {
    const profile_name = this._name_row.text;
    if (profile_name === null || profile_name === '') {
      log('Profile name must not be empty!');
      // show error as toast to user
      return;
    }
    const profile_id = this._id_row.text;
    if (profile_id === null || profile_id === '') {
      log('Profile ID must not be empty!');
      // show error as toast to user
      return;
    }
    const use_all_available_addons = this._use_all_switch.state;
    const response: NewProfileDialogResponse = {
      status: Gtk.ResponseType.ACCEPT,
      content: {
        profile_name,
        profile_id,
        use_all_available_addons,
      }
    };
    this.resolve?.call(this, response);
  }

  on_cancel_clicked() {
    this.resolve?.call(this, {
      status: Gtk.ResponseType.CANCEL,
      content: null,
    } as NewProfileDialogResponse);
  }
}
