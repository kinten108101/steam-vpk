import GObject from 'gi://GObject';
import Gtk from 'gi://Gtk';
import * as Utils from '../steam-vpk-utils/utils.js';

export default class TypedBuilder extends Gtk.Builder {
  static {
    Utils.registerClass({}, this);
  }

  constructor(param: Gtk.Builder.ConstructorProperties = {}) {
    super(param);
  }

  /**
   * Get the object named `name`.
   *
   * A wrapper over {@link Gtk.Builder.get_object} that supports generics.
   * @param name name of object to get
   * @returns the object named `name`
   * @throws a JS Error if object named `name` is not found
   */
  get_typed_object<T extends GObject.Object>(name: string): T {
    const obj = this.get_object(name);
    if (obj === null) throw new Error(`Bad XML, \"${name}\" not found.`);
    return obj as T;
  }
}
