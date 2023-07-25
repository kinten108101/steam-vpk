#!/usr/bin/gjs

var Gio = imports.gi.Gio;
imports.gi.versions.Gtk = '4.0';
var Gtk = imports.gi.Gtk;
var GObject = imports.gi.GObject;
var System = imports.system;

Gtk.init();

const window = new Gtk.ApplicationWindow();

const group = new Gio.SimpleActionGroup();
window.insert_action_group('addons', group);

const action = new Gio.SimpleAction({ name: 'box' });
action.connect('activate', () => {
  console.log('hi');
})
group.add_action(action);

const a = new Gtk.Button();
window.child = a;
//window.activate_action('addons.box', null);
a.set_action_name('addons.box');
a.emit('clicked');

