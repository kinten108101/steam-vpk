import GLib from 'gi://GLib';
import Gio from 'gi://Gio';
import HeaderBox, { BoxPages } from '../ui/headerbox.js';
import HeaderboxDetachable from '../windows/headerbox-detachable.js';

export default function HeaderBoxActions(
{ action_map,
  headerbox,
}:
{ action_map: Gio.ActionMap;
  headerbox: HeaderBox;
}) {
  let next_reveal = false;
  const reveal = new Gio.SimpleAction({
    name: "headerbox.reveal",
  });
  reveal.connect("activate", (_action) => {
    next_reveal = !next_reveal;
    headerbox.reveal_child = next_reveal;
  });
  action_map.add_action(reveal);

  const box_switch = new Gio.SimpleAction({
    name: "headerbox.box-switch",
    parameter_type: GLib.VariantType.new("s"),
  });
  box_switch.connect("activate", (_action, parameter: GLib.Variant) => {
    const box_name = parameter.deepUnpack() as BoxPages;
    headerbox.current_page = box_name;
  });
  action_map.add_action(box_switch);

  function init_headerbox() {
    box_switch.activate(GLib.Variant.new_string('status_box'));
    return methods;
  }

  const methods = {
    init_headerbox,
  };

  return methods;
}

export function HeaderboxAttachControls(
{ action_map,
  detachable,
}:
{ action_map: Gio.ActionMap;
  detachable: HeaderboxDetachable;
}) {
  const detach = new Gio.SimpleAction({
    name: "headerbox.detach",
  });
  detach.connect("activate", () => {
    detachable.set_visible(true);
  });
  action_map.add_action(detach);

  const attach = new Gio.SimpleAction({
    name: "headerbox.attach",
  });
  attach.connect("activate", () => {
    detachable.set_visible(false);
  });
  action_map.add_action(attach);
}
