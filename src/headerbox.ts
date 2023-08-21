import Gio from "gi://Gio";
import GLib from "gi://GLib";
import Gtk from 'gi://Gtk';
import Adw from 'gi://Adw';
import TypedBuilder from './typed-builder.js';
import { APP_RDNN } from './const.js';

export default function HeaderBox(
{ parent_window,
  action_map,
  reveal_toggle,
  build_entry,
  disable_all,
  reenable_all,
}:
{ parent_window: Gtk.Window;
  action_map: Gio.ActionMap;
  reveal_toggle: Gtk.ToggleButton;
  build_entry: Adw.Bin;
  disable_all: () => void;
  reenable_all: () => void;
  view_switcher_revealer?: Gtk.Revealer;
}) {
  parent_window;
  const builder = new TypedBuilder;
  builder.add_from_resource(`${APP_RDNN}/ui/headerbox.ui`);

  const headerbox = builder.get_typed_object<Gtk.Box>('headerbox');
  build_entry.set_child(headerbox);

  /**
   * Box Stack
   */

  const status_control_button = builder.get_typed_object<Gtk.Button>(
    "status_control_button",
  );

  const box_stack = builder.get_typed_object<Adw.ViewStack>("box-stack");
  const update_panel = () => {
    console.log((new Date()).getTime());
    if (box_stack.get_visible_child_name() === "status_box") {
      status_control_button.set_visible(true);
      return;
    }
    status_control_button.set_visible(false);
  };
  const box_model = box_stack.get_pages();
  setInterval(() => {
    box_model;
  }, 1000);
  box_model.connect("selection-changed", update_panel);
  update_panel();

  const button_status = builder.get_typed_object<Gtk.ToggleButton>(
    "button_status"
  );
  const button_console = builder.get_typed_object<Gtk.ToggleButton>(
    "button_console"
  );
  const button2box:
  { [key:string]: Gtk.ToggleButton } = {
    status_box: button_status,
    inject_console_box: button_console,
  };

  const box_switch = new Gio.SimpleAction({
    name: "box_switch",
    parameter_type: GLib.VariantType.new("s"),
  });
  box_switch.connect("activate", (_action, parameter: GLib.Variant) => {
    const box_name = parameter.deepUnpack();
    for (const key in button2box) {
      const box = button2box[key];
      if (box === undefined) return;
      if (key !== box_name) {
        box.set_active(false);
        continue;
      }
      box_stack.set_visible_child_name(key);
      box.set_active(true);
    }
  });
  button2box[box_stack.get_visible_child_name() || '']?.set_active(true);
  action_map.add_action(box_switch);

  /**
   * Modal
   */

  const view_stack = builder.get_typed_object<Adw.ViewStack>("view_stack");
  const hub_full = builder.get_typed_object<Adw.Window>("hub_full");
  hub_full.connect("notify::visible", () => {
    if (hub_full.get_visible())
      view_stack.set_visible_child_name("popped_view");
    else view_stack.set_visible_child_name("default_view");
  });
  const detach = new Gio.SimpleAction({
    name: "detach",
  });
  detach.connect("activate", () => {
    //hub_full.set_modal(true);
    hub_full.set_transient_for(parent_window);
    hub_full.set_visible(true);
  });
  action_map.add_action(detach);

  const modal_actions = new Gio.SimpleActionGroup();
  const attach = new Gio.SimpleAction({
    name: "attach",
  });
  attach.connect("activate", () => {
    hub_full.set_visible(false);
  });
  modal_actions.add_action(attach);

  action_map.add_action(attach);

  /**
   * Reveal method
   */

  const headerbox_revealer = builder.get_typed_object<Gtk.Revealer>(
    "headerbox_revealer"
  );
  const content_revealer = builder.get_typed_object<Gtk.Revealer>(
    "content_revealer"
  );

  function headerbox_setup(config: {
    animation: 'popin' | 'pushdown';
  }) {
    if (typeof config !== "object") return {};

    headerbox_revealer.connect("notify::child-revealed", () => {
      if (!headerbox_revealer.get_child_revealed()) return;
      content_revealer.set_reveal_child(true);
      reveal_toggle.set_sensitive(true);
      reveal_toggle.set_active(true);
    });

    content_revealer.connect("notify::child-revealed", () => {
      if (content_revealer.get_child_revealed()) return;
      headerbox_revealer.set_reveal_child(false);
      reveal_toggle.set_sensitive(true);
      reveal_toggle.set_active(false);
    });

    function reveal_headerbox(val: boolean) {
      if (val === true) {
        disable_all();
        reveal_toggle.set_sensitive(false);
        headerbox_revealer.set_reveal_child(true);
      } else if (val === false) {
        reveal_toggle.set_sensitive(false);
        content_revealer.set_reveal_child(false);
        reenable_all();
      }
    }

    return {
      reveal_headerbox,
    };
  }

  const controller = headerbox_setup({
    animation: "popin",
  });

  const reveal = new Gio.SimpleAction({
    name: "reveal",
  });
  reveal.connect("activate", () => {
    if (controller.reveal_headerbox === undefined) return;
    if (!headerbox_revealer.get_reveal_child()) {
      controller.reveal_headerbox(true);
      return;
    }
    controller.reveal_headerbox(false);
  });
  action_map.add_action(reveal);
  hub_full.insert_action_group("modal", modal_actions);
}
