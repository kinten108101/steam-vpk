import GLib from 'gi://GLib';
import Gio from 'gi://Gio';
import HeaderBox from '../ui/headerbox.js';
import HeaderboxDetachable from '../windows/headerbox-detachable.js';

/**
 * @param {{
 *   headerbox: HeaderBox;
 * }} params
 */
export function HeaderBoxActions(
{ headerbox,
}) {
  let next_reveal = false;
  const headerbox_reveal = new Gio.SimpleAction({
    name: "headerbox.reveal",
  });
  headerbox_reveal.connect("activate", (_action) => {
    next_reveal = !next_reveal;
    headerbox.reveal_child = next_reveal;
  });

  const headerbox_box_switch = new Gio.SimpleAction({
    name: "headerbox.box-switch",
    parameter_type: GLib.VariantType.new("s"),
  });
  headerbox_box_switch.connect("activate", (_action, parameter) => {
    if (!parameter) throw new Error;
    /**
     * @type {import('../ui/headerbox.js').BoxPages}
     */
    const box_name = parameter.deepUnpack();
    headerbox.current_page = box_name;
  });

  return {
    headerbox_reveal,
    headerbox_box_switch,
  };
}

/**
 * @param {{
 *   detachable: HeaderboxDetachable;
 * }} params
 */
export function HeaderboxAttachControls(
{ detachable,
}) {
  const headerbox_detach = new Gio.SimpleAction({
    name: "headerbox.detach",
  });
  headerbox_detach.connect("activate", () => {
    detachable.set_visible(true);
  });

  const headerbox_attach = new Gio.SimpleAction({
    name: "headerbox.attach",
  });
  headerbox_attach.connect("activate", () => {
    detachable.set_visible(false);
  });

  return {
    headerbox_detach,
    headerbox_attach,
  };
}
