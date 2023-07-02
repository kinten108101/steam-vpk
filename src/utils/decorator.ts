import GObject from 'gi://GObject';

/**
 * Some parts of the decorator feature use the Metadata library
 * which is currently available as an NPM package. To use runtime
 * NPM deps in GJS environment we need tools like Browserify to
 * bundle up foreign libraries. We will do this later.
 *
 * Here's a preview of decorator as a concept.
 */
export function gobjectClass
<Props extends { [key: string]: GObject.ParamSpec },
 Interfaces extends { $gtype: GObject.GType }[],
 Sigs extends {
        [key: string]: {
            param_types?: readonly GObject.GType[];
            [key: string]: any;
        };
    }>
(info: GObject.MetaInfo<Props, Interfaces, Sigs> = {}) {
  return (constructor: Function) => {
    console.log(`Registering ${constructor.name}`);
    GObject.registerClass({
      GTypeName: `Stvpk${constructor.name}`,
      ...info
    }, constructor);
  }
}

export function gobjectProp(target: Object, propertyKey: string | symbol) {
  // how
  target;
  propertyKey;
}

export function gobjectChild(target: Object, propertyKey: string | symbol) {
  // how
  target;
  propertyKey;
}

/*

@gobjectClass({
  name: 'Gjs_Foo',
  template: 'resource:///org/gnome/myapp/ui/foo.ui',
})
class Foo extends Object.Object {
  @gobjectChild
  label!: Gtk.Label;

  @gobjectChild
  private _contentArea!: Gtk.Box;

  @gobjectProp
  model: Gio.ListStore<Item> = new Gio.ListStore(Item);

  @gobjectSignal
  static 'new-event' = {};

  items: Map<string, Item> = new Map();
}

*/

export function defined(originalMethod: any, ...props: any[]) {
    return function(this: any, ...args: any[]) {
      props.forEach((x) => {
        if (x === undefined) {
          console.log('oj no!');
          throw new Error();
        }
      })
      return originalMethod.call(this, ...args);
    };
}


export function bind(target: Object, propertyKey: string | symbol) {
  // how
  target;
  propertyKey;
}

export function unimplemented(
  target: Object,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor
) {
  // how
  target;
  propertyKey;
  descriptor;

  //const original: Function = descriptor.value;

  descriptor.value = (): never => {
    throw new Error('Method is unimplemented')
  }
}
