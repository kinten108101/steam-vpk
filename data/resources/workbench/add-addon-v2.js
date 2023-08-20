import Gio from "gi://Gio";

const window = workbench.builder.get_object("window");
const leaflet = workbench.builder.get_object("leaflet");

const validate = new Gio.SimpleAction({
  name: "validate",
});

validate.connect("activate", () => {
  leaflet.set_visible_child_name("preview-download");
});
window.add_action(validate);

const retry = new Gio.SimpleAction({
  name: "retry",
});

retry.connect("activate", () => {
  leaflet.set_visible_child_name("input-url");
});
window.add_action(retry);
