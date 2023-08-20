import Gio from "gi://Gio";
import GLib from "gi://GLib";

function HeaderBox() {
  const window = workbench.builder.get_object("window");

  const status_box_overlay = workbench.builder.get_object("status-box-overlay");
  const shade = workbench.builder.get_object("shade");
  status_box_overlay.add_overlay(shade);
  const toolbar_layer = workbench.builder.get_object("toolbar_layer");
  status_box_overlay.add_overlay(toolbar_layer);
  const viewstackswitcher_layer = workbench.builder.get_object(
    "viewstackswitcher_layer",
  );
  status_box_overlay.add_overlay(viewstackswitcher_layer);

  const status_control_button = workbench.builder.get_object(
    "status_control_button",
  );

  const box_stack = workbench.builder.get_object("box-stack");
  const update_panel = () => {
    if (box_stack.get_visible_child_name() === "status_box") {
      status_control_button.set_visible(true);
      return;
    }
    status_control_button.set_visible(false);
  };
  box_stack.get_pages().connect("selection-changed", update_panel);
  update_panel();

  const button_status = workbench.builder.get_object("button_status");
  const button_console = workbench.builder.get_object("button_console");
  const buttons = {
    status_box: button_status,
    inject_console_box: button_console,
  };

  const box_switch = new Gio.SimpleAction({
    name: "box_switch",
    parameter_type: GLib.VariantType.new("s"),
  });
  box_switch.connect("activate", (_action, parameter) => {
    const box_name = parameter.deepUnpack();
    for (const key in buttons) {
      if (key !== box_name) {
        buttons[key].set_active(false);
        continue;
      }
      box_stack.set_visible_child_name(key);
      buttons[key].set_active(true);
    }
  });
  buttons[box_stack.get_visible_child_name()].set_active(true);
  window.add_action(box_switch);

  const headerbox_revealer = workbench.builder.get_object("headerbox_revealer");
  const content_revealer = workbench.builder.get_object("content_revealer");

  const view_stack = workbench.builder.get_object("view_stack");
  const hub_full = workbench.builder.get_object("hub_full");
  hub_full.connect("notify::visible", () => {
    if (hub_full.get_visible())
      view_stack.set_visible_child_name("popped_view");
    else view_stack.set_visible_child_name("default_view");
  });
  const detach = new Gio.SimpleAction({
    name: "detach",
  });
  detach.connect("activate", () => {
    hub_full.set_transient_for(window);
    hub_full.set_visible(true);
  });
  window.add_action(detach);

  const modal_actions = new Gio.SimpleActionGroup();
  const attach = new Gio.SimpleAction({
    name: "attach",
  });
  attach.connect("activate", () => {
    hub_full.set_visible(false);
  });
  modal_actions.add_action(attach);
  hub_full.insert_action_group("modal", modal_actions);

  const controller = headerbox_setup({
    animation: "popin",
  });

  const reveal_toggle = workbench.builder.get_object("reveal_toggle");
  const reveal = new Gio.SimpleAction({
    name: "reveal",
  });
  reveal.connect("activate", () => {
    if (!headerbox_revealer.get_reveal_child()) {
      controller.reveal_headerbox(true);
      return;
    }
    controller.reveal_headerbox(false);
  });

  function headerbox_setup(config) {
    if (typeof config !== "object") return;
    if (config.animation === "popin") {
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

      function reveal_headerbox(val) {
        if (val === true) {
          reveal_toggle.set_sensitive(false);
          headerbox_revealer.set_reveal_child(true);
        } else if (val === false) {
          reveal_toggle.set_sensitive(false);
          content_revealer.set_reveal_child(false);
        }
      }

      return {
        reveal_headerbox,
      };
    } else if (config.animation === "pushdown") {
      headerbox_revealer.set_reveal_child(false);
      content_revealer.set_reveal_child(true);

      function reveal_headerbox(val) {
        if (val === true) {
          headerbox_revealer.set_reveal_child(true);
        } else if (val === false) {
          headerbox_revealer.set_reveal_child(false);
        }
      }

      return {
        reveal_headerbox,
      };
    }
  }

  window.add_action(reveal);

  const modal_stack = workbench.builder.get_object("modal_stack");
}

HeaderBox();
