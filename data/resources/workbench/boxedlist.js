import Gtk from "gi://Gtk";
import Gio from "gi://Gio";

const boxedlist = workbench.builder.get_object("boxedlist");
const model = new Gtk.StringList();
boxedlist.bind_model(model, (item) => {
  const button = new Gtk.Button();
  button.set_label(item.string);
  console.log("setup", item.string);
  return button;
});
model.append("hi");
model.append("how");
model.append("hmm");
setTimeout(() => {
  model.remove(1);
}, 5000);
