import Gtk from "gi://Gtk";

const model = workbench.builder.get_object("model");
model.append("1");
model.append("2");
model.append("3");
model.append("4");
model.append("5");
model.append("6");
model.append("7");

const cache = new WeakMap();

const list = workbench.builder.get_object("list");
const factory = new Gtk.SignalListItemFactory();
factory.connect("setup", (_factory, listitem) => {
  console.log("setup");
  const widget = new Gtk.Button();
  listitem.set_child(widget);
});
factory.connect("bind", (_factory, listitem) => {
  const widget = listitem.get_child();
  const item = listitem.get_item();
  console.log("bind", item.string);
  widget.set_label(item.string);
  cache.set(widget, item.string);
});
factory.connect("unbind", (_factory, listitem) => {
  console.log("unbind", listitem.get_child().get_label());
});
factory.connect("teardown", () => {
  console.log("teardown");
});
list.set_factory(factory);

setTimeout(() => {
  console.log("###");
  factory;
  model.remove(1);
}, 10000);
