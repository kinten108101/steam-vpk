import Gio from 'gi://Gio';
import Gtk from 'gi://Gtk';
import Adw from 'gi://Adw';
import TypedBuilder from './typed-builder.js';
import * as Consts from './const.js';

export default function
profile_window_implement(
{ main_window }:
{ main_window: Gtk.Window }) {
  const profileActions = new Gio.SimpleActionGroup();
  main_window.insert_action_group('profiles', profileActions);

  const manage = new Gio.SimpleAction({ name: 'manage' });
  manage.connect('activate', () => {
    const builder = new TypedBuilder();
    builder.add_from_resource(`${Consts.APP_RDNN}/ui/profile-window.ui`);
    const window = builder.get_typed_object<Adw.Window>('window');
    main_window.get_group().add_window(window);
    window.present();
  });
  profileActions.add_action(manage);
}
