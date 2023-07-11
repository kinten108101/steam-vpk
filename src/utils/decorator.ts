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
  return (constructor: Function, _: ClassDecoratorContext) => {
    console.debug(`Registering ${constructor.name}`);
    GObject.registerClass({
      GTypeName: `Stvpk${constructor.name}`,
      ...info
    }, constructor);
  }
}


}
