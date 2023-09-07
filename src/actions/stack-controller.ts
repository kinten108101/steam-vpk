import Gio from 'gi://Gio';
import Adw from 'gi://Adw';

export default function StackController(
{ stack,
  action_map,
}:
{ stack?: Adw.ViewStack;
  action_map: Gio.ActionMap;
}) {
  if (!stack) return;
  const model = stack.get_pages();
  // FIXME(kinten): For some reasons the GtkSelectionModel impl of Adw.ViewStack does not
  // have get_n_items. Or maybe it's a language binding mistake.
  let length = 2;

  const pageForward = new Gio.SimpleAction({
    name: 'stack.page-forward',
  });
  pageForward.connect('activate', () => {
    const bitset = model.get_selection();
    const current = bitset.get_nth(0);
    const next = (current + 1) % length;
    model.select_item(next, true);
  });
  action_map.add_action(pageForward);

  const pageBackward = new Gio.SimpleAction({
    name: 'stack.page-backward',
  });
  pageBackward.connect('activate', () => {
    const bitset = model.get_selection();
    const current = bitset.get_nth(0);
    const next = (current - 1) >= 0 ? (current - 1) % length : length - Math.abs(current - 1) % length;
    model.select_item(next, true);
  });
  action_map.add_action(pageBackward);
}
