import Gio from 'gi://Gio';

abstract class ConversationError extends Error {}

export class MissingParamError extends ConversationError {
  constructor() {
    super('Param does not exist');
  }
}

type DialogAction = (...args: any[]) => Promise<[Symbol]>;

class Dialog {
  neighbors: Map<Symbol, Dialog>;
  action: DialogAction;

  constructor(param: { action: DialogAction }) {
    this.action = param.action;
    this.neighbors = new Map;
  }
}

export class Conversation {
  pages: Dialog[];
  navigation = {
    NEXT: Symbol('next'),
    BACK: Symbol('back'),
    RETRY: Symbol('retry'),
    QUIT: Symbol('quit'),
  };
  cancellable: Gio.Cancellable;
  params: Map<string, any> = new Map;

  constructor() {
    this.pages = [];
    this.cancellable = new Gio.Cancellable();
  }

  async run() {
    let next = this.pages[0];
    while (next !== undefined && !this.cancellable.is_cancelled()) {
      const page = next;
      const [decision] = await page.action().catch(error => {
        logError(error);
        return [this.navigation.QUIT];
      });
      if (decision === this.navigation.QUIT) {
        console.debug('quit');
        break;
      }
      next = page.neighbors.get(decision);
      if (next === undefined)
        console.warn('Unknown wizard.navigation encountered');
    }
  }

  add_dialog(action: DialogAction) {
    const newpage = new Dialog({ action });
    const lastPage = this.pages[this.pages.length - 1];
    if (lastPage !== undefined) {
      newpage.neighbors.set(this.navigation.BACK, lastPage);
      lastPage.neighbors.set(this.navigation.NEXT, newpage);
    }
    newpage.neighbors.set(this.navigation.RETRY, newpage);
    this.pages.push(newpage);
    return newpage;
  }

  set_param(name: string, obj: any) {
    this.params.set(name, obj);
  }

  get_param<T extends any>(name: string): T {
    const val = this.params.get(name);
    if (val === undefined) throw new MissingParamError();
    return val;
  }
}
