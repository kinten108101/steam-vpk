import Gtk from 'gi://Gtk';

export default function Shortcuts(
{ application,

}:
{ application: Gtk.Application;

}) {
  (<[string, string[]][]>
  [
    ['app.quit', ['<Control>q']],
    ['app.new-window', ['<Control>n']],
    ['win.reload-addons', ['<Primary>r']],
    ['win.back', ['<Alt>Left']],
    ['win.forward', ['<Alt>Right']],
    ['win.show-preferences', ['<Control>comma']],
    ['win.stack.page-backward', ['<Shift>Left']],
    ['win.stack.page-forward', ['<Shift>Right']],
    ['window.close', ['<Control>w']],
    ['win.add-addon.add-url', ['<Control>b']],
    ['win.add-addon.add-name', ['<Control>m']],
  ]).forEach(([action, accels]) => {
    application.set_accels_for_action(action, accels);
  });
}
