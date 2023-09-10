import Gtk from 'gi://Gtk';

export default function Shortcuts(
{ application,

}:
{ application: Gtk.Application;

}) {
  (<[string, string[]][]>
  [
    ['app.quit', ['<Primary>q']],
    ['app.new-window', ['<Primary>n']],
    ['win.reload-addons', ['<Primary>r']],
    ['win.back', ['<Alt>Left']],
    ['win.forward', ['<Alt>Right']],
    ['win.show-preferences', ['<Primary>comma']],
    ['win.stack.page-backward', ['<Shift>Left']],
    ['win.stack.page-forward', ['<Shift>Right']],
    ['window.close', ['<Primary>w']],
    ['win.add-addon.add-url', ['<Primary>g']],
    ['win.add-addon.add-name', ['<Primary>m']],
    ['win.injector.run', ['<Primary>b']],
    ['win.profile-bar.toggle-primary-button', ['<Primary>p']],
  ]).forEach(([action, accels]) => {
    application.set_accels_for_action(action, accels);
  });
}
