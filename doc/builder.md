# Builder

Been working in the GTK framework, and I've noticed how the doc fails in some areas. So I was thinking of extending some parts of the API. Specifically, I want to create some objects in a correct and less repetitive way.

I can subclass, but I've never been a fan of OO. Instead, I want to write helper functions. To this end, there are some approaches. But most interestingly, I can write "builders".

The idea came to me when I was reading the source code of the app Fractal. Fractal was written in Rust with gtk-rs. I realized how builder objects were used everywhere in gtk-rs. Here's a snippet:

```rust
let dialog = adw::AboutWindow::builder()
    .application_name("Fractal")
    .application_icon(config::APP_ID)
    .developer_name(gettext("The Fractal Team"))
    .license_type(gtk::License::Gpl30)
    .website("https://gitlab.gnome.org/GNOME/fractal/")
    .issue_url("https://gitlab.gnome.org/GNOME/fractal/-/issues")
    // ...
    .build();

dialog.present();
```

I quickly took an interest in these "builders" and the builder pattern overall. I haven't used this pattern enough, if ever, only heard of. So I went ahead and wrote some Javascript builders for GTK widgets and objects.

---

Most of the time I rely on the constructor method to set up the object:

```js
class MyApplication extends Gtk.Application {
  constructor(param) {
    super(param)
    this.setupActions();
    this.setupShortcuts();
    this.setupStylesheet();
  }

  setupActions() {
    // ...
  }

  setupShortcuts() {
    //...
  }

  setupStylesheet() {
    //...
  }

  run(argv) {
    //...
  }
}

function Main(argv) {
  const app = new Application();
  // ...
  app.run(argv);
}
```

Methods .setupActions and .setupShortcuts and .setupStylesheet are my extended procedures that run in Application's construction. I would often subclass some widgets and add custom procedures.

As to why I have to do any of this in the first place, it's because the API is "limited". Take Adw.MessageDialog for instance. You can't add responses as constructor parameters (a response is a struct with two string fields, id and label), even if you can designate default response and such. You have to call dialog_instance.add_response after construction. And you must do this for every response you want to add.

```js
const dialog = new Adw.MessageDialog({
  heading: 'Delete this?',
  body: 'All data will be lost.',
  // a "responses" prop is sadly unavailable. In theory, we can do something like
  // responses: [{ id: 'res::ok', label: 'OK' }, ...],
});
// instead, you have to add responses manually:
dialog.add_response('res::ok', 'OK');
dialog.add_response('res::cancel', 'Cancel');
dialog.add_response('res::retry', 'Retry');
// ...
dialog.show();
```

The process where you do some extra post-processing work after object construction in order to get a desirable object... let's call this process "assembling".

So construction isn't enough; GTK forces you into this assembling pattern after construction. Of course this may be intentional because in some way it's not so bad. At least your code is now imperative, you're seeing the making of the object yourself. In other words, it's very transparent. But I also dread having to write these code. Some of them aren't so bad, but some really are. There are times when the parameter for a function is involved, you have to do a lot of set-up work. You create functions and variables that only serve during this set-up process and cannot be reused after this...

```js
const child_1 = new Widget(1);
validateWidget(child_1);
dialog.add_extra_child(child_1);

const child_2 = new Widget(2);
validateWidget(child_2);
dialog.add_extra_child(child_2);

// ...
```

The solution? Oftentimes I will subclass widgets like Adw.MessageDialog and let their construction do all the work:

```js
class MyMessageDialog extends Adw.MessageDialog {
  constructor(param) {
    super(param);
    const responses = param.responses;
    const children = param.children;
    this.addResponses(responses);
    this.addExtraChildren(children);
    // ...
  }

  addResponses(responses) {
    responses.forEach(x => {
      this.add_response(x.id, x.label);
    });
  }

  addExtraChildren(children) {
    children.forEach(x => {
      if (this._private_checkValidChild(x))
        this.add_extra_child(x);
    });
  }

  _private_checkValidChild(child) {
    //...
  }
}

const dialog = new MyMessageDialog({
  responses: [
    { id: 'res::ok', label: 'OK' },
    { id: 'res::cancel', label: 'Cancel' },
    { id: 'res::retry', label: 'Retry' },
    // ...
  ],
  children: [
    new Widget(1),
    new Widget(2),
    // ...
  ],
})
dialog.show();

```

There are some issues with this:

- You don't see what's happening during construction. It's an encapsulated procedure. Sometimes it's good to have encapsulation, but in this case I don't want it.

- I don't like abusing the constructor method. Every time you add a feature, you not only add more variables to the class but also append more code to the constructor method. You may group codes into sub-functions, but you still have to call these functions from the constructor method. They are all part of one long execution flow. This doesn't scale up well.


```js
class MyMessageDialog extends Adw.MessageDialog {
  constructor(param) {
    super(param);
    const responses = param.responses;
    const children = param.children;
    const val = param.val;
    this.addResponses(responses);
    this.addExtraChildren(children);
    this.addFeature(val);
    // ...
    // everytime you add some new procedures, you must explicitly mention them from here...
  }

  addResponses(responses) {
    responses.forEach(x => {
      this.add_response(x.id, x.label);
    });
  }

  addExtraChildren(children) {
    children.forEach(x => {
      if (this._private_checkValidChild(x))
        this.add_extra_child(x);
    });
  }

  addFeature(val) {
    // ....
  }
}
```

- Overall that's not the responsibility of the construction process. Construction is about doing the minimal set-up work so that you can access the object with safety. By then you should have only a barebone object. You can use it, things won't crash, but you won't get the features you want, and that's right. It's not right to expect a fully useable object right after one initialization statement.

The builder pattern solves this problem. It simply makes assembling less painful, reducing code duplication. It combines the best of both worlds: the cleanness of setting up objects in one expression, and the transparency of an assembling process.


```js
class MessageDialogBuilder() {
  instance;

  constructor() {
    this.instance = new Adw.MessageDialog();
    // no reference to response or extraChild()!
  }

  build() {
    return this.instance;
    // no reference to response or extraChild()!
  }

  response(param) {
    this.add_response(param.id, param.label);
    return this;
  }

  extraChild(widget) {
    this._private_checkValidChild(widget);
    this.add_extra_child(widget);
    return this;
  }

  _private_checkValidChild(widget) {
    // ...
  }

  prop(val) {
    // ...
  }
}

const dialog = MessageDialogBuilder()
  .response('res::ok', 'OK')
  .response('res::cancel', 'Cancel')
  .response('res::retry', 'Retry')
  .extraChild(new Widget(1))
  .extraChild(new Widget(2))
  .build();
dialog.show();
```

Every method in the builder class returns an instance of itself. This allows you to chain up commands, until you reach .build() where the final product is returned.

Also, notice how I now use a .response method, instead of .responses. .response takes a struct, while .responses takes an array of structs.

Now I don't have to input an array type! OFC, you may prefer array type, but at least we now have more options.

```js
MessageDialogBuilder()
  .response('res::ok', 'OK')
  .response('res::cancel', 'Cancel')
  .response('res::retry', 'Retry')
  // ...

// or

  .responses([
    { id: 'res::ok', label: 'OK' },
    { id: 'res::cancel', label: 'Cancel' },
    { id: 'res::retry', label: 'Retry' },
  ])
  // ...
```

IMO the former is clearer.

In comparision, it's impossible to do this with subclassing because each prop in an object must be unique. If there are duplicate props, the one comes later will override the one comes earlier.

```js
new MyMessageDialog({
  response: { id: 'res::ok', label: 'OK' },
  response: { id: 'res::cancel', label: 'Cancel' },
  response: { id: 'res::retry', label: 'Retry' },
  // This won't work. Instead, you must input an array:
  responses: [
    { id: 'res::ok', label: 'OK' },
    { id: 'res::cancel', label: 'Cancel' },
    { id: 'res::retry', label: 'Retry' },
  ],
  // ...
```

The sequence of these methods also matter. Imagine a .validateChildren method:

```js
MessageDialogBuilder()
  .extraChild() // add child to a this.children variable
  .extraChild()
  .extraChild()
  .validateChildren() // validate all children saved in a this.children variable!
  // ...

MessageDialogBuilder()
  .validateChildren() // error, this.children is empty!
  .extraChild()
  .extraChild()
  .extraChild()
  // ...
```

---

I wrote a bunch of builders and pushed them to libone, check it out!

Note that I haven't read any book or doc on this pattern and it's rationale. I visited wikipedia to see what they have to say about the builder pattern. My idea's there, but there's also something about writing different implementations for a builder, and how swapping builders results in different objects even with the same assembling sequence. Polymorphism? Sure, but I don't think my code is getting there yet. And so is the Fractal code. I only enjoy the transparency part.

Design patterns are cool tools to learn, and they will help us if we use them right. But to know when it is right to use, you have to use the design pattern without knowing it. Most of the time, you won't use these patterns at all. There are so many rules to these patterns that you may get distracted after reading. IMO this is true for all styles and patterns.
