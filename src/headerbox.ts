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

  const button_status = builder.get_typed_object<Gtk.ToggleButton>(
    "button_status"
  );
  const button_console = builder.get_typed_object<Gtk.ToggleButton>(
    "button_console"
  );
  const stack_data:
  {
    [key:string]: { button: Gtk.ToggleButton, empty: boolean }
  } = {
    'status_box': {
      button: button_status,
      empty: false,
    },
    'inject_console_box': {
      button: button_console,
      empty: false,
    },
  };

  function box_stack_set_empty(box_name: string, val: boolean) {
    const box = stack_data[box_name];
    if (box === undefined) throw new Error;
    box.empty = val;
    if (box_stack.get_visible_child_name() === box_name)
      update_box_stack(box_name);
  }

  function update_box_stack(box_name: string) {
    for (const key in stack_data) {
      const data = stack_data[key];
      if (data === undefined) throw new Error;
      const { button, empty } = data;
      if (key !== box_name) {
        button.set_active(false);
        continue;
      }
      if (empty) {
        content_type_stack.set_visible_child_name('empty_content');
      } else {
        content_type_stack.set_visible_child_name('default_content');
        box_stack.set_visible_child_name(key);
      }
      button.set_active(true);
    }
  }

  const box_switch = new Gio.SimpleAction({
    name: "box_switch",
    parameter_type: GLib.VariantType.new("s"),
  });
  box_switch.connect("activate", (_action, parameter: GLib.Variant) => {
    const box_name = parameter.deepUnpack() as string;
    update_box_stack(box_name);
  });
  action_map.add_action(box_switch);

  /**
   * Status box
   */

  const status_box = builder.get_typed_object<Gtk.Box>('status_box');
  const status_title = builder.get_typed_object<Gtk.Label>('status_title');
  const status_description = builder.get_typed_object<Gtk.Label>('status_description');
  const content_type_stack = builder.get_typed_object<Adw.ViewStack>('content_type_stack');

  function set_status(status: {
    type: 'error' | 'generic';
    empty_override?: boolean;
    title: string;
    description: string;
  }) {
    const style_options = {
      red: 'red',
      white: 'white',
    };
    const iconname_options = {
      error: 'error-symbolic',
      question_round: 'question-round-symbolic',
    };
    function pick(classes: string[], style: string): string[] {
      const css = new Set(classes);
      for (const x in style_options) {
        if ((<{[key: string]: string}>style_options)[x] === style) {
          css.add(style);
          continue;
        }
        css.delete(x);
      }
      function set2arr(set: Set<any>) {
        const arr: any[] = [];
        set.forEach(x => {
          arr.push(x);
        });
        return arr;
      }
      const _classes = set2arr(css);
      return _classes;
    }
    const [style, icon_name]: [string, string] = (() => {
      switch (status.type) {
      case 'error':
        return [
          style_options.red,
          iconname_options.error,
        ];
      case 'generic':
        return [
          style_options.white,
          iconname_options.question_round,
        ];
      }
    })();
    button_status.set_css_classes(pick(button_status.css_classes, style));
    button_status.set_icon_name(icon_name);

    if (status.empty_override === true) {
      box_stack_set_empty('status_box', true);
      return;
    }
    box_stack_set_empty('status_box', false);

    status_box.set_css_classes(pick(status_box.css_classes, style));
    status_title.set_label(status.title);
    status_description.set_label(status.description);
  }

  function set_empty_status() {
    set_status({
      type: 'generic',
      empty_override: true,
      title: '',
      description: '',
    });
  }

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

  function init() {
    box_switch.activate(GLib.Variant.new_string('status_box'));
  }

  return {
    init,
    set_status,
    set_empty_status,
  }
}
