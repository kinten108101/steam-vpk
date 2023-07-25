export interface ViewModelBindee<T> {
  binder: ViewModelBinder<T, this>;
  onBind(context: T): void;
}

export default class ViewModelBinder<Context, Bindee extends ViewModelBindee<Context>> {
  branches: ViewModelBindee<Context>[];
  current: Bindee;

  constructor(branches: ViewModelBindee<Context>[], current: Bindee) {
    this.branches = branches;
    this.current = current;
  }

  bind(context: Context) {
    this.current.onBind(context);
    this.branches.forEach(x => {
      x.binder.bind(context);
    })
  }
}
