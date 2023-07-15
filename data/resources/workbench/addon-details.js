const Gtk = imports.gi.Gtk;

const a = workbench.builder.get_object("carousel");
const description = workbench.builder.get_object("description");
a.append(description);
