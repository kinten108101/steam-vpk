import Gio from 'gi://Gio';
import { DownloadPage } from '../ui/download-page.js';
import { LaunchpadPage } from '../ui/launchpad.js';

export default function TextMarkupPresenter(
{ gsettings,
  download_page,
  launchpad_page,
}:
{ gsettings: Gio.Settings;
  download_page: DownloadPage;
  launchpad_page: LaunchpadPage;
}) {
  gsettings.bind('enable-text-markup', download_page, 'enable-text-markup', Gio.SettingsBindFlags.DEFAULT);
  gsettings.bind('enable-text-markup', launchpad_page, 'enable-text-markup', Gio.SettingsBindFlags.DEFAULT);
}
