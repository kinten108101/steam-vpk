/**
 * Panel 1
 *
 * Generated from 1.3.0
 */

import * as Gio from "gi-types/gio2";
import * as GObject from "gi-types/gobject2";
import * as Adw from "gi-types/adw1";
import * as Gtk from "gi-types/gtk4";
import * as GLib from "gi-types/glib2";

export const MAJOR_VERSION: number;
export const MICRO_VERSION: number;
export const MINOR_VERSION: number;
export const VERSION_S: string;
export const WIDGET_KIND_ANY: string;
export const WIDGET_KIND_DOCUMENT: string;
export const WIDGET_KIND_UNKNOWN: string;
export const WIDGET_KIND_UTILITY: string;
export function check_version(major: number, minor: number, micro: number): boolean;
export function finalize(): void;
export function get_major_version(): number;
export function get_micro_version(): number;
export function get_minor_version(): number;
export function get_resource(): Gio.Resource;
export function init(): void;
export function marshal_BOOLEAN__OBJECT_OBJECT(
    closure: GObject.Closure,
    return_value: GObject.Value | any,
    n_param_values: number,
    param_values: GObject.Value | any,
    invocation_hint?: any | null,
    marshal_data?: any | null
): void;
export function marshal_OBJECT__OBJECT(
    closure: GObject.Closure,
    return_value: GObject.Value | any,
    n_param_values: number,
    param_values: GObject.Value | any,
    invocation_hint?: any | null,
    marshal_data?: any | null
): void;
export type ActionActivateFunc = (instance: any | null, action_name: string, param: GLib.Variant) => void;
export type FrameCallback = (frame: Frame) => void;
export type WorkspaceForeach = (workspace: Workspace) => void;

export namespace Area {
    export const $gtype: GObject.GType<Area>;
}

export enum Area {
    START = 0,
    END = 1,
    TOP = 2,
    BOTTOM = 3,
    CENTER = 4,
}
export module ActionMuxer {
    export interface ConstructorProperties extends GObject.Object.ConstructorProperties {
        [key: string]: any;
    }
}
export class ActionMuxer extends GObject.Object implements Gio.ActionGroup {
    static $gtype: GObject.GType<ActionMuxer>;

    constructor(properties?: Partial<ActionMuxer.ConstructorProperties>, ...args: any[]);
    _init(properties?: Partial<ActionMuxer.ConstructorProperties>, ...args: any[]): void;

    // Constructors

    static ["new"](): ActionMuxer;

    // Members

    get_action_group(prefix: string): Gio.ActionGroup | null;
    insert_action_group(prefix: string, action_group: Gio.ActionGroup): void;
    list_groups(): string[];
    remove_action_group(prefix: string): void;
    remove_all(): void;

    // Implemented Members

    action_added(action_name: string): void;
    action_enabled_changed(action_name: string, enabled: boolean): void;
    action_removed(action_name: string): void;
    action_state_changed(action_name: string, state: GLib.Variant): void;
    activate_action(action_name: string, parameter?: GLib.Variant | null): void;
    change_action_state(action_name: string, value: GLib.Variant): void;
    get_action_enabled(action_name: string): boolean;
    get_action_parameter_type(action_name: string): GLib.VariantType | null;
    get_action_state(action_name: string): GLib.Variant | null;
    get_action_state_hint(action_name: string): GLib.Variant | null;
    get_action_state_type(action_name: string): GLib.VariantType | null;
    has_action(action_name: string): boolean;
    list_actions(): string[];
    query_action(
        action_name: string
    ): [boolean, boolean, GLib.VariantType | null, GLib.VariantType | null, GLib.Variant | null, GLib.Variant | null];
    vfunc_action_added(action_name: string): void;
    vfunc_action_enabled_changed(action_name: string, enabled: boolean): void;
    vfunc_action_removed(action_name: string): void;
    vfunc_action_state_changed(action_name: string, state: GLib.Variant): void;
    vfunc_activate_action(action_name: string, parameter?: GLib.Variant | null): void;
    vfunc_change_action_state(action_name: string, value: GLib.Variant): void;
    vfunc_get_action_enabled(action_name: string): boolean;
    vfunc_get_action_parameter_type(action_name: string): GLib.VariantType | null;
    vfunc_get_action_state(action_name: string): GLib.Variant | null;
    vfunc_get_action_state_hint(action_name: string): GLib.Variant | null;
    vfunc_get_action_state_type(action_name: string): GLib.VariantType | null;
    vfunc_has_action(action_name: string): boolean;
    vfunc_list_actions(): string[];
    vfunc_query_action(
        action_name: string
    ): [boolean, boolean, GLib.VariantType | null, GLib.VariantType | null, GLib.Variant | null, GLib.Variant | null];
}
export module Application {
    export interface ConstructorProperties extends Adw.Application.ConstructorProperties {
        [key: string]: any;
    }
}
export class Application extends Adw.Application implements Gio.ActionGroup, Gio.ActionMap {
    static $gtype: GObject.GType<Application>;

    constructor(properties?: Partial<Application.ConstructorProperties>, ...args: any[]);
    _init(properties?: Partial<Application.ConstructorProperties>, ...args: any[]): void;

    // Constructors

    static ["new"](application_id: string, flags: Gio.ApplicationFlags): Application;
    // Conflicted with Adw.Application.new
    static ["new"](...args: never[]): any;
}
export module Dock {
    export interface ConstructorProperties extends Gtk.Widget.ConstructorProperties {
        [key: string]: any;
        bottom_height: number;
        bottomHeight: number;
        can_reveal_bottom: boolean;
        canRevealBottom: boolean;
        can_reveal_end: boolean;
        canRevealEnd: boolean;
        can_reveal_start: boolean;
        canRevealStart: boolean;
        can_reveal_top: boolean;
        canRevealTop: boolean;
        end_width: number;
        endWidth: number;
        reveal_bottom: boolean;
        revealBottom: boolean;
        reveal_end: boolean;
        revealEnd: boolean;
        reveal_start: boolean;
        revealStart: boolean;
        reveal_top: boolean;
        revealTop: boolean;
        start_width: number;
        startWidth: number;
        top_height: number;
        topHeight: number;
    }
}
export class Dock extends Gtk.Widget implements Gtk.Accessible, Gtk.Buildable, Gtk.ConstraintTarget {
    static $gtype: GObject.GType<Dock>;

    constructor(properties?: Partial<Dock.ConstructorProperties>, ...args: any[]);
    _init(properties?: Partial<Dock.ConstructorProperties>, ...args: any[]): void;

    // Properties
    get bottom_height(): number;
    set bottom_height(val: number);
    get bottomHeight(): number;
    set bottomHeight(val: number);
    get can_reveal_bottom(): boolean;
    get canRevealBottom(): boolean;
    get can_reveal_end(): boolean;
    get canRevealEnd(): boolean;
    get can_reveal_start(): boolean;
    get canRevealStart(): boolean;
    get can_reveal_top(): boolean;
    get canRevealTop(): boolean;
    get end_width(): number;
    set end_width(val: number);
    get endWidth(): number;
    set endWidth(val: number);
    get reveal_bottom(): boolean;
    set reveal_bottom(val: boolean);
    get revealBottom(): boolean;
    set revealBottom(val: boolean);
    get reveal_end(): boolean;
    set reveal_end(val: boolean);
    get revealEnd(): boolean;
    set revealEnd(val: boolean);
    get reveal_start(): boolean;
    set reveal_start(val: boolean);
    get revealStart(): boolean;
    set revealStart(val: boolean);
    get reveal_top(): boolean;
    set reveal_top(val: boolean);
    get revealTop(): boolean;
    set revealTop(val: boolean);
    get start_width(): number;
    set start_width(val: number);
    get startWidth(): number;
    set startWidth(val: number);
    get top_height(): number;
    set top_height(val: number);
    get topHeight(): number;
    set topHeight(val: number);

    // Signals

    connect(id: string, callback: (...args: any[]) => any): number;
    connect_after(id: string, callback: (...args: any[]) => any): number;
    emit(id: string, ...args: any[]): void;
    connect(signal: "adopt-widget", callback: (_source: this, widget: Widget) => boolean): number;
    connect_after(signal: "adopt-widget", callback: (_source: this, widget: Widget) => boolean): number;
    emit(signal: "adopt-widget", widget: Widget): void;
    connect(signal: "create-frame", callback: (_source: this, position: Position) => Frame): number;
    connect_after(signal: "create-frame", callback: (_source: this, position: Position) => Frame): number;
    emit(signal: "create-frame", position: Position): void;
    connect(signal: "panel-drag-begin", callback: (_source: this, panel: Widget) => void): number;
    connect_after(signal: "panel-drag-begin", callback: (_source: this, panel: Widget) => void): number;
    emit(signal: "panel-drag-begin", panel: Widget): void;
    connect(signal: "panel-drag-end", callback: (_source: this, panel: Widget) => void): number;
    connect_after(signal: "panel-drag-end", callback: (_source: this, panel: Widget) => void): number;
    emit(signal: "panel-drag-end", panel: Widget): void;

    // Implemented Properties

    get accessible_role(): Gtk.AccessibleRole;
    set accessible_role(val: Gtk.AccessibleRole);
    get accessibleRole(): Gtk.AccessibleRole;
    set accessibleRole(val: Gtk.AccessibleRole);

    // Constructors

    static ["new"](): Dock;

    // Members

    foreach_frame(): void;
    get_can_reveal_area(area: Area): boolean;
    get_can_reveal_bottom(): boolean;
    get_can_reveal_end(): boolean;
    get_can_reveal_start(): boolean;
    get_can_reveal_top(): boolean;
    get_reveal_area(area: Area): boolean;
    get_reveal_bottom(): boolean;
    get_reveal_end(): boolean;
    get_reveal_start(): boolean;
    get_reveal_top(): boolean;
    remove(widget: Gtk.Widget): void;
    set_bottom_height(height: number): void;
    set_end_width(width: number): void;
    set_reveal_area(area: Area, reveal: boolean): void;
    set_reveal_bottom(reveal_bottom: boolean): void;
    set_reveal_end(reveal_end: boolean): void;
    set_reveal_start(reveal_start: boolean): void;
    set_reveal_top(reveal_top: boolean): void;
    set_start_width(width: number): void;
    set_top_height(height: number): void;
    vfunc_panel_drag_begin(widget: Widget): void;
    vfunc_panel_drag_end(widget: Widget): void;

    // Implemented Members

    get_accessible_parent(): Gtk.Accessible | null;
    get_accessible_role(): Gtk.AccessibleRole;
    get_at_context(): Gtk.ATContext;
    get_bounds(): [boolean, number, number, number, number];
    get_first_accessible_child(): Gtk.Accessible | null;
    get_next_accessible_sibling(): Gtk.Accessible | null;
    get_platform_state(state: Gtk.AccessiblePlatformState): boolean;
    reset_property(property: Gtk.AccessibleProperty): void;
    reset_relation(relation: Gtk.AccessibleRelation): void;
    reset_state(state: Gtk.AccessibleState): void;
    set_accessible_parent(parent?: Gtk.Accessible | null, next_sibling?: Gtk.Accessible | null): void;
    update_next_accessible_sibling(new_sibling?: Gtk.Accessible | null): void;
    update_property(properties: Gtk.AccessibleProperty[], values: GObject.Value[]): void;
    update_relation(relations: Gtk.AccessibleRelation[], values: GObject.Value[]): void;
    update_state(states: Gtk.AccessibleState[], values: GObject.Value[]): void;
    vfunc_get_accessible_parent(): Gtk.Accessible | null;
    vfunc_get_at_context(): Gtk.ATContext | null;
    vfunc_get_bounds(): [boolean, number, number, number, number];
    vfunc_get_first_accessible_child(): Gtk.Accessible | null;
    vfunc_get_next_accessible_sibling(): Gtk.Accessible | null;
    vfunc_get_platform_state(state: Gtk.AccessiblePlatformState): boolean;
    get_buildable_id(): string | null;
    vfunc_add_child(builder: Gtk.Builder, child: GObject.Object, type?: string | null): void;
    vfunc_custom_finished(builder: Gtk.Builder, child: GObject.Object | null, tagname: string, data?: any | null): void;
    vfunc_custom_tag_end(builder: Gtk.Builder, child: GObject.Object | null, tagname: string, data?: any | null): void;
    vfunc_custom_tag_start(
        builder: Gtk.Builder,
        child: GObject.Object | null,
        tagname: string
    ): [boolean, Gtk.BuildableParser, any];
    vfunc_get_id(): string;
    vfunc_get_internal_child<T = GObject.Object>(builder: Gtk.Builder, childname: string): T;
    vfunc_parser_finished(builder: Gtk.Builder): void;
    vfunc_set_buildable_property(builder: Gtk.Builder, name: string, value: GObject.Value | any): void;
    vfunc_set_id(id: string): void;
}
export module DocumentWorkspace {
    export interface ConstructorProperties extends Workspace.ConstructorProperties {
        [key: string]: any;
        dock: Dock;
        grid: Grid;
        statusbar: Statusbar;
    }
}
export class DocumentWorkspace
    extends Workspace
    implements
        Gio.ActionGroup,
        Gio.ActionMap,
        Gtk.Accessible,
        Gtk.Buildable,
        Gtk.ConstraintTarget,
        Gtk.Native,
        Gtk.Root,
        Gtk.ShortcutManager
{
    static $gtype: GObject.GType<DocumentWorkspace>;

    constructor(properties?: Partial<DocumentWorkspace.ConstructorProperties>, ...args: any[]);
    _init(properties?: Partial<DocumentWorkspace.ConstructorProperties>, ...args: any[]): void;

    // Properties
    get dock(): Dock;
    get grid(): Grid;
    get statusbar(): Statusbar;

    // Signals

    connect(id: string, callback: (...args: any[]) => any): number;
    connect_after(id: string, callback: (...args: any[]) => any): number;
    emit(id: string, ...args: any[]): void;
    connect(signal: "add-widget", callback: (_source: this, object: Widget, p0: Position) => boolean): number;
    connect_after(signal: "add-widget", callback: (_source: this, object: Widget, p0: Position) => boolean): number;
    emit(signal: "add-widget", object: Widget, p0: Position): void;
    connect(signal: "create-frame", callback: (_source: this, object: Position) => Frame): number;
    connect_after(signal: "create-frame", callback: (_source: this, object: Position) => Frame): number;
    emit(signal: "create-frame", object: Position): void;

    // Constructors

    static ["new"](): DocumentWorkspace;

    // Members

    add_widget(widget: Widget, position?: Position | null): void;
    get_dock(): Dock;
    get_grid(): Grid;
    get_statusbar(): Statusbar | null;
    get_titlebar(): Gtk.Widget | null;
    set_titlebar(titlebar: Gtk.Widget): void;
    // Conflicted with Gtk.Window.set_titlebar
    set_titlebar(...args: never[]): any;
    vfunc_add_widget(widget: Widget, position: Position): boolean;
}
export module Frame {
    export interface ConstructorProperties extends Gtk.Widget.ConstructorProperties {
        [key: string]: any;
        closeable: boolean;
        empty: boolean;
        placeholder: Gtk.Widget;
        visible_child: Widget;
        visibleChild: Widget;
    }
}
export class Frame extends Gtk.Widget implements Gtk.Accessible, Gtk.Buildable, Gtk.ConstraintTarget, Gtk.Orientable {
    static $gtype: GObject.GType<Frame>;

    constructor(properties?: Partial<Frame.ConstructorProperties>, ...args: any[]);
    _init(properties?: Partial<Frame.ConstructorProperties>, ...args: any[]): void;

    // Properties
    get closeable(): boolean;
    get empty(): boolean;
    get placeholder(): Gtk.Widget;
    set placeholder(val: Gtk.Widget);
    get visible_child(): Widget;
    set visible_child(val: Widget);
    get visibleChild(): Widget;
    set visibleChild(val: Widget);

    // Signals

    connect(id: string, callback: (...args: any[]) => any): number;
    connect_after(id: string, callback: (...args: any[]) => any): number;
    emit(id: string, ...args: any[]): void;
    connect(signal: "adopt-widget", callback: (_source: this, widget: Widget) => boolean): number;
    connect_after(signal: "adopt-widget", callback: (_source: this, widget: Widget) => boolean): number;
    emit(signal: "adopt-widget", widget: Widget): void;
    connect(signal: "page-closed", callback: (_source: this, widget: Widget) => void): number;
    connect_after(signal: "page-closed", callback: (_source: this, widget: Widget) => void): number;
    emit(signal: "page-closed", widget: Widget): void;

    // Implemented Properties

    get accessible_role(): Gtk.AccessibleRole;
    set accessible_role(val: Gtk.AccessibleRole);
    get accessibleRole(): Gtk.AccessibleRole;
    set accessibleRole(val: Gtk.AccessibleRole);
    get orientation(): Gtk.Orientation;
    set orientation(val: Gtk.Orientation);

    // Constructors

    static ["new"](): Frame;

    // Members

    add(panel: Widget): void;
    add_before(panel: Widget, sibling: Widget): void;
    get_closeable(): boolean;
    get_empty(): boolean;
    get_header(): FrameHeader | null;
    get_n_pages(): number;
    get_page(n: number): Widget | null;
    get_pages(): Gtk.SelectionModel;
    get_placeholder(): Gtk.Widget | null;
    get_position(): Position;
    get_requested_size(): number;
    get_visible_child(): Widget | null;
    remove(panel: Widget): void;
    set_child_pinned(child: Widget, pinned: boolean): void;
    set_header(header?: FrameHeader | null): void;
    set_placeholder(placeholder?: Gtk.Widget | null): void;
    set_requested_size(requested_size: number): void;
    set_visible_child(widget: Widget): void;
    vfunc_adopt_widget(widget: Widget): boolean;
    vfunc_page_closed(widget: Widget): void;

    // Implemented Members

    get_accessible_parent(): Gtk.Accessible | null;
    get_accessible_role(): Gtk.AccessibleRole;
    get_at_context(): Gtk.ATContext;
    get_bounds(): [boolean, number, number, number, number];
    get_first_accessible_child(): Gtk.Accessible | null;
    get_next_accessible_sibling(): Gtk.Accessible | null;
    get_platform_state(state: Gtk.AccessiblePlatformState): boolean;
    reset_property(property: Gtk.AccessibleProperty): void;
    reset_relation(relation: Gtk.AccessibleRelation): void;
    reset_state(state: Gtk.AccessibleState): void;
    set_accessible_parent(parent?: Gtk.Accessible | null, next_sibling?: Gtk.Accessible | null): void;
    update_next_accessible_sibling(new_sibling?: Gtk.Accessible | null): void;
    update_property(properties: Gtk.AccessibleProperty[], values: GObject.Value[]): void;
    update_relation(relations: Gtk.AccessibleRelation[], values: GObject.Value[]): void;
    update_state(states: Gtk.AccessibleState[], values: GObject.Value[]): void;
    vfunc_get_accessible_parent(): Gtk.Accessible | null;
    vfunc_get_at_context(): Gtk.ATContext | null;
    vfunc_get_bounds(): [boolean, number, number, number, number];
    vfunc_get_first_accessible_child(): Gtk.Accessible | null;
    vfunc_get_next_accessible_sibling(): Gtk.Accessible | null;
    vfunc_get_platform_state(state: Gtk.AccessiblePlatformState): boolean;
    get_buildable_id(): string | null;
    vfunc_add_child(builder: Gtk.Builder, child: GObject.Object, type?: string | null): void;
    vfunc_custom_finished(builder: Gtk.Builder, child: GObject.Object | null, tagname: string, data?: any | null): void;
    vfunc_custom_tag_end(builder: Gtk.Builder, child: GObject.Object | null, tagname: string, data?: any | null): void;
    vfunc_custom_tag_start(
        builder: Gtk.Builder,
        child: GObject.Object | null,
        tagname: string
    ): [boolean, Gtk.BuildableParser, any];
    vfunc_get_id(): string;
    vfunc_get_internal_child<T = GObject.Object>(builder: Gtk.Builder, childname: string): T;
    vfunc_parser_finished(builder: Gtk.Builder): void;
    vfunc_set_buildable_property(builder: Gtk.Builder, name: string, value: GObject.Value | any): void;
    vfunc_set_id(id: string): void;
    get_orientation(): Gtk.Orientation;
    set_orientation(orientation: Gtk.Orientation): void;
}
export module FrameHeaderBar {
    export interface ConstructorProperties extends Gtk.Widget.ConstructorProperties {
        [key: string]: any;
        show_icon: boolean;
        showIcon: boolean;
    }
}
export class FrameHeaderBar
    extends Gtk.Widget
    implements Gtk.Accessible, Gtk.Buildable, Gtk.ConstraintTarget, FrameHeader
{
    static $gtype: GObject.GType<FrameHeaderBar>;

    constructor(properties?: Partial<FrameHeaderBar.ConstructorProperties>, ...args: any[]);
    _init(properties?: Partial<FrameHeaderBar.ConstructorProperties>, ...args: any[]): void;

    // Properties
    get show_icon(): boolean;
    set show_icon(val: boolean);
    get showIcon(): boolean;
    set showIcon(val: boolean);

    // Implemented Properties

    get accessible_role(): Gtk.AccessibleRole;
    set accessible_role(val: Gtk.AccessibleRole);
    get accessibleRole(): Gtk.AccessibleRole;
    set accessibleRole(val: Gtk.AccessibleRole);
    get frame(): Frame;
    set frame(val: Frame);

    // Constructors

    static ["new"](): FrameHeaderBar;

    // Members

    get_menu_popover(): Gtk.PopoverMenu;
    get_show_icon(): boolean;
    set_show_icon(show_icon: boolean): void;

    // Implemented Members

    get_accessible_parent(): Gtk.Accessible | null;
    get_accessible_role(): Gtk.AccessibleRole;
    get_at_context(): Gtk.ATContext;
    get_bounds(): [boolean, number, number, number, number];
    get_first_accessible_child(): Gtk.Accessible | null;
    get_next_accessible_sibling(): Gtk.Accessible | null;
    get_platform_state(state: Gtk.AccessiblePlatformState): boolean;
    reset_property(property: Gtk.AccessibleProperty): void;
    reset_relation(relation: Gtk.AccessibleRelation): void;
    reset_state(state: Gtk.AccessibleState): void;
    set_accessible_parent(parent?: Gtk.Accessible | null, next_sibling?: Gtk.Accessible | null): void;
    update_next_accessible_sibling(new_sibling?: Gtk.Accessible | null): void;
    update_property(properties: Gtk.AccessibleProperty[], values: GObject.Value[]): void;
    update_relation(relations: Gtk.AccessibleRelation[], values: GObject.Value[]): void;
    update_state(states: Gtk.AccessibleState[], values: GObject.Value[]): void;
    vfunc_get_accessible_parent(): Gtk.Accessible | null;
    vfunc_get_at_context(): Gtk.ATContext | null;
    vfunc_get_bounds(): [boolean, number, number, number, number];
    vfunc_get_first_accessible_child(): Gtk.Accessible | null;
    vfunc_get_next_accessible_sibling(): Gtk.Accessible | null;
    vfunc_get_platform_state(state: Gtk.AccessiblePlatformState): boolean;
    get_buildable_id(): string | null;
    vfunc_add_child(builder: Gtk.Builder, child: GObject.Object, type?: string | null): void;
    vfunc_custom_finished(builder: Gtk.Builder, child: GObject.Object | null, tagname: string, data?: any | null): void;
    vfunc_custom_tag_end(builder: Gtk.Builder, child: GObject.Object | null, tagname: string, data?: any | null): void;
    vfunc_custom_tag_start(
        builder: Gtk.Builder,
        child: GObject.Object | null,
        tagname: string
    ): [boolean, Gtk.BuildableParser, any];
    vfunc_get_id(): string;
    vfunc_get_internal_child<T = GObject.Object>(builder: Gtk.Builder, childname: string): T;
    vfunc_parser_finished(builder: Gtk.Builder): void;
    vfunc_set_buildable_property(builder: Gtk.Builder, name: string, value: GObject.Value | any): void;
    vfunc_set_id(id: string): void;
    add_prefix(priority: number, child: Gtk.Widget): void;
    add_suffix(priority: number, child: Gtk.Widget): void;
    can_drop(widget: Widget): boolean;
    get_frame(): Frame | null;
    page_changed(widget?: Widget | null): void;
    set_frame(frame?: Frame | null): void;
    vfunc_add_prefix(priority: number, child: Gtk.Widget): void;
    vfunc_add_suffix(priority: number, child: Gtk.Widget): void;
    vfunc_can_drop(widget: Widget): boolean;
    vfunc_page_changed(widget?: Widget | null): void;
}
export module FrameSwitcher {
    export interface ConstructorProperties extends Gtk.Widget.ConstructorProperties {
        [key: string]: any;
    }
}
export class FrameSwitcher
    extends Gtk.Widget
    implements Gtk.Accessible, Gtk.Buildable, Gtk.ConstraintTarget, Gtk.Orientable, FrameHeader
{
    static $gtype: GObject.GType<FrameSwitcher>;

    constructor(properties?: Partial<FrameSwitcher.ConstructorProperties>, ...args: any[]);
    _init(properties?: Partial<FrameSwitcher.ConstructorProperties>, ...args: any[]): void;

    // Implemented Properties

    get accessible_role(): Gtk.AccessibleRole;
    set accessible_role(val: Gtk.AccessibleRole);
    get accessibleRole(): Gtk.AccessibleRole;
    set accessibleRole(val: Gtk.AccessibleRole);
    get orientation(): Gtk.Orientation;
    set orientation(val: Gtk.Orientation);
    get frame(): Frame;
    set frame(val: Frame);

    // Constructors

    static ["new"](): FrameSwitcher;

    // Implemented Members

    get_accessible_parent(): Gtk.Accessible | null;
    get_accessible_role(): Gtk.AccessibleRole;
    get_at_context(): Gtk.ATContext;
    get_bounds(): [boolean, number, number, number, number];
    get_first_accessible_child(): Gtk.Accessible | null;
    get_next_accessible_sibling(): Gtk.Accessible | null;
    get_platform_state(state: Gtk.AccessiblePlatformState): boolean;
    reset_property(property: Gtk.AccessibleProperty): void;
    reset_relation(relation: Gtk.AccessibleRelation): void;
    reset_state(state: Gtk.AccessibleState): void;
    set_accessible_parent(parent?: Gtk.Accessible | null, next_sibling?: Gtk.Accessible | null): void;
    update_next_accessible_sibling(new_sibling?: Gtk.Accessible | null): void;
    update_property(properties: Gtk.AccessibleProperty[], values: GObject.Value[]): void;
    update_relation(relations: Gtk.AccessibleRelation[], values: GObject.Value[]): void;
    update_state(states: Gtk.AccessibleState[], values: GObject.Value[]): void;
    vfunc_get_accessible_parent(): Gtk.Accessible | null;
    vfunc_get_at_context(): Gtk.ATContext | null;
    vfunc_get_bounds(): [boolean, number, number, number, number];
    vfunc_get_first_accessible_child(): Gtk.Accessible | null;
    vfunc_get_next_accessible_sibling(): Gtk.Accessible | null;
    vfunc_get_platform_state(state: Gtk.AccessiblePlatformState): boolean;
    get_buildable_id(): string | null;
    vfunc_add_child(builder: Gtk.Builder, child: GObject.Object, type?: string | null): void;
    vfunc_custom_finished(builder: Gtk.Builder, child: GObject.Object | null, tagname: string, data?: any | null): void;
    vfunc_custom_tag_end(builder: Gtk.Builder, child: GObject.Object | null, tagname: string, data?: any | null): void;
    vfunc_custom_tag_start(
        builder: Gtk.Builder,
        child: GObject.Object | null,
        tagname: string
    ): [boolean, Gtk.BuildableParser, any];
    vfunc_get_id(): string;
    vfunc_get_internal_child<T = GObject.Object>(builder: Gtk.Builder, childname: string): T;
    vfunc_parser_finished(builder: Gtk.Builder): void;
    vfunc_set_buildable_property(builder: Gtk.Builder, name: string, value: GObject.Value | any): void;
    vfunc_set_id(id: string): void;
    get_orientation(): Gtk.Orientation;
    set_orientation(orientation: Gtk.Orientation): void;
    add_prefix(priority: number, child: Gtk.Widget): void;
    add_suffix(priority: number, child: Gtk.Widget): void;
    can_drop(widget: Widget): boolean;
    get_frame(): Frame | null;
    page_changed(widget?: Widget | null): void;
    set_frame(frame?: Frame | null): void;
    vfunc_add_prefix(priority: number, child: Gtk.Widget): void;
    vfunc_add_suffix(priority: number, child: Gtk.Widget): void;
    vfunc_can_drop(widget: Widget): boolean;
    vfunc_page_changed(widget?: Widget | null): void;
}
export module FrameTabBar {
    export interface ConstructorProperties extends Gtk.Widget.ConstructorProperties {
        [key: string]: any;
        autohide: boolean;
        expand_tabs: boolean;
        expandTabs: boolean;
        inverted: boolean;
    }
}
export class FrameTabBar
    extends Gtk.Widget
    implements Gtk.Accessible, Gtk.Buildable, Gtk.ConstraintTarget, FrameHeader
{
    static $gtype: GObject.GType<FrameTabBar>;

    constructor(properties?: Partial<FrameTabBar.ConstructorProperties>, ...args: any[]);
    _init(properties?: Partial<FrameTabBar.ConstructorProperties>, ...args: any[]): void;

    // Properties
    get autohide(): boolean;
    set autohide(val: boolean);
    get expand_tabs(): boolean;
    set expand_tabs(val: boolean);
    get expandTabs(): boolean;
    set expandTabs(val: boolean);
    get inverted(): boolean;
    set inverted(val: boolean);

    // Implemented Properties

    get accessible_role(): Gtk.AccessibleRole;
    set accessible_role(val: Gtk.AccessibleRole);
    get accessibleRole(): Gtk.AccessibleRole;
    set accessibleRole(val: Gtk.AccessibleRole);
    get frame(): Frame;
    set frame(val: Frame);

    // Constructors

    static ["new"](): FrameTabBar;

    // Members

    get_autohide(): boolean;
    get_expand_tabs(): boolean;
    get_inverted(): boolean;
    set_autohide(autohide: boolean): void;
    set_expand_tabs(expand_tabs: boolean): void;
    set_inverted(inverted: boolean): void;

    // Implemented Members

    get_accessible_parent(): Gtk.Accessible | null;
    get_accessible_role(): Gtk.AccessibleRole;
    get_at_context(): Gtk.ATContext;
    get_bounds(): [boolean, number, number, number, number];
    get_first_accessible_child(): Gtk.Accessible | null;
    get_next_accessible_sibling(): Gtk.Accessible | null;
    get_platform_state(state: Gtk.AccessiblePlatformState): boolean;
    reset_property(property: Gtk.AccessibleProperty): void;
    reset_relation(relation: Gtk.AccessibleRelation): void;
    reset_state(state: Gtk.AccessibleState): void;
    set_accessible_parent(parent?: Gtk.Accessible | null, next_sibling?: Gtk.Accessible | null): void;
    update_next_accessible_sibling(new_sibling?: Gtk.Accessible | null): void;
    update_property(properties: Gtk.AccessibleProperty[], values: GObject.Value[]): void;
    update_relation(relations: Gtk.AccessibleRelation[], values: GObject.Value[]): void;
    update_state(states: Gtk.AccessibleState[], values: GObject.Value[]): void;
    vfunc_get_accessible_parent(): Gtk.Accessible | null;
    vfunc_get_at_context(): Gtk.ATContext | null;
    vfunc_get_bounds(): [boolean, number, number, number, number];
    vfunc_get_first_accessible_child(): Gtk.Accessible | null;
    vfunc_get_next_accessible_sibling(): Gtk.Accessible | null;
    vfunc_get_platform_state(state: Gtk.AccessiblePlatformState): boolean;
    get_buildable_id(): string | null;
    vfunc_add_child(builder: Gtk.Builder, child: GObject.Object, type?: string | null): void;
    vfunc_custom_finished(builder: Gtk.Builder, child: GObject.Object | null, tagname: string, data?: any | null): void;
    vfunc_custom_tag_end(builder: Gtk.Builder, child: GObject.Object | null, tagname: string, data?: any | null): void;
    vfunc_custom_tag_start(
        builder: Gtk.Builder,
        child: GObject.Object | null,
        tagname: string
    ): [boolean, Gtk.BuildableParser, any];
    vfunc_get_id(): string;
    vfunc_get_internal_child<T = GObject.Object>(builder: Gtk.Builder, childname: string): T;
    vfunc_parser_finished(builder: Gtk.Builder): void;
    vfunc_set_buildable_property(builder: Gtk.Builder, name: string, value: GObject.Value | any): void;
    vfunc_set_id(id: string): void;
    add_prefix(priority: number, child: Gtk.Widget): void;
    add_suffix(priority: number, child: Gtk.Widget): void;
    can_drop(widget: Widget): boolean;
    get_frame(): Frame | null;
    page_changed(widget?: Widget | null): void;
    set_frame(frame?: Frame | null): void;
    vfunc_add_prefix(priority: number, child: Gtk.Widget): void;
    vfunc_add_suffix(priority: number, child: Gtk.Widget): void;
    vfunc_can_drop(widget: Widget): boolean;
    vfunc_page_changed(widget?: Widget | null): void;
}
export module GSettingsActionGroup {
    export interface ConstructorProperties extends GObject.Object.ConstructorProperties {
        [key: string]: any;
        settings: Gio.Settings;
    }
}
export class GSettingsActionGroup extends GObject.Object implements Gio.ActionGroup {
    static $gtype: GObject.GType<GSettingsActionGroup>;

    constructor(properties?: Partial<GSettingsActionGroup.ConstructorProperties>, ...args: any[]);
    _init(properties?: Partial<GSettingsActionGroup.ConstructorProperties>, ...args: any[]): void;

    // Properties
    get settings(): Gio.Settings;

    // Members

    static new(settings: Gio.Settings): Gio.ActionGroup;

    // Implemented Members

    action_added(action_name: string): void;
    action_enabled_changed(action_name: string, enabled: boolean): void;
    action_removed(action_name: string): void;
    action_state_changed(action_name: string, state: GLib.Variant): void;
    activate_action(action_name: string, parameter?: GLib.Variant | null): void;
    change_action_state(action_name: string, value: GLib.Variant): void;
    get_action_enabled(action_name: string): boolean;
    get_action_parameter_type(action_name: string): GLib.VariantType | null;
    get_action_state(action_name: string): GLib.Variant | null;
    get_action_state_hint(action_name: string): GLib.Variant | null;
    get_action_state_type(action_name: string): GLib.VariantType | null;
    has_action(action_name: string): boolean;
    list_actions(): string[];
    query_action(
        action_name: string
    ): [boolean, boolean, GLib.VariantType | null, GLib.VariantType | null, GLib.Variant | null, GLib.Variant | null];
    vfunc_action_added(action_name: string): void;
    vfunc_action_enabled_changed(action_name: string, enabled: boolean): void;
    vfunc_action_removed(action_name: string): void;
    vfunc_action_state_changed(action_name: string, state: GLib.Variant): void;
    vfunc_activate_action(action_name: string, parameter?: GLib.Variant | null): void;
    vfunc_change_action_state(action_name: string, value: GLib.Variant): void;
    vfunc_get_action_enabled(action_name: string): boolean;
    vfunc_get_action_parameter_type(action_name: string): GLib.VariantType | null;
    vfunc_get_action_state(action_name: string): GLib.Variant | null;
    vfunc_get_action_state_hint(action_name: string): GLib.Variant | null;
    vfunc_get_action_state_type(action_name: string): GLib.VariantType | null;
    vfunc_has_action(action_name: string): boolean;
    vfunc_list_actions(): string[];
    vfunc_query_action(
        action_name: string
    ): [boolean, boolean, GLib.VariantType | null, GLib.VariantType | null, GLib.Variant | null, GLib.Variant | null];
}
export module Grid {
    export interface ConstructorProperties extends Gtk.Widget.ConstructorProperties {
        [key: string]: any;
    }
}
export class Grid extends Gtk.Widget implements Gtk.Accessible, Gtk.Buildable, Gtk.ConstraintTarget {
    static $gtype: GObject.GType<Grid>;

    constructor(properties?: Partial<Grid.ConstructorProperties>, ...args: any[]);
    _init(properties?: Partial<Grid.ConstructorProperties>, ...args: any[]): void;

    // Signals

    connect(id: string, callback: (...args: any[]) => any): number;
    connect_after(id: string, callback: (...args: any[]) => any): number;
    emit(id: string, ...args: any[]): void;
    connect(signal: "create-frame", callback: (_source: this) => Frame): number;
    connect_after(signal: "create-frame", callback: (_source: this) => Frame): number;
    emit(signal: "create-frame"): void;

    // Implemented Properties

    get accessible_role(): Gtk.AccessibleRole;
    set accessible_role(val: Gtk.AccessibleRole);
    get accessibleRole(): Gtk.AccessibleRole;
    set accessibleRole(val: Gtk.AccessibleRole);

    // Constructors

    static ["new"](): Grid;

    // Members

    add(widget: Widget): void;
    agree_to_close_async(cancellable?: Gio.Cancellable | null): void;
    agree_to_close_finish(result: Gio.AsyncResult): boolean;
    foreach_frame(callback: FrameCallback): void;
    get_column(column: number): GridColumn;
    get_most_recent_column(): GridColumn;
    get_most_recent_frame(): Frame;
    get_n_columns(): number;
    insert_column(position: number): void;

    // Implemented Members

    get_accessible_parent(): Gtk.Accessible | null;
    get_accessible_role(): Gtk.AccessibleRole;
    get_at_context(): Gtk.ATContext;
    get_bounds(): [boolean, number, number, number, number];
    get_first_accessible_child(): Gtk.Accessible | null;
    get_next_accessible_sibling(): Gtk.Accessible | null;
    get_platform_state(state: Gtk.AccessiblePlatformState): boolean;
    reset_property(property: Gtk.AccessibleProperty): void;
    reset_relation(relation: Gtk.AccessibleRelation): void;
    reset_state(state: Gtk.AccessibleState): void;
    set_accessible_parent(parent?: Gtk.Accessible | null, next_sibling?: Gtk.Accessible | null): void;
    update_next_accessible_sibling(new_sibling?: Gtk.Accessible | null): void;
    update_property(properties: Gtk.AccessibleProperty[], values: GObject.Value[]): void;
    update_relation(relations: Gtk.AccessibleRelation[], values: GObject.Value[]): void;
    update_state(states: Gtk.AccessibleState[], values: GObject.Value[]): void;
    vfunc_get_accessible_parent(): Gtk.Accessible | null;
    vfunc_get_at_context(): Gtk.ATContext | null;
    vfunc_get_bounds(): [boolean, number, number, number, number];
    vfunc_get_first_accessible_child(): Gtk.Accessible | null;
    vfunc_get_next_accessible_sibling(): Gtk.Accessible | null;
    vfunc_get_platform_state(state: Gtk.AccessiblePlatformState): boolean;
    get_buildable_id(): string | null;
    vfunc_add_child(builder: Gtk.Builder, child: GObject.Object, type?: string | null): void;
    vfunc_custom_finished(builder: Gtk.Builder, child: GObject.Object | null, tagname: string, data?: any | null): void;
    vfunc_custom_tag_end(builder: Gtk.Builder, child: GObject.Object | null, tagname: string, data?: any | null): void;
    vfunc_custom_tag_start(
        builder: Gtk.Builder,
        child: GObject.Object | null,
        tagname: string
    ): [boolean, Gtk.BuildableParser, any];
    vfunc_get_id(): string;
    vfunc_get_internal_child<T = GObject.Object>(builder: Gtk.Builder, childname: string): T;
    vfunc_parser_finished(builder: Gtk.Builder): void;
    vfunc_set_buildable_property(builder: Gtk.Builder, name: string, value: GObject.Value | any): void;
    vfunc_set_id(id: string): void;
}
export module GridColumn {
    export interface ConstructorProperties extends Gtk.Widget.ConstructorProperties {
        [key: string]: any;
    }
}
export class GridColumn extends Gtk.Widget implements Gtk.Accessible, Gtk.Buildable, Gtk.ConstraintTarget {
    static $gtype: GObject.GType<GridColumn>;

    constructor(properties?: Partial<GridColumn.ConstructorProperties>, ...args: any[]);
    _init(properties?: Partial<GridColumn.ConstructorProperties>, ...args: any[]): void;

    // Implemented Properties

    get accessible_role(): Gtk.AccessibleRole;
    set accessible_role(val: Gtk.AccessibleRole);
    get accessibleRole(): Gtk.AccessibleRole;
    set accessibleRole(val: Gtk.AccessibleRole);

    // Constructors

    static ["new"](): GridColumn;

    // Members

    foreach_frame(): void;
    get_empty(): boolean;
    get_most_recent_frame(): Frame;
    get_n_rows(): number;
    get_row(row: number): Frame;

    // Implemented Members

    get_accessible_parent(): Gtk.Accessible | null;
    get_accessible_role(): Gtk.AccessibleRole;
    get_at_context(): Gtk.ATContext;
    get_bounds(): [boolean, number, number, number, number];
    get_first_accessible_child(): Gtk.Accessible | null;
    get_next_accessible_sibling(): Gtk.Accessible | null;
    get_platform_state(state: Gtk.AccessiblePlatformState): boolean;
    reset_property(property: Gtk.AccessibleProperty): void;
    reset_relation(relation: Gtk.AccessibleRelation): void;
    reset_state(state: Gtk.AccessibleState): void;
    set_accessible_parent(parent?: Gtk.Accessible | null, next_sibling?: Gtk.Accessible | null): void;
    update_next_accessible_sibling(new_sibling?: Gtk.Accessible | null): void;
    update_property(properties: Gtk.AccessibleProperty[], values: GObject.Value[]): void;
    update_relation(relations: Gtk.AccessibleRelation[], values: GObject.Value[]): void;
    update_state(states: Gtk.AccessibleState[], values: GObject.Value[]): void;
    vfunc_get_accessible_parent(): Gtk.Accessible | null;
    vfunc_get_at_context(): Gtk.ATContext | null;
    vfunc_get_bounds(): [boolean, number, number, number, number];
    vfunc_get_first_accessible_child(): Gtk.Accessible | null;
    vfunc_get_next_accessible_sibling(): Gtk.Accessible | null;
    vfunc_get_platform_state(state: Gtk.AccessiblePlatformState): boolean;
    get_buildable_id(): string | null;
    vfunc_add_child(builder: Gtk.Builder, child: GObject.Object, type?: string | null): void;
    vfunc_custom_finished(builder: Gtk.Builder, child: GObject.Object | null, tagname: string, data?: any | null): void;
    vfunc_custom_tag_end(builder: Gtk.Builder, child: GObject.Object | null, tagname: string, data?: any | null): void;
    vfunc_custom_tag_start(
        builder: Gtk.Builder,
        child: GObject.Object | null,
        tagname: string
    ): [boolean, Gtk.BuildableParser, any];
    vfunc_get_id(): string;
    vfunc_get_internal_child<T = GObject.Object>(builder: Gtk.Builder, childname: string): T;
    vfunc_parser_finished(builder: Gtk.Builder): void;
    vfunc_set_buildable_property(builder: Gtk.Builder, name: string, value: GObject.Value | any): void;
    vfunc_set_id(id: string): void;
}
export module Inhibitor {
    export interface ConstructorProperties extends GObject.Object.ConstructorProperties {
        [key: string]: any;
    }
}
export class Inhibitor extends GObject.Object {
    static $gtype: GObject.GType<Inhibitor>;

    constructor(properties?: Partial<Inhibitor.ConstructorProperties>, ...args: any[]);
    _init(properties?: Partial<Inhibitor.ConstructorProperties>, ...args: any[]): void;

    // Members

    uninhibit(): void;
}
export module LayeredSettings {
    export interface ConstructorProperties extends GObject.Object.ConstructorProperties {
        [key: string]: any;
        path: string;
        schema_id: string;
        schemaId: string;
    }
}
export class LayeredSettings extends GObject.Object {
    static $gtype: GObject.GType<LayeredSettings>;

    constructor(properties?: Partial<LayeredSettings.ConstructorProperties>, ...args: any[]);
    _init(properties?: Partial<LayeredSettings.ConstructorProperties>, ...args: any[]): void;

    // Properties
    get path(): string;
    get schema_id(): string;
    get schemaId(): string;

    // Signals

    connect(id: string, callback: (...args: any[]) => any): number;
    connect_after(id: string, callback: (...args: any[]) => any): number;
    emit(id: string, ...args: any[]): void;
    connect(signal: "changed", callback: (_source: this, object: string) => void): number;
    connect_after(signal: "changed", callback: (_source: this, object: string) => void): number;
    emit(signal: "changed", object: string): void;

    // Constructors

    static ["new"](schema_id: string, path: string): LayeredSettings;

    // Members

    append(settings: Gio.Settings): void;
    bind(key: string, object: any | null, property: string, flags: Gio.SettingsBindFlags): void;
    bind_with_mapping(
        key: string,
        object: any | null,
        property: string,
        flags: Gio.SettingsBindFlags,
        get_mapping: Gio.SettingsBindGetMapping,
        set_mapping: Gio.SettingsBindSetMapping
    ): void;
    get_boolean(key: string): boolean;
    get_default_value(key: string): GLib.Variant;
    get_double(key: string): number;
    get_int(key: string): number;
    get_key(key: string): Gio.SettingsSchemaKey;
    get_string(key: string): string;
    get_uint(key: string): number;
    get_user_value(key: string): GLib.Variant | null;
    get_value(key: string): GLib.Variant;
    list_keys(): string[];
    set_boolean(key: string, val: boolean): void;
    set_double(key: string, val: number): void;
    set_int(key: string, val: number): void;
    set_string(key: string, val: string): void;
    set_uint(key: string, val: number): void;
    set_value(key: string, value: GLib.Variant): void;
    unbind(property: string): void;
}
export module MenuManager {
    export interface ConstructorProperties extends GObject.Object.ConstructorProperties {
        [key: string]: any;
    }
}
export class MenuManager extends GObject.Object {
    static $gtype: GObject.GType<MenuManager>;

    constructor(properties?: Partial<MenuManager.ConstructorProperties>, ...args: any[]);
    _init(properties?: Partial<MenuManager.ConstructorProperties>, ...args: any[]): void;

    // Constructors

    static ["new"](): MenuManager;

    // Members

    add_filename(filename: string): number;
    add_resource(resource: string): number;
    find_item_by_id(id: string): [Gio.Menu | null, number];
    get_menu_by_id(menu_id: string): Gio.Menu;
    get_menu_ids(): string[];
    merge(menu_id: string, menu_model: Gio.MenuModel): number;
    remove(merge_id: number): void;
    set_attribute_string(menu: Gio.Menu, position: number, attribute: string, value: string): void;
}
export module OmniBar {
    export interface ConstructorProperties extends Gtk.Widget.ConstructorProperties {
        [key: string]: any;
        action_tooltip: string;
        actionTooltip: string;
        icon_name: string;
        iconName: string;
        menu_model: Gio.MenuModel;
        menuModel: Gio.MenuModel;
        popover: Gtk.Popover;
        progress: number;
    }
}
export class OmniBar extends Gtk.Widget implements Gtk.Accessible, Gtk.Actionable, Gtk.Buildable, Gtk.ConstraintTarget {
    static $gtype: GObject.GType<OmniBar>;

    constructor(properties?: Partial<OmniBar.ConstructorProperties>, ...args: any[]);
    _init(properties?: Partial<OmniBar.ConstructorProperties>, ...args: any[]): void;

    // Properties
    get action_tooltip(): string;
    set action_tooltip(val: string);
    get actionTooltip(): string;
    set actionTooltip(val: string);
    get icon_name(): string;
    set icon_name(val: string);
    get iconName(): string;
    set iconName(val: string);
    get menu_model(): Gio.MenuModel;
    set menu_model(val: Gio.MenuModel);
    get menuModel(): Gio.MenuModel;
    set menuModel(val: Gio.MenuModel);
    get popover(): Gtk.Popover;
    set popover(val: Gtk.Popover);
    get progress(): number;
    set progress(val: number);

    // Implemented Properties

    get accessible_role(): Gtk.AccessibleRole;
    set accessible_role(val: Gtk.AccessibleRole);
    get accessibleRole(): Gtk.AccessibleRole;
    set accessibleRole(val: Gtk.AccessibleRole);
    get action_name(): string;
    set action_name(val: string);
    get actionName(): string;
    set actionName(val: string);
    get action_target(): GLib.Variant;
    set action_target(val: GLib.Variant);
    get actionTarget(): GLib.Variant;
    set actionTarget(val: GLib.Variant);

    // Constructors

    static ["new"](): OmniBar;

    // Members

    add_prefix(priority: number, widget: Gtk.Widget): void;
    add_suffix(priority: number, widget: Gtk.Widget): void;
    get_popover(): Gtk.Popover | null;
    get_progress(): number;
    remove(widget: Gtk.Widget): void;
    set_popover(popover?: Gtk.Popover | null): void;
    set_progress(progress: number): void;
    start_pulsing(): void;
    stop_pulsing(): void;

    // Implemented Members

    get_accessible_parent(): Gtk.Accessible | null;
    get_accessible_role(): Gtk.AccessibleRole;
    get_at_context(): Gtk.ATContext;
    get_bounds(): [boolean, number, number, number, number];
    get_first_accessible_child(): Gtk.Accessible | null;
    get_next_accessible_sibling(): Gtk.Accessible | null;
    get_platform_state(state: Gtk.AccessiblePlatformState): boolean;
    reset_property(property: Gtk.AccessibleProperty): void;
    reset_relation(relation: Gtk.AccessibleRelation): void;
    reset_state(state: Gtk.AccessibleState): void;
    set_accessible_parent(parent?: Gtk.Accessible | null, next_sibling?: Gtk.Accessible | null): void;
    update_next_accessible_sibling(new_sibling?: Gtk.Accessible | null): void;
    update_property(properties: Gtk.AccessibleProperty[], values: GObject.Value[]): void;
    update_relation(relations: Gtk.AccessibleRelation[], values: GObject.Value[]): void;
    update_state(states: Gtk.AccessibleState[], values: GObject.Value[]): void;
    vfunc_get_accessible_parent(): Gtk.Accessible | null;
    vfunc_get_at_context(): Gtk.ATContext | null;
    vfunc_get_bounds(): [boolean, number, number, number, number];
    vfunc_get_first_accessible_child(): Gtk.Accessible | null;
    vfunc_get_next_accessible_sibling(): Gtk.Accessible | null;
    vfunc_get_platform_state(state: Gtk.AccessiblePlatformState): boolean;
    get_action_name(): string | null;
    get_action_target_value(): GLib.Variant | null;
    set_action_name(action_name?: string | null): void;
    set_action_target_value(target_value?: GLib.Variant | null): void;
    set_detailed_action_name(detailed_action_name: string): void;
    vfunc_get_action_name(): string | null;
    vfunc_get_action_target_value(): GLib.Variant | null;
    vfunc_set_action_name(action_name?: string | null): void;
    vfunc_set_action_target_value(target_value?: GLib.Variant | null): void;
    get_buildable_id(): string | null;
    vfunc_add_child(builder: Gtk.Builder, child: GObject.Object, type?: string | null): void;
    vfunc_custom_finished(builder: Gtk.Builder, child: GObject.Object | null, tagname: string, data?: any | null): void;
    vfunc_custom_tag_end(builder: Gtk.Builder, child: GObject.Object | null, tagname: string, data?: any | null): void;
    vfunc_custom_tag_start(
        builder: Gtk.Builder,
        child: GObject.Object | null,
        tagname: string
    ): [boolean, Gtk.BuildableParser, any];
    vfunc_get_id(): string;
    vfunc_get_internal_child<T = GObject.Object>(builder: Gtk.Builder, childname: string): T;
    vfunc_parser_finished(builder: Gtk.Builder): void;
    vfunc_set_buildable_property(builder: Gtk.Builder, name: string, value: GObject.Value | any): void;
    vfunc_set_id(id: string): void;
}
export module Paned {
    export interface ConstructorProperties extends Gtk.Widget.ConstructorProperties {
        [key: string]: any;
    }
}
export class Paned extends Gtk.Widget implements Gtk.Accessible, Gtk.Buildable, Gtk.ConstraintTarget, Gtk.Orientable {
    static $gtype: GObject.GType<Paned>;

    constructor(properties?: Partial<Paned.ConstructorProperties>, ...args: any[]);
    _init(properties?: Partial<Paned.ConstructorProperties>, ...args: any[]): void;

    // Implemented Properties

    get accessible_role(): Gtk.AccessibleRole;
    set accessible_role(val: Gtk.AccessibleRole);
    get accessibleRole(): Gtk.AccessibleRole;
    set accessibleRole(val: Gtk.AccessibleRole);
    get orientation(): Gtk.Orientation;
    set orientation(val: Gtk.Orientation);

    // Constructors

    static ["new"](): Paned;

    // Members

    append(child: Gtk.Widget): void;
    get_n_children(): number;
    get_nth_child(nth: number): Gtk.Widget | null;
    insert(position: number, child: Gtk.Widget): void;
    insert_after(child: Gtk.Widget, sibling: Gtk.Widget): void;
    // Conflicted with Gtk.Widget.insert_after
    insert_after(...args: never[]): any;
    prepend(child: Gtk.Widget): void;
    remove(child: Gtk.Widget): void;

    // Implemented Members

    get_accessible_parent(): Gtk.Accessible | null;
    get_accessible_role(): Gtk.AccessibleRole;
    get_at_context(): Gtk.ATContext;
    get_bounds(): [boolean, number, number, number, number];
    get_first_accessible_child(): Gtk.Accessible | null;
    get_next_accessible_sibling(): Gtk.Accessible | null;
    get_platform_state(state: Gtk.AccessiblePlatformState): boolean;
    reset_property(property: Gtk.AccessibleProperty): void;
    reset_relation(relation: Gtk.AccessibleRelation): void;
    reset_state(state: Gtk.AccessibleState): void;
    set_accessible_parent(parent?: Gtk.Accessible | null, next_sibling?: Gtk.Accessible | null): void;
    update_next_accessible_sibling(new_sibling?: Gtk.Accessible | null): void;
    update_property(properties: Gtk.AccessibleProperty[], values: GObject.Value[]): void;
    update_relation(relations: Gtk.AccessibleRelation[], values: GObject.Value[]): void;
    update_state(states: Gtk.AccessibleState[], values: GObject.Value[]): void;
    vfunc_get_accessible_parent(): Gtk.Accessible | null;
    vfunc_get_at_context(): Gtk.ATContext | null;
    vfunc_get_bounds(): [boolean, number, number, number, number];
    vfunc_get_first_accessible_child(): Gtk.Accessible | null;
    vfunc_get_next_accessible_sibling(): Gtk.Accessible | null;
    vfunc_get_platform_state(state: Gtk.AccessiblePlatformState): boolean;
    get_buildable_id(): string | null;
    vfunc_add_child(builder: Gtk.Builder, child: GObject.Object, type?: string | null): void;
    vfunc_custom_finished(builder: Gtk.Builder, child: GObject.Object | null, tagname: string, data?: any | null): void;
    vfunc_custom_tag_end(builder: Gtk.Builder, child: GObject.Object | null, tagname: string, data?: any | null): void;
    vfunc_custom_tag_start(
        builder: Gtk.Builder,
        child: GObject.Object | null,
        tagname: string
    ): [boolean, Gtk.BuildableParser, any];
    vfunc_get_id(): string;
    vfunc_get_internal_child<T = GObject.Object>(builder: Gtk.Builder, childname: string): T;
    vfunc_parser_finished(builder: Gtk.Builder): void;
    vfunc_set_buildable_property(builder: Gtk.Builder, name: string, value: GObject.Value | any): void;
    vfunc_set_id(id: string): void;
    get_orientation(): Gtk.Orientation;
    set_orientation(orientation: Gtk.Orientation): void;
}
export module Position {
    export interface ConstructorProperties extends GObject.Object.ConstructorProperties {
        [key: string]: any;
        area: Area;
        area_set: boolean;
        areaSet: boolean;
        column: number;
        column_set: boolean;
        columnSet: boolean;
        depth: number;
        depth_set: boolean;
        depthSet: boolean;
        row: number;
        row_set: boolean;
        rowSet: boolean;
    }
}
export class Position extends GObject.Object {
    static $gtype: GObject.GType<Position>;

    constructor(properties?: Partial<Position.ConstructorProperties>, ...args: any[]);
    _init(properties?: Partial<Position.ConstructorProperties>, ...args: any[]): void;

    // Properties
    get area(): Area;
    set area(val: Area);
    get area_set(): boolean;
    set area_set(val: boolean);
    get areaSet(): boolean;
    set areaSet(val: boolean);
    get column(): number;
    set column(val: number);
    get column_set(): boolean;
    set column_set(val: boolean);
    get columnSet(): boolean;
    set columnSet(val: boolean);
    get depth(): number;
    set depth(val: number);
    get depth_set(): boolean;
    set depth_set(val: boolean);
    get depthSet(): boolean;
    set depthSet(val: boolean);
    get row(): number;
    set row(val: number);
    get row_set(): boolean;
    set row_set(val: boolean);
    get rowSet(): boolean;
    set rowSet(val: boolean);

    // Constructors

    static ["new"](): Position;
    static new_from_variant(variant: GLib.Variant): Position;

    // Members

    equal(b: Position): boolean;
    get_area(): Area;
    get_area_set(): boolean;
    get_column(): number;
    get_column_set(): boolean;
    get_depth(): number;
    get_depth_set(): boolean;
    get_row(): number;
    get_row_set(): boolean;
    is_indeterminate(): boolean;
    set_area(area: Area): void;
    set_area_set(area_set: boolean): void;
    set_column(column: number): void;
    set_column_set(column_set: boolean): void;
    set_depth(depth: number): void;
    set_depth_set(depth_set: boolean): void;
    set_row(row: number): void;
    set_row_set(row_set: boolean): void;
    to_variant(): GLib.Variant | null;
}
export module SaveDelegate {
    export interface ConstructorProperties extends GObject.Object.ConstructorProperties {
        [key: string]: any;
        icon: Gio.Icon;
        icon_name: string;
        iconName: string;
        is_draft: boolean;
        isDraft: boolean;
        progress: number;
        subtitle: string;
        title: string;
    }
}
export class SaveDelegate extends GObject.Object {
    static $gtype: GObject.GType<SaveDelegate>;

    constructor(properties?: Partial<SaveDelegate.ConstructorProperties>, ...args: any[]);
    _init(properties?: Partial<SaveDelegate.ConstructorProperties>, ...args: any[]): void;

    // Properties
    get icon(): Gio.Icon;
    set icon(val: Gio.Icon);
    get icon_name(): string;
    set icon_name(val: string);
    get iconName(): string;
    set iconName(val: string);
    get is_draft(): boolean;
    set is_draft(val: boolean);
    get isDraft(): boolean;
    set isDraft(val: boolean);
    get progress(): number;
    set progress(val: number);
    get subtitle(): string;
    set subtitle(val: string);
    get title(): string;
    set title(val: string);

    // Signals

    connect(id: string, callback: (...args: any[]) => any): number;
    connect_after(id: string, callback: (...args: any[]) => any): number;
    emit(id: string, ...args: any[]): void;
    connect(signal: "close", callback: (_source: this) => void): number;
    connect_after(signal: "close", callback: (_source: this) => void): number;
    emit(signal: "close"): void;
    connect(signal: "discard", callback: (_source: this) => void): number;
    connect_after(signal: "discard", callback: (_source: this) => void): number;
    emit(signal: "discard"): void;
    connect(signal: "save", callback: (_source: this, task: Gio.Task) => boolean): number;
    connect_after(signal: "save", callback: (_source: this, task: Gio.Task) => boolean): number;
    emit(signal: "save", task: Gio.Task): void;

    // Constructors

    static ["new"](): SaveDelegate;

    // Members

    close(): void;
    discard(): void;
    get_icon(): Gio.Icon | null;
    get_icon_name(): string | null;
    get_is_draft(): boolean;
    get_progress(): number;
    get_subtitle(): string | null;
    get_title(): string | null;
    save_async(cancellable?: Gio.Cancellable | null, callback?: Gio.AsyncReadyCallback<this> | null): void;
    save_finish(result: Gio.AsyncResult): boolean;
    set_icon(icon?: Gio.Icon | null): void;
    set_icon_name(icon?: string | null): void;
    set_is_draft(is_draft: boolean): void;
    set_progress(progress: number): void;
    set_subtitle(subtitle?: string | null): void;
    set_title(title?: string | null): void;
    vfunc_close(): void;
    vfunc_discard(): void;
    vfunc_save(task: Gio.Task): boolean;
    vfunc_save_async(cancellable?: Gio.Cancellable | null, callback?: Gio.AsyncReadyCallback<this> | null): void;
    vfunc_save_finish(result: Gio.AsyncResult): boolean;
}
export module SaveDialog {
    export interface ConstructorProperties extends Adw.MessageDialog.ConstructorProperties {
        [key: string]: any;
        close_after_save: boolean;
        closeAfterSave: boolean;
    }
}
export class SaveDialog
    extends Adw.MessageDialog
    implements Gtk.Accessible, Gtk.Buildable, Gtk.ConstraintTarget, Gtk.Native, Gtk.Root, Gtk.ShortcutManager
{
    static $gtype: GObject.GType<SaveDialog>;

    constructor(properties?: Partial<SaveDialog.ConstructorProperties>, ...args: any[]);
    _init(properties?: Partial<SaveDialog.ConstructorProperties>, ...args: any[]): void;

    // Properties
    get close_after_save(): boolean;
    set close_after_save(val: boolean);
    get closeAfterSave(): boolean;
    set closeAfterSave(val: boolean);

    // Constructors

    static ["new"](): SaveDialog;

    // Members

    add_delegate(delegate: SaveDelegate): void;
    get_close_after_save(): boolean;
    run_async(cancellable?: Gio.Cancellable | null, callback?: Gio.AsyncReadyCallback<this> | null): void;
    run_finish(result: Gio.AsyncResult): boolean;
    set_close_after_save(close_after_save: boolean): void;
}
export module Session {
    export interface ConstructorProperties extends GObject.Object.ConstructorProperties {
        [key: string]: any;
    }
}
export class Session extends GObject.Object {
    static $gtype: GObject.GType<Session>;

    constructor(properties?: Partial<Session.ConstructorProperties>, ...args: any[]);
    _init(properties?: Partial<Session.ConstructorProperties>, ...args: any[]): void;

    // Constructors

    static ["new"](): Session;
    static new_from_variant(variant: GLib.Variant): Session;

    // Members

    append(item: SessionItem): void;
    get_item(position: number): SessionItem | null;
    get_n_items(): number;
    insert(position: number, item: SessionItem): void;
    lookup_by_id(id: string): SessionItem | null;
    prepend(item: SessionItem): void;
    remove(item: SessionItem): void;
    remove_at(position: number): void;
    to_variant(): GLib.Variant;
}
export module SessionItem {
    export interface ConstructorProperties extends GObject.Object.ConstructorProperties {
        [key: string]: any;
        id: string;
        module_name: string;
        moduleName: string;
        position: Position;
        type_hint: string;
        typeHint: string;
        workspace: string;
    }
}
export class SessionItem extends GObject.Object {
    static $gtype: GObject.GType<SessionItem>;

    constructor(properties?: Partial<SessionItem.ConstructorProperties>, ...args: any[]);
    _init(properties?: Partial<SessionItem.ConstructorProperties>, ...args: any[]): void;

    // Properties
    get id(): string;
    set id(val: string);
    get module_name(): string;
    set module_name(val: string);
    get moduleName(): string;
    set moduleName(val: string);
    get position(): Position;
    set position(val: Position);
    get type_hint(): string;
    set type_hint(val: string);
    get typeHint(): string;
    set typeHint(val: string);
    get workspace(): string;
    set workspace(val: string);

    // Constructors

    static ["new"](): SessionItem;

    // Members

    get_id(): string | null;
    get_metadata_value(key: string, expected_type?: GLib.VariantType | null): GLib.Variant | null;
    get_module_name(): string | null;
    get_position(): Position | null;
    get_type_hint(): string | null;
    get_workspace(): string | null;
    has_metadata(key: string): [boolean, GLib.VariantType | null];
    has_metadata_with_type(key: string, expected_type: GLib.VariantType): boolean;
    set_id(id?: string | null): void;
    set_metadata_value(key: string, value?: GLib.Variant | null): void;
    set_module_name(module_name?: string | null): void;
    set_position(position?: Position | null): void;
    set_type_hint(type_hint?: string | null): void;
    set_workspace(workspace?: string | null): void;
}
export module Settings {
    export interface ConstructorProperties extends GObject.Object.ConstructorProperties {
        [key: string]: any;
        identifier: string;
        path: string;
        path_prefix: string;
        pathPrefix: string;
        path_suffix: string;
        pathSuffix: string;
        schema_id: string;
        schemaId: string;
        schema_id_prefix: string;
        schemaIdPrefix: string;
    }
}
export class Settings extends GObject.Object implements Gio.ActionGroup {
    static $gtype: GObject.GType<Settings>;

    constructor(properties?: Partial<Settings.ConstructorProperties>, ...args: any[]);
    _init(properties?: Partial<Settings.ConstructorProperties>, ...args: any[]): void;

    // Properties
    get identifier(): string;
    get path(): string;
    get path_prefix(): string;
    get pathPrefix(): string;
    get path_suffix(): string;
    get pathSuffix(): string;
    get schema_id(): string;
    get schemaId(): string;
    get schema_id_prefix(): string;
    get schemaIdPrefix(): string;

    // Signals

    connect(id: string, callback: (...args: any[]) => any): number;
    connect_after(id: string, callback: (...args: any[]) => any): number;
    emit(id: string, ...args: any[]): void;
    connect(signal: "changed", callback: (_source: this, object: string) => void): number;
    connect_after(signal: "changed", callback: (_source: this, object: string) => void): number;
    emit(signal: "changed", object: string): void;

    // Constructors

    static ["new"](identifier: string, schema_id: string): Settings;
    static new_relocatable(
        identifier: string,
        schema_id: string,
        schema_id_prefix: string,
        path_prefix: string,
        path_suffix: string
    ): Settings;
    static new_with_path(identifier: string, schema_id: string, path: string): Settings;

    // Members

    bind(key: string, object: any | null, property: string, flags: Gio.SettingsBindFlags): void;
    bind_with_mapping(
        key: string,
        object: any | null,
        property: string,
        flags: Gio.SettingsBindFlags,
        get_mapping?: Gio.SettingsBindGetMapping | null,
        set_mapping?: Gio.SettingsBindSetMapping | null
    ): void;
    get_boolean(key: string): boolean;
    get_default_value(key: string): GLib.Variant;
    get_double(key: string): number;
    get_int(key: string): number;
    get_schema_id(): string;
    get_string(key: string): string;
    get_uint(key: string): number;
    get_user_value(key: string): GLib.Variant | null;
    get_value(key: string): GLib.Variant;
    set_boolean(key: string, val: boolean): void;
    set_double(key: string, val: number): void;
    set_int(key: string, val: number): void;
    set_string(key: string, val: string): void;
    set_uint(key: string, val: number): void;
    set_value(key: string, value: GLib.Variant): void;
    unbind(property: string): void;
    static resolve_schema_path(
        schema_id_prefix: string,
        schema_id: string,
        identifier: string,
        path_prefix: string,
        path_suffix: string
    ): string;

    // Implemented Members

    action_added(action_name: string): void;
    action_enabled_changed(action_name: string, enabled: boolean): void;
    action_removed(action_name: string): void;
    action_state_changed(action_name: string, state: GLib.Variant): void;
    activate_action(action_name: string, parameter?: GLib.Variant | null): void;
    change_action_state(action_name: string, value: GLib.Variant): void;
    get_action_enabled(action_name: string): boolean;
    get_action_parameter_type(action_name: string): GLib.VariantType | null;
    get_action_state(action_name: string): GLib.Variant | null;
    get_action_state_hint(action_name: string): GLib.Variant | null;
    get_action_state_type(action_name: string): GLib.VariantType | null;
    has_action(action_name: string): boolean;
    list_actions(): string[];
    query_action(
        action_name: string
    ): [boolean, boolean, GLib.VariantType | null, GLib.VariantType | null, GLib.Variant | null, GLib.Variant | null];
    vfunc_action_added(action_name: string): void;
    vfunc_action_enabled_changed(action_name: string, enabled: boolean): void;
    vfunc_action_removed(action_name: string): void;
    vfunc_action_state_changed(action_name: string, state: GLib.Variant): void;
    vfunc_activate_action(action_name: string, parameter?: GLib.Variant | null): void;
    vfunc_change_action_state(action_name: string, value: GLib.Variant): void;
    vfunc_get_action_enabled(action_name: string): boolean;
    vfunc_get_action_parameter_type(action_name: string): GLib.VariantType | null;
    vfunc_get_action_state(action_name: string): GLib.Variant | null;
    vfunc_get_action_state_hint(action_name: string): GLib.Variant | null;
    vfunc_get_action_state_type(action_name: string): GLib.VariantType | null;
    vfunc_has_action(action_name: string): boolean;
    vfunc_list_actions(): string[];
    vfunc_query_action(
        action_name: string
    ): [boolean, boolean, GLib.VariantType | null, GLib.VariantType | null, GLib.Variant | null, GLib.Variant | null];
}
export module Statusbar {
    export interface ConstructorProperties extends Gtk.Widget.ConstructorProperties {
        [key: string]: any;
    }
}
export class Statusbar extends Gtk.Widget implements Gtk.Accessible, Gtk.Buildable, Gtk.ConstraintTarget {
    static $gtype: GObject.GType<Statusbar>;

    constructor(properties?: Partial<Statusbar.ConstructorProperties>, ...args: any[]);
    _init(properties?: Partial<Statusbar.ConstructorProperties>, ...args: any[]): void;

    // Implemented Properties

    get accessible_role(): Gtk.AccessibleRole;
    set accessible_role(val: Gtk.AccessibleRole);
    get accessibleRole(): Gtk.AccessibleRole;
    set accessibleRole(val: Gtk.AccessibleRole);

    // Constructors

    static ["new"](): Statusbar;

    // Members

    add_prefix(priority: number, widget: Gtk.Widget): void;
    add_suffix(priority: number, widget: Gtk.Widget): void;
    remove(widget: Gtk.Widget): void;

    // Implemented Members

    get_accessible_parent(): Gtk.Accessible | null;
    get_accessible_role(): Gtk.AccessibleRole;
    get_at_context(): Gtk.ATContext;
    get_bounds(): [boolean, number, number, number, number];
    get_first_accessible_child(): Gtk.Accessible | null;
    get_next_accessible_sibling(): Gtk.Accessible | null;
    get_platform_state(state: Gtk.AccessiblePlatformState): boolean;
    reset_property(property: Gtk.AccessibleProperty): void;
    reset_relation(relation: Gtk.AccessibleRelation): void;
    reset_state(state: Gtk.AccessibleState): void;
    set_accessible_parent(parent?: Gtk.Accessible | null, next_sibling?: Gtk.Accessible | null): void;
    update_next_accessible_sibling(new_sibling?: Gtk.Accessible | null): void;
    update_property(properties: Gtk.AccessibleProperty[], values: GObject.Value[]): void;
    update_relation(relations: Gtk.AccessibleRelation[], values: GObject.Value[]): void;
    update_state(states: Gtk.AccessibleState[], values: GObject.Value[]): void;
    vfunc_get_accessible_parent(): Gtk.Accessible | null;
    vfunc_get_at_context(): Gtk.ATContext | null;
    vfunc_get_bounds(): [boolean, number, number, number, number];
    vfunc_get_first_accessible_child(): Gtk.Accessible | null;
    vfunc_get_next_accessible_sibling(): Gtk.Accessible | null;
    vfunc_get_platform_state(state: Gtk.AccessiblePlatformState): boolean;
    get_buildable_id(): string | null;
    vfunc_add_child(builder: Gtk.Builder, child: GObject.Object, type?: string | null): void;
    vfunc_custom_finished(builder: Gtk.Builder, child: GObject.Object | null, tagname: string, data?: any | null): void;
    vfunc_custom_tag_end(builder: Gtk.Builder, child: GObject.Object | null, tagname: string, data?: any | null): void;
    vfunc_custom_tag_start(
        builder: Gtk.Builder,
        child: GObject.Object | null,
        tagname: string
    ): [boolean, Gtk.BuildableParser, any];
    vfunc_get_id(): string;
    vfunc_get_internal_child<T = GObject.Object>(builder: Gtk.Builder, childname: string): T;
    vfunc_parser_finished(builder: Gtk.Builder): void;
    vfunc_set_buildable_property(builder: Gtk.Builder, name: string, value: GObject.Value | any): void;
    vfunc_set_id(id: string): void;
}
export module ThemeSelector {
    export interface ConstructorProperties extends Gtk.Widget.ConstructorProperties {
        [key: string]: any;
        action_name: string;
        actionName: string;
    }
}
export class ThemeSelector extends Gtk.Widget implements Gtk.Accessible, Gtk.Buildable, Gtk.ConstraintTarget {
    static $gtype: GObject.GType<ThemeSelector>;

    constructor(properties?: Partial<ThemeSelector.ConstructorProperties>, ...args: any[]);
    _init(properties?: Partial<ThemeSelector.ConstructorProperties>, ...args: any[]): void;

    // Properties
    get action_name(): string;
    set action_name(val: string);
    get actionName(): string;
    set actionName(val: string);

    // Implemented Properties

    get accessible_role(): Gtk.AccessibleRole;
    set accessible_role(val: Gtk.AccessibleRole);
    get accessibleRole(): Gtk.AccessibleRole;
    set accessibleRole(val: Gtk.AccessibleRole);

    // Constructors

    static ["new"](): ThemeSelector;

    // Members

    get_action_name(): string;
    set_action_name(action_name: string): void;

    // Implemented Members

    get_accessible_parent(): Gtk.Accessible | null;
    get_accessible_role(): Gtk.AccessibleRole;
    get_at_context(): Gtk.ATContext;
    get_bounds(): [boolean, number, number, number, number];
    get_first_accessible_child(): Gtk.Accessible | null;
    get_next_accessible_sibling(): Gtk.Accessible | null;
    get_platform_state(state: Gtk.AccessiblePlatformState): boolean;
    reset_property(property: Gtk.AccessibleProperty): void;
    reset_relation(relation: Gtk.AccessibleRelation): void;
    reset_state(state: Gtk.AccessibleState): void;
    set_accessible_parent(parent?: Gtk.Accessible | null, next_sibling?: Gtk.Accessible | null): void;
    update_next_accessible_sibling(new_sibling?: Gtk.Accessible | null): void;
    update_property(properties: Gtk.AccessibleProperty[], values: GObject.Value[]): void;
    update_relation(relations: Gtk.AccessibleRelation[], values: GObject.Value[]): void;
    update_state(states: Gtk.AccessibleState[], values: GObject.Value[]): void;
    vfunc_get_accessible_parent(): Gtk.Accessible | null;
    vfunc_get_at_context(): Gtk.ATContext | null;
    vfunc_get_bounds(): [boolean, number, number, number, number];
    vfunc_get_first_accessible_child(): Gtk.Accessible | null;
    vfunc_get_next_accessible_sibling(): Gtk.Accessible | null;
    vfunc_get_platform_state(state: Gtk.AccessiblePlatformState): boolean;
    get_buildable_id(): string | null;
    vfunc_add_child(builder: Gtk.Builder, child: GObject.Object, type?: string | null): void;
    vfunc_custom_finished(builder: Gtk.Builder, child: GObject.Object | null, tagname: string, data?: any | null): void;
    vfunc_custom_tag_end(builder: Gtk.Builder, child: GObject.Object | null, tagname: string, data?: any | null): void;
    vfunc_custom_tag_start(
        builder: Gtk.Builder,
        child: GObject.Object | null,
        tagname: string
    ): [boolean, Gtk.BuildableParser, any];
    vfunc_get_id(): string;
    vfunc_get_internal_child<T = GObject.Object>(builder: Gtk.Builder, childname: string): T;
    vfunc_parser_finished(builder: Gtk.Builder): void;
    vfunc_set_buildable_property(builder: Gtk.Builder, name: string, value: GObject.Value | any): void;
    vfunc_set_id(id: string): void;
}
export module ToggleButton {
    export interface ConstructorProperties extends Gtk.Widget.ConstructorProperties {
        [key: string]: any;
        area: Area;
        dock: Dock;
    }
}
export class ToggleButton extends Gtk.Widget implements Gtk.Accessible, Gtk.Buildable, Gtk.ConstraintTarget {
    static $gtype: GObject.GType<ToggleButton>;

    constructor(properties?: Partial<ToggleButton.ConstructorProperties>, ...args: any[]);
    _init(properties?: Partial<ToggleButton.ConstructorProperties>, ...args: any[]): void;

    // Properties
    get area(): Area;
    get dock(): Dock;
    set dock(val: Dock);

    // Implemented Properties

    get accessible_role(): Gtk.AccessibleRole;
    set accessible_role(val: Gtk.AccessibleRole);
    get accessibleRole(): Gtk.AccessibleRole;
    set accessibleRole(val: Gtk.AccessibleRole);

    // Constructors

    static ["new"](dock: Dock, area: Area): ToggleButton;

    // Implemented Members

    get_accessible_parent(): Gtk.Accessible | null;
    get_accessible_role(): Gtk.AccessibleRole;
    get_at_context(): Gtk.ATContext;
    get_bounds(): [boolean, number, number, number, number];
    get_first_accessible_child(): Gtk.Accessible | null;
    get_next_accessible_sibling(): Gtk.Accessible | null;
    get_platform_state(state: Gtk.AccessiblePlatformState): boolean;
    reset_property(property: Gtk.AccessibleProperty): void;
    reset_relation(relation: Gtk.AccessibleRelation): void;
    reset_state(state: Gtk.AccessibleState): void;
    set_accessible_parent(parent?: Gtk.Accessible | null, next_sibling?: Gtk.Accessible | null): void;
    update_next_accessible_sibling(new_sibling?: Gtk.Accessible | null): void;
    update_property(properties: Gtk.AccessibleProperty[], values: GObject.Value[]): void;
    update_relation(relations: Gtk.AccessibleRelation[], values: GObject.Value[]): void;
    update_state(states: Gtk.AccessibleState[], values: GObject.Value[]): void;
    vfunc_get_accessible_parent(): Gtk.Accessible | null;
    vfunc_get_at_context(): Gtk.ATContext | null;
    vfunc_get_bounds(): [boolean, number, number, number, number];
    vfunc_get_first_accessible_child(): Gtk.Accessible | null;
    vfunc_get_next_accessible_sibling(): Gtk.Accessible | null;
    vfunc_get_platform_state(state: Gtk.AccessiblePlatformState): boolean;
    get_buildable_id(): string | null;
    vfunc_add_child(builder: Gtk.Builder, child: GObject.Object, type?: string | null): void;
    vfunc_custom_finished(builder: Gtk.Builder, child: GObject.Object | null, tagname: string, data?: any | null): void;
    vfunc_custom_tag_end(builder: Gtk.Builder, child: GObject.Object | null, tagname: string, data?: any | null): void;
    vfunc_custom_tag_start(
        builder: Gtk.Builder,
        child: GObject.Object | null,
        tagname: string
    ): [boolean, Gtk.BuildableParser, any];
    vfunc_get_id(): string;
    vfunc_get_internal_child<T = GObject.Object>(builder: Gtk.Builder, childname: string): T;
    vfunc_parser_finished(builder: Gtk.Builder): void;
    vfunc_set_buildable_property(builder: Gtk.Builder, name: string, value: GObject.Value | any): void;
    vfunc_set_id(id: string): void;
}
export module Widget {
    export interface ConstructorProperties extends Gtk.Widget.ConstructorProperties {
        [key: string]: any;
        busy: boolean;
        can_maximize: boolean;
        canMaximize: boolean;
        child: Gtk.Widget;
        icon: Gio.Icon;
        icon_name: string;
        iconName: string;
        id: string;
        kind: string;
        menu_model: Gio.MenuModel;
        menuModel: Gio.MenuModel;
        modified: boolean;
        needs_attention: boolean;
        needsAttention: boolean;
        reorderable: boolean;
        save_delegate: SaveDelegate;
        saveDelegate: SaveDelegate;
        title: string;
        tooltip: string;
    }
}
export class Widget extends Gtk.Widget implements Gtk.Accessible, Gtk.Buildable, Gtk.ConstraintTarget {
    static $gtype: GObject.GType<Widget>;

    constructor(properties?: Partial<Widget.ConstructorProperties>, ...args: any[]);
    _init(properties?: Partial<Widget.ConstructorProperties>, ...args: any[]): void;

    // Properties
    get busy(): boolean;
    get can_maximize(): boolean;
    set can_maximize(val: boolean);
    get canMaximize(): boolean;
    set canMaximize(val: boolean);
    get child(): Gtk.Widget;
    set child(val: Gtk.Widget);
    get icon(): Gio.Icon;
    set icon(val: Gio.Icon);
    get icon_name(): string;
    set icon_name(val: string);
    get iconName(): string;
    set iconName(val: string);
    get id(): string;
    set id(val: string);
    get kind(): string;
    set kind(val: string);
    get menu_model(): Gio.MenuModel;
    set menu_model(val: Gio.MenuModel);
    get menuModel(): Gio.MenuModel;
    set menuModel(val: Gio.MenuModel);
    get modified(): boolean;
    set modified(val: boolean);
    get needs_attention(): boolean;
    set needs_attention(val: boolean);
    get needsAttention(): boolean;
    set needsAttention(val: boolean);
    get reorderable(): boolean;
    set reorderable(val: boolean);
    get save_delegate(): SaveDelegate;
    set save_delegate(val: SaveDelegate);
    get saveDelegate(): SaveDelegate;
    set saveDelegate(val: SaveDelegate);
    get title(): string;
    set title(val: string);
    get tooltip(): string;
    set tooltip(val: string);

    // Signals

    connect(id: string, callback: (...args: any[]) => any): number;
    connect_after(id: string, callback: (...args: any[]) => any): number;
    emit(id: string, ...args: any[]): void;
    connect(signal: "get-default-focus", callback: (_source: this) => Gtk.Widget | null): number;
    connect_after(signal: "get-default-focus", callback: (_source: this) => Gtk.Widget | null): number;
    emit(signal: "get-default-focus"): void;
    connect(signal: "presented", callback: (_source: this) => void): number;
    connect_after(signal: "presented", callback: (_source: this) => void): number;
    emit(signal: "presented"): void;

    // Implemented Properties

    get accessible_role(): Gtk.AccessibleRole;
    set accessible_role(val: Gtk.AccessibleRole);
    get accessibleRole(): Gtk.AccessibleRole;
    set accessibleRole(val: Gtk.AccessibleRole);

    // Constructors

    static ["new"](): Widget;

    // Members

    action_set_enabled(action_name: string, enabled: boolean): void;
    close(): void;
    focus_default(): boolean;
    force_close(): void;
    get_busy(): boolean;
    get_can_maximize(): boolean;
    get_child(): Gtk.Widget | null;
    get_default_focus(): Gtk.Widget | null;
    get_icon(): Gio.Icon | null;
    get_icon_name(): string | null;
    get_id(): string;
    get_kind(): string;
    get_menu_model(): Gio.MenuModel | null;
    get_modified(): boolean;
    get_needs_attention(): boolean;
    get_position(): Position | null;
    get_reorderable(): boolean;
    get_save_delegate(): SaveDelegate | null;
    get_title(): string | null;
    get_tooltip(): string | null;
    insert_action_group(prefix: string, group: Gio.ActionGroup): void;
    // Conflicted with Gtk.Widget.insert_action_group
    insert_action_group(...args: never[]): any;
    mark_busy(): void;
    maximize(): void;
    raise(): void;
    set_can_maximize(can_maximize: boolean): void;
    set_child(child?: Gtk.Widget | null): void;
    set_icon(icon?: Gio.Icon | null): void;
    set_icon_name(icon_name?: string | null): void;
    set_id(id: string): void;
    set_kind(kind?: string | null): void;
    set_menu_model(menu_model?: Gio.MenuModel | null): void;
    set_modified(modified: boolean): void;
    set_needs_attention(needs_attention: boolean): void;
    set_reorderable(reorderable: boolean): void;
    set_save_delegate(save_delegate?: SaveDelegate | null): void;
    set_title(title?: string | null): void;
    set_tooltip(tooltip?: string | null): void;
    unmark_busy(): void;
    unmaximize(): void;
    vfunc_get_default_focus(): Gtk.Widget | null;
    vfunc_presented(): void;
    static install_action(
        action_name: string,
        parameter_type: string | null,
        activate: Gtk.WidgetActionActivateFunc
    ): void;
    static install_property_action(action_name: string, property_name: string): void;

    // Implemented Members

    get_accessible_parent(): Gtk.Accessible | null;
    get_accessible_role(): Gtk.AccessibleRole;
    get_at_context(): Gtk.ATContext;
    get_bounds(): [boolean, number, number, number, number];
    get_first_accessible_child(): Gtk.Accessible | null;
    get_next_accessible_sibling(): Gtk.Accessible | null;
    get_platform_state(state: Gtk.AccessiblePlatformState): boolean;
    reset_property(property: Gtk.AccessibleProperty): void;
    reset_relation(relation: Gtk.AccessibleRelation): void;
    reset_state(state: Gtk.AccessibleState): void;
    set_accessible_parent(parent?: Gtk.Accessible | null, next_sibling?: Gtk.Accessible | null): void;
    update_next_accessible_sibling(new_sibling?: Gtk.Accessible | null): void;
    update_property(properties: Gtk.AccessibleProperty[], values: GObject.Value[]): void;
    update_relation(relations: Gtk.AccessibleRelation[], values: GObject.Value[]): void;
    update_state(states: Gtk.AccessibleState[], values: GObject.Value[]): void;
    vfunc_get_accessible_parent(): Gtk.Accessible | null;
    vfunc_get_at_context(): Gtk.ATContext | null;
    vfunc_get_bounds(): [boolean, number, number, number, number];
    vfunc_get_first_accessible_child(): Gtk.Accessible | null;
    vfunc_get_next_accessible_sibling(): Gtk.Accessible | null;
    vfunc_get_platform_state(state: Gtk.AccessiblePlatformState): boolean;
    get_buildable_id(): string | null;
    vfunc_add_child(builder: Gtk.Builder, child: GObject.Object, type?: string | null): void;
    vfunc_custom_finished(builder: Gtk.Builder, child: GObject.Object | null, tagname: string, data?: any | null): void;
    vfunc_custom_tag_end(builder: Gtk.Builder, child: GObject.Object | null, tagname: string, data?: any | null): void;
    vfunc_custom_tag_start(
        builder: Gtk.Builder,
        child: GObject.Object | null,
        tagname: string
    ): [boolean, Gtk.BuildableParser, any];
    vfunc_get_id(): string;
    vfunc_get_internal_child<T = GObject.Object>(builder: Gtk.Builder, childname: string): T;
    vfunc_parser_finished(builder: Gtk.Builder): void;
    vfunc_set_buildable_property(builder: Gtk.Builder, name: string, value: GObject.Value | any): void;
    vfunc_set_id(id: string): void;
}
export module Workbench {
    export interface ConstructorProperties extends Gtk.WindowGroup.ConstructorProperties {
        [key: string]: any;
        id: string;
    }
}
export class Workbench extends Gtk.WindowGroup {
    static $gtype: GObject.GType<Workbench>;

    constructor(properties?: Partial<Workbench.ConstructorProperties>, ...args: any[]);
    _init(properties?: Partial<Workbench.ConstructorProperties>, ...args: any[]): void;

    // Properties
    get id(): string;
    set id(val: string);

    // Signals

    connect(id: string, callback: (...args: any[]) => any): number;
    connect_after(id: string, callback: (...args: any[]) => any): number;
    emit(id: string, ...args: any[]): void;
    connect(signal: "activate", callback: (_source: this) => void): number;
    connect_after(signal: "activate", callback: (_source: this) => void): number;
    emit(signal: "activate"): void;

    // Constructors

    static ["new"](): Workbench;

    // Members

    action_set_enabled(action_name: string, enabled: boolean): void;
    activate(): void;
    add_workspace(workspace: Workspace): void;
    find_workspace_typed(workspace_type: GObject.GType): Workspace | null;
    focus_workspace(workspace: Workspace): void;
    foreach_workspace(foreach_func: WorkspaceForeach): void;
    get_id(): string;
    remove_workspace(workspace: Workspace): void;
    set_id(id: string): void;
    vfunc_activate(): void;
    vfunc_unload_async(cancellable?: Gio.Cancellable | null, callback?: Gio.AsyncReadyCallback<this> | null): void;
    vfunc_unload_finish(result: Gio.AsyncResult): boolean;
    static find_from_widget(widget: Gtk.Widget): Workbench | null;
    static install_action(action_name: string, parameter_type: string | null, activate: ActionActivateFunc): void;
    static install_property_action(action_name: string, property_name: string): void;
}
export module Workspace {
    export interface ConstructorProperties extends Adw.ApplicationWindow.ConstructorProperties {
        [key: string]: any;
        id: string;
    }
}
export class Workspace
    extends Adw.ApplicationWindow
    implements
        Gio.ActionGroup,
        Gio.ActionMap,
        Gtk.Accessible,
        Gtk.Buildable,
        Gtk.ConstraintTarget,
        Gtk.Native,
        Gtk.Root,
        Gtk.ShortcutManager
{
    static $gtype: GObject.GType<Workspace>;

    constructor(properties?: Partial<Workspace.ConstructorProperties>, ...args: any[]);
    _init(properties?: Partial<Workspace.ConstructorProperties>, ...args: any[]): void;

    // Properties
    get id(): string;
    set id(val: string);

    // Members

    action_set_enabled(action_name: string, enabled: boolean): void;
    get_id(): string;
    // Conflicted with Gtk.ApplicationWindow.get_id
    get_id(...args: never[]): any;
    get_workbench(): Workbench | null;
    inhibit(flags: Gtk.ApplicationInhibitFlags, reason: string): Inhibitor | null;
    set_id(id: string): void;
    static find_from_widget(widget: Gtk.Widget): Workspace | null;
    static install_action(action_name: string, parameter_type: string | null, activate: ActionActivateFunc): void;
    // Conflicted with Gtk.Widget.install_action
    static install_action(...args: never[]): any;
    static install_property_action(action_name: string, property_name: string): void;
}

export class Action {
    static $gtype: GObject.GType<Action>;

    constructor(copy: Action);
}

export interface FrameHeaderNamespace {
    $gtype: GObject.GType<FrameHeader>;
    prototype: FrameHeaderPrototype;
}
export type FrameHeader = FrameHeaderPrototype;
export interface FrameHeaderPrototype extends Gtk.Widget {
    // Properties
    frame: Frame;

    // Members

    add_prefix(priority: number, child: Gtk.Widget): void;
    add_suffix(priority: number, child: Gtk.Widget): void;
    can_drop(widget: Widget): boolean;
    get_frame(): Frame | null;
    page_changed(widget?: Widget | null): void;
    set_frame(frame?: Frame | null): void;
    vfunc_add_prefix(priority: number, child: Gtk.Widget): void;
    vfunc_add_suffix(priority: number, child: Gtk.Widget): void;
    vfunc_can_drop(widget: Widget): boolean;
    vfunc_page_changed(widget?: Widget | null): void;
}

export const FrameHeader: FrameHeaderNamespace;
