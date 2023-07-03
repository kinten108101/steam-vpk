import GLib from 'gi://GLib';
import GObject from 'gi://GObject';
import Gio from 'gi://Gio';
import Gtk from 'gi://Gtk';
import Adw from 'gi://Adw';

import * as Gtk1 from './utils/gtk1.js';
import * as Adw1 from './utils/adw1.js';

import { gobjectChild, gobjectClass, gobjectProp } from './utils/decorator.js';
import { Log } from './utils/log.js';
import { Result } from './utils/result.js';
import { Errors, FlatError } from './utils/errors.js';
import { bind } from './utils/decorator.js';

import { Config } from './config.js';
import { isValidAddonId, isValidAddonName } from './id.js';
import { LateBindee, LateBinder } from './mvc.js';

interface StackPage {
  readonly stackPageId: string;
}

interface InState {
  type: string;
  value: any;
  valid: boolean;
  getter: () => any;
  setter: (val: any) => void;
  validator: (val: any) => boolean;
}

@gobjectClass({
  Signals: { 'state-changed': {} }
})
class InputStateManager extends GObject.Object {
  states: Map<string, InState>;
  all_valid: boolean;

  constructor(param = {}) {
    super(param);
    this.states = new Map;
    this.all_valid = true;
  }

  add_state(id: string, type: string, getter: () => any, setter: (val: any) => void, validator: (val: any) => boolean) {
    if (this.states.has(id)) {
      Log.error('State already exists');
      return;
    }
    const init_value = getter();
    if (typeof init_value !== type) {
      Log.error('Inconsistent state type');
      return;
    }
    setter(init_value);
    const another_value = getter();
    if (another_value !== init_value) {
      Log.error('Setter is not consistent');
      return;
    }
    const state: InState = {
      type,
      value: init_value,
      valid: true,
      getter,
      setter,
      validator,
    }
    this.states.set(id, state);
  }

  listen(widget: Gtk.Widget, signal: string) {
    widget.connect(signal, this.update_states);
  }

  set_valid(id: string, val: boolean) {
    const state = this.states.get(id);
    if (state === undefined) {
      Log.error('State doesn\'t exists');
      return;
    }
    state.valid = val;
  }

  get_valid(id: string) {
    const state = this.states.get(id);
    if (state === undefined) {
      throw new Error('State doesn\'t exists');
    }
    return state.valid;
  }

  update_states = () => {
    let all_valid = true;
    this.states.forEach(x => {
      x.value = x.getter();
      x.valid = x.validator(x.value);
      if (!x.valid) all_valid = x.valid;
    })
    this.all_valid = all_valid;
    this.emit('state-changed');
  }
}

interface Painting {
  canvas: Gtk.Widget;
  getter: () => boolean;
}

@gobjectClass()
class ErrorPainter extends GObject.Object {
  paintings: Map<string, Painting>;

  constructor(param = {}) {
    super(param);
    this.paintings = new Map();
  }

  add_painting(id: string, obj: Gtk.Widget, getter: () => boolean) {
    if (this.paintings.has(id)) {
      Log.error('Painting already exists!');
      return;
    }
    const painting: Painting = {
      canvas: obj,
      getter,
    }
    this.paintings.set(id, painting);
  }

  listen(widget: GObject.Object, signal: string) {
    widget.connect(signal, this.paints);
  }

  paints = () => {
    this.paintings.forEach(x => {
      if (!x.getter()) {
        x.canvas.add_css_class('error');
        return;
      }
      x.canvas.remove_css_class('error');
    })
  }
}


@gobjectClass({
  Template: `resource://${Config.config.app_rdnn}/ui/add-addon-name.ui`,
  Properties: {
    'input-source': GObject.ParamSpec.jsobject(
      'input-source', 'input-source', 'input-source',
      GObject.ParamFlags.READWRITE),
  },
  Children: [
    'scanButton',
    'stvpkid',
  ],
  Signals: {
    'switch-to-here': {},
  },
})
export class AddAddonName extends Gtk.Box
implements StackPage, LateBindee<AddAddonWindow> {
  readonly stackPageId = 'namePage';

  @gobjectChild scanButton!: Gtk1.SpinningButton;
  @gobjectChild stvpkid!: Adw.EntryRow;

  @bind toaster!: Adw1.Toaster;
  @bind promiser!: Gtk1.WindowPromiser<[string]>;

  input: InputStateManager;
  painter: ErrorPainter;

  constructor(param = {}) {
    super(param);
    this.input = new InputStateManager();
    this.input.add_state('stvpkid', 'string',
      () => {
        return this.stvpkid.get_text() || '';
      },
      (val: string) => {
        this.stvpkid.set_text(val);
      },
      isValidAddonId);
    this.input.listen(this.stvpkid, 'notify::text');

    this.painter = new ErrorPainter();
    this.painter.add_painting('stvpkid', this.stvpkid, () => {
      return this.input.get_valid('stvpkid');
    });
    this.painter.listen(this.input, 'state-changed');

    this.scanButton.post_spinning_sensitivity_getter_override = () => {
      return this.input.get_valid('stvpkid');
    }
    this.input.connect('state-changed', () => {
      this.scanButton.set_sensitive(this.input.get_valid('stvpkid'));
    })
  }

  onBind(addAddonWindow: AddAddonWindow) {
    this.toaster = addAddonWindow;
    this.promiser = new Gtk1.WindowPromiser<[string]>(addAddonWindow);
  }

  resetState() {
    this.scanButton.set_spinning(false);
  }

  showErrorMsg(msg: string) {
    Adw1.Toast.builder()
      .title(msg)
      .timeout(2)
      .wrap().build()
      .present(this.toaster);
    this.input.set_valid('stvpkid', false);
  }

  onScan() {
    this.stvpkid.notify('text');
    const stvpkid = this.stvpkid.get_text() || '';
    this.promiser.resolve([stvpkid]);
    this.scanButton.set_spinning(true);
  }

  async present(): Promise<Result<[string], GLib.Error | Error>> {
    this.resetState();
    const promise = this.promiser.promise();
    this.emit('switch-to-here');
    return promise;
  }
}

interface InputState {
  initInputSource: () => void;
  updateInputSource: () => void;
  readonly inputSource: any;
}

interface ErrorState {
  initErrorState: () => void;
  updateErrorState: () => void;
  readonly errorSource: any;
}

export namespace AddAddonPreviewDownload {
  export interface CacheInfo {
    addonName: string,
    addonId: string,
  }
}

@gobjectClass({
  Template: `resource://${Config.config.app_rdnn}/ui/add-addon-preview-download.ui`,
  Properties: {
  'input-source': GObject.ParamSpec.jsobject(
    'input-source', 'input-source', 'input-source',
    GObject.ParamFlags.READWRITE),
  },
  Children: [
    'addonName',
    'stvpkid',
    'includeInProfile',
    'downloadButton',
  ],
  Signals: {
    'switch-to-here': [],
  }
})
export class AddAddonPreviewDownload extends Gtk.Box
implements StackPage, LateBindee<AddAddonWindow>, InputState, ErrorState {
  readonly stackPageId = 'previewDownload';

  data!: AddAddonPreviewDownload.CacheInfo;

  @gobjectChild addonName!: Adw.EntryRow;
  @gobjectChild stvpkid!: Adw.EntryRow;
  @gobjectChild includeInProfile!: Gtk.Switch;
  @gobjectChild downloadButton!: Gtk.Button;

  @bind toaster!: Adw1.Toaster;
  @bind window!: Gtk.Window;
  @bind promiser!: Gtk1.WindowPromiser<[string, string, boolean]>;

  readonly inputSource = {
    addonName: {
      valid: true,
      setValid: (val: boolean) => {
        if (this.inputSource.addonName.valid === val) return;
        this.inputSource.addonName.valid = val;
        this.notify('input-source');
      },
    },
    stvpkid: {
      valid: true,
      setValid: (val: boolean) => {
        if (this.inputSource.stvpkid.valid === val) return;
        this.inputSource.stvpkid.valid = val;
        this.notify('input-source');
      },
    }
  };

  readonly errorSource = {
    addonName: {
      errorMsg: '',
    },
    stvpkid: {
      errorMsg: '',
    },
  }

  constructor(param = {}) {
    super(param);
    this.initInputSource();
    this.initErrorState();
  }

  initInputSource = () => {
    this.addonName.connect('notify::text', this.updateInputSource);
    this.stvpkid.connect('notify::text', this.updateInputSource);
  }

  updateInputSource = () => {
    const addonNameState = this.inputSource.addonName;
    const addonName = this.addonName.get_text() || '';
    addonNameState.setValid(isValidAddonName(addonName));

    const stvpkidState = this.inputSource.stvpkid;
    const stvpkid = this.stvpkid.get_text() || '';
    stvpkidState.setValid(isValidAddonId(stvpkid));
  };

  initErrorState = () => {
    this.connect('notify::input-source', this.updateErrorState);
  }

  updateErrorState = () => {
    [
      {
        input: this.inputSource.addonName,
        widget: this.addonName,
        error: this.errorSource.addonName,
      },
      {
        input: this.inputSource.stvpkid,
        widget: this.stvpkid,
        error: this.errorSource.stvpkid,
      },
    ].forEach(({input, widget, error}) => {
      if (!input.valid) {
        widget.add_css_class('error');
        if (error.errorMsg === '') return;
        Adw1.Toast.builder()
          .title(error.errorMsg)
          .timeout(2)
          .wrap().build()
          .present(this.toaster);
        // FIXME(kinten): Error message should be of one-time use. Either pass as parameter or something
        error.errorMsg = '';
      } else {
        widget.remove_css_class('error');
      }
    });

    const valid = [
      this.inputSource.addonName.valid,
      this.inputSource.stvpkid.valid,
    ].reduce((acc, x) => {
      return acc && x;
    })

    this.downloadButton.set_sensitive(valid);
  }

  onBind(controller: AddAddonWindow) {
    this.toaster = controller;
    this.window = controller;
    this.promiser = new Gtk1.WindowPromiser<[string, string, boolean]>(this.window);
  }

  onDownload() {
    this.updateInputSource();
    if (!this.inputSource.addonName.valid || !this.inputSource.stvpkid.valid)
      return;

    const addonName = this.addonName.get_text() || '';
    const stvpkid = this.stvpkid.get_text() || '';
    const includeInProfile = this.includeInProfile.get_active();

    this.promiser.resolve([addonName, stvpkid, includeInProfile]);
    // will this trigger a reject? Experiments say no, but my mind says yes
    // contect: a rejector is connected to the close-request signal, as per WindowPromiser
  }

  onGoBack() {
    const error = new FlatError({
      code: Errors.DIALOG_GO_BACK,
    })
    this.promiser.reject(error);
  }

  onSyncName() {
    this.addonName.set_text(this.data.addonName);
    Adw1.Toast.builder()
      .title('Generated add-on name')
      .timeout(2)
      .wrap().build()
      .present(this.toaster);
    return;
  }

  onSyncId() {
    this.stvpkid.set_text(this.data.addonId);
    Adw1.Toast.builder()
      .title('Generated add-on ID')
      .timeout(2)
      .wrap().build()
      .present(this.toaster);
    return;
  }

  async present(data: AddAddonPreviewDownload.CacheInfo) {
    this.data = data;
    this.addonName.set_text(data.addonName);
    this.stvpkid.set_text(data.addonId);
    const promise = this.promiser.promise();
    this.emit('switch-to-here');
    return promise;
  }
}

@gobjectClass({
  Template: `resource://${Config.config.app_rdnn}/ui/add-addon-url.ui`,
  Properties: {
    'input-source': GObject.ParamSpec.jsobject(
      'input-source', 'input-source', 'input-source',
      GObject.ParamFlags.READWRITE),
  },
  Children: [
    'validateButton',
    'url',
  ],
  Signals: {
    'switch-to-here': {},
  },
})
export class AddAddonUrl extends Gtk.Box
implements StackPage, LateBindee<AddAddonWindow>, InputState, ErrorState {
  readonly stackPageId = 'url';

  @gobjectProp inputSource = {
    url: {
      valid: true,
      setValid: (val: boolean) => {
        if (this.inputSource.url.valid === val) return;
        this.inputSource.url.valid = val;
        this.notify('input-source');
      },
    },
  };

  errorSource = {
    url: {
      errorMsg: '',
    }
  }

  @gobjectChild validateButton!: Gtk.Button;
  @gobjectChild url!: Adw.EntryRow;

  @bind toaster!: Adw1.Toaster;
  @bind window!: Gtk.Window;
  @bind promiser!: Gtk1.WindowPromiser<[string]>;

  spinner: Gtk.Spinner;


  constructor(param = {}) {
    super(param);
    this.spinner = new Gtk.Spinner({
      spinning: true,
    });
    this.initInputSource();
    this.initErrorState();
  }

  onBind(controller: AddAddonWindow) {
    this.toaster = controller;
    this.window = controller;
    this.promiser = new Gtk1.WindowPromiser<[string]>(this.window);
  }

  initInputSource () {
    this.url.connect('notify::text', this.updateInputSource);
  }

  updateInputSource = () => {
    const urlState = this.inputSource.url;
    urlState.setValid(this.isValidUrl(this.url.get_text()));
    this.notify('input-source');
  }

  resetState() {
    this.setValidateButtonSpinning(false);
  }

  isValidUrl(val: string | null): boolean {
    if (val === null) return false;
    if (val === '') return false;
    return true;
  }

  initErrorState() {
    this.connect('notify::input-source', this.updateErrorState);
  }

  updateErrorState = () => {
    [
      {
        input: this.inputSource.url,
        widget: this.url,
        error: this.errorSource.url,
      },
    ].forEach(({input, widget, error}) => {
      if (!input.valid) {
        widget.add_css_class('error');
        if (error.errorMsg === '') return;
        Adw1.Toast.builder()
          .title(error.errorMsg)
          .timeout(2)
          .wrap().build()
          .present(this.toaster);
        error.errorMsg = '';
      } else {
        widget.remove_css_class('error');
      }
    });

    this.validateButton.set_sensitive(this.inputSource.url.valid);
  }

  setValidateButtonSpinning(val: boolean) {
    if (val) {
      this.spinner.set_parent(this.validateButton);
      this.validateButton.set_label('');
      this.validateButton.set_sensitive(false);
      return;
    }
    this.spinner.unparent();
    this.validateButton.set_label('Validate');
    this.validateButton.set_sensitive(this.inputSource.url.valid);
  }

  onValidate() {
    this.updateInputSource();
    const url = this.url.get_text() || '';
    this.promiser.resolve([url]);
    // button switch to loading state
    this.setValidateButtonSpinning(true);
  }

  async present(): Promise<Result<[string], GLib.Error | Error>> {
    this.resetState();
    const promise = this.promiser.promise();
    this.emit('switch-to-here');
    return promise;
  }
}

type AddAddonWizardNodeAction = (...args: any[]) => Promise<[Symbol, ...any[]]>;

class AddAddonWizardNode {
  neighbors: Map<Symbol, AddAddonWizardNode>;
  action: AddAddonWizardNodeAction;

  constructor(param: { action: AddAddonWizardNodeAction }) {
    this.action = param.action;
    this.neighbors = new Map;
  }
}

export class AddAddonWizard {
  pages: AddAddonWizardNode[];
  navigation = {
    NEXT: Symbol('next'),
    BACK: Symbol('back'),
    RETRY: Symbol('retry'),
    QUIT: Symbol('quit'),
  };
  cancellable: Gio.Cancellable;

  constructor() {
    this.pages = [];
    this.cancellable = new Gio.Cancellable();
  }

  async run() {
    let next = this.pages[0];
    let args: any[] = [];
    while (next !== undefined && !this.cancellable.is_cancelled()) {
      const page = next;
      const [decision, ...nextargs] = await page.action(...args).catch(error => {
        Log.error('Caught a loose error in AddAddonWizard::run:');
        Log.error(error);
        return [this.navigation.QUIT];
      });
      if (decision === this.navigation.QUIT) {
        Log.debug('quit');
        break;
      }
      args = nextargs;
      next = page.neighbors.get(decision);
      if (next === undefined)
        Log.warn('Unknown wizard.navigation encountered');
    }
  }

  addPage(action: AddAddonWizardNodeAction) {
    const newpage = new AddAddonWizardNode({ action });
    const lastPage = this.pages[this.pages.length - 1];
    if (lastPage !== undefined) {
      newpage.neighbors.set(this.navigation.BACK, lastPage);
      lastPage.neighbors.set(this.navigation.NEXT, newpage);
    }
    newpage.neighbors.set(this.navigation.RETRY, newpage);
    this.pages.push(newpage);
    return newpage;
  }
}

@gobjectClass({
  Template: `resource://${Config.config.app_rdnn}/ui/add-addon.ui`,
  Children: [
    'toastOverlay',
    'viewStack',
    'url',
    'previewDownload',
    'namePage',
  ],
})
export class AddAddonWindow extends Adw.Window
implements Adw1.Toaster, LateBinder {
  @gobjectChild toastOverlay!: Adw.ToastOverlay;
  @gobjectChild viewStack!: Adw.ViewStack;
  @gobjectChild url!: AddAddonUrl;
  @gobjectChild previewDownload!: AddAddonPreviewDownload;
  @gobjectChild namePage!: AddAddonName;

  constructor(params = {}) {
    super(params);
    [
      this.url,
      this.previewDownload,
      this.namePage,
    ].forEach((x, _, arr) => {
      x.connect('switch-to-here', () => {
        this.viewStack.set_visible_child_name(x.stackPageId);
        arr.forEach(y => {
          if (y === x) return;
          y.set_visible(false);
        });
        x.set_visible(true);
      });
    });
    this.bind();
  }

  bind() {
    [
      this.url,
      this.previewDownload,
      this.namePage,
    ].forEach((x: LateBindee<AddAddonWindow>) => {
      x.onBind(this);
    });
  }

  displayToast(toast: Adw.Toast) {
    this.toastOverlay.add_toast(toast);
  }
}
