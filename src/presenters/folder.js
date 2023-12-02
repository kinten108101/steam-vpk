import GObject from 'gi://GObject';
import Gio from 'gi://Gio';
import { MAX_U16, MAX_U32 } from '../utils/const.js';

/**
 * @param {number} num
 * @returns {boolean}
 */
function is_valid_u32(num) {
  return (num >= 0) && (num <= MAX_U32);
}

/**
 * @typedef {{
 *   set_visible_child_name(name: string): void;
 *   get_visible_child_name(): string;
 * }} Pager
 */

class Page extends GObject.Object {
  static {
    GObject.registerClass({
      GTypeName: 'StvpkPage',
      Properties: {
        page_name: GObject.ParamSpec.string(
          'page-name', '', '',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
          ''),
        view_name: GObject.ParamSpec.string(
          'view-name', '', '',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
          ''),
      },
    }, this);
  }

  /**
   * @type {!string}
   */
  // @ts-expect-error
  page_name;

  /**
   * @type {!string}
   */
  // @ts-expect-error
  view_name;

  /**
   * @param {{
   *   page_name: string;
   *   view_name: string;
   * }} params
   */
  constructor(params) {
    super(params);
  }
}

/**
 * A traversable timeline with view stack interface
 * @implements Pager
 */
export default class Folder extends GObject.Object {
  static {
    GObject.registerClass({
      Properties: {
        page_cursor: GObject.ParamSpec.int(
          'page-cursor', '', '',
          GObject.ParamFlags.READWRITE | GObject.ParamFlags.CONSTRUCT,
          -1, MAX_U16,
          -1),
      },
    }, this);
  }

  page_stack = new Gio.ListStore({ item_type: Page.$gtype });

  /**
   * @type {!number}
   */
  // @ts-expect-error
  page_cursor;

  /**
   * @type {Map<string, {
   *   apply_fn: (current_page: string | null, target_page: string, target_view: string) => boolean;
   * }>}
   */
  page_handlers = new Map;

  constructor(params = {}) {
    super(params);
  }

  /**
   * @param {string} view_name
   * @param {(current_page: string | null, target_page: string, id: string) => boolean} apply_fn
   * @returns {void}
   */
  add_handler(view_name, apply_fn) {
    this.page_handlers.set(view_name, {
      apply_fn,
    });
  }

  /**
   * @param {Page} [page]
   * @returns {boolean}
   */
  navigate_forward(page) {
    const target_page = page ? page : (is_valid_u32(this.page_cursor + 1) ? /** @type {Page | null} */ (this.page_stack.get_item(this.page_cursor + 1)) : null);
    if (!target_page) return false;
    const target_handler = this.page_handlers.get(target_page.view_name);
    if (!target_handler) throw new Error;
    const {apply_fn} = target_handler;
    const current_page = is_valid_u32(this.page_cursor) ? /** @type {Page | null} */ (this.page_stack.get_item(this.page_cursor)) : null;
    if (!apply_fn(current_page?.page_name || null, target_page.page_name, target_page.view_name)) return false;
    this.page_cursor++;
    return true;
  }

  /**
   * @param {Page} [page]
   * @returns {boolean}
   */
  navigate_backward(page) {
    const target_page = page ? page : (is_valid_u32(this.page_cursor - 1) ? /** @type {Page | null} */ (this.page_stack.get_item(this.page_cursor - 1)) : null);
    if (!target_page) return false;
    const current_page = is_valid_u32(this.page_cursor) ? /** @type {Page | null} */ (this.page_stack.get_item(this.page_cursor)) : null;
    const target_handler = this.page_handlers.get(target_page.view_name);
    if (!target_handler) throw new Error;
    const {apply_fn} = target_handler;
    if (!apply_fn(current_page?.page_name || null, target_page.page_name, target_page.view_name)) return false;
    this.page_cursor--;
    return true;
  }

  get_visible_child_name() {
    const current_page = ( /** @type {Page | null} */ (this.page_stack.get_item(this.page_cursor - 1)));
    if (!current_page) throw new Error;
    return current_page.page_name;
  }

  /**
   * @param {string} page_name
   * @returns {void}
   */
  set_visible_child_name(page_name) {
    if (is_valid_u32(this.page_cursor + 1)) {
      const next_page = ( /** @type {Page | null} */ (this.page_stack.get_item(this.page_cursor + 1)));
      if (next_page && next_page.page_name === page_name) {
        this.navigate_forward(next_page);
        return;
      }
    }
    if (is_valid_u32(this.page_cursor - 1)) {
      const prev_page = ( /** @type {Page | null} */ (this.page_stack.get_item(this.page_cursor - 1)));
      if (prev_page && prev_page.page_name === page_name) {
        this.navigate_backward(prev_page);
        return;
      }
    }

    let i = this.page_cursor - 2;
    /**
     * @type {?Page}
     */
    let existing_page = null;
    while (i >= 0) {
      const page = ( /** @type {Page | null} */ (this.page_stack.get_item(i)));
      if (page && page.page_name === page_name) {
        existing_page = page;
        break;
      }
      i--;
    }

    if (existing_page) {
      this.page_cursor = i;
      return;
    }

    const top = this.page_stack.get_n_items() - 1;
    const removals = Math.max(top - Math.max(this.page_cursor, 0), 0);
    const page_name_parts = page_name.split('/');
    if (page_name_parts.length > 1 && page_name_parts.length !== 2) throw new Error;
    const view_name = page_name_parts[0] || page_name;
    const new_page = new Page({
      page_name,
      view_name,
    });
    this.page_stack.splice(this.page_cursor + 1, removals, [new_page]);

    this.navigate_forward(new_page);
  }

  /**
   * @param {string} page_name
   * @returns {boolean}
   */
  cut_path(page_name) {
    const top = this.page_stack.get_n_items() - 1;
    let i = top;
    /**
     * @type {?Page}
     */
    let target_page = null;
    while (i > 0) {
      const page = ( /** @type {Page | null} */ (this.page_stack.get_item(i)));
      if (page && page.page_name === page_name) {
        target_page = page;
        break;
      }
      i--;
    }
    if (target_page && (this.page_cursor < i)) {
      const removals = top - i + 1;
      if (removals) {
        this.page_stack.splice(i, removals, []);
        return true;
      }
    }
    return false;
  }
}
