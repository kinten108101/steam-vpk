const stack = workbench.builder.get_object("stack");
const names = ["default", "spinning"];
let i = 0;
setInterval(() => {
  stack.set_visible_child_name(names[i++ % 2]);
}, 3000);
