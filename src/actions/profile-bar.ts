import Gio from 'gi://Gio';

import { ProfileBar } from '../ui/profile-bar.js';

export default function ProfileBarActions(
{ action_map,
  profile_bar,
}:
{ action_map: Gio.ActionMap;
  profile_bar: ProfileBar;
}) {
  const toggle_primary_button = new Gio.SimpleAction({
    name: 'profile-bar.toggle-primary-button',
  });
  toggle_primary_button.connect('activate', () => {
    profile_bar.primary_button.activate();
  });
  action_map.add_action(toggle_primary_button);
}
