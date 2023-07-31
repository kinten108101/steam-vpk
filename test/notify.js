#!/usr/bin/gjs

var Gio = imports.gi.Gio;
imports.gi.versions.Gtk = '4.0';
var Gtk = imports.gi.Gtk;
var GObject = imports.gi.GObject;
var System = imports.system;

class Obj extends GObject.Object {
  static [GObject.properties] = {
    'nama': GObject.ParamSpec.string('nama', '', '', GObject.ParamFlags.READWRITE, null),
  };

  static {
    GObject.registerClass({}, this);
  }
}

var a = new Obj();
a.connect('notify::nama', ($obj, v, val) => {
  log(val);
});
a.nama = 'Ruby';

