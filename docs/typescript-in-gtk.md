---
title: TypeScript in GTK+
---

GType generates glue code at runtime whether or not the
development language is object-oriented. The GLib type system
runs parallel with the current type system. GObject properties
and their getter and setter are generated at runtime. No amount
of TypeScript type definition will help, and current TypeScript
LSP client implementations do not handle this. I've found some
workarounds to combat the situation, although this will lead to
impure code.

For GObject properties, in JS class definition declare their
types as `any` using index signature. When using these props,
right before starting to, bind them to a local variable with
clearly defined type. This ensure type safety and full LSP
functionality.

```ts
class Js_exampleClass extends GObject.object {
  [props: string]: any;

  constructor(params={}) {
    super(params);
    const example_property: string = this.example_property;
    log(example_property); // Expect 'Hello world!'
  }
}

const ExampleClass = GObject.registerClass({
  GTypeName: 'ExampleClass',
  Property: {
    'example-property': GObject.ParamSpec.string(
      'example-property',
      'Example Property',
      'Example description',
      GObject.ParamFlags.READWRITE,
      'Hello world!'
      ),
  },
}, Js_exampleClass);

const example = new ExampleClass;
```

For GObject path to UI template
