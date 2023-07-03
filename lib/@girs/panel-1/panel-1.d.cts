
/*
 * Type Definitions for Gjs (https://gjs.guide/)
 *
 * These type definitions are automatically generated, do not edit them by hand.
 * If you found a bug fix it in `ts-for-gir` or create a bug report on https://github.com/gjsify/ts-for-gir
 */

import './panel-1-ambient.d.ts';
import './panel-1-import.d.ts';
/**
 * Panel-1
 */

import type Gtk from '@girs/gtk-4.0';
import type Gsk from '@girs/gsk-4.0';
import type Graphene from '@girs/graphene-1.0';
import type GObject from '@girs/gobject-2.0';
import type GLib from '@girs/glib-2.0';
import type Gdk from '@girs/gdk-4.0';
import type cairo from '@girs/cairo-1.0';
import type PangoCairo from '@girs/pangocairo-1.0';
import type Pango from '@girs/pango-1.0';
import type HarfBuzz from '@girs/harfbuzz-0.0';
import type freetype2 from '@girs/freetype2-2.0';
import type Gio from '@girs/gio-2.0';
import type GdkPixbuf from '@girs/gdkpixbuf-2.0';
import type GModule from '@girs/gmodule-2.0';
import type Adw from '@girs/adw-1';

/**
 * The area of the panel.
 */
export enum Area {
    /**
     * the area of the panel that is at the horizontal
     *    start. The side is defined by the direction of the user
     *    language. In English, it is the left side.
     */
    START,
    /**
     * the area of the panel that is at the end.
     */
    END,
    /**
     * the area at the top of the panel.
     */
    TOP,
    /**
     * the area at the bottom of the panel.
     */
    BOTTOM,
    /**
     * the area that would be considered as the main area, always
     *    revealed.
     */
    CENTER,
}
/**
 * libpanel major version component (e.g. 1 if %PANEL_VERSION is 1.2.3)
 */
export const MAJOR_VERSION: number
/**
 * libpanel micro version component (e.g. 3 if %PANEL_VERSION is 1.2.3)
 */
export const MICRO_VERSION: number
/**
 * libpanel minor version component (e.g. 2 if %PANEL_VERSION is 1.2.3)
 */
export const MINOR_VERSION: number
/**
 * libpanel version, encoded as a string, useful for printing and
 * concatenation.
 */
export const VERSION_S: string | null
export const WIDGET_KIND_ANY: string | null
export const WIDGET_KIND_DOCUMENT: string | null
export const WIDGET_KIND_UNKNOWN: string | null
export const WIDGET_KIND_UTILITY: string | null
export function check_version(major: number, minor: number, micro: number): boolean
export function finalize(): void
export function get_major_version(): number
export function get_micro_version(): number
export function get_minor_version(): number
export function get_resource(): Gio.Resource
export function init(): void
export function marshal_BOOLEAN__OBJECT_OBJECT(closure: GObject.TClosure, return_value: any, n_param_values: number, param_values: any, invocation_hint: any | null, marshal_data: any | null): void
export function marshal_OBJECT__OBJECT(closure: GObject.TClosure, return_value: any, n_param_values: number, param_values: any, invocation_hint: any | null, marshal_data: any | null): void
export interface ActionActivateFunc {
    (instance: any | null, action_name: string | null, param: GLib.Variant): void
}
/**
 * Callback passed to "foreach frame" functions.
 * @callback 
 * @param frame The #PanelFrame calling.
 */
export interface FrameCallback {
    (frame: Frame): void
}
/**
 * This function is called for each workspace window within a #PanelWorkbench
 * when using panel_workbench_foreach_workspace().
 * @callback 
 * @param workspace a #PanelWorkspace
 */
export interface WorkspaceForeach {
    (workspace: Workspace): void
}
export module FrameHeader {
    export interface ConstructorProperties extends Gtk.Widget.ConstructorProperties, GObject.Object.ConstructorProperties {
        /**
         * The frame the header is attached to, or %NULL.
         */
        frame?: Frame | null
    }

}

export interface FrameHeader extends Gtk.Widget {
    /**
     * The frame the header is attached to, or %NULL.
     */
    frame: Frame
    /**
     * Add a widget into a the prefix area with a priority. The highest
     * the priority the closest to the start.
     * @param priority the priority
     * @param child a #GtkWidget
     */
    add_prefix(priority: number, child: Gtk.Widget): void
    /**
     * Add a widget into a the suffix area with a priority. The highest
     * the priority the closest to the start.
     * @param priority the priority
     * @param child a #GtkWidget
     */
    add_suffix(priority: number, child: Gtk.Widget): void
    /**
     * Tells if the panel widget can be drop onto the panel frame.
     * @param widget a #PanelWidget
     * @returns whether the widget can be dropped.
     */
    can_drop(widget: Widget): boolean
    /**
     * Gets the frame the header is attached to.
     * @returns a #PanelFrame or %NULL
     */
    get_frame(): Frame | null
    /**
     * Notifies the header that the visible page has changed.
     * @param widget a #PanelWidget or %NULL if no page is visible
     */
    page_changed(widget: Widget | null): void
    /**
     * Sets the frame the header is attached to.
     * @param frame a #PanelFrame or %NULL
     */
    set_frame(frame: Frame | null): void
    /**
     * Add a widget into a the prefix area with a priority. The highest
     * the priority the closest to the start.
     * @virtual 
     * @param priority the priority
     * @param child a #GtkWidget
     */
    vfunc_add_prefix(priority: number, child: Gtk.Widget): void
    /**
     * Add a widget into a the suffix area with a priority. The highest
     * the priority the closest to the start.
     * @virtual 
     * @param priority the priority
     * @param child a #GtkWidget
     */
    vfunc_add_suffix(priority: number, child: Gtk.Widget): void
    /**
     * Tells if the panel widget can be drop onto the panel frame.
     * @virtual 
     * @param widget a #PanelWidget
     * @returns whether the widget can be dropped.
     */
    vfunc_can_drop(widget: Widget): boolean
    /**
     * Notifies the header that the visible page has changed.
     * @virtual 
     * @param widget a #PanelWidget or %NULL if no page is visible
     */
    vfunc_page_changed(widget: Widget | null): void
    connect(sigName: "notify::frame", callback: (($obj: FrameHeader, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::frame", callback: (($obj: FrameHeader, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::frame", ...args: any[]): void
    connect(sigName: "notify::can-focus", callback: (($obj: FrameHeader, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::can-focus", callback: (($obj: FrameHeader, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::can-focus", ...args: any[]): void
    connect(sigName: "notify::can-target", callback: (($obj: FrameHeader, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::can-target", callback: (($obj: FrameHeader, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::can-target", ...args: any[]): void
    connect(sigName: "notify::css-classes", callback: (($obj: FrameHeader, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::css-classes", callback: (($obj: FrameHeader, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::css-classes", ...args: any[]): void
    connect(sigName: "notify::css-name", callback: (($obj: FrameHeader, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::css-name", callback: (($obj: FrameHeader, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::css-name", ...args: any[]): void
    connect(sigName: "notify::cursor", callback: (($obj: FrameHeader, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::cursor", callback: (($obj: FrameHeader, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::cursor", ...args: any[]): void
    connect(sigName: "notify::focus-on-click", callback: (($obj: FrameHeader, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::focus-on-click", callback: (($obj: FrameHeader, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::focus-on-click", ...args: any[]): void
    connect(sigName: "notify::focusable", callback: (($obj: FrameHeader, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::focusable", callback: (($obj: FrameHeader, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::focusable", ...args: any[]): void
    connect(sigName: "notify::halign", callback: (($obj: FrameHeader, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::halign", callback: (($obj: FrameHeader, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::halign", ...args: any[]): void
    connect(sigName: "notify::has-default", callback: (($obj: FrameHeader, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::has-default", callback: (($obj: FrameHeader, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::has-default", ...args: any[]): void
    connect(sigName: "notify::has-focus", callback: (($obj: FrameHeader, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::has-focus", callback: (($obj: FrameHeader, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::has-focus", ...args: any[]): void
    connect(sigName: "notify::has-tooltip", callback: (($obj: FrameHeader, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::has-tooltip", callback: (($obj: FrameHeader, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::has-tooltip", ...args: any[]): void
    connect(sigName: "notify::height-request", callback: (($obj: FrameHeader, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::height-request", callback: (($obj: FrameHeader, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::height-request", ...args: any[]): void
    connect(sigName: "notify::hexpand", callback: (($obj: FrameHeader, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::hexpand", callback: (($obj: FrameHeader, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::hexpand", ...args: any[]): void
    connect(sigName: "notify::hexpand-set", callback: (($obj: FrameHeader, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::hexpand-set", callback: (($obj: FrameHeader, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::hexpand-set", ...args: any[]): void
    connect(sigName: "notify::layout-manager", callback: (($obj: FrameHeader, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::layout-manager", callback: (($obj: FrameHeader, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::layout-manager", ...args: any[]): void
    connect(sigName: "notify::margin-bottom", callback: (($obj: FrameHeader, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::margin-bottom", callback: (($obj: FrameHeader, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::margin-bottom", ...args: any[]): void
    connect(sigName: "notify::margin-end", callback: (($obj: FrameHeader, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::margin-end", callback: (($obj: FrameHeader, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::margin-end", ...args: any[]): void
    connect(sigName: "notify::margin-start", callback: (($obj: FrameHeader, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::margin-start", callback: (($obj: FrameHeader, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::margin-start", ...args: any[]): void
    connect(sigName: "notify::margin-top", callback: (($obj: FrameHeader, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::margin-top", callback: (($obj: FrameHeader, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::margin-top", ...args: any[]): void
    connect(sigName: "notify::name", callback: (($obj: FrameHeader, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::name", callback: (($obj: FrameHeader, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::name", ...args: any[]): void
    connect(sigName: "notify::opacity", callback: (($obj: FrameHeader, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::opacity", callback: (($obj: FrameHeader, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::opacity", ...args: any[]): void
    connect(sigName: "notify::overflow", callback: (($obj: FrameHeader, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::overflow", callback: (($obj: FrameHeader, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::overflow", ...args: any[]): void
    connect(sigName: "notify::parent", callback: (($obj: FrameHeader, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::parent", callback: (($obj: FrameHeader, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::parent", ...args: any[]): void
    connect(sigName: "notify::receives-default", callback: (($obj: FrameHeader, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::receives-default", callback: (($obj: FrameHeader, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::receives-default", ...args: any[]): void
    connect(sigName: "notify::root", callback: (($obj: FrameHeader, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::root", callback: (($obj: FrameHeader, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::root", ...args: any[]): void
    connect(sigName: "notify::scale-factor", callback: (($obj: FrameHeader, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::scale-factor", callback: (($obj: FrameHeader, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::scale-factor", ...args: any[]): void
    connect(sigName: "notify::sensitive", callback: (($obj: FrameHeader, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::sensitive", callback: (($obj: FrameHeader, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::sensitive", ...args: any[]): void
    connect(sigName: "notify::tooltip-markup", callback: (($obj: FrameHeader, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::tooltip-markup", callback: (($obj: FrameHeader, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::tooltip-markup", ...args: any[]): void
    connect(sigName: "notify::tooltip-text", callback: (($obj: FrameHeader, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::tooltip-text", callback: (($obj: FrameHeader, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::tooltip-text", ...args: any[]): void
    connect(sigName: "notify::valign", callback: (($obj: FrameHeader, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::valign", callback: (($obj: FrameHeader, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::valign", ...args: any[]): void
    connect(sigName: "notify::vexpand", callback: (($obj: FrameHeader, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::vexpand", callback: (($obj: FrameHeader, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::vexpand", ...args: any[]): void
    connect(sigName: "notify::vexpand-set", callback: (($obj: FrameHeader, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::vexpand-set", callback: (($obj: FrameHeader, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::vexpand-set", ...args: any[]): void
    connect(sigName: "notify::visible", callback: (($obj: FrameHeader, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::visible", callback: (($obj: FrameHeader, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::visible", ...args: any[]): void
    connect(sigName: "notify::width-request", callback: (($obj: FrameHeader, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::width-request", callback: (($obj: FrameHeader, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::width-request", ...args: any[]): void
    connect(sigName: "notify::accessible-role", callback: (($obj: FrameHeader, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::accessible-role", callback: (($obj: FrameHeader, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::accessible-role", ...args: any[]): void
    connect(sigName: string, callback: (...args: any[]) => void): number
    connect_after(sigName: string, callback: (...args: any[]) => void): number
    emit(sigName: string, ...args: any[]): void
    disconnect(id: number): void
}

/**
 * An interface implemented by the header of a #PanelFrame.
 * @interface 
 */
export class FrameHeader extends GObject.Object {
    static name: string
    static $gtype: GObject.GType<FrameHeader>
    constructor(config?: FrameHeader.ConstructorProperties) 
    _init(config?: FrameHeader.ConstructorProperties): void
}

export module ActionMuxer {
    export interface ConstructorProperties extends Gio.ActionGroup.ConstructorProperties, GObject.Object.ConstructorProperties {
    }

}

export interface ActionMuxer extends Gio.ActionGroup {
    /**
     * Locates the #GActionGroup inserted as `prefix`.
     * 
     * If no group was found matching `group,` %NULL is returned.
     * @param prefix the name of the inserted action group
     * @returns a #GActionGroup matching @prefix if   found, otherwise %NULL.
     */
    get_action_group(prefix: string | null): Gio.ActionGroup | null
    insert_action_group(prefix: string | null, action_group: Gio.ActionGroup): void
    /**
     * Gets a list of group names in the muxer.
     * @returns    an array containing the names of groups within the muxer
     */
    list_groups(): string[]
    remove_action_group(prefix: string | null): void
    remove_all(): void
    connect(sigName: string, callback: (...args: any[]) => void): number
    connect_after(sigName: string, callback: (...args: any[]) => void): number
    emit(sigName: string, ...args: any[]): void
    disconnect(id: number): void
}

export class ActionMuxer extends GObject.Object {
    static name: string
    static $gtype: GObject.GType<ActionMuxer>
    constructor(config?: ActionMuxer.ConstructorProperties) 
    constructor() 
    static new(): ActionMuxer
    _init(config?: ActionMuxer.ConstructorProperties): void
}

export module Application {
    export interface ConstructorProperties extends Gio.ActionGroup.ConstructorProperties, Gio.ActionMap.ConstructorProperties, Adw.Application.ConstructorProperties {
    }

}

export interface Application extends Gio.ActionGroup, Gio.ActionMap {
    parent_instance: Adw.Application & Gtk.Application & Gio.Application & Gio.Application
    connect(sigName: "notify::style-manager", callback: (($obj: Application, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::style-manager", callback: (($obj: Application, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::style-manager", ...args: any[]): void
    connect(sigName: "notify::active-window", callback: (($obj: Application, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::active-window", callback: (($obj: Application, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::active-window", ...args: any[]): void
    connect(sigName: "notify::menubar", callback: (($obj: Application, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::menubar", callback: (($obj: Application, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::menubar", ...args: any[]): void
    connect(sigName: "notify::register-session", callback: (($obj: Application, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::register-session", callback: (($obj: Application, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::register-session", ...args: any[]): void
    connect(sigName: "notify::screensaver-active", callback: (($obj: Application, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::screensaver-active", callback: (($obj: Application, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::screensaver-active", ...args: any[]): void
    connect(sigName: "notify::action-group", callback: (($obj: Application, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::action-group", callback: (($obj: Application, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::action-group", ...args: any[]): void
    connect(sigName: "notify::application-id", callback: (($obj: Application, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::application-id", callback: (($obj: Application, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::application-id", ...args: any[]): void
    connect(sigName: "notify::flags", callback: (($obj: Application, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::flags", callback: (($obj: Application, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::flags", ...args: any[]): void
    connect(sigName: "notify::inactivity-timeout", callback: (($obj: Application, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::inactivity-timeout", callback: (($obj: Application, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::inactivity-timeout", ...args: any[]): void
    connect(sigName: "notify::is-busy", callback: (($obj: Application, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::is-busy", callback: (($obj: Application, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::is-busy", ...args: any[]): void
    connect(sigName: "notify::is-registered", callback: (($obj: Application, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::is-registered", callback: (($obj: Application, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::is-registered", ...args: any[]): void
    connect(sigName: "notify::is-remote", callback: (($obj: Application, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::is-remote", callback: (($obj: Application, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::is-remote", ...args: any[]): void
    connect(sigName: "notify::resource-base-path", callback: (($obj: Application, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::resource-base-path", callback: (($obj: Application, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::resource-base-path", ...args: any[]): void
    connect(sigName: string, callback: (...args: any[]) => void): number
    connect_after(sigName: string, callback: (...args: any[]) => void): number
    emit(sigName: string, ...args: any[]): void
    disconnect(id: number): void
}

export class Application extends Adw.Application {
    static name: string
    static $gtype: GObject.GType<Application>
    constructor(config?: Application.ConstructorProperties) 
    constructor(application_id: string | null, flags: Gio.ApplicationFlags) 
    static new(application_id: string | null, flags: Gio.ApplicationFlags): Application
    /**
     * Creates a new `AdwApplication`.
     * 
     * If `application_id` is not `NULL`, then it must be valid. See
     * [func`Gio`.Application.id_is_valid].
     * 
     * If no application ID is given then some features (most notably application
     * uniqueness) will be disabled.
     * @constructor 
     * @param application_id The application ID
     * @param flags The application flags
     * @returns the newly created `AdwApplication`
     */
    static new(application_id: string | null, flags: Gio.ApplicationFlags): Adw.Application
    /**
     * Creates a new `GtkApplication` instance.
     * 
     * When using `GtkApplication`, it is not necessary to call [func`Gtk`.init]
     * manually. It is called as soon as the application gets registered as
     * the primary instance.
     * 
     * Concretely, [func`Gtk`.init] is called in the default handler for the
     * `GApplication::startup` signal. Therefore, `GtkApplication` subclasses should
     * always chain up in their `GApplication::startup` handler before using any GTK
     * API.
     * 
     * Note that commandline arguments are not passed to [func`Gtk`.init].
     * 
     * If `application_id` is not %NULL, then it must be valid. See
     * `g_application_id_is_valid()`.
     * 
     * If no application ID is given then some features (most notably application
     * uniqueness) will be disabled.
     * @constructor 
     * @param application_id The application ID
     * @param flags the application flags
     * @returns a new `GtkApplication` instance
     */
    static new(application_id: string | null, flags: Gio.ApplicationFlags): Gtk.Application
    /**
     * Creates a new #GApplication instance.
     * 
     * If non-%NULL, the application id must be valid.  See
     * g_application_id_is_valid().
     * 
     * If no application ID is given then some features of #GApplication
     * (most notably application uniqueness) will be disabled.
     * @constructor 
     * @param application_id the application id
     * @param flags the application flags
     * @returns a new #GApplication instance
     */
    static new(application_id: string | null, flags: Gio.ApplicationFlags): Gio.Application
    _init(config?: Application.ConstructorProperties): void
}

export module Dock {
    /**
     * Signal callback interface for `adopt-widget`
     */
    export interface AdoptWidgetSignalCallback {
        ($obj: Dock, widget: Widget): boolean
    }

    /**
     * Signal callback interface for `create-frame`
     */
    export interface CreateFrameSignalCallback {
        ($obj: Dock, position: Position): Frame
    }

    /**
     * Signal callback interface for `panel-drag-begin`
     */
    export interface PanelDragBeginSignalCallback {
        ($obj: Dock, panel: Widget): void
    }

    /**
     * Signal callback interface for `panel-drag-end`
     */
    export interface PanelDragEndSignalCallback {
        ($obj: Dock, panel: Widget): void
    }

    export interface ConstructorProperties extends Gtk.Accessible.ConstructorProperties, Gtk.Buildable.ConstructorProperties, Gtk.ConstraintTarget.ConstructorProperties, Gtk.Widget.ConstructorProperties {
        bottom_height?: number | null
        end_width?: number | null
        reveal_bottom?: boolean | null
        reveal_end?: boolean | null
        reveal_start?: boolean | null
        reveal_top?: boolean | null
        start_width?: number | null
        top_height?: number | null
    }

}

export interface Dock extends Gtk.Accessible, Gtk.Buildable, Gtk.ConstraintTarget {
    bottom_height: number
    readonly can_reveal_bottom: boolean
    readonly can_reveal_end: boolean
    readonly can_reveal_start: boolean
    readonly can_reveal_top: boolean
    end_width: number
    reveal_bottom: boolean
    reveal_end: boolean
    reveal_start: boolean
    reveal_top: boolean
    start_width: number
    top_height: number
    parent_instance: Gtk.Widget & GObject.InitiallyUnowned
    /**
     * Invokes a callback for each frame in the dock.
     */
    foreach_frame(): void
    /**
     * Tells if the panel area can be revealed.
     * @param area the panel area to check.
     * @returns whether it can reveal the area or not. If the is no child or the child is empty, will return %FALSE.
     */
    get_can_reveal_area(area: Area): boolean
    /**
     * Tells if the bottom panel area can be revealed.
     * @returns whether it can reveal the bottom area or not. If the is no child or the child is empty, will return %FALSE.
     */
    get_can_reveal_bottom(): boolean
    /**
     * Tells if the end panel area can be revealed.
     * @returns whether it can reveal the end area or not. If the is no child or the child is empty, will return %FALSE.
     */
    get_can_reveal_end(): boolean
    /**
     * Tells if the start panel area can be revealed.
     * @returns whether it can reveal the start area or not. If the is no child or the child is empty, will return %FALSE.
     */
    get_can_reveal_start(): boolean
    /**
     * Tells if the top panel area can be revealed.
     * @returns whether it can reveal the top area or not. If the is no child or the child is empty, will return %FALSE.
     */
    get_can_reveal_top(): boolean
    /**
     * Tells if an area if revealed.
     * @param area the #PanelArea to return the reveal status of.
     * @returns The reveal state.
     */
    get_reveal_area(area: Area): boolean
    /**
     * Tells if the bottom area is revealed.
     * @returns The reveal state of the bottom area.
     */
    get_reveal_bottom(): boolean
    /**
     * Tells if the end area is revealed.
     * @returns The reveal state of the end area.
     */
    get_reveal_end(): boolean
    /**
     * Tells if the start area is revealed.
     * @returns The reveal state of the start area.
     */
    get_reveal_start(): boolean
    /**
     * Tells if the top area is revealed.
     * @returns The reveal state of the top area.
     */
    get_reveal_top(): boolean
    /**
     * Removes a widget from the dock. If `widget` is not a #DockChild,
     * then the closest #DockChild parent is removed.
     * @param widget a #GtkWidget to remove
     */
    remove(widget: Gtk.Widget): void
    /**
     * Set the height of the bottom area.
     * @param height the height
     */
    set_bottom_height(height: number): void
    /**
     * Set the width of the end area.
     * @param width the width
     */
    set_end_width(width: number): void
    /**
     * Sets the reveal status of the area.
     * @param area a #PanelArea. %PANEL_AREA_CENTER is an invalid value.
     * @param reveal reveal the area.
     */
    set_reveal_area(area: Area, reveal: boolean): void
    /**
     * Sets the reveal status of the bottom area.
     * @param reveal_bottom reveal the bottom area.
     */
    set_reveal_bottom(reveal_bottom: boolean): void
    /**
     * Sets the reveal status of the end area.
     * @param reveal_end reveal the end area.
     */
    set_reveal_end(reveal_end: boolean): void
    /**
     * Sets the reveal status of the start area.
     * @param reveal_start reveal the start area.
     */
    set_reveal_start(reveal_start: boolean): void
    /**
     * Sets the reveal status of the top area.
     * @param reveal_top reveal the top area.
     */
    set_reveal_top(reveal_top: boolean): void
    /**
     * Set the width of the start area.
     * @param width the width
     */
    set_start_width(width: number): void
    /**
     * Set the height of the top area.
     * @param height the height
     */
    set_top_height(height: number): void
    vfunc_panel_drag_begin(widget: Widget): void
    vfunc_panel_drag_end(widget: Widget): void
    connect(sigName: "adopt-widget", callback: Dock.AdoptWidgetSignalCallback): number
    connect_after(sigName: "adopt-widget", callback: Dock.AdoptWidgetSignalCallback): number
    emit(sigName: "adopt-widget", widget: Widget, ...args: any[]): void
    connect(sigName: "create-frame", callback: Dock.CreateFrameSignalCallback): number
    connect_after(sigName: "create-frame", callback: Dock.CreateFrameSignalCallback): number
    emit(sigName: "create-frame", position: Position, ...args: any[]): void
    connect(sigName: "panel-drag-begin", callback: Dock.PanelDragBeginSignalCallback): number
    connect_after(sigName: "panel-drag-begin", callback: Dock.PanelDragBeginSignalCallback): number
    emit(sigName: "panel-drag-begin", panel: Widget, ...args: any[]): void
    connect(sigName: "panel-drag-end", callback: Dock.PanelDragEndSignalCallback): number
    connect_after(sigName: "panel-drag-end", callback: Dock.PanelDragEndSignalCallback): number
    emit(sigName: "panel-drag-end", panel: Widget, ...args: any[]): void
    connect(sigName: "notify::bottom-height", callback: (($obj: Dock, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::bottom-height", callback: (($obj: Dock, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::bottom-height", ...args: any[]): void
    connect(sigName: "notify::can-reveal-bottom", callback: (($obj: Dock, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::can-reveal-bottom", callback: (($obj: Dock, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::can-reveal-bottom", ...args: any[]): void
    connect(sigName: "notify::can-reveal-end", callback: (($obj: Dock, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::can-reveal-end", callback: (($obj: Dock, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::can-reveal-end", ...args: any[]): void
    connect(sigName: "notify::can-reveal-start", callback: (($obj: Dock, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::can-reveal-start", callback: (($obj: Dock, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::can-reveal-start", ...args: any[]): void
    connect(sigName: "notify::can-reveal-top", callback: (($obj: Dock, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::can-reveal-top", callback: (($obj: Dock, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::can-reveal-top", ...args: any[]): void
    connect(sigName: "notify::end-width", callback: (($obj: Dock, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::end-width", callback: (($obj: Dock, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::end-width", ...args: any[]): void
    connect(sigName: "notify::reveal-bottom", callback: (($obj: Dock, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::reveal-bottom", callback: (($obj: Dock, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::reveal-bottom", ...args: any[]): void
    connect(sigName: "notify::reveal-end", callback: (($obj: Dock, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::reveal-end", callback: (($obj: Dock, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::reveal-end", ...args: any[]): void
    connect(sigName: "notify::reveal-start", callback: (($obj: Dock, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::reveal-start", callback: (($obj: Dock, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::reveal-start", ...args: any[]): void
    connect(sigName: "notify::reveal-top", callback: (($obj: Dock, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::reveal-top", callback: (($obj: Dock, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::reveal-top", ...args: any[]): void
    connect(sigName: "notify::start-width", callback: (($obj: Dock, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::start-width", callback: (($obj: Dock, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::start-width", ...args: any[]): void
    connect(sigName: "notify::top-height", callback: (($obj: Dock, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::top-height", callback: (($obj: Dock, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::top-height", ...args: any[]): void
    connect(sigName: "notify::can-focus", callback: (($obj: Dock, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::can-focus", callback: (($obj: Dock, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::can-focus", ...args: any[]): void
    connect(sigName: "notify::can-target", callback: (($obj: Dock, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::can-target", callback: (($obj: Dock, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::can-target", ...args: any[]): void
    connect(sigName: "notify::css-classes", callback: (($obj: Dock, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::css-classes", callback: (($obj: Dock, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::css-classes", ...args: any[]): void
    connect(sigName: "notify::css-name", callback: (($obj: Dock, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::css-name", callback: (($obj: Dock, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::css-name", ...args: any[]): void
    connect(sigName: "notify::cursor", callback: (($obj: Dock, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::cursor", callback: (($obj: Dock, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::cursor", ...args: any[]): void
    connect(sigName: "notify::focus-on-click", callback: (($obj: Dock, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::focus-on-click", callback: (($obj: Dock, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::focus-on-click", ...args: any[]): void
    connect(sigName: "notify::focusable", callback: (($obj: Dock, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::focusable", callback: (($obj: Dock, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::focusable", ...args: any[]): void
    connect(sigName: "notify::halign", callback: (($obj: Dock, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::halign", callback: (($obj: Dock, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::halign", ...args: any[]): void
    connect(sigName: "notify::has-default", callback: (($obj: Dock, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::has-default", callback: (($obj: Dock, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::has-default", ...args: any[]): void
    connect(sigName: "notify::has-focus", callback: (($obj: Dock, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::has-focus", callback: (($obj: Dock, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::has-focus", ...args: any[]): void
    connect(sigName: "notify::has-tooltip", callback: (($obj: Dock, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::has-tooltip", callback: (($obj: Dock, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::has-tooltip", ...args: any[]): void
    connect(sigName: "notify::height-request", callback: (($obj: Dock, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::height-request", callback: (($obj: Dock, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::height-request", ...args: any[]): void
    connect(sigName: "notify::hexpand", callback: (($obj: Dock, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::hexpand", callback: (($obj: Dock, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::hexpand", ...args: any[]): void
    connect(sigName: "notify::hexpand-set", callback: (($obj: Dock, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::hexpand-set", callback: (($obj: Dock, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::hexpand-set", ...args: any[]): void
    connect(sigName: "notify::layout-manager", callback: (($obj: Dock, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::layout-manager", callback: (($obj: Dock, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::layout-manager", ...args: any[]): void
    connect(sigName: "notify::margin-bottom", callback: (($obj: Dock, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::margin-bottom", callback: (($obj: Dock, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::margin-bottom", ...args: any[]): void
    connect(sigName: "notify::margin-end", callback: (($obj: Dock, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::margin-end", callback: (($obj: Dock, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::margin-end", ...args: any[]): void
    connect(sigName: "notify::margin-start", callback: (($obj: Dock, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::margin-start", callback: (($obj: Dock, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::margin-start", ...args: any[]): void
    connect(sigName: "notify::margin-top", callback: (($obj: Dock, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::margin-top", callback: (($obj: Dock, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::margin-top", ...args: any[]): void
    connect(sigName: "notify::name", callback: (($obj: Dock, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::name", callback: (($obj: Dock, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::name", ...args: any[]): void
    connect(sigName: "notify::opacity", callback: (($obj: Dock, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::opacity", callback: (($obj: Dock, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::opacity", ...args: any[]): void
    connect(sigName: "notify::overflow", callback: (($obj: Dock, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::overflow", callback: (($obj: Dock, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::overflow", ...args: any[]): void
    connect(sigName: "notify::parent", callback: (($obj: Dock, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::parent", callback: (($obj: Dock, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::parent", ...args: any[]): void
    connect(sigName: "notify::receives-default", callback: (($obj: Dock, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::receives-default", callback: (($obj: Dock, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::receives-default", ...args: any[]): void
    connect(sigName: "notify::root", callback: (($obj: Dock, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::root", callback: (($obj: Dock, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::root", ...args: any[]): void
    connect(sigName: "notify::scale-factor", callback: (($obj: Dock, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::scale-factor", callback: (($obj: Dock, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::scale-factor", ...args: any[]): void
    connect(sigName: "notify::sensitive", callback: (($obj: Dock, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::sensitive", callback: (($obj: Dock, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::sensitive", ...args: any[]): void
    connect(sigName: "notify::tooltip-markup", callback: (($obj: Dock, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::tooltip-markup", callback: (($obj: Dock, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::tooltip-markup", ...args: any[]): void
    connect(sigName: "notify::tooltip-text", callback: (($obj: Dock, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::tooltip-text", callback: (($obj: Dock, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::tooltip-text", ...args: any[]): void
    connect(sigName: "notify::valign", callback: (($obj: Dock, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::valign", callback: (($obj: Dock, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::valign", ...args: any[]): void
    connect(sigName: "notify::vexpand", callback: (($obj: Dock, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::vexpand", callback: (($obj: Dock, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::vexpand", ...args: any[]): void
    connect(sigName: "notify::vexpand-set", callback: (($obj: Dock, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::vexpand-set", callback: (($obj: Dock, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::vexpand-set", ...args: any[]): void
    connect(sigName: "notify::visible", callback: (($obj: Dock, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::visible", callback: (($obj: Dock, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::visible", ...args: any[]): void
    connect(sigName: "notify::width-request", callback: (($obj: Dock, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::width-request", callback: (($obj: Dock, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::width-request", ...args: any[]): void
    connect(sigName: "notify::accessible-role", callback: (($obj: Dock, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::accessible-role", callback: (($obj: Dock, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::accessible-role", ...args: any[]): void
    connect(sigName: string, callback: (...args: any[]) => void): number
    connect_after(sigName: string, callback: (...args: any[]) => void): number
    emit(sigName: string, ...args: any[]): void
    disconnect(id: number): void
}

/**
 * The #PanelDock is a widget designed to contain widgets that can be
 * docked. Use the #PanelDock as the top widget of your dockable UI.
 * 
 * A #PanelDock is divided in 5 areas: %PANEL_AREA_TOP,
 * %PANEL_AREA_BOTTOM, %PANEL_AREA_START, %PANEL_AREA_END represent
 * the surrounding areas that can revealed. %PANEL_AREA_CENTER
 * represent the main area, that is always displayed and resized
 * depending on the reveal state of the surrounding areas.
 * 
 * It will contain a #PanelDockChild for each of the areas in use,
 * albeit this is done by the widget.
 * @class 
 */
export class Dock extends Gtk.Widget {
    static name: string
    static $gtype: GObject.GType<Dock>
    constructor(config?: Dock.ConstructorProperties) 
    /**
     * Create a new #PanelDock.
     * @constructor 
     * @returns a newly created #PanelDock
     */
    constructor() 
    /**
     * Create a new #PanelDock.
     * @constructor 
     * @returns a newly created #PanelDock
     */
    static new(): Dock
    _init(config?: Dock.ConstructorProperties): void
}

export module DocumentWorkspace {
    /**
     * Signal callback interface for `add-widget`
     */
    export interface AddWidgetSignalCallback {
        ($obj: DocumentWorkspace, object: Widget, p0: Position): boolean
    }


    export interface ConstructorProperties extends Gio.ActionGroup.ConstructorProperties, Gio.ActionMap.ConstructorProperties, Gtk.Accessible.ConstructorProperties, Gtk.Buildable.ConstructorProperties, Gtk.ConstraintTarget.ConstructorProperties, Gtk.Native.ConstructorProperties, Gtk.Root.ConstructorProperties, Gtk.ShortcutManager.ConstructorProperties, Workspace.ConstructorProperties {
    }

}

export interface DocumentWorkspace extends Gio.ActionGroup, Gio.ActionMap, Gtk.Accessible, Gtk.Buildable, Gtk.ConstraintTarget, Gtk.Native, Gtk.Root, Gtk.ShortcutManager {
    readonly dock: Dock
    readonly grid: Grid
    readonly statusbar: Statusbar
    parent_instance: Workspace & Adw.ApplicationWindow & Gtk.ApplicationWindow & Gtk.Window & Gtk.Widget & GObject.InitiallyUnowned
    /**
     * Requests the workspace add `widget` to the dock at `position`.
     * @param widget a #PanelWidget
     * @param position a #PanelPosition or %NULL
     */
    add_widget(widget: Widget, position: Position | null): void
    /**
     * Get the #PanelDock for the workspace.
     * @returns a #PanelDock
     */
    get_dock(): Dock
    /**
     * Get the document grid for the workspace.
     * @returns a #PanelGrid
     */
    get_grid(): Grid
    /**
     * Gets the statusbar for the workspace.
     * @returns a #PanelStatusbar
     */
    get_statusbar(): Statusbar | null
    /**
     * Gets the titlebar for the workspace.
     * @returns a #GtkWidget or %NULL
     */
    get_titlebar(): Gtk.Widget | null
    set_titlebar(titlebar: Gtk.Widget): void
    /**
     * Sets a custom titlebar for `window`.
     * 
     * A typical widget used here is [class`Gtk`.HeaderBar], as it
     * provides various features expected of a titlebar while allowing
     * the addition of child widgets to it.
     * 
     * If you set a custom titlebar, GTK will do its best to convince
     * the window manager not to put its own titlebar on the window.
     * Depending on the system, this function may not work for a window
     * that is already visible, so you set the titlebar before calling
     * [method`Gtk`.Widget.show].
     * @param titlebar the widget to use as titlebar
     */
    set_titlebar(titlebar: Gtk.Widget | null): void
    /**
     * Activate the named action within `action_group`.
     * 
     * If the action is expecting a parameter, then the correct type of
     * parameter must be given as `parameter`.  If the action is expecting no
     * parameters then `parameter` must be %NULL.  See
     * g_action_group_get_action_parameter_type().
     * 
     * If the #GActionGroup implementation supports asynchronous remote
     * activation over D-Bus, this call may return before the relevant
     * D-Bus traffic has been sent, or any replies have been received. In
     * order to block on such asynchronous activation calls,
     * g_dbus_connection_flush() should be called prior to the code, which
     * depends on the result of the action activation. Without flushing
     * the D-Bus connection, there is no guarantee that the action would
     * have been activated.
     * 
     * The following code which runs in a remote app instance, shows an
     * example of a "quit" action being activated on the primary app
     * instance over D-Bus. Here g_dbus_connection_flush() is called
     * before `exit()`. Without g_dbus_connection_flush(), the "quit" action
     * may fail to be activated on the primary instance.
     * 
     * 
     * ```c
     * // call "quit" action on primary instance
     * g_action_group_activate_action (G_ACTION_GROUP (app), "quit", NULL);
     * 
     * // make sure the action is activated now
     * g_dbus_connection_flush (...);
     * 
     * g_debug ("application has been terminated. exiting.");
     * 
     * exit (0);
     * ```
     * 
     * @param action_name the name of the action to activate
     * @param parameter parameters to the activation
     */
    activate_action(action_name: string | null, parameter: GLib.Variant | null): void
    /**
     * Looks up the action in the action groups associated with
     * `widget` and its ancestors, and activates it.
     * 
     * If the action is in an action group added with
     * [method`Gtk`.Widget.insert_action_group], the `name` is expected
     * to be prefixed with the prefix that was used when the group was
     * inserted.
     * 
     * The arguments must match the actions expected parameter type,
     * as returned by `g_action_get_parameter_type()`.
     * @param name the name of the action to activate
     * @param args parameters to use
     * @returns %TRUE if the action was activated, %FALSE if the   action does not exist.
     */
    activate_action(name: string | null, args: GLib.Variant | null): boolean
    get_id(): string | null
    /**
     * Returns the unique ID of the window.
     * 
     *  If the window has not yet been added to a `GtkApplication`, returns `0`.
     * @returns the unique ID for @window, or `0` if the window   has not yet been added to a `GtkApplication`
     */
    get_id(): number
    /**
     * Returns the unique ID of the window.
     * 
     *  If the window has not yet been added to a `GtkApplication`, returns `0`.
     * @returns the unique ID for @window, or `0` if the window   has not yet been added to a `GtkApplication`
     */
    get_id(): number
    vfunc_add_widget(widget: Widget, position: Position): boolean
    connect(sigName: "add-widget", callback: DocumentWorkspace.AddWidgetSignalCallback): number
    connect_after(sigName: "add-widget", callback: DocumentWorkspace.AddWidgetSignalCallback): number
    emit(sigName: "add-widget", object: Widget, p0: Position, ...args: any[]): void
    connect(sigName: "create-frame", callback: (...args: any[]) => void): number
    connect_after(sigName: "create-frame", callback: (...args: any[]) => void): number
    emit(sigName: "create-frame", object: Position, ...args: any[]): void
    connect(sigName: "notify::dock", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::dock", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::dock", ...args: any[]): void
    connect(sigName: "notify::grid", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::grid", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::grid", ...args: any[]): void
    connect(sigName: "notify::statusbar", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::statusbar", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::statusbar", ...args: any[]): void
    connect(sigName: "notify::id", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::id", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::id", ...args: any[]): void
    connect(sigName: "notify::content", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::content", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::content", ...args: any[]): void
    connect(sigName: "notify::show-menubar", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::show-menubar", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::show-menubar", ...args: any[]): void
    connect(sigName: "notify::application", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::application", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::application", ...args: any[]): void
    connect(sigName: "notify::child", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::child", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::child", ...args: any[]): void
    connect(sigName: "notify::decorated", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::decorated", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::decorated", ...args: any[]): void
    connect(sigName: "notify::default-height", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::default-height", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::default-height", ...args: any[]): void
    connect(sigName: "notify::default-widget", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::default-widget", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::default-widget", ...args: any[]): void
    connect(sigName: "notify::default-width", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::default-width", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::default-width", ...args: any[]): void
    connect(sigName: "notify::deletable", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::deletable", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::deletable", ...args: any[]): void
    connect(sigName: "notify::destroy-with-parent", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::destroy-with-parent", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::destroy-with-parent", ...args: any[]): void
    connect(sigName: "notify::display", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::display", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::display", ...args: any[]): void
    connect(sigName: "notify::focus-visible", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::focus-visible", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::focus-visible", ...args: any[]): void
    connect(sigName: "notify::focus-widget", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::focus-widget", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::focus-widget", ...args: any[]): void
    connect(sigName: "notify::fullscreened", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::fullscreened", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::fullscreened", ...args: any[]): void
    connect(sigName: "notify::handle-menubar-accel", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::handle-menubar-accel", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::handle-menubar-accel", ...args: any[]): void
    connect(sigName: "notify::hide-on-close", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::hide-on-close", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::hide-on-close", ...args: any[]): void
    connect(sigName: "notify::icon-name", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::icon-name", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::icon-name", ...args: any[]): void
    connect(sigName: "notify::is-active", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::is-active", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::is-active", ...args: any[]): void
    connect(sigName: "notify::maximized", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::maximized", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::maximized", ...args: any[]): void
    connect(sigName: "notify::mnemonics-visible", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::mnemonics-visible", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::mnemonics-visible", ...args: any[]): void
    connect(sigName: "notify::modal", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::modal", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::modal", ...args: any[]): void
    connect(sigName: "notify::resizable", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::resizable", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::resizable", ...args: any[]): void
    connect(sigName: "notify::startup-id", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::startup-id", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::startup-id", ...args: any[]): void
    connect(sigName: "notify::title", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::title", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::title", ...args: any[]): void
    connect(sigName: "notify::titlebar", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::titlebar", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::titlebar", ...args: any[]): void
    connect(sigName: "notify::transient-for", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::transient-for", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::transient-for", ...args: any[]): void
    connect(sigName: "notify::can-focus", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::can-focus", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::can-focus", ...args: any[]): void
    connect(sigName: "notify::can-target", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::can-target", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::can-target", ...args: any[]): void
    connect(sigName: "notify::css-classes", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::css-classes", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::css-classes", ...args: any[]): void
    connect(sigName: "notify::css-name", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::css-name", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::css-name", ...args: any[]): void
    connect(sigName: "notify::cursor", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::cursor", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::cursor", ...args: any[]): void
    connect(sigName: "notify::focus-on-click", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::focus-on-click", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::focus-on-click", ...args: any[]): void
    connect(sigName: "notify::focusable", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::focusable", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::focusable", ...args: any[]): void
    connect(sigName: "notify::halign", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::halign", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::halign", ...args: any[]): void
    connect(sigName: "notify::has-default", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::has-default", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::has-default", ...args: any[]): void
    connect(sigName: "notify::has-focus", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::has-focus", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::has-focus", ...args: any[]): void
    connect(sigName: "notify::has-tooltip", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::has-tooltip", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::has-tooltip", ...args: any[]): void
    connect(sigName: "notify::height-request", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::height-request", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::height-request", ...args: any[]): void
    connect(sigName: "notify::hexpand", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::hexpand", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::hexpand", ...args: any[]): void
    connect(sigName: "notify::hexpand-set", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::hexpand-set", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::hexpand-set", ...args: any[]): void
    connect(sigName: "notify::layout-manager", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::layout-manager", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::layout-manager", ...args: any[]): void
    connect(sigName: "notify::margin-bottom", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::margin-bottom", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::margin-bottom", ...args: any[]): void
    connect(sigName: "notify::margin-end", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::margin-end", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::margin-end", ...args: any[]): void
    connect(sigName: "notify::margin-start", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::margin-start", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::margin-start", ...args: any[]): void
    connect(sigName: "notify::margin-top", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::margin-top", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::margin-top", ...args: any[]): void
    connect(sigName: "notify::name", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::name", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::name", ...args: any[]): void
    connect(sigName: "notify::opacity", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::opacity", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::opacity", ...args: any[]): void
    connect(sigName: "notify::overflow", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::overflow", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::overflow", ...args: any[]): void
    connect(sigName: "notify::parent", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::parent", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::parent", ...args: any[]): void
    connect(sigName: "notify::receives-default", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::receives-default", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::receives-default", ...args: any[]): void
    connect(sigName: "notify::root", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::root", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::root", ...args: any[]): void
    connect(sigName: "notify::scale-factor", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::scale-factor", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::scale-factor", ...args: any[]): void
    connect(sigName: "notify::sensitive", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::sensitive", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::sensitive", ...args: any[]): void
    connect(sigName: "notify::tooltip-markup", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::tooltip-markup", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::tooltip-markup", ...args: any[]): void
    connect(sigName: "notify::tooltip-text", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::tooltip-text", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::tooltip-text", ...args: any[]): void
    connect(sigName: "notify::valign", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::valign", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::valign", ...args: any[]): void
    connect(sigName: "notify::vexpand", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::vexpand", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::vexpand", ...args: any[]): void
    connect(sigName: "notify::vexpand-set", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::vexpand-set", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::vexpand-set", ...args: any[]): void
    connect(sigName: "notify::visible", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::visible", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::visible", ...args: any[]): void
    connect(sigName: "notify::width-request", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::width-request", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::width-request", ...args: any[]): void
    connect(sigName: "notify::accessible-role", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::accessible-role", callback: (($obj: DocumentWorkspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::accessible-role", ...args: any[]): void
    connect(sigName: string, callback: (...args: any[]) => void): number
    connect_after(sigName: string, callback: (...args: any[]) => void): number
    emit(sigName: string, ...args: any[]): void
    disconnect(id: number): void
}

export class DocumentWorkspace extends Workspace {
    static name: string
    static $gtype: GObject.GType<DocumentWorkspace>
    constructor(config?: DocumentWorkspace.ConstructorProperties) 
    /**
     * Creates a new #PanelDocumentWorkspace.
     * @constructor 
     * @returns a #PanelDocumentWorkspace
     */
    constructor() 
    /**
     * Creates a new #PanelDocumentWorkspace.
     * @constructor 
     * @returns a #PanelDocumentWorkspace
     */
    static new(): DocumentWorkspace
    /**
     * Creates a new `AdwApplicationWindow` for `app`.
     * @constructor 
     * @param app an application instance
     * @returns the newly created `AdwApplicationWindow`
     */
    static new(app: Gtk.Application): Adw.ApplicationWindow
    /**
     * Creates a new `GtkWindow`.
     * 
     * To get an undecorated window (no window borders), use
     * [method`Gtk`.Window.set_decorated].
     * 
     * All top-level windows created by gtk_window_new() are stored
     * in an internal top-level window list. This list can be obtained
     * from [func`Gtk`.Window.list_toplevels]. Due to GTK keeping a
     * reference to the window internally, gtk_window_new() does not
     * return a reference to the caller.
     * 
     * To delete a `GtkWindow`, call [method`Gtk`.Window.destroy].
     * @constructor 
     * @returns a new `GtkWindow`.
     */
    static new(): Gtk.Window
    _init(config?: DocumentWorkspace.ConstructorProperties): void
    /**
     * This should be called at class initialization time to specify
     * actions to be added for all instances of this class.
     * 
     * Actions installed by this function are stateless. The only state
     * they have is whether they are enabled or not.
     * @param action_name a prefixed action name, such as "project.open"
     * @param parameter_type the parameter type
     * @param activate callback to use when the action is activated
     */
    static install_action(workspace_class: Workspace | Function | GObject.GType, action_name: string | null, parameter_type: string | null, activate: ActionActivateFunc): void
    /**
     * This should be called at class initialization time to specify
     * actions to be added for all instances of this class.
     * 
     * Actions installed by this function are stateless. The only state
     * they have is whether they are enabled or not.
     * @param action_name a prefixed action name, such as "clipboard.paste"
     * @param parameter_type the parameter type
     * @param activate callback to use when the action is activated
     */
    static install_action(widget_class: Widget | Function | GObject.GType, action_name: string | null, parameter_type: string | null, activate: Gtk.WidgetActionActivateFunc): void
    /**
     * This should be called at class initialization time to specify
     * actions to be added for all instances of this class.
     * 
     * Actions installed by this function are stateless. The only state
     * they have is whether they are enabled or not.
     * @param action_name a prefixed action name, such as "clipboard.paste"
     * @param parameter_type the parameter type
     * @param activate callback to use when the action is activated
     */
    static install_action(widget_class: Widget | Function | GObject.GType, action_name: string | null, parameter_type: string | null, activate: Gtk.WidgetActionActivateFunc): void
}

export module Frame {
    /**
     * Signal callback interface for `adopt-widget`
     */
    export interface AdoptWidgetSignalCallback {
        ($obj: Frame, widget: Widget): boolean
    }

    /**
     * Signal callback interface for `page-closed`
     */
    export interface PageClosedSignalCallback {
        ($obj: Frame, widget: Widget): void
    }

    export interface ConstructorProperties extends Gtk.Accessible.ConstructorProperties, Gtk.Buildable.ConstructorProperties, Gtk.ConstraintTarget.ConstructorProperties, Gtk.Orientable.ConstructorProperties, Gtk.Widget.ConstructorProperties {
        placeholder?: Gtk.Widget | null
        visible_child?: Widget | null
    }

}

export interface Frame extends Gtk.Accessible, Gtk.Buildable, Gtk.ConstraintTarget, Gtk.Orientable {
    readonly closeable: boolean
    readonly empty: boolean
    placeholder: Gtk.Widget
    visible_child: Widget
    parent_instance: Gtk.Widget & GObject.InitiallyUnowned
    /**
     * Adds a widget to the frame.
     * @param panel a #PanelWidget to add
     */
    add(panel: Widget): void
    /**
     * Add `panel` before `sibling` in the #PanelFrame.
     * @param panel the #PanelWidget to add.
     * @param sibling the sibling #PanelWidget to add the panel before.
     */
    add_before(panel: Widget, sibling: Widget): void
    /**
     * Tells if the panel frame is closeable.
     * @returns %TRUE if the panel frame is closeable.
     */
    get_closeable(): boolean
    /**
     * Tells if the panel frame is empty.
     * @returns %TRUE if the panel is empty.
     */
    get_empty(): boolean
    /**
     * Gets the header for the frame.
     * @returns a #PanelFrameHeader or %NULL
     */
    get_header(): FrameHeader | null
    /**
     * Gets the number of pages in the panel frame.
     * @returns The number of pages.
     */
    get_n_pages(): number
    /**
     * Gets the page with the given index, if any.
     * @param n the index of the page
     * @returns a #PanelWidget or %NULL
     */
    get_page(n: number): Widget | null
    /**
     * Get the pages for the frame.
     * @returns a #GtkSelectionModel
     */
    get_pages(): Gtk.SelectionModel
    /**
     * Gets the placeholder widget, if any.
     * @returns a #GtkWidget or %NULL
     */
    get_placeholder(): Gtk.Widget | null
    /**
     * Gets the #PanelPosition for the frame.
     * @returns a #PanelPosition
     */
    get_position(): Position
    /**
     * Gets the requested size for the panel frame.
     * @returns the requested size.
     */
    get_requested_size(): number
    /**
     * Gets the widget of the currently visible child.
     * @returns a #PanelWidget or %NULL
     */
    get_visible_child(): Widget | null
    /**
     * Removes a widget from the frame.
     * @param panel a #PanelWidget to remove.
     */
    remove(panel: Widget): void
    /**
     * Set pinned state of `child`.
     * @param child a #PanelWidget
     * @param pinned if `widget` should be pinned
     */
    set_child_pinned(child: Widget, pinned: boolean): void
    /**
     * Sets the header for the frame, such as a #PanelFrameSwitcher.
     * @param header a #PanelFrameHeader
     */
    set_header(header: FrameHeader | null): void
    /**
     * Sets the placeholder widget for the frame.
     * 
     * The placeholder widget is displayed when there are no pages
     * to display in the frame.
     * @param placeholder a #GtkWidget or %NULL
     */
    set_placeholder(placeholder: Gtk.Widget | null): void
    /**
     * Sets the requested size for the panel frame.
     * @param requested_size the requested size.
     */
    set_requested_size(requested_size: number): void
    /**
     * Sets the current page to the child specified in `widget`.
     * @param widget a #PanelWidget
     */
    set_visible_child(widget: Widget): void
    vfunc_adopt_widget(widget: Widget): boolean
    vfunc_page_closed(widget: Widget): void
    connect(sigName: "adopt-widget", callback: Frame.AdoptWidgetSignalCallback): number
    connect_after(sigName: "adopt-widget", callback: Frame.AdoptWidgetSignalCallback): number
    emit(sigName: "adopt-widget", widget: Widget, ...args: any[]): void
    connect(sigName: "page-closed", callback: Frame.PageClosedSignalCallback): number
    connect_after(sigName: "page-closed", callback: Frame.PageClosedSignalCallback): number
    emit(sigName: "page-closed", widget: Widget, ...args: any[]): void
    connect(sigName: "notify::closeable", callback: (($obj: Frame, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::closeable", callback: (($obj: Frame, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::closeable", ...args: any[]): void
    connect(sigName: "notify::empty", callback: (($obj: Frame, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::empty", callback: (($obj: Frame, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::empty", ...args: any[]): void
    connect(sigName: "notify::placeholder", callback: (($obj: Frame, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::placeholder", callback: (($obj: Frame, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::placeholder", ...args: any[]): void
    connect(sigName: "notify::visible-child", callback: (($obj: Frame, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::visible-child", callback: (($obj: Frame, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::visible-child", ...args: any[]): void
    connect(sigName: "notify::can-focus", callback: (($obj: Frame, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::can-focus", callback: (($obj: Frame, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::can-focus", ...args: any[]): void
    connect(sigName: "notify::can-target", callback: (($obj: Frame, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::can-target", callback: (($obj: Frame, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::can-target", ...args: any[]): void
    connect(sigName: "notify::css-classes", callback: (($obj: Frame, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::css-classes", callback: (($obj: Frame, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::css-classes", ...args: any[]): void
    connect(sigName: "notify::css-name", callback: (($obj: Frame, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::css-name", callback: (($obj: Frame, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::css-name", ...args: any[]): void
    connect(sigName: "notify::cursor", callback: (($obj: Frame, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::cursor", callback: (($obj: Frame, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::cursor", ...args: any[]): void
    connect(sigName: "notify::focus-on-click", callback: (($obj: Frame, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::focus-on-click", callback: (($obj: Frame, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::focus-on-click", ...args: any[]): void
    connect(sigName: "notify::focusable", callback: (($obj: Frame, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::focusable", callback: (($obj: Frame, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::focusable", ...args: any[]): void
    connect(sigName: "notify::halign", callback: (($obj: Frame, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::halign", callback: (($obj: Frame, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::halign", ...args: any[]): void
    connect(sigName: "notify::has-default", callback: (($obj: Frame, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::has-default", callback: (($obj: Frame, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::has-default", ...args: any[]): void
    connect(sigName: "notify::has-focus", callback: (($obj: Frame, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::has-focus", callback: (($obj: Frame, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::has-focus", ...args: any[]): void
    connect(sigName: "notify::has-tooltip", callback: (($obj: Frame, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::has-tooltip", callback: (($obj: Frame, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::has-tooltip", ...args: any[]): void
    connect(sigName: "notify::height-request", callback: (($obj: Frame, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::height-request", callback: (($obj: Frame, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::height-request", ...args: any[]): void
    connect(sigName: "notify::hexpand", callback: (($obj: Frame, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::hexpand", callback: (($obj: Frame, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::hexpand", ...args: any[]): void
    connect(sigName: "notify::hexpand-set", callback: (($obj: Frame, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::hexpand-set", callback: (($obj: Frame, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::hexpand-set", ...args: any[]): void
    connect(sigName: "notify::layout-manager", callback: (($obj: Frame, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::layout-manager", callback: (($obj: Frame, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::layout-manager", ...args: any[]): void
    connect(sigName: "notify::margin-bottom", callback: (($obj: Frame, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::margin-bottom", callback: (($obj: Frame, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::margin-bottom", ...args: any[]): void
    connect(sigName: "notify::margin-end", callback: (($obj: Frame, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::margin-end", callback: (($obj: Frame, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::margin-end", ...args: any[]): void
    connect(sigName: "notify::margin-start", callback: (($obj: Frame, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::margin-start", callback: (($obj: Frame, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::margin-start", ...args: any[]): void
    connect(sigName: "notify::margin-top", callback: (($obj: Frame, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::margin-top", callback: (($obj: Frame, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::margin-top", ...args: any[]): void
    connect(sigName: "notify::name", callback: (($obj: Frame, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::name", callback: (($obj: Frame, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::name", ...args: any[]): void
    connect(sigName: "notify::opacity", callback: (($obj: Frame, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::opacity", callback: (($obj: Frame, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::opacity", ...args: any[]): void
    connect(sigName: "notify::overflow", callback: (($obj: Frame, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::overflow", callback: (($obj: Frame, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::overflow", ...args: any[]): void
    connect(sigName: "notify::parent", callback: (($obj: Frame, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::parent", callback: (($obj: Frame, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::parent", ...args: any[]): void
    connect(sigName: "notify::receives-default", callback: (($obj: Frame, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::receives-default", callback: (($obj: Frame, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::receives-default", ...args: any[]): void
    connect(sigName: "notify::root", callback: (($obj: Frame, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::root", callback: (($obj: Frame, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::root", ...args: any[]): void
    connect(sigName: "notify::scale-factor", callback: (($obj: Frame, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::scale-factor", callback: (($obj: Frame, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::scale-factor", ...args: any[]): void
    connect(sigName: "notify::sensitive", callback: (($obj: Frame, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::sensitive", callback: (($obj: Frame, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::sensitive", ...args: any[]): void
    connect(sigName: "notify::tooltip-markup", callback: (($obj: Frame, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::tooltip-markup", callback: (($obj: Frame, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::tooltip-markup", ...args: any[]): void
    connect(sigName: "notify::tooltip-text", callback: (($obj: Frame, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::tooltip-text", callback: (($obj: Frame, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::tooltip-text", ...args: any[]): void
    connect(sigName: "notify::valign", callback: (($obj: Frame, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::valign", callback: (($obj: Frame, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::valign", ...args: any[]): void
    connect(sigName: "notify::vexpand", callback: (($obj: Frame, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::vexpand", callback: (($obj: Frame, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::vexpand", ...args: any[]): void
    connect(sigName: "notify::vexpand-set", callback: (($obj: Frame, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::vexpand-set", callback: (($obj: Frame, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::vexpand-set", ...args: any[]): void
    connect(sigName: "notify::visible", callback: (($obj: Frame, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::visible", callback: (($obj: Frame, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::visible", ...args: any[]): void
    connect(sigName: "notify::width-request", callback: (($obj: Frame, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::width-request", callback: (($obj: Frame, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::width-request", ...args: any[]): void
    connect(sigName: "notify::accessible-role", callback: (($obj: Frame, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::accessible-role", callback: (($obj: Frame, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::accessible-role", ...args: any[]): void
    connect(sigName: "notify::orientation", callback: (($obj: Frame, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::orientation", callback: (($obj: Frame, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::orientation", ...args: any[]): void
    connect(sigName: string, callback: (...args: any[]) => void): number
    connect_after(sigName: string, callback: (...args: any[]) => void): number
    emit(sigName: string, ...args: any[]): void
    disconnect(id: number): void
}

/**
 * The #PanelFrame is a widget containing panels to display in an
 * area. The widgets are added internally in an [class`Adw`.TabView] to
 * display them one at a time like in a stack.
 * 
 * A #PanelFrame can also have a header widget that will be displayed
 * above the panels.
 * @class 
 */
export class Frame extends Gtk.Widget {
    static name: string
    static $gtype: GObject.GType<Frame>
    constructor(config?: Frame.ConstructorProperties) 
    /**
     * Create a new #PanelFrame.
     * @constructor 
     * @returns a newly created #PanelFrame object.
     */
    constructor() 
    /**
     * Create a new #PanelFrame.
     * @constructor 
     * @returns a newly created #PanelFrame object.
     */
    static new(): Frame
    _init(config?: Frame.ConstructorProperties): void
}

export module FrameHeaderBar {
    export interface ConstructorProperties extends Gtk.Accessible.ConstructorProperties, Gtk.Buildable.ConstructorProperties, Gtk.ConstraintTarget.ConstructorProperties, FrameHeader.ConstructorProperties, Gtk.Widget.ConstructorProperties {
        /**
         * Whether to show the icon or not.
         */
        show_icon?: boolean | null
    }

}

export interface FrameHeaderBar extends Gtk.Accessible, Gtk.Buildable, Gtk.ConstraintTarget, FrameHeader {
    /**
     * Whether to show the icon or not.
     */
    show_icon: boolean
    /**
     * Gets the menu popover attached to this menubar.
     * @returns a #GtkPopoverMenu
     */
    get_menu_popover(): Gtk.PopoverMenu
    /**
     * Tell whether it show the icon or not.
     * @returns whether to show the icon.
     */
    get_show_icon(): boolean
    /**
     * Set whether to show the icon or not.
     * @param show_icon whether to show the icon
     */
    set_show_icon(show_icon: boolean): void
    connect(sigName: "notify::show-icon", callback: (($obj: FrameHeaderBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::show-icon", callback: (($obj: FrameHeaderBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::show-icon", ...args: any[]): void
    connect(sigName: "notify::can-focus", callback: (($obj: FrameHeaderBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::can-focus", callback: (($obj: FrameHeaderBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::can-focus", ...args: any[]): void
    connect(sigName: "notify::can-target", callback: (($obj: FrameHeaderBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::can-target", callback: (($obj: FrameHeaderBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::can-target", ...args: any[]): void
    connect(sigName: "notify::css-classes", callback: (($obj: FrameHeaderBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::css-classes", callback: (($obj: FrameHeaderBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::css-classes", ...args: any[]): void
    connect(sigName: "notify::css-name", callback: (($obj: FrameHeaderBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::css-name", callback: (($obj: FrameHeaderBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::css-name", ...args: any[]): void
    connect(sigName: "notify::cursor", callback: (($obj: FrameHeaderBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::cursor", callback: (($obj: FrameHeaderBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::cursor", ...args: any[]): void
    connect(sigName: "notify::focus-on-click", callback: (($obj: FrameHeaderBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::focus-on-click", callback: (($obj: FrameHeaderBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::focus-on-click", ...args: any[]): void
    connect(sigName: "notify::focusable", callback: (($obj: FrameHeaderBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::focusable", callback: (($obj: FrameHeaderBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::focusable", ...args: any[]): void
    connect(sigName: "notify::halign", callback: (($obj: FrameHeaderBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::halign", callback: (($obj: FrameHeaderBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::halign", ...args: any[]): void
    connect(sigName: "notify::has-default", callback: (($obj: FrameHeaderBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::has-default", callback: (($obj: FrameHeaderBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::has-default", ...args: any[]): void
    connect(sigName: "notify::has-focus", callback: (($obj: FrameHeaderBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::has-focus", callback: (($obj: FrameHeaderBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::has-focus", ...args: any[]): void
    connect(sigName: "notify::has-tooltip", callback: (($obj: FrameHeaderBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::has-tooltip", callback: (($obj: FrameHeaderBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::has-tooltip", ...args: any[]): void
    connect(sigName: "notify::height-request", callback: (($obj: FrameHeaderBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::height-request", callback: (($obj: FrameHeaderBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::height-request", ...args: any[]): void
    connect(sigName: "notify::hexpand", callback: (($obj: FrameHeaderBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::hexpand", callback: (($obj: FrameHeaderBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::hexpand", ...args: any[]): void
    connect(sigName: "notify::hexpand-set", callback: (($obj: FrameHeaderBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::hexpand-set", callback: (($obj: FrameHeaderBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::hexpand-set", ...args: any[]): void
    connect(sigName: "notify::layout-manager", callback: (($obj: FrameHeaderBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::layout-manager", callback: (($obj: FrameHeaderBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::layout-manager", ...args: any[]): void
    connect(sigName: "notify::margin-bottom", callback: (($obj: FrameHeaderBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::margin-bottom", callback: (($obj: FrameHeaderBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::margin-bottom", ...args: any[]): void
    connect(sigName: "notify::margin-end", callback: (($obj: FrameHeaderBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::margin-end", callback: (($obj: FrameHeaderBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::margin-end", ...args: any[]): void
    connect(sigName: "notify::margin-start", callback: (($obj: FrameHeaderBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::margin-start", callback: (($obj: FrameHeaderBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::margin-start", ...args: any[]): void
    connect(sigName: "notify::margin-top", callback: (($obj: FrameHeaderBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::margin-top", callback: (($obj: FrameHeaderBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::margin-top", ...args: any[]): void
    connect(sigName: "notify::name", callback: (($obj: FrameHeaderBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::name", callback: (($obj: FrameHeaderBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::name", ...args: any[]): void
    connect(sigName: "notify::opacity", callback: (($obj: FrameHeaderBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::opacity", callback: (($obj: FrameHeaderBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::opacity", ...args: any[]): void
    connect(sigName: "notify::overflow", callback: (($obj: FrameHeaderBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::overflow", callback: (($obj: FrameHeaderBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::overflow", ...args: any[]): void
    connect(sigName: "notify::parent", callback: (($obj: FrameHeaderBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::parent", callback: (($obj: FrameHeaderBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::parent", ...args: any[]): void
    connect(sigName: "notify::receives-default", callback: (($obj: FrameHeaderBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::receives-default", callback: (($obj: FrameHeaderBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::receives-default", ...args: any[]): void
    connect(sigName: "notify::root", callback: (($obj: FrameHeaderBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::root", callback: (($obj: FrameHeaderBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::root", ...args: any[]): void
    connect(sigName: "notify::scale-factor", callback: (($obj: FrameHeaderBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::scale-factor", callback: (($obj: FrameHeaderBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::scale-factor", ...args: any[]): void
    connect(sigName: "notify::sensitive", callback: (($obj: FrameHeaderBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::sensitive", callback: (($obj: FrameHeaderBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::sensitive", ...args: any[]): void
    connect(sigName: "notify::tooltip-markup", callback: (($obj: FrameHeaderBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::tooltip-markup", callback: (($obj: FrameHeaderBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::tooltip-markup", ...args: any[]): void
    connect(sigName: "notify::tooltip-text", callback: (($obj: FrameHeaderBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::tooltip-text", callback: (($obj: FrameHeaderBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::tooltip-text", ...args: any[]): void
    connect(sigName: "notify::valign", callback: (($obj: FrameHeaderBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::valign", callback: (($obj: FrameHeaderBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::valign", ...args: any[]): void
    connect(sigName: "notify::vexpand", callback: (($obj: FrameHeaderBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::vexpand", callback: (($obj: FrameHeaderBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::vexpand", ...args: any[]): void
    connect(sigName: "notify::vexpand-set", callback: (($obj: FrameHeaderBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::vexpand-set", callback: (($obj: FrameHeaderBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::vexpand-set", ...args: any[]): void
    connect(sigName: "notify::visible", callback: (($obj: FrameHeaderBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::visible", callback: (($obj: FrameHeaderBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::visible", ...args: any[]): void
    connect(sigName: "notify::width-request", callback: (($obj: FrameHeaderBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::width-request", callback: (($obj: FrameHeaderBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::width-request", ...args: any[]): void
    connect(sigName: "notify::accessible-role", callback: (($obj: FrameHeaderBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::accessible-role", callback: (($obj: FrameHeaderBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::accessible-role", ...args: any[]): void
    connect(sigName: "notify::frame", callback: (($obj: FrameHeaderBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::frame", callback: (($obj: FrameHeaderBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::frame", ...args: any[]): void
    connect(sigName: string, callback: (...args: any[]) => void): number
    connect_after(sigName: string, callback: (...args: any[]) => void): number
    emit(sigName: string, ...args: any[]): void
    disconnect(id: number): void
}

/**
 * A header bar for #PanelFrame. It can optionally show an icon, it
 * can have a popover to be displace, and it can also have prefix and
 * suffix widgets.
 * 
 * It is an implementation of #PanelFrameHeader
 * @class 
 */
export class FrameHeaderBar extends Gtk.Widget {
    static name: string
    static $gtype: GObject.GType<FrameHeaderBar>
    constructor(config?: FrameHeaderBar.ConstructorProperties) 
    /**
     * Create a new #PanelFrameHeaderBar.
     * @constructor 
     * @returns a newly created #PanelFrameHeaderBar
     */
    constructor() 
    /**
     * Create a new #PanelFrameHeaderBar.
     * @constructor 
     * @returns a newly created #PanelFrameHeaderBar
     */
    static new(): FrameHeaderBar
    _init(config?: FrameHeaderBar.ConstructorProperties): void
}

export module FrameSwitcher {
    export interface ConstructorProperties extends Gtk.Accessible.ConstructorProperties, Gtk.Buildable.ConstructorProperties, Gtk.ConstraintTarget.ConstructorProperties, Gtk.Orientable.ConstructorProperties, FrameHeader.ConstructorProperties, Gtk.Widget.ConstructorProperties {
    }

}

export interface FrameSwitcher extends Gtk.Accessible, Gtk.Buildable, Gtk.ConstraintTarget, Gtk.Orientable, FrameHeader {
    connect(sigName: "notify::can-focus", callback: (($obj: FrameSwitcher, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::can-focus", callback: (($obj: FrameSwitcher, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::can-focus", ...args: any[]): void
    connect(sigName: "notify::can-target", callback: (($obj: FrameSwitcher, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::can-target", callback: (($obj: FrameSwitcher, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::can-target", ...args: any[]): void
    connect(sigName: "notify::css-classes", callback: (($obj: FrameSwitcher, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::css-classes", callback: (($obj: FrameSwitcher, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::css-classes", ...args: any[]): void
    connect(sigName: "notify::css-name", callback: (($obj: FrameSwitcher, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::css-name", callback: (($obj: FrameSwitcher, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::css-name", ...args: any[]): void
    connect(sigName: "notify::cursor", callback: (($obj: FrameSwitcher, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::cursor", callback: (($obj: FrameSwitcher, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::cursor", ...args: any[]): void
    connect(sigName: "notify::focus-on-click", callback: (($obj: FrameSwitcher, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::focus-on-click", callback: (($obj: FrameSwitcher, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::focus-on-click", ...args: any[]): void
    connect(sigName: "notify::focusable", callback: (($obj: FrameSwitcher, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::focusable", callback: (($obj: FrameSwitcher, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::focusable", ...args: any[]): void
    connect(sigName: "notify::halign", callback: (($obj: FrameSwitcher, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::halign", callback: (($obj: FrameSwitcher, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::halign", ...args: any[]): void
    connect(sigName: "notify::has-default", callback: (($obj: FrameSwitcher, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::has-default", callback: (($obj: FrameSwitcher, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::has-default", ...args: any[]): void
    connect(sigName: "notify::has-focus", callback: (($obj: FrameSwitcher, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::has-focus", callback: (($obj: FrameSwitcher, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::has-focus", ...args: any[]): void
    connect(sigName: "notify::has-tooltip", callback: (($obj: FrameSwitcher, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::has-tooltip", callback: (($obj: FrameSwitcher, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::has-tooltip", ...args: any[]): void
    connect(sigName: "notify::height-request", callback: (($obj: FrameSwitcher, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::height-request", callback: (($obj: FrameSwitcher, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::height-request", ...args: any[]): void
    connect(sigName: "notify::hexpand", callback: (($obj: FrameSwitcher, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::hexpand", callback: (($obj: FrameSwitcher, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::hexpand", ...args: any[]): void
    connect(sigName: "notify::hexpand-set", callback: (($obj: FrameSwitcher, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::hexpand-set", callback: (($obj: FrameSwitcher, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::hexpand-set", ...args: any[]): void
    connect(sigName: "notify::layout-manager", callback: (($obj: FrameSwitcher, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::layout-manager", callback: (($obj: FrameSwitcher, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::layout-manager", ...args: any[]): void
    connect(sigName: "notify::margin-bottom", callback: (($obj: FrameSwitcher, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::margin-bottom", callback: (($obj: FrameSwitcher, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::margin-bottom", ...args: any[]): void
    connect(sigName: "notify::margin-end", callback: (($obj: FrameSwitcher, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::margin-end", callback: (($obj: FrameSwitcher, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::margin-end", ...args: any[]): void
    connect(sigName: "notify::margin-start", callback: (($obj: FrameSwitcher, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::margin-start", callback: (($obj: FrameSwitcher, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::margin-start", ...args: any[]): void
    connect(sigName: "notify::margin-top", callback: (($obj: FrameSwitcher, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::margin-top", callback: (($obj: FrameSwitcher, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::margin-top", ...args: any[]): void
    connect(sigName: "notify::name", callback: (($obj: FrameSwitcher, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::name", callback: (($obj: FrameSwitcher, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::name", ...args: any[]): void
    connect(sigName: "notify::opacity", callback: (($obj: FrameSwitcher, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::opacity", callback: (($obj: FrameSwitcher, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::opacity", ...args: any[]): void
    connect(sigName: "notify::overflow", callback: (($obj: FrameSwitcher, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::overflow", callback: (($obj: FrameSwitcher, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::overflow", ...args: any[]): void
    connect(sigName: "notify::parent", callback: (($obj: FrameSwitcher, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::parent", callback: (($obj: FrameSwitcher, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::parent", ...args: any[]): void
    connect(sigName: "notify::receives-default", callback: (($obj: FrameSwitcher, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::receives-default", callback: (($obj: FrameSwitcher, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::receives-default", ...args: any[]): void
    connect(sigName: "notify::root", callback: (($obj: FrameSwitcher, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::root", callback: (($obj: FrameSwitcher, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::root", ...args: any[]): void
    connect(sigName: "notify::scale-factor", callback: (($obj: FrameSwitcher, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::scale-factor", callback: (($obj: FrameSwitcher, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::scale-factor", ...args: any[]): void
    connect(sigName: "notify::sensitive", callback: (($obj: FrameSwitcher, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::sensitive", callback: (($obj: FrameSwitcher, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::sensitive", ...args: any[]): void
    connect(sigName: "notify::tooltip-markup", callback: (($obj: FrameSwitcher, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::tooltip-markup", callback: (($obj: FrameSwitcher, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::tooltip-markup", ...args: any[]): void
    connect(sigName: "notify::tooltip-text", callback: (($obj: FrameSwitcher, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::tooltip-text", callback: (($obj: FrameSwitcher, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::tooltip-text", ...args: any[]): void
    connect(sigName: "notify::valign", callback: (($obj: FrameSwitcher, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::valign", callback: (($obj: FrameSwitcher, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::valign", ...args: any[]): void
    connect(sigName: "notify::vexpand", callback: (($obj: FrameSwitcher, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::vexpand", callback: (($obj: FrameSwitcher, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::vexpand", ...args: any[]): void
    connect(sigName: "notify::vexpand-set", callback: (($obj: FrameSwitcher, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::vexpand-set", callback: (($obj: FrameSwitcher, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::vexpand-set", ...args: any[]): void
    connect(sigName: "notify::visible", callback: (($obj: FrameSwitcher, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::visible", callback: (($obj: FrameSwitcher, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::visible", ...args: any[]): void
    connect(sigName: "notify::width-request", callback: (($obj: FrameSwitcher, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::width-request", callback: (($obj: FrameSwitcher, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::width-request", ...args: any[]): void
    connect(sigName: "notify::accessible-role", callback: (($obj: FrameSwitcher, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::accessible-role", callback: (($obj: FrameSwitcher, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::accessible-role", ...args: any[]): void
    connect(sigName: "notify::orientation", callback: (($obj: FrameSwitcher, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::orientation", callback: (($obj: FrameSwitcher, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::orientation", ...args: any[]): void
    connect(sigName: "notify::frame", callback: (($obj: FrameSwitcher, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::frame", callback: (($obj: FrameSwitcher, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::frame", ...args: any[]): void
    connect(sigName: string, callback: (...args: any[]) => void): number
    connect_after(sigName: string, callback: (...args: any[]) => void): number
    emit(sigName: string, ...args: any[]): void
    disconnect(id: number): void
}

/**
 * A #PanelFrameSwitcher is a #PanelFrameHeader that shows a row of
 * buttons to switch between #GtkStack pages, not disimilar to a
 * #GtkStackSwitcher.
 * @class 
 */
export class FrameSwitcher extends Gtk.Widget {
    static name: string
    static $gtype: GObject.GType<FrameSwitcher>
    constructor(config?: FrameSwitcher.ConstructorProperties) 
    /**
     * Create a new `PanelFrameSwitcher`.
     * @constructor 
     * @returns a new `PanelFrameSwitcher`.
     */
    constructor() 
    /**
     * Create a new `PanelFrameSwitcher`.
     * @constructor 
     * @returns a new `PanelFrameSwitcher`.
     */
    static new(): FrameSwitcher
    _init(config?: FrameSwitcher.ConstructorProperties): void
}

export module FrameTabBar {
    export interface ConstructorProperties extends Gtk.Accessible.ConstructorProperties, Gtk.Buildable.ConstructorProperties, Gtk.ConstraintTarget.ConstructorProperties, FrameHeader.ConstructorProperties, Gtk.Widget.ConstructorProperties {
        /**
         * Whether the tabs automatically hide.
         */
        autohide?: boolean | null
        /**
         * Whether tabs expand to full width.
         */
        expand_tabs?: boolean | null
        /**
         * Whether tabs use inverted layout.
         */
        inverted?: boolean | null
    }

}

export interface FrameTabBar extends Gtk.Accessible, Gtk.Buildable, Gtk.ConstraintTarget, FrameHeader {
    /**
     * Whether the tabs automatically hide.
     */
    autohide: boolean
    /**
     * Whether tabs expand to full width.
     */
    expand_tabs: boolean
    /**
     * Whether tabs use inverted layout.
     */
    inverted: boolean
    /**
     * Gets whether the tabs automatically hide.
     * @returns the value of the autohide property.
     */
    get_autohide(): boolean
    /**
     * Gets whether tabs expand to full width.
     * @returns the value of the expand_tabs property.
     */
    get_expand_tabs(): boolean
    /**
     * Gets whether tabs use inverted layout.
     * @returns the value of the inverted property.
     */
    get_inverted(): boolean
    /**
     * Sets whether the tabs automatically hide.
     * @param autohide the autohide value
     */
    set_autohide(autohide: boolean): void
    /**
     * Sets whether tabs expand to full width.
     * @param expand_tabs the expand_tabs value
     */
    set_expand_tabs(expand_tabs: boolean): void
    /**
     * Sets whether tabs tabs use inverted layout.
     * @param inverted the inverted value
     */
    set_inverted(inverted: boolean): void
    connect(sigName: "notify::autohide", callback: (($obj: FrameTabBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::autohide", callback: (($obj: FrameTabBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::autohide", ...args: any[]): void
    connect(sigName: "notify::expand-tabs", callback: (($obj: FrameTabBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::expand-tabs", callback: (($obj: FrameTabBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::expand-tabs", ...args: any[]): void
    connect(sigName: "notify::inverted", callback: (($obj: FrameTabBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::inverted", callback: (($obj: FrameTabBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::inverted", ...args: any[]): void
    connect(sigName: "notify::can-focus", callback: (($obj: FrameTabBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::can-focus", callback: (($obj: FrameTabBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::can-focus", ...args: any[]): void
    connect(sigName: "notify::can-target", callback: (($obj: FrameTabBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::can-target", callback: (($obj: FrameTabBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::can-target", ...args: any[]): void
    connect(sigName: "notify::css-classes", callback: (($obj: FrameTabBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::css-classes", callback: (($obj: FrameTabBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::css-classes", ...args: any[]): void
    connect(sigName: "notify::css-name", callback: (($obj: FrameTabBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::css-name", callback: (($obj: FrameTabBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::css-name", ...args: any[]): void
    connect(sigName: "notify::cursor", callback: (($obj: FrameTabBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::cursor", callback: (($obj: FrameTabBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::cursor", ...args: any[]): void
    connect(sigName: "notify::focus-on-click", callback: (($obj: FrameTabBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::focus-on-click", callback: (($obj: FrameTabBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::focus-on-click", ...args: any[]): void
    connect(sigName: "notify::focusable", callback: (($obj: FrameTabBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::focusable", callback: (($obj: FrameTabBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::focusable", ...args: any[]): void
    connect(sigName: "notify::halign", callback: (($obj: FrameTabBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::halign", callback: (($obj: FrameTabBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::halign", ...args: any[]): void
    connect(sigName: "notify::has-default", callback: (($obj: FrameTabBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::has-default", callback: (($obj: FrameTabBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::has-default", ...args: any[]): void
    connect(sigName: "notify::has-focus", callback: (($obj: FrameTabBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::has-focus", callback: (($obj: FrameTabBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::has-focus", ...args: any[]): void
    connect(sigName: "notify::has-tooltip", callback: (($obj: FrameTabBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::has-tooltip", callback: (($obj: FrameTabBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::has-tooltip", ...args: any[]): void
    connect(sigName: "notify::height-request", callback: (($obj: FrameTabBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::height-request", callback: (($obj: FrameTabBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::height-request", ...args: any[]): void
    connect(sigName: "notify::hexpand", callback: (($obj: FrameTabBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::hexpand", callback: (($obj: FrameTabBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::hexpand", ...args: any[]): void
    connect(sigName: "notify::hexpand-set", callback: (($obj: FrameTabBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::hexpand-set", callback: (($obj: FrameTabBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::hexpand-set", ...args: any[]): void
    connect(sigName: "notify::layout-manager", callback: (($obj: FrameTabBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::layout-manager", callback: (($obj: FrameTabBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::layout-manager", ...args: any[]): void
    connect(sigName: "notify::margin-bottom", callback: (($obj: FrameTabBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::margin-bottom", callback: (($obj: FrameTabBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::margin-bottom", ...args: any[]): void
    connect(sigName: "notify::margin-end", callback: (($obj: FrameTabBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::margin-end", callback: (($obj: FrameTabBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::margin-end", ...args: any[]): void
    connect(sigName: "notify::margin-start", callback: (($obj: FrameTabBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::margin-start", callback: (($obj: FrameTabBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::margin-start", ...args: any[]): void
    connect(sigName: "notify::margin-top", callback: (($obj: FrameTabBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::margin-top", callback: (($obj: FrameTabBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::margin-top", ...args: any[]): void
    connect(sigName: "notify::name", callback: (($obj: FrameTabBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::name", callback: (($obj: FrameTabBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::name", ...args: any[]): void
    connect(sigName: "notify::opacity", callback: (($obj: FrameTabBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::opacity", callback: (($obj: FrameTabBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::opacity", ...args: any[]): void
    connect(sigName: "notify::overflow", callback: (($obj: FrameTabBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::overflow", callback: (($obj: FrameTabBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::overflow", ...args: any[]): void
    connect(sigName: "notify::parent", callback: (($obj: FrameTabBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::parent", callback: (($obj: FrameTabBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::parent", ...args: any[]): void
    connect(sigName: "notify::receives-default", callback: (($obj: FrameTabBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::receives-default", callback: (($obj: FrameTabBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::receives-default", ...args: any[]): void
    connect(sigName: "notify::root", callback: (($obj: FrameTabBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::root", callback: (($obj: FrameTabBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::root", ...args: any[]): void
    connect(sigName: "notify::scale-factor", callback: (($obj: FrameTabBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::scale-factor", callback: (($obj: FrameTabBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::scale-factor", ...args: any[]): void
    connect(sigName: "notify::sensitive", callback: (($obj: FrameTabBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::sensitive", callback: (($obj: FrameTabBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::sensitive", ...args: any[]): void
    connect(sigName: "notify::tooltip-markup", callback: (($obj: FrameTabBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::tooltip-markup", callback: (($obj: FrameTabBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::tooltip-markup", ...args: any[]): void
    connect(sigName: "notify::tooltip-text", callback: (($obj: FrameTabBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::tooltip-text", callback: (($obj: FrameTabBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::tooltip-text", ...args: any[]): void
    connect(sigName: "notify::valign", callback: (($obj: FrameTabBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::valign", callback: (($obj: FrameTabBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::valign", ...args: any[]): void
    connect(sigName: "notify::vexpand", callback: (($obj: FrameTabBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::vexpand", callback: (($obj: FrameTabBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::vexpand", ...args: any[]): void
    connect(sigName: "notify::vexpand-set", callback: (($obj: FrameTabBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::vexpand-set", callback: (($obj: FrameTabBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::vexpand-set", ...args: any[]): void
    connect(sigName: "notify::visible", callback: (($obj: FrameTabBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::visible", callback: (($obj: FrameTabBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::visible", ...args: any[]): void
    connect(sigName: "notify::width-request", callback: (($obj: FrameTabBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::width-request", callback: (($obj: FrameTabBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::width-request", ...args: any[]): void
    connect(sigName: "notify::accessible-role", callback: (($obj: FrameTabBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::accessible-role", callback: (($obj: FrameTabBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::accessible-role", ...args: any[]): void
    connect(sigName: "notify::frame", callback: (($obj: FrameTabBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::frame", callback: (($obj: FrameTabBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::frame", ...args: any[]): void
    connect(sigName: string, callback: (...args: any[]) => void): number
    connect_after(sigName: string, callback: (...args: any[]) => void): number
    emit(sigName: string, ...args: any[]): void
    disconnect(id: number): void
}

/**
 * A #PanelFrameHeader that implements switching between tab views in
 * a #PanelFrame.
 * @class 
 */
export class FrameTabBar extends Gtk.Widget {
    static name: string
    static $gtype: GObject.GType<FrameTabBar>
    constructor(config?: FrameTabBar.ConstructorProperties) 
    /**
     * Create a new #PanelFrameTabBar.
     * @constructor 
     * @returns a newly created #PanelFrameTabBar
     */
    constructor() 
    /**
     * Create a new #PanelFrameTabBar.
     * @constructor 
     * @returns a newly created #PanelFrameTabBar
     */
    static new(): FrameTabBar
    _init(config?: FrameTabBar.ConstructorProperties): void
}

export module GSettingsActionGroup {
    export interface ConstructorProperties extends Gio.ActionGroup.ConstructorProperties, GObject.Object.ConstructorProperties {
        settings?: Gio.Settings | null
    }

}

export interface GSettingsActionGroup extends Gio.ActionGroup {
    readonly settings: Gio.Settings
    connect(sigName: "notify::settings", callback: (($obj: GSettingsActionGroup, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::settings", callback: (($obj: GSettingsActionGroup, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::settings", ...args: any[]): void
    connect(sigName: string, callback: (...args: any[]) => void): number
    connect_after(sigName: string, callback: (...args: any[]) => void): number
    emit(sigName: string, ...args: any[]): void
    disconnect(id: number): void
}

export class GSettingsActionGroup extends GObject.Object {
    static name: string
    static $gtype: GObject.GType<GSettingsActionGroup>
    constructor(config?: GSettingsActionGroup.ConstructorProperties) 
    _init(config?: GSettingsActionGroup.ConstructorProperties): void
    /**
     * Creates a new #GActionGroup that exports `settings`.
     * @param settings a #GSettings
     * @returns an #PanelGSettingsActionGroup
     */
    static new(settings: Gio.Settings): Gio.ActionGroup
}

export module Grid {
    /**
     * Signal callback interface for `create-frame`
     */
    export interface CreateFrameSignalCallback {
        ($obj: Grid): Frame
    }

    export interface ConstructorProperties extends Gtk.Accessible.ConstructorProperties, Gtk.Buildable.ConstructorProperties, Gtk.ConstraintTarget.ConstructorProperties, Gtk.Widget.ConstructorProperties {
    }

}

export interface Grid extends Gtk.Accessible, Gtk.Buildable, Gtk.ConstraintTarget {
    parent_instance: Gtk.Widget & GObject.InitiallyUnowned
    /**
     * Add a #PanelWidget to the grid.
     * @param widget a #PanelWidget the widget to add.
     */
    add(widget: Widget): void
    /**
     * Request to close, asynchronously. This will display the save dialog.
     * @param cancellable 
     */
    agree_to_close_async(cancellable: Gio.Cancellable | null): void
    agree_to_close_finish(result: Gio.AsyncResult): boolean
    /**
     * Calls `callback` for each #PanelFrame within `grid`.
     * @param callback a #PanelFrameCallback
     */
    foreach_frame(callback: FrameCallback): void
    /**
     * Gets the #PanelGridColumn for a column index.
     * @param column a column index
     * @returns a #PanelGridColumn
     */
    get_column(column: number): GridColumn
    /**
     * Gets the most recently acive column on a grid.
     * @returns a #PanelGridColumn
     */
    get_most_recent_column(): GridColumn
    /**
     * Gets the most recently acive frame on a grid.
     * @returns a #PanelGridFrame
     */
    get_most_recent_frame(): Frame
    /**
     * Gets the number of columns in the grid.
     * @returns The number of columns.
     */
    get_n_columns(): number
    /**
     * Inserts a column at `position`.
     * @param position The position to insert the column at.
     */
    insert_column(position: number): void
    connect(sigName: "create-frame", callback: Grid.CreateFrameSignalCallback): number
    connect_after(sigName: "create-frame", callback: Grid.CreateFrameSignalCallback): number
    emit(sigName: "create-frame", ...args: any[]): void
    connect(sigName: "notify::can-focus", callback: (($obj: Grid, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::can-focus", callback: (($obj: Grid, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::can-focus", ...args: any[]): void
    connect(sigName: "notify::can-target", callback: (($obj: Grid, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::can-target", callback: (($obj: Grid, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::can-target", ...args: any[]): void
    connect(sigName: "notify::css-classes", callback: (($obj: Grid, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::css-classes", callback: (($obj: Grid, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::css-classes", ...args: any[]): void
    connect(sigName: "notify::css-name", callback: (($obj: Grid, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::css-name", callback: (($obj: Grid, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::css-name", ...args: any[]): void
    connect(sigName: "notify::cursor", callback: (($obj: Grid, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::cursor", callback: (($obj: Grid, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::cursor", ...args: any[]): void
    connect(sigName: "notify::focus-on-click", callback: (($obj: Grid, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::focus-on-click", callback: (($obj: Grid, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::focus-on-click", ...args: any[]): void
    connect(sigName: "notify::focusable", callback: (($obj: Grid, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::focusable", callback: (($obj: Grid, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::focusable", ...args: any[]): void
    connect(sigName: "notify::halign", callback: (($obj: Grid, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::halign", callback: (($obj: Grid, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::halign", ...args: any[]): void
    connect(sigName: "notify::has-default", callback: (($obj: Grid, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::has-default", callback: (($obj: Grid, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::has-default", ...args: any[]): void
    connect(sigName: "notify::has-focus", callback: (($obj: Grid, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::has-focus", callback: (($obj: Grid, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::has-focus", ...args: any[]): void
    connect(sigName: "notify::has-tooltip", callback: (($obj: Grid, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::has-tooltip", callback: (($obj: Grid, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::has-tooltip", ...args: any[]): void
    connect(sigName: "notify::height-request", callback: (($obj: Grid, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::height-request", callback: (($obj: Grid, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::height-request", ...args: any[]): void
    connect(sigName: "notify::hexpand", callback: (($obj: Grid, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::hexpand", callback: (($obj: Grid, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::hexpand", ...args: any[]): void
    connect(sigName: "notify::hexpand-set", callback: (($obj: Grid, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::hexpand-set", callback: (($obj: Grid, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::hexpand-set", ...args: any[]): void
    connect(sigName: "notify::layout-manager", callback: (($obj: Grid, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::layout-manager", callback: (($obj: Grid, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::layout-manager", ...args: any[]): void
    connect(sigName: "notify::margin-bottom", callback: (($obj: Grid, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::margin-bottom", callback: (($obj: Grid, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::margin-bottom", ...args: any[]): void
    connect(sigName: "notify::margin-end", callback: (($obj: Grid, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::margin-end", callback: (($obj: Grid, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::margin-end", ...args: any[]): void
    connect(sigName: "notify::margin-start", callback: (($obj: Grid, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::margin-start", callback: (($obj: Grid, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::margin-start", ...args: any[]): void
    connect(sigName: "notify::margin-top", callback: (($obj: Grid, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::margin-top", callback: (($obj: Grid, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::margin-top", ...args: any[]): void
    connect(sigName: "notify::name", callback: (($obj: Grid, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::name", callback: (($obj: Grid, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::name", ...args: any[]): void
    connect(sigName: "notify::opacity", callback: (($obj: Grid, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::opacity", callback: (($obj: Grid, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::opacity", ...args: any[]): void
    connect(sigName: "notify::overflow", callback: (($obj: Grid, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::overflow", callback: (($obj: Grid, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::overflow", ...args: any[]): void
    connect(sigName: "notify::parent", callback: (($obj: Grid, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::parent", callback: (($obj: Grid, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::parent", ...args: any[]): void
    connect(sigName: "notify::receives-default", callback: (($obj: Grid, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::receives-default", callback: (($obj: Grid, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::receives-default", ...args: any[]): void
    connect(sigName: "notify::root", callback: (($obj: Grid, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::root", callback: (($obj: Grid, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::root", ...args: any[]): void
    connect(sigName: "notify::scale-factor", callback: (($obj: Grid, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::scale-factor", callback: (($obj: Grid, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::scale-factor", ...args: any[]): void
    connect(sigName: "notify::sensitive", callback: (($obj: Grid, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::sensitive", callback: (($obj: Grid, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::sensitive", ...args: any[]): void
    connect(sigName: "notify::tooltip-markup", callback: (($obj: Grid, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::tooltip-markup", callback: (($obj: Grid, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::tooltip-markup", ...args: any[]): void
    connect(sigName: "notify::tooltip-text", callback: (($obj: Grid, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::tooltip-text", callback: (($obj: Grid, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::tooltip-text", ...args: any[]): void
    connect(sigName: "notify::valign", callback: (($obj: Grid, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::valign", callback: (($obj: Grid, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::valign", ...args: any[]): void
    connect(sigName: "notify::vexpand", callback: (($obj: Grid, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::vexpand", callback: (($obj: Grid, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::vexpand", ...args: any[]): void
    connect(sigName: "notify::vexpand-set", callback: (($obj: Grid, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::vexpand-set", callback: (($obj: Grid, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::vexpand-set", ...args: any[]): void
    connect(sigName: "notify::visible", callback: (($obj: Grid, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::visible", callback: (($obj: Grid, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::visible", ...args: any[]): void
    connect(sigName: "notify::width-request", callback: (($obj: Grid, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::width-request", callback: (($obj: Grid, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::width-request", ...args: any[]): void
    connect(sigName: "notify::accessible-role", callback: (($obj: Grid, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::accessible-role", callback: (($obj: Grid, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::accessible-role", ...args: any[]): void
    connect(sigName: string, callback: (...args: any[]) => void): number
    connect_after(sigName: string, callback: (...args: any[]) => void): number
    emit(sigName: string, ...args: any[]): void
    disconnect(id: number): void
}

/**
 * The #PanelGrid is a widget used to layout the dock item in the
 * center area.
 * @class 
 */
export class Grid extends Gtk.Widget {
    static name: string
    static $gtype: GObject.GType<Grid>
    constructor(config?: Grid.ConstructorProperties) 
    /**
     * Creates a new #PanelGrid.
     * @constructor 
     * @returns a newly created #PanelGrid
     */
    constructor() 
    /**
     * Creates a new #PanelGrid.
     * @constructor 
     * @returns a newly created #PanelGrid
     */
    static new(): Grid
    _init(config?: Grid.ConstructorProperties): void
}

export module GridColumn {
    export interface ConstructorProperties extends Gtk.Accessible.ConstructorProperties, Gtk.Buildable.ConstructorProperties, Gtk.ConstraintTarget.ConstructorProperties, Gtk.Widget.ConstructorProperties {
    }

}

export interface GridColumn extends Gtk.Accessible, Gtk.Buildable, Gtk.ConstraintTarget {
    /**
     * Invokes a callback for each frame in the grid column.
     */
    foreach_frame(): void
    get_empty(): boolean
    /**
     * Gets the most recently acive frame on a grid column.
     * @returns a #PanelGridFrame
     */
    get_most_recent_frame(): Frame
    get_n_rows(): number
    /**
     * Gets the frame corresponding to a row index.
     * @param row the index of the row
     * @returns a #PanelGridFrame
     */
    get_row(row: number): Frame
    connect(sigName: "notify::can-focus", callback: (($obj: GridColumn, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::can-focus", callback: (($obj: GridColumn, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::can-focus", ...args: any[]): void
    connect(sigName: "notify::can-target", callback: (($obj: GridColumn, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::can-target", callback: (($obj: GridColumn, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::can-target", ...args: any[]): void
    connect(sigName: "notify::css-classes", callback: (($obj: GridColumn, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::css-classes", callback: (($obj: GridColumn, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::css-classes", ...args: any[]): void
    connect(sigName: "notify::css-name", callback: (($obj: GridColumn, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::css-name", callback: (($obj: GridColumn, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::css-name", ...args: any[]): void
    connect(sigName: "notify::cursor", callback: (($obj: GridColumn, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::cursor", callback: (($obj: GridColumn, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::cursor", ...args: any[]): void
    connect(sigName: "notify::focus-on-click", callback: (($obj: GridColumn, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::focus-on-click", callback: (($obj: GridColumn, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::focus-on-click", ...args: any[]): void
    connect(sigName: "notify::focusable", callback: (($obj: GridColumn, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::focusable", callback: (($obj: GridColumn, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::focusable", ...args: any[]): void
    connect(sigName: "notify::halign", callback: (($obj: GridColumn, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::halign", callback: (($obj: GridColumn, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::halign", ...args: any[]): void
    connect(sigName: "notify::has-default", callback: (($obj: GridColumn, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::has-default", callback: (($obj: GridColumn, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::has-default", ...args: any[]): void
    connect(sigName: "notify::has-focus", callback: (($obj: GridColumn, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::has-focus", callback: (($obj: GridColumn, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::has-focus", ...args: any[]): void
    connect(sigName: "notify::has-tooltip", callback: (($obj: GridColumn, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::has-tooltip", callback: (($obj: GridColumn, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::has-tooltip", ...args: any[]): void
    connect(sigName: "notify::height-request", callback: (($obj: GridColumn, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::height-request", callback: (($obj: GridColumn, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::height-request", ...args: any[]): void
    connect(sigName: "notify::hexpand", callback: (($obj: GridColumn, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::hexpand", callback: (($obj: GridColumn, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::hexpand", ...args: any[]): void
    connect(sigName: "notify::hexpand-set", callback: (($obj: GridColumn, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::hexpand-set", callback: (($obj: GridColumn, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::hexpand-set", ...args: any[]): void
    connect(sigName: "notify::layout-manager", callback: (($obj: GridColumn, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::layout-manager", callback: (($obj: GridColumn, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::layout-manager", ...args: any[]): void
    connect(sigName: "notify::margin-bottom", callback: (($obj: GridColumn, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::margin-bottom", callback: (($obj: GridColumn, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::margin-bottom", ...args: any[]): void
    connect(sigName: "notify::margin-end", callback: (($obj: GridColumn, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::margin-end", callback: (($obj: GridColumn, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::margin-end", ...args: any[]): void
    connect(sigName: "notify::margin-start", callback: (($obj: GridColumn, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::margin-start", callback: (($obj: GridColumn, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::margin-start", ...args: any[]): void
    connect(sigName: "notify::margin-top", callback: (($obj: GridColumn, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::margin-top", callback: (($obj: GridColumn, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::margin-top", ...args: any[]): void
    connect(sigName: "notify::name", callback: (($obj: GridColumn, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::name", callback: (($obj: GridColumn, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::name", ...args: any[]): void
    connect(sigName: "notify::opacity", callback: (($obj: GridColumn, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::opacity", callback: (($obj: GridColumn, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::opacity", ...args: any[]): void
    connect(sigName: "notify::overflow", callback: (($obj: GridColumn, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::overflow", callback: (($obj: GridColumn, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::overflow", ...args: any[]): void
    connect(sigName: "notify::parent", callback: (($obj: GridColumn, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::parent", callback: (($obj: GridColumn, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::parent", ...args: any[]): void
    connect(sigName: "notify::receives-default", callback: (($obj: GridColumn, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::receives-default", callback: (($obj: GridColumn, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::receives-default", ...args: any[]): void
    connect(sigName: "notify::root", callback: (($obj: GridColumn, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::root", callback: (($obj: GridColumn, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::root", ...args: any[]): void
    connect(sigName: "notify::scale-factor", callback: (($obj: GridColumn, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::scale-factor", callback: (($obj: GridColumn, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::scale-factor", ...args: any[]): void
    connect(sigName: "notify::sensitive", callback: (($obj: GridColumn, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::sensitive", callback: (($obj: GridColumn, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::sensitive", ...args: any[]): void
    connect(sigName: "notify::tooltip-markup", callback: (($obj: GridColumn, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::tooltip-markup", callback: (($obj: GridColumn, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::tooltip-markup", ...args: any[]): void
    connect(sigName: "notify::tooltip-text", callback: (($obj: GridColumn, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::tooltip-text", callback: (($obj: GridColumn, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::tooltip-text", ...args: any[]): void
    connect(sigName: "notify::valign", callback: (($obj: GridColumn, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::valign", callback: (($obj: GridColumn, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::valign", ...args: any[]): void
    connect(sigName: "notify::vexpand", callback: (($obj: GridColumn, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::vexpand", callback: (($obj: GridColumn, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::vexpand", ...args: any[]): void
    connect(sigName: "notify::vexpand-set", callback: (($obj: GridColumn, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::vexpand-set", callback: (($obj: GridColumn, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::vexpand-set", ...args: any[]): void
    connect(sigName: "notify::visible", callback: (($obj: GridColumn, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::visible", callback: (($obj: GridColumn, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::visible", ...args: any[]): void
    connect(sigName: "notify::width-request", callback: (($obj: GridColumn, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::width-request", callback: (($obj: GridColumn, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::width-request", ...args: any[]): void
    connect(sigName: "notify::accessible-role", callback: (($obj: GridColumn, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::accessible-role", callback: (($obj: GridColumn, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::accessible-role", ...args: any[]): void
    connect(sigName: string, callback: (...args: any[]) => void): number
    connect_after(sigName: string, callback: (...args: any[]) => void): number
    emit(sigName: string, ...args: any[]): void
    disconnect(id: number): void
}

export class GridColumn extends Gtk.Widget {
    static name: string
    static $gtype: GObject.GType<GridColumn>
    constructor(config?: GridColumn.ConstructorProperties) 
    constructor() 
    static new(): GridColumn
    _init(config?: GridColumn.ConstructorProperties): void
}

export module Inhibitor {
    export interface ConstructorProperties extends GObject.Object.ConstructorProperties {
    }

}

export interface Inhibitor {
    uninhibit(): void
    connect(sigName: string, callback: (...args: any[]) => void): number
    connect_after(sigName: string, callback: (...args: any[]) => void): number
    emit(sigName: string, ...args: any[]): void
    disconnect(id: number): void
}

export class Inhibitor extends GObject.Object {
    static name: string
    static $gtype: GObject.GType<Inhibitor>
    constructor(config?: Inhibitor.ConstructorProperties) 
    _init(config?: Inhibitor.ConstructorProperties): void
}

export module LayeredSettings {
    /**
     * Signal callback interface for `changed`
     */
    export interface ChangedSignalCallback {
        ($obj: LayeredSettings, object: string | null): void
    }

    export interface ConstructorProperties extends GObject.Object.ConstructorProperties {
        path?: string | null
        schema_id?: string | null
    }

}

export interface LayeredSettings {
    readonly path: string | null
    readonly schema_id: string | null
    append(settings: Gio.Settings): void
    bind(key: string | null, object: any | null, property: string | null, flags: Gio.SettingsBindFlags): void
    /**
     * Creates a new binding similar to g_settings_bind_with_mapping() but applying
     * from the resolved value via the layered settings.
     * @param key the settings key to bind. `object` (type GObject.Object): the target object.
     * @param object 
     * @param property the property on `object` to apply.
     * @param flags flags for the binding.
     * @param get_mapping the get mapping function
     * @param set_mapping the set mapping function
     */
    bind_with_mapping(key: string | null, object: any | null, property: string | null, flags: Gio.SettingsBindFlags, get_mapping: Gio.SettingsBindGetMapping, set_mapping: Gio.SettingsBindSetMapping): void
    get_boolean(key: string | null): boolean
    get_default_value(key: string | null): GLib.Variant
    get_double(key: string | null): number
    get_int(key: string | null): number
    /**
     * Gets the #GSettingsSchemaKey denoted by `key`.
     * 
     * It is a programming error to call this with a key that does not exist.
     * @param key the name of the setting
     * @returns a #GSettingsSchemaKey
     */
    get_key(key: string | null): Gio.SettingsSchemaKey
    get_string(key: string | null): string | null
    get_uint(key: string | null): number
    get_user_value(key: string | null): GLib.Variant | null
    /**
     * Gets the value of `key` from the first layer that is modified.
     * @param key 
     * @returns a #GVariant
     */
    get_value(key: string | null): GLib.Variant
    /**
     * Lists the available keys.
     * @returns    an array of keys that can be retrieved from the #PanelLayeredSettings.
     */
    list_keys(): string[]
    set_boolean(key: string | null, val: boolean): void
    set_double(key: string | null, val: number): void
    set_int(key: string | null, val: number): void
    set_string(key: string | null, val: string | null): void
    set_uint(key: string | null, val: number): void
    set_value(key: string | null, value: GLib.Variant): void
    unbind(property: string | null): void
    connect(sigName: "changed", callback: LayeredSettings.ChangedSignalCallback): number
    connect_after(sigName: "changed", callback: LayeredSettings.ChangedSignalCallback): number
    emit(sigName: "changed", object: string | null, ...args: any[]): void
    connect(sigName: "notify::path", callback: (($obj: LayeredSettings, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::path", callback: (($obj: LayeredSettings, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::path", ...args: any[]): void
    connect(sigName: "notify::schema-id", callback: (($obj: LayeredSettings, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::schema-id", callback: (($obj: LayeredSettings, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::schema-id", ...args: any[]): void
    connect(sigName: string, callback: (...args: any[]) => void): number
    connect_after(sigName: string, callback: (...args: any[]) => void): number
    emit(sigName: string, ...args: any[]): void
    disconnect(id: number): void
}

export class LayeredSettings extends GObject.Object {
    static name: string
    static $gtype: GObject.GType<LayeredSettings>
    constructor(config?: LayeredSettings.ConstructorProperties) 
    constructor(schema_id: string | null, path: string | null) 
    static new(schema_id: string | null, path: string | null): LayeredSettings
    _init(config?: LayeredSettings.ConstructorProperties): void
}

export module MenuManager {
    export interface ConstructorProperties extends GObject.Object.ConstructorProperties {
    }

}

export interface MenuManager {
    add_filename(filename: string | null): number
    add_resource(resource: string | null): number
    /**
     * Locates a menu item that matches `id` and sets the position within
     * the resulting #GMenu to `position`.
     * 
     * If no match is found, %NULL is returned.
     * @param id the identifier of the menu item
     * @returns a #GMenu if successful; otherwise   %NULL and @position is unset.
     */
    find_item_by_id(id: string | null): [ /* returnType */ Gio.Menu | null, /* position */ number ]
    get_menu_by_id(menu_id: string | null): Gio.Menu
    /**
     * Gets the known menu ids as a string array.
     */
    get_menu_ids(): string[]
    /**
     * Note that `menu_model` is not retained, a copy of it is made.
     * @param menu_id the identifier of the menu
     * @param menu_model the menu model to merge
     * @returns the merge-id which can be used with panel_menu_manager_remove()
     */
    merge(menu_id: string | null, menu_model: Gio.MenuModel): number
    /**
     * This removes items from menus that were added as part of a previous
     * menu merge. Use the value returned from panel_menu_manager_merge() as
     * the `merge_id`.
     * @param merge_id A previously registered merge id
     */
    remove(merge_id: number): void
    /**
     * Overwrites an attribute for a menu that was created by
     * #PanelMenuManager.
     * 
     * This can be useful when you want to update an attribute such as
     * "accel" when an accelerator has changed due to user mappings.
     * @param menu the menu that was retreived with panel_menu_manager_get_menu_by_id()
     * @param position the index of the item in the menu
     * @param attribute the attribute to change
     * @param value the new value for the attribute
     */
    set_attribute_string(menu: Gio.Menu, position: number, attribute: string | null, value: string | null): void
    connect(sigName: string, callback: (...args: any[]) => void): number
    connect_after(sigName: string, callback: (...args: any[]) => void): number
    emit(sigName: string, ...args: any[]): void
    disconnect(id: number): void
}

/**
 * The goal of #PanelMenuManager is to simplify the process of merging multiple
 * GtkBuilder .ui files containing menus into a single representation of the
 * application menus. Additionally, it provides the ability to "unmerge"
 * previously merged menus.
 * 
 * This allows for an application to have plugins which seemlessly extends
 * the core application menus.
 * 
 * Implementation notes:
 * 
 * To make this work, we don't use the GMenu instances created by a GtkBuilder
 * instance. Instead, we create the menus ourself and recreate section and
 * submenu links. This allows the #PanelMenuManager to be in full control of
 * the generated menus.
 * 
 * panel_menu_manager_get_menu_by_id() will always return a #GMenu, however
 * that menu may contain no children until something has extended it later
 * on during the application process.
 * @class 
 */
export class MenuManager extends GObject.Object {
    static name: string
    static $gtype: GObject.GType<MenuManager>
    constructor(config?: MenuManager.ConstructorProperties) 
    constructor() 
    static new(): MenuManager
    _init(config?: MenuManager.ConstructorProperties): void
}

export module OmniBar {
    export interface ConstructorProperties extends Gtk.Accessible.ConstructorProperties, Gtk.Actionable.ConstructorProperties, Gtk.Buildable.ConstructorProperties, Gtk.ConstraintTarget.ConstructorProperties, Gtk.Widget.ConstructorProperties {
        /**
         * The tooltip for the action.
         */
        action_tooltip?: string | null
        /**
         * The name of the icon to use.
         */
        icon_name?: string | null
        /**
         * The menu model of the omni bar menu.
         */
        menu_model?: Gio.MenuModel | null
        /**
         * The popover to show.
         */
        popover?: Gtk.Popover | null
        /**
         * The current progress value.
         */
        progress?: number | null
    }

}

export interface OmniBar extends Gtk.Accessible, Gtk.Actionable, Gtk.Buildable, Gtk.ConstraintTarget {
    /**
     * The tooltip for the action.
     */
    action_tooltip: string | null
    /**
     * The name of the icon to use.
     */
    icon_name: string | null
    /**
     * The menu model of the omni bar menu.
     */
    menu_model: Gio.MenuModel
    /**
     * The popover to show.
     */
    popover: Gtk.Popover
    /**
     * The current progress value.
     */
    progress: number
    parent_instance: Gtk.Widget & GObject.InitiallyUnowned
    /**
     * Add a widget at the start of the container, ordered by priority.
     * The highest the priority, the closest to the start.
     * @param priority the priority
     * @param widget the widget to add at the start.
     */
    add_prefix(priority: number, widget: Gtk.Widget): void
    /**
     * Add a widget towards the end of the container, ordered by priority.
     * The highest the priority, the closest to the start.
     * @param priority the priority
     * @param widget the widget to add toward the end.
     */
    add_suffix(priority: number, widget: Gtk.Widget): void
    /**
     * Gets the current popover or %NULL if none is setup.
     * @returns a #GtkPopover or %NULL
     */
    get_popover(): Gtk.Popover | null
    /**
     * Gets the progress value displayed in the omni bar.
     * @returns the progress value.
     */
    get_progress(): number
    /**
     * Removes a widget from the omni bar. Currently only prefix or suffix
     * widgets are supported.
     * @param widget The widget to remove.
     */
    remove(widget: Gtk.Widget): void
    /**
     * Sets the omnibar popover, that will appear when clicking on the omni bar.
     * @param popover a #GtkPopover or %NULL
     */
    set_popover(popover: Gtk.Popover | null): void
    /**
     * Sets the progress value displayed in the omni bar.
     * @param progress the progress value
     */
    set_progress(progress: number): void
    /**
     * Starts pulsing the omni bar. Use
     * `panel_omni_bar_stop_pulsing` to stop.
     */
    start_pulsing(): void
    /**
     * Stops pulsing the omni bar, that was started with
     * `panel_omni_bar_start_pulsing`.
     */
    stop_pulsing(): void
    connect(sigName: "notify::action-tooltip", callback: (($obj: OmniBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::action-tooltip", callback: (($obj: OmniBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::action-tooltip", ...args: any[]): void
    connect(sigName: "notify::icon-name", callback: (($obj: OmniBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::icon-name", callback: (($obj: OmniBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::icon-name", ...args: any[]): void
    connect(sigName: "notify::menu-model", callback: (($obj: OmniBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::menu-model", callback: (($obj: OmniBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::menu-model", ...args: any[]): void
    connect(sigName: "notify::popover", callback: (($obj: OmniBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::popover", callback: (($obj: OmniBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::popover", ...args: any[]): void
    connect(sigName: "notify::progress", callback: (($obj: OmniBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::progress", callback: (($obj: OmniBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::progress", ...args: any[]): void
    connect(sigName: "notify::can-focus", callback: (($obj: OmniBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::can-focus", callback: (($obj: OmniBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::can-focus", ...args: any[]): void
    connect(sigName: "notify::can-target", callback: (($obj: OmniBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::can-target", callback: (($obj: OmniBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::can-target", ...args: any[]): void
    connect(sigName: "notify::css-classes", callback: (($obj: OmniBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::css-classes", callback: (($obj: OmniBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::css-classes", ...args: any[]): void
    connect(sigName: "notify::css-name", callback: (($obj: OmniBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::css-name", callback: (($obj: OmniBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::css-name", ...args: any[]): void
    connect(sigName: "notify::cursor", callback: (($obj: OmniBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::cursor", callback: (($obj: OmniBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::cursor", ...args: any[]): void
    connect(sigName: "notify::focus-on-click", callback: (($obj: OmniBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::focus-on-click", callback: (($obj: OmniBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::focus-on-click", ...args: any[]): void
    connect(sigName: "notify::focusable", callback: (($obj: OmniBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::focusable", callback: (($obj: OmniBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::focusable", ...args: any[]): void
    connect(sigName: "notify::halign", callback: (($obj: OmniBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::halign", callback: (($obj: OmniBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::halign", ...args: any[]): void
    connect(sigName: "notify::has-default", callback: (($obj: OmniBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::has-default", callback: (($obj: OmniBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::has-default", ...args: any[]): void
    connect(sigName: "notify::has-focus", callback: (($obj: OmniBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::has-focus", callback: (($obj: OmniBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::has-focus", ...args: any[]): void
    connect(sigName: "notify::has-tooltip", callback: (($obj: OmniBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::has-tooltip", callback: (($obj: OmniBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::has-tooltip", ...args: any[]): void
    connect(sigName: "notify::height-request", callback: (($obj: OmniBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::height-request", callback: (($obj: OmniBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::height-request", ...args: any[]): void
    connect(sigName: "notify::hexpand", callback: (($obj: OmniBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::hexpand", callback: (($obj: OmniBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::hexpand", ...args: any[]): void
    connect(sigName: "notify::hexpand-set", callback: (($obj: OmniBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::hexpand-set", callback: (($obj: OmniBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::hexpand-set", ...args: any[]): void
    connect(sigName: "notify::layout-manager", callback: (($obj: OmniBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::layout-manager", callback: (($obj: OmniBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::layout-manager", ...args: any[]): void
    connect(sigName: "notify::margin-bottom", callback: (($obj: OmniBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::margin-bottom", callback: (($obj: OmniBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::margin-bottom", ...args: any[]): void
    connect(sigName: "notify::margin-end", callback: (($obj: OmniBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::margin-end", callback: (($obj: OmniBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::margin-end", ...args: any[]): void
    connect(sigName: "notify::margin-start", callback: (($obj: OmniBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::margin-start", callback: (($obj: OmniBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::margin-start", ...args: any[]): void
    connect(sigName: "notify::margin-top", callback: (($obj: OmniBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::margin-top", callback: (($obj: OmniBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::margin-top", ...args: any[]): void
    connect(sigName: "notify::name", callback: (($obj: OmniBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::name", callback: (($obj: OmniBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::name", ...args: any[]): void
    connect(sigName: "notify::opacity", callback: (($obj: OmniBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::opacity", callback: (($obj: OmniBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::opacity", ...args: any[]): void
    connect(sigName: "notify::overflow", callback: (($obj: OmniBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::overflow", callback: (($obj: OmniBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::overflow", ...args: any[]): void
    connect(sigName: "notify::parent", callback: (($obj: OmniBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::parent", callback: (($obj: OmniBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::parent", ...args: any[]): void
    connect(sigName: "notify::receives-default", callback: (($obj: OmniBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::receives-default", callback: (($obj: OmniBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::receives-default", ...args: any[]): void
    connect(sigName: "notify::root", callback: (($obj: OmniBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::root", callback: (($obj: OmniBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::root", ...args: any[]): void
    connect(sigName: "notify::scale-factor", callback: (($obj: OmniBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::scale-factor", callback: (($obj: OmniBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::scale-factor", ...args: any[]): void
    connect(sigName: "notify::sensitive", callback: (($obj: OmniBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::sensitive", callback: (($obj: OmniBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::sensitive", ...args: any[]): void
    connect(sigName: "notify::tooltip-markup", callback: (($obj: OmniBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::tooltip-markup", callback: (($obj: OmniBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::tooltip-markup", ...args: any[]): void
    connect(sigName: "notify::tooltip-text", callback: (($obj: OmniBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::tooltip-text", callback: (($obj: OmniBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::tooltip-text", ...args: any[]): void
    connect(sigName: "notify::valign", callback: (($obj: OmniBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::valign", callback: (($obj: OmniBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::valign", ...args: any[]): void
    connect(sigName: "notify::vexpand", callback: (($obj: OmniBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::vexpand", callback: (($obj: OmniBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::vexpand", ...args: any[]): void
    connect(sigName: "notify::vexpand-set", callback: (($obj: OmniBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::vexpand-set", callback: (($obj: OmniBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::vexpand-set", ...args: any[]): void
    connect(sigName: "notify::visible", callback: (($obj: OmniBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::visible", callback: (($obj: OmniBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::visible", ...args: any[]): void
    connect(sigName: "notify::width-request", callback: (($obj: OmniBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::width-request", callback: (($obj: OmniBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::width-request", ...args: any[]): void
    connect(sigName: "notify::accessible-role", callback: (($obj: OmniBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::accessible-role", callback: (($obj: OmniBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::accessible-role", ...args: any[]): void
    connect(sigName: "notify::action-name", callback: (($obj: OmniBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::action-name", callback: (($obj: OmniBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::action-name", ...args: any[]): void
    connect(sigName: "notify::action-target", callback: (($obj: OmniBar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::action-target", callback: (($obj: OmniBar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::action-target", ...args: any[]): void
    connect(sigName: string, callback: (...args: any[]) => void): number
    connect_after(sigName: string, callback: (...args: any[]) => void): number
    emit(sigName: string, ...args: any[]): void
    disconnect(id: number): void
}

/**
 * A multi-use widget for user interaction in the window header bar.
 * You can add widgets, a popover to provide action items, an icon,
 * updates on progress and pulse the main widget.
 * 
 * There is also a prefix and suffix area that can contain more
 * widgets.
 * 
 * <picture>
 *   <source srcset="omni-bar-dark.png" media="(prefers-color-scheme: dark)">
 *   <img src="omni-bar.png" alt="omni-bar">
 * </picture>
 * @class 
 */
export class OmniBar extends Gtk.Widget {
    static name: string
    static $gtype: GObject.GType<OmniBar>
    constructor(config?: OmniBar.ConstructorProperties) 
    /**
     * Create a new #PanelOmniBar.
     * @constructor 
     * @returns a newly created #PanelOmniBar
     */
    constructor() 
    /**
     * Create a new #PanelOmniBar.
     * @constructor 
     * @returns a newly created #PanelOmniBar
     */
    static new(): OmniBar
    _init(config?: OmniBar.ConstructorProperties): void
}

export module Paned {
    export interface ConstructorProperties extends Gtk.Accessible.ConstructorProperties, Gtk.Buildable.ConstructorProperties, Gtk.ConstraintTarget.ConstructorProperties, Gtk.Orientable.ConstructorProperties, Gtk.Widget.ConstructorProperties {
    }

}

export interface Paned extends Gtk.Accessible, Gtk.Buildable, Gtk.ConstraintTarget, Gtk.Orientable {
    /**
     * Append a widget in the paned.
     * @param child a #GtkWidget to append.
     */
    append(child: Gtk.Widget): void
    /**
     * Gets the number of children in the paned.
     * @returns the number of children.
     */
    get_n_children(): number
    /**
     * Gets the child at position `nth`.
     * @param nth the child position
     * @returns a #GtkWidget or %NULL
     */
    get_nth_child(nth: number): Gtk.Widget | null
    /**
     * Inserts a widget at position in the paned.
     * @param position the position
     * @param child a #GtkWidget to insert.
     */
    insert(position: number, child: Gtk.Widget): void
    /**
     * Inserts a widget afer `sibling` in the paned.
     * @param child a #GtkWidget to insert.
     * @param sibling the widget after which to insert.
     */
    insert_after(child: Gtk.Widget, sibling: Gtk.Widget): void
    /**
     * Inserts `widget` into the child widget list of `parent`.
     * 
     * It will be placed after `previous_sibling,` or at the beginning if
     * `previous_sibling` is %NULL.
     * 
     * After calling this function, `gtk_widget_get_prev_sibling(widget)`
     * will return `previous_sibling`.
     * 
     * If `parent` is already set as the parent widget of `widget,` this
     * function can also be used to reorder `widget` in the child widget
     * list of `parent`.
     * 
     * This API is primarily meant for widget implementations; if you are
     * just using a widget, you *must* use its own API for adding children.
     * @param parent the parent `GtkWidget` to insert `widget` into
     * @param previous_sibling the new previous sibling of `widget`
     */
    insert_after(parent: Gtk.Widget, previous_sibling: Gtk.Widget | null): void
    /**
     * Prepends a widget in the paned.
     * @param child a #GtkWidget to prepend.
     */
    prepend(child: Gtk.Widget): void
    /**
     * Removes a widget from the paned.
     * @param child a #GtkWidget
     */
    remove(child: Gtk.Widget): void
    connect(sigName: "notify::can-focus", callback: (($obj: Paned, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::can-focus", callback: (($obj: Paned, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::can-focus", ...args: any[]): void
    connect(sigName: "notify::can-target", callback: (($obj: Paned, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::can-target", callback: (($obj: Paned, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::can-target", ...args: any[]): void
    connect(sigName: "notify::css-classes", callback: (($obj: Paned, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::css-classes", callback: (($obj: Paned, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::css-classes", ...args: any[]): void
    connect(sigName: "notify::css-name", callback: (($obj: Paned, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::css-name", callback: (($obj: Paned, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::css-name", ...args: any[]): void
    connect(sigName: "notify::cursor", callback: (($obj: Paned, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::cursor", callback: (($obj: Paned, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::cursor", ...args: any[]): void
    connect(sigName: "notify::focus-on-click", callback: (($obj: Paned, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::focus-on-click", callback: (($obj: Paned, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::focus-on-click", ...args: any[]): void
    connect(sigName: "notify::focusable", callback: (($obj: Paned, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::focusable", callback: (($obj: Paned, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::focusable", ...args: any[]): void
    connect(sigName: "notify::halign", callback: (($obj: Paned, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::halign", callback: (($obj: Paned, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::halign", ...args: any[]): void
    connect(sigName: "notify::has-default", callback: (($obj: Paned, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::has-default", callback: (($obj: Paned, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::has-default", ...args: any[]): void
    connect(sigName: "notify::has-focus", callback: (($obj: Paned, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::has-focus", callback: (($obj: Paned, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::has-focus", ...args: any[]): void
    connect(sigName: "notify::has-tooltip", callback: (($obj: Paned, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::has-tooltip", callback: (($obj: Paned, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::has-tooltip", ...args: any[]): void
    connect(sigName: "notify::height-request", callback: (($obj: Paned, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::height-request", callback: (($obj: Paned, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::height-request", ...args: any[]): void
    connect(sigName: "notify::hexpand", callback: (($obj: Paned, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::hexpand", callback: (($obj: Paned, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::hexpand", ...args: any[]): void
    connect(sigName: "notify::hexpand-set", callback: (($obj: Paned, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::hexpand-set", callback: (($obj: Paned, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::hexpand-set", ...args: any[]): void
    connect(sigName: "notify::layout-manager", callback: (($obj: Paned, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::layout-manager", callback: (($obj: Paned, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::layout-manager", ...args: any[]): void
    connect(sigName: "notify::margin-bottom", callback: (($obj: Paned, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::margin-bottom", callback: (($obj: Paned, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::margin-bottom", ...args: any[]): void
    connect(sigName: "notify::margin-end", callback: (($obj: Paned, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::margin-end", callback: (($obj: Paned, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::margin-end", ...args: any[]): void
    connect(sigName: "notify::margin-start", callback: (($obj: Paned, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::margin-start", callback: (($obj: Paned, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::margin-start", ...args: any[]): void
    connect(sigName: "notify::margin-top", callback: (($obj: Paned, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::margin-top", callback: (($obj: Paned, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::margin-top", ...args: any[]): void
    connect(sigName: "notify::name", callback: (($obj: Paned, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::name", callback: (($obj: Paned, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::name", ...args: any[]): void
    connect(sigName: "notify::opacity", callback: (($obj: Paned, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::opacity", callback: (($obj: Paned, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::opacity", ...args: any[]): void
    connect(sigName: "notify::overflow", callback: (($obj: Paned, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::overflow", callback: (($obj: Paned, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::overflow", ...args: any[]): void
    connect(sigName: "notify::parent", callback: (($obj: Paned, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::parent", callback: (($obj: Paned, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::parent", ...args: any[]): void
    connect(sigName: "notify::receives-default", callback: (($obj: Paned, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::receives-default", callback: (($obj: Paned, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::receives-default", ...args: any[]): void
    connect(sigName: "notify::root", callback: (($obj: Paned, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::root", callback: (($obj: Paned, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::root", ...args: any[]): void
    connect(sigName: "notify::scale-factor", callback: (($obj: Paned, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::scale-factor", callback: (($obj: Paned, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::scale-factor", ...args: any[]): void
    connect(sigName: "notify::sensitive", callback: (($obj: Paned, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::sensitive", callback: (($obj: Paned, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::sensitive", ...args: any[]): void
    connect(sigName: "notify::tooltip-markup", callback: (($obj: Paned, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::tooltip-markup", callback: (($obj: Paned, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::tooltip-markup", ...args: any[]): void
    connect(sigName: "notify::tooltip-text", callback: (($obj: Paned, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::tooltip-text", callback: (($obj: Paned, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::tooltip-text", ...args: any[]): void
    connect(sigName: "notify::valign", callback: (($obj: Paned, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::valign", callback: (($obj: Paned, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::valign", ...args: any[]): void
    connect(sigName: "notify::vexpand", callback: (($obj: Paned, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::vexpand", callback: (($obj: Paned, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::vexpand", ...args: any[]): void
    connect(sigName: "notify::vexpand-set", callback: (($obj: Paned, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::vexpand-set", callback: (($obj: Paned, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::vexpand-set", ...args: any[]): void
    connect(sigName: "notify::visible", callback: (($obj: Paned, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::visible", callback: (($obj: Paned, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::visible", ...args: any[]): void
    connect(sigName: "notify::width-request", callback: (($obj: Paned, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::width-request", callback: (($obj: Paned, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::width-request", ...args: any[]): void
    connect(sigName: "notify::accessible-role", callback: (($obj: Paned, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::accessible-role", callback: (($obj: Paned, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::accessible-role", ...args: any[]): void
    connect(sigName: "notify::orientation", callback: (($obj: Paned, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::orientation", callback: (($obj: Paned, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::orientation", ...args: any[]): void
    connect(sigName: string, callback: (...args: any[]) => void): number
    connect_after(sigName: string, callback: (...args: any[]) => void): number
    emit(sigName: string, ...args: any[]): void
    disconnect(id: number): void
}

/**
 * A #PanelPaned is the concrete widget for a panel area.
 * @class 
 */
export class Paned extends Gtk.Widget {
    static name: string
    static $gtype: GObject.GType<Paned>
    constructor(config?: Paned.ConstructorProperties) 
    /**
     * Create a new #PanelPaned.
     * @constructor 
     * @returns a newly created #PanelPaned
     */
    constructor() 
    /**
     * Create a new #PanelPaned.
     * @constructor 
     * @returns a newly created #PanelPaned
     */
    static new(): Paned
    _init(config?: Paned.ConstructorProperties): void
}

export module Position {
    export interface ConstructorProperties extends GObject.Object.ConstructorProperties {
        /**
         * The area.
         */
        area?: Area | null
        /**
         * The area is set.
         */
        area_set?: boolean | null
        /**
         * The column in the position.
         */
        column?: number | null
        /**
         * The column is set.
         */
        column_set?: boolean | null
        depth?: number | null
        depth_set?: boolean | null
        row?: number | null
        row_set?: boolean | null
    }

}

export interface Position {
    /**
     * The area.
     */
    area: Area
    /**
     * The area is set.
     */
    area_set: boolean
    /**
     * The column in the position.
     */
    column: number
    /**
     * The column is set.
     */
    column_set: boolean
    depth: number
    depth_set: boolean
    row: number
    row_set: boolean
    /**
     * Compares two #PanelPosition.
     * @param b another #PanelPosition
     * @returns whether the two pane positions are equal.
     */
    equal(b: Position): boolean
    /**
     * Gets the area.
     * @returns the area.
     */
    get_area(): Area
    /**
     * Gets wether the area is set.
     * @returns the wether the area is set.
     */
    get_area_set(): boolean
    get_column(): number
    get_column_set(): boolean
    get_depth(): number
    get_depth_set(): boolean
    get_row(): number
    get_row_set(): boolean
    /**
     * Tells is the position is indeterminate.
     * @returns whether the position is indeterminate.
     */
    is_indeterminate(): boolean
    /**
     * Sets the area.
     * @param area the #PanelArea
     */
    set_area(area: Area): void
    /**
     * Sets whether the area is set.
     * @param area_set whether the area is set.
     */
    set_area_set(area_set: boolean): void
    set_column(column: number): void
    set_column_set(column_set: boolean): void
    set_depth(depth: number): void
    set_depth_set(depth_set: boolean): void
    set_row(row: number): void
    set_row_set(row_set: boolean): void
    /**
     * Convert a #PanelPosition to a #GVariant.
     * @returns the new #GVariant containing the positon values
     */
    to_variant(): GLib.Variant | null
    connect(sigName: "notify::area", callback: (($obj: Position, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::area", callback: (($obj: Position, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::area", ...args: any[]): void
    connect(sigName: "notify::area-set", callback: (($obj: Position, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::area-set", callback: (($obj: Position, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::area-set", ...args: any[]): void
    connect(sigName: "notify::column", callback: (($obj: Position, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::column", callback: (($obj: Position, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::column", ...args: any[]): void
    connect(sigName: "notify::column-set", callback: (($obj: Position, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::column-set", callback: (($obj: Position, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::column-set", ...args: any[]): void
    connect(sigName: "notify::depth", callback: (($obj: Position, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::depth", callback: (($obj: Position, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::depth", ...args: any[]): void
    connect(sigName: "notify::depth-set", callback: (($obj: Position, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::depth-set", callback: (($obj: Position, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::depth-set", ...args: any[]): void
    connect(sigName: "notify::row", callback: (($obj: Position, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::row", callback: (($obj: Position, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::row", ...args: any[]): void
    connect(sigName: "notify::row-set", callback: (($obj: Position, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::row-set", callback: (($obj: Position, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::row-set", ...args: any[]): void
    connect(sigName: string, callback: (...args: any[]) => void): number
    connect_after(sigName: string, callback: (...args: any[]) => void): number
    emit(sigName: string, ...args: any[]): void
    disconnect(id: number): void
}

/**
 * Specifies a position in the dock. You receive a #PanelPosition in the
 * handler to [signal`PanelDock:`:create-frame].
 * @class 
 */
export class Position extends GObject.Object {
    static name: string
    static $gtype: GObject.GType<Position>
    constructor(config?: Position.ConstructorProperties) 
    /**
     * Create a position.
     * @constructor 
     * @returns a newly created instance of #PanelPosition.
     */
    constructor() 
    /**
     * Create a position.
     * @constructor 
     * @returns a newly created instance of #PanelPosition.
     */
    static new(): Position
    /**
     * Create a #PanelPosition from a #GVariant.
     * @constructor 
     * @param variant a #GVariant
     * @returns A newly created #PanelPosition   from the #GVariant.
     */
    static new_from_variant(variant: GLib.Variant): Position
    _init(config?: Position.ConstructorProperties): void
}

export module SaveDelegate {
    /**
     * Signal callback interface for `close`
     */
    export interface CloseSignalCallback {
        ($obj: SaveDelegate): void
    }

    /**
     * Signal callback interface for `discard`
     */
    export interface DiscardSignalCallback {
        ($obj: SaveDelegate): void
    }

    /**
     * Signal callback interface for `save`
     */
    export interface SaveSignalCallback {
        ($obj: SaveDelegate, task: Gio.Task): boolean
    }

    export interface ConstructorProperties extends GObject.Object.ConstructorProperties {
        /**
         * The "icon" property contains a #GIcon that describes the save
         * operation. Generally, this should be the symbolic icon of the
         * document class you are saving.
         * 
         * Alternatively, you can use #PanelSaveDelegate:icon-name for a
         * named icon.
         */
        icon?: Gio.Icon | null
        /**
         * The "icon-name" property contains the name of an icon to use when
         * showing information about the save operation in UI such as a save
         * dialog.
         * 
         * You can also use #PanelSaveDelegate:icon to set a #GIcon instead of
         * an icon name.
         */
        icon_name?: string | null
        /**
         * The "is-draft" property indicates that the document represented by the
         * delegate is a draft and might be lost of not saved.
         */
        is_draft?: boolean | null
        /**
         * The "progress" property contains progress between 0.0 and 1.0 and
         * should be updated by the delegate implementation as saving progresses.
         */
        progress?: number | null
        /**
         * The "subtitle" property contains additional information that may
         * not make sense to put in the title. This might include the directory
         * that the file will be saved within.
         */
        subtitle?: string | null
        /**
         * The "title" property contains the title of the document being saved.
         * Generally, this should be the base name of the document such as
         * `file.txt`.
         */
        title?: string | null
    }

}

export interface SaveDelegate {
    /**
     * The "icon" property contains a #GIcon that describes the save
     * operation. Generally, this should be the symbolic icon of the
     * document class you are saving.
     * 
     * Alternatively, you can use #PanelSaveDelegate:icon-name for a
     * named icon.
     */
    icon: Gio.Icon
    /**
     * The "icon-name" property contains the name of an icon to use when
     * showing information about the save operation in UI such as a save
     * dialog.
     * 
     * You can also use #PanelSaveDelegate:icon to set a #GIcon instead of
     * an icon name.
     */
    icon_name: string | null
    /**
     * The "is-draft" property indicates that the document represented by the
     * delegate is a draft and might be lost of not saved.
     */
    is_draft: boolean
    /**
     * The "progress" property contains progress between 0.0 and 1.0 and
     * should be updated by the delegate implementation as saving progresses.
     */
    progress: number
    /**
     * The "subtitle" property contains additional information that may
     * not make sense to put in the title. This might include the directory
     * that the file will be saved within.
     */
    subtitle: string | null
    /**
     * The "title" property contains the title of the document being saved.
     * Generally, this should be the base name of the document such as
     * `file.txt`.
     */
    title: string | null
    parent_instance: GObject.Object
    close(): void
    discard(): void
    /**
     * Gets the #GIcon for the save delegate, or %NULL if unset.
     * @returns a #GIcon or %NULL
     */
    get_icon(): Gio.Icon | null
    /**
     * Gets the icon name for the save delegate.
     * @returns the icon name or %NULL
     */
    get_icon_name(): string | null
    get_is_draft(): boolean
    get_progress(): number
    /**
     * Gets the subtitle for the save delegate.
     * @returns the subtitle or %NULL
     */
    get_subtitle(): string | null
    /**
     * Gets the title for the save delegate.
     * @returns the title or %NULL
     */
    get_title(): string | null
    save_async(cancellable: Gio.Cancellable | null, callback: Gio.AsyncReadyCallback<this> | null): void
    /**
     * Promisified version of {@link save_async}
     * 
     * 
     * @param cancellable 
     * @returns A Promise of the result of {@link save_async}
     */
    save_async(cancellable: Gio.Cancellable | null): globalThis.Promise<boolean>
    save_finish(result: Gio.AsyncResult): boolean
    /**
     * Sets the #GIcon for the save delegate. Pass %NULL to unset.
     * @param icon a #GIcon or %NULL
     */
    set_icon(icon: Gio.Icon | null): void
    /**
     * Sets the icon name for the save delegate. Pass %NULL to unset.
     * @param icon the icon name or %NULL
     */
    set_icon_name(icon: string | null): void
    set_is_draft(is_draft: boolean): void
    set_progress(progress: number): void
    /**
     * Sets the subtitle for the save delegate. Pass %NULL to unset.
     * @param subtitle the subtitle or %NULL
     */
    set_subtitle(subtitle: string | null): void
    /**
     * Sets the title for the save delegate. Pass %NULL to unset.
     * @param title the title or %NULL
     */
    set_title(title: string | null): void
    vfunc_close(): void
    vfunc_discard(): void
    vfunc_save(task: Gio.Task): boolean
    vfunc_save_async(cancellable: Gio.Cancellable | null, callback: Gio.AsyncReadyCallback<this> | null): void
    vfunc_save_finish(result: Gio.AsyncResult): boolean
    connect(sigName: "close", callback: SaveDelegate.CloseSignalCallback): number
    connect_after(sigName: "close", callback: SaveDelegate.CloseSignalCallback): number
    emit(sigName: "close", ...args: any[]): void
    connect(sigName: "discard", callback: SaveDelegate.DiscardSignalCallback): number
    connect_after(sigName: "discard", callback: SaveDelegate.DiscardSignalCallback): number
    emit(sigName: "discard", ...args: any[]): void
    connect(sigName: "save", callback: SaveDelegate.SaveSignalCallback): number
    connect_after(sigName: "save", callback: SaveDelegate.SaveSignalCallback): number
    emit(sigName: "save", task: Gio.Task, ...args: any[]): void
    connect(sigName: "notify::icon", callback: (($obj: SaveDelegate, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::icon", callback: (($obj: SaveDelegate, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::icon", ...args: any[]): void
    connect(sigName: "notify::icon-name", callback: (($obj: SaveDelegate, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::icon-name", callback: (($obj: SaveDelegate, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::icon-name", ...args: any[]): void
    connect(sigName: "notify::is-draft", callback: (($obj: SaveDelegate, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::is-draft", callback: (($obj: SaveDelegate, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::is-draft", ...args: any[]): void
    connect(sigName: "notify::progress", callback: (($obj: SaveDelegate, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::progress", callback: (($obj: SaveDelegate, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::progress", ...args: any[]): void
    connect(sigName: "notify::subtitle", callback: (($obj: SaveDelegate, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::subtitle", callback: (($obj: SaveDelegate, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::subtitle", ...args: any[]): void
    connect(sigName: "notify::title", callback: (($obj: SaveDelegate, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::title", callback: (($obj: SaveDelegate, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::title", ...args: any[]): void
    connect(sigName: string, callback: (...args: any[]) => void): number
    connect_after(sigName: string, callback: (...args: any[]) => void): number
    emit(sigName: string, ...args: any[]): void
    disconnect(id: number): void
}

export class SaveDelegate extends GObject.Object {
    static name: string
    static $gtype: GObject.GType<SaveDelegate>
    constructor(config?: SaveDelegate.ConstructorProperties) 
    /**
     * Create a new #PanelSaveDelegate.
     * @constructor 
     * @returns a newly created #PanelSaveDelegate
     */
    constructor() 
    /**
     * Create a new #PanelSaveDelegate.
     * @constructor 
     * @returns a newly created #PanelSaveDelegate
     */
    static new(): SaveDelegate
    _init(config?: SaveDelegate.ConstructorProperties): void
}

export module SaveDialog {
    export interface ConstructorProperties extends Gtk.Accessible.ConstructorProperties, Gtk.Buildable.ConstructorProperties, Gtk.ConstraintTarget.ConstructorProperties, Gtk.Native.ConstructorProperties, Gtk.Root.ConstructorProperties, Gtk.ShortcutManager.ConstructorProperties, Adw.MessageDialog.ConstructorProperties {
        /**
         * This property requests that the widget close after saving.
         */
        close_after_save?: boolean | null
    }

}

export interface SaveDialog extends Gtk.Accessible, Gtk.Buildable, Gtk.ConstraintTarget, Gtk.Native, Gtk.Root, Gtk.ShortcutManager {
    /**
     * This property requests that the widget close after saving.
     */
    close_after_save: boolean
    parent_instance: Gtk.Window & Gtk.Widget & GObject.InitiallyUnowned & GObject.InitiallyUnowned
    add_delegate(delegate: SaveDelegate): void
    get_close_after_save(): boolean
    run_async(cancellable: Gio.Cancellable | null, callback: Gio.AsyncReadyCallback<this> | null): void
    /**
     * Promisified version of {@link run_async}
     * 
     * 
     * @param cancellable 
     * @returns A Promise of the result of {@link run_async}
     */
    run_async(cancellable: Gio.Cancellable | null): globalThis.Promise<boolean>
    run_finish(result: Gio.AsyncResult): boolean
    set_close_after_save(close_after_save: boolean): void
    connect(sigName: "notify::close-after-save", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::close-after-save", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::close-after-save", ...args: any[]): void
    connect(sigName: "notify::body", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::body", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::body", ...args: any[]): void
    connect(sigName: "notify::body-use-markup", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::body-use-markup", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::body-use-markup", ...args: any[]): void
    connect(sigName: "notify::close-response", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::close-response", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::close-response", ...args: any[]): void
    connect(sigName: "notify::default-response", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::default-response", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::default-response", ...args: any[]): void
    connect(sigName: "notify::extra-child", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::extra-child", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::extra-child", ...args: any[]): void
    connect(sigName: "notify::heading", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::heading", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::heading", ...args: any[]): void
    connect(sigName: "notify::heading-use-markup", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::heading-use-markup", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::heading-use-markup", ...args: any[]): void
    connect(sigName: "notify::application", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::application", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::application", ...args: any[]): void
    connect(sigName: "notify::child", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::child", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::child", ...args: any[]): void
    connect(sigName: "notify::decorated", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::decorated", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::decorated", ...args: any[]): void
    connect(sigName: "notify::default-height", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::default-height", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::default-height", ...args: any[]): void
    connect(sigName: "notify::default-widget", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::default-widget", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::default-widget", ...args: any[]): void
    connect(sigName: "notify::default-width", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::default-width", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::default-width", ...args: any[]): void
    connect(sigName: "notify::deletable", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::deletable", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::deletable", ...args: any[]): void
    connect(sigName: "notify::destroy-with-parent", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::destroy-with-parent", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::destroy-with-parent", ...args: any[]): void
    connect(sigName: "notify::display", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::display", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::display", ...args: any[]): void
    connect(sigName: "notify::focus-visible", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::focus-visible", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::focus-visible", ...args: any[]): void
    connect(sigName: "notify::focus-widget", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::focus-widget", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::focus-widget", ...args: any[]): void
    connect(sigName: "notify::fullscreened", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::fullscreened", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::fullscreened", ...args: any[]): void
    connect(sigName: "notify::handle-menubar-accel", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::handle-menubar-accel", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::handle-menubar-accel", ...args: any[]): void
    connect(sigName: "notify::hide-on-close", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::hide-on-close", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::hide-on-close", ...args: any[]): void
    connect(sigName: "notify::icon-name", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::icon-name", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::icon-name", ...args: any[]): void
    connect(sigName: "notify::is-active", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::is-active", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::is-active", ...args: any[]): void
    connect(sigName: "notify::maximized", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::maximized", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::maximized", ...args: any[]): void
    connect(sigName: "notify::mnemonics-visible", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::mnemonics-visible", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::mnemonics-visible", ...args: any[]): void
    connect(sigName: "notify::modal", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::modal", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::modal", ...args: any[]): void
    connect(sigName: "notify::resizable", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::resizable", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::resizable", ...args: any[]): void
    connect(sigName: "notify::startup-id", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::startup-id", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::startup-id", ...args: any[]): void
    connect(sigName: "notify::title", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::title", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::title", ...args: any[]): void
    connect(sigName: "notify::titlebar", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::titlebar", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::titlebar", ...args: any[]): void
    connect(sigName: "notify::transient-for", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::transient-for", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::transient-for", ...args: any[]): void
    connect(sigName: "notify::can-focus", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::can-focus", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::can-focus", ...args: any[]): void
    connect(sigName: "notify::can-target", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::can-target", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::can-target", ...args: any[]): void
    connect(sigName: "notify::css-classes", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::css-classes", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::css-classes", ...args: any[]): void
    connect(sigName: "notify::css-name", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::css-name", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::css-name", ...args: any[]): void
    connect(sigName: "notify::cursor", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::cursor", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::cursor", ...args: any[]): void
    connect(sigName: "notify::focus-on-click", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::focus-on-click", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::focus-on-click", ...args: any[]): void
    connect(sigName: "notify::focusable", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::focusable", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::focusable", ...args: any[]): void
    connect(sigName: "notify::halign", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::halign", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::halign", ...args: any[]): void
    connect(sigName: "notify::has-default", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::has-default", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::has-default", ...args: any[]): void
    connect(sigName: "notify::has-focus", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::has-focus", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::has-focus", ...args: any[]): void
    connect(sigName: "notify::has-tooltip", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::has-tooltip", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::has-tooltip", ...args: any[]): void
    connect(sigName: "notify::height-request", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::height-request", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::height-request", ...args: any[]): void
    connect(sigName: "notify::hexpand", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::hexpand", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::hexpand", ...args: any[]): void
    connect(sigName: "notify::hexpand-set", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::hexpand-set", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::hexpand-set", ...args: any[]): void
    connect(sigName: "notify::layout-manager", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::layout-manager", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::layout-manager", ...args: any[]): void
    connect(sigName: "notify::margin-bottom", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::margin-bottom", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::margin-bottom", ...args: any[]): void
    connect(sigName: "notify::margin-end", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::margin-end", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::margin-end", ...args: any[]): void
    connect(sigName: "notify::margin-start", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::margin-start", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::margin-start", ...args: any[]): void
    connect(sigName: "notify::margin-top", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::margin-top", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::margin-top", ...args: any[]): void
    connect(sigName: "notify::name", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::name", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::name", ...args: any[]): void
    connect(sigName: "notify::opacity", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::opacity", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::opacity", ...args: any[]): void
    connect(sigName: "notify::overflow", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::overflow", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::overflow", ...args: any[]): void
    connect(sigName: "notify::parent", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::parent", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::parent", ...args: any[]): void
    connect(sigName: "notify::receives-default", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::receives-default", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::receives-default", ...args: any[]): void
    connect(sigName: "notify::root", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::root", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::root", ...args: any[]): void
    connect(sigName: "notify::scale-factor", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::scale-factor", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::scale-factor", ...args: any[]): void
    connect(sigName: "notify::sensitive", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::sensitive", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::sensitive", ...args: any[]): void
    connect(sigName: "notify::tooltip-markup", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::tooltip-markup", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::tooltip-markup", ...args: any[]): void
    connect(sigName: "notify::tooltip-text", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::tooltip-text", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::tooltip-text", ...args: any[]): void
    connect(sigName: "notify::valign", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::valign", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::valign", ...args: any[]): void
    connect(sigName: "notify::vexpand", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::vexpand", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::vexpand", ...args: any[]): void
    connect(sigName: "notify::vexpand-set", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::vexpand-set", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::vexpand-set", ...args: any[]): void
    connect(sigName: "notify::visible", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::visible", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::visible", ...args: any[]): void
    connect(sigName: "notify::width-request", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::width-request", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::width-request", ...args: any[]): void
    connect(sigName: "notify::accessible-role", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::accessible-role", callback: (($obj: SaveDialog, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::accessible-role", ...args: any[]): void
    connect(sigName: string, callback: (...args: any[]) => void): number
    connect_after(sigName: string, callback: (...args: any[]) => void): number
    emit(sigName: string, ...args: any[]): void
    disconnect(id: number): void
}

export class SaveDialog extends Adw.MessageDialog {
    static name: string
    static $gtype: GObject.GType<SaveDialog>
    constructor(config?: SaveDialog.ConstructorProperties) 
    /**
     * Create a new #PanelSaveDialog.
     * @constructor 
     * @returns a newly created #PanelSaveDialog
     */
    constructor() 
    /**
     * Create a new #PanelSaveDialog.
     * @constructor 
     * @returns a newly created #PanelSaveDialog
     */
    static new(): SaveDialog
    /**
     * Creates a new `AdwMessageDialog`.
     * 
     * `heading` and `body` can be set to `NULL`. This can be useful if they need to
     * be formatted or use markup. In that case, set them to `NULL` and call
     * [method`MessageDialog`.format_body] or similar methods afterwards:
     * 
     * ```c
     * GtkWidget *dialog;
     * 
     * dialog = adw_message_dialog_new (parent, _("Replace File?"), NULL);
     * adw_message_dialog_format_body (ADW_MESSAGE_DIALOG (dialog),
     *                                 _("A file named “%s” already exists.  Do you want to replace it?"),
     *                                 filename);
     * ```
     * @constructor 
     * @param parent transient parent
     * @param heading the heading
     * @param body the body text
     * @returns the newly created `AdwMessageDialog`
     */
    static new(parent: Gtk.Window | null, heading: string | null, body: string | null): Adw.MessageDialog
    /**
     * Creates a new `GtkWindow`.
     * 
     * To get an undecorated window (no window borders), use
     * [method`Gtk`.Window.set_decorated].
     * 
     * All top-level windows created by gtk_window_new() are stored
     * in an internal top-level window list. This list can be obtained
     * from [func`Gtk`.Window.list_toplevels]. Due to GTK keeping a
     * reference to the window internally, gtk_window_new() does not
     * return a reference to the caller.
     * 
     * To delete a `GtkWindow`, call [method`Gtk`.Window.destroy].
     * @constructor 
     * @returns a new `GtkWindow`.
     */
    static new(): Gtk.Window
    _init(config?: SaveDialog.ConstructorProperties): void
}

export module Session {
    export interface ConstructorProperties extends GObject.Object.ConstructorProperties {
    }

}

export interface Session {
    append(item: SessionItem): void
    /**
     * Gets the item at `position`.
     * @param position the index of the item
     * @returns The #PanelSessionItem at @position   or %NULL if there is no item at that position.
     */
    get_item(position: number): SessionItem | null
    get_n_items(): number
    insert(position: number, item: SessionItem): void
    /**
     * Gets a session item matching `id`.
     * @param id the id of the item
     * @returns an #PanelSessionItem or %NULL
     */
    lookup_by_id(id: string | null): SessionItem | null
    prepend(item: SessionItem): void
    remove(item: SessionItem): void
    remove_at(position: number): void
    /**
     * Serializes a #PanelSession as a #GVariant
     * 
     * The result of this function may be passed to
     * panel_session_new_from_variant() to recreate a #PanelSession.
     * 
     * The resulting variant will not be floating.
     * @returns a #GVariant
     */
    to_variant(): GLib.Variant
    connect(sigName: string, callback: (...args: any[]) => void): number
    connect_after(sigName: string, callback: (...args: any[]) => void): number
    emit(sigName: string, ...args: any[]): void
    disconnect(id: number): void
}

export class Session extends GObject.Object {
    static name: string
    static $gtype: GObject.GType<Session>
    constructor(config?: Session.ConstructorProperties) 
    constructor() 
    static new(): Session
    /**
     * Creates a new #PanelSession from a #GVariant.
     * 
     * This creates a new #PanelSession instance from a previous session
     * which had been serialized to `variant`.
     * @constructor 
     * @param variant a #GVariant from panel_session_to_variant()
     * @returns a #PanelSession
     */
    static new_from_variant(variant: GLib.Variant): Session
    _init(config?: Session.ConstructorProperties): void
}

export module SessionItem {
    export interface ConstructorProperties extends GObject.Object.ConstructorProperties {
        id?: string | null
        module_name?: string | null
        position?: Position | null
        type_hint?: string | null
        workspace?: string | null
    }

}

export interface SessionItem {
    id: string | null
    module_name: string | null
    position: Position
    type_hint: string | null
    workspace: string | null
    /**
     * Gets the id for the session item, if any.
     * @returns a string containing the id; otherwise %NULL
     */
    get_id(): string | null
    /**
     * Retrieves the metadata value for `key`.
     * 
     * If `expected_type` is non-%NULL, any non-%NULL value returned from this
     * function will match `expected_type`.
     * @param key the metadata key
     * @param expected_type a #GVariantType or %NULL
     * @returns a non-floating #GVariant which should   be released with g_variant_unref(); otherwise %NULL.
     */
    get_metadata_value(key: string | null, expected_type: GLib.VariantType | null): GLib.Variant | null
    /**
     * Gets the module-name that created an item.
     * @returns a module-name or %NULL
     */
    get_module_name(): string | null
    /**
     * Gets the #PanelPosition for the item.
     * @returns a #PanelPosition or %NULL
     */
    get_position(): Position | null
    /**
     * Gets the type hint for an item.
     * @returns a type-hint or %NULL
     */
    get_type_hint(): string | null
    /**
     * Gets the workspace id for the item.
     * @returns a workspace or %NULL
     */
    get_workspace(): string | null
    /**
     * If the item contains a metadata value for `key`.
     * 
     * Checks if a value exists for a metadata key and retrieves the #GVariantType
     * for that key.
     * @param key the name of the metadata
     * @returns %TRUE if @self contains metadata named @key and @value_type is set   to the value's #GVariantType. Otherwise %FALSE and @value_type is unchanged.
     */
    has_metadata(key: string | null): [ /* returnType */ boolean, /* value_type */ GLib.VariantType | null ]
    /**
     * Checks if the item contains metadata `key` with `expected_type`.
     * @param key the metadata key
     * @param expected_type the #GVariantType to check for `key`
     * @returns %TRUE if a value was found for @key matching @expected_typed;   otherwise %FALSE is returned.
     */
    has_metadata_with_type(key: string | null, expected_type: GLib.VariantType): boolean
    /**
     * Sets the identifier for the item.
     * 
     * The identifier should generally be global to the session as it would
     * not be expected to come across multiple items with the same id.
     * @param id an optional identifier for the item
     */
    set_id(id: string | null): void
    /**
     * Sets the value for metadata `key`.
     * 
     * If `value` is %NULL, the metadata key is unset.
     * @param key the metadata key
     * @param value the value for `key` or %NULL
     */
    set_metadata_value(key: string | null, value: GLib.Variant | null): void
    /**
     * Sets the module-name for the session item.
     * 
     * This is generally used to help determine which plugin created
     * the item when decoding them at project load time.
     * @param module_name the module name owning the item
     */
    set_module_name(module_name: string | null): void
    /**
     * Sets the position for `self,` if any.
     * @param position a #PanelPosition or %NULL
     */
    set_position(position: Position | null): void
    /**
     * Sets the type-hint value for the item.
     * 
     * This is generally used to help inflate the right version of
     * an object when loading session items.
     * @param type_hint a type hint string for the item
     */
    set_type_hint(type_hint: string | null): void
    /**
     * Sets the workspace id for the item.
     * 
     * This is generally used to tie an item to a specific workspace.
     * @param workspace a workspace string for the item
     */
    set_workspace(workspace: string | null): void
    connect(sigName: "notify::id", callback: (($obj: SessionItem, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::id", callback: (($obj: SessionItem, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::id", ...args: any[]): void
    connect(sigName: "notify::module-name", callback: (($obj: SessionItem, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::module-name", callback: (($obj: SessionItem, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::module-name", ...args: any[]): void
    connect(sigName: "notify::position", callback: (($obj: SessionItem, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::position", callback: (($obj: SessionItem, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::position", ...args: any[]): void
    connect(sigName: "notify::type-hint", callback: (($obj: SessionItem, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::type-hint", callback: (($obj: SessionItem, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::type-hint", ...args: any[]): void
    connect(sigName: "notify::workspace", callback: (($obj: SessionItem, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::workspace", callback: (($obj: SessionItem, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::workspace", ...args: any[]): void
    connect(sigName: string, callback: (...args: any[]) => void): number
    connect_after(sigName: string, callback: (...args: any[]) => void): number
    emit(sigName: string, ...args: any[]): void
    disconnect(id: number): void
}

export class SessionItem extends GObject.Object {
    static name: string
    static $gtype: GObject.GType<SessionItem>
    constructor(config?: SessionItem.ConstructorProperties) 
    constructor() 
    static new(): SessionItem
    _init(config?: SessionItem.ConstructorProperties): void
}

export module Settings {
    /**
     * Signal callback interface for `changed`
     */
    export interface ChangedSignalCallback {
        ($obj: Settings, object: string | null): void
    }

    export interface ConstructorProperties extends Gio.ActionGroup.ConstructorProperties, GObject.Object.ConstructorProperties {
        /**
         * The "identifier" property is used to make unique paths.
         * 
         * This might be a unique "project-id" for example, in an IDE.
         */
        identifier?: string | null
        path?: string | null
        path_prefix?: string | null
        path_suffix?: string | null
        schema_id?: string | null
        schema_id_prefix?: string | null
    }

}

export interface Settings extends Gio.ActionGroup {
    /**
     * The "identifier" property is used to make unique paths.
     * 
     * This might be a unique "project-id" for example, in an IDE.
     */
    readonly identifier: string | null
    readonly path: string | null
    readonly path_prefix: string | null
    readonly path_suffix: string | null
    readonly schema_id: string | null
    readonly schema_id_prefix: string | null
    bind(key: string | null, object: any | null, property: string | null, flags: Gio.SettingsBindFlags): void
    /**
     * Like panel_settings_bind() but allows transforming to and from settings storage using
     * `get_mapping` and `set_mapping` transformation functions.
     * 
     * Call panel_settings_unbind() to unbind the mapping.
     * @param key The settings key
     * @param object the object to bind to
     * @param property the property of `object` to bind to
     * @param flags flags for the binding
     * @param get_mapping variant to value mapping
     * @param set_mapping value to variant mapping
     */
    bind_with_mapping(key: string | null, object: any | null, property: string | null, flags: Gio.SettingsBindFlags, get_mapping: Gio.SettingsBindGetMapping | null, set_mapping: Gio.SettingsBindSetMapping | null): void
    get_boolean(key: string | null): boolean
    get_default_value(key: string | null): GLib.Variant
    get_double(key: string | null): number
    get_int(key: string | null): number
    get_schema_id(): string | null
    get_string(key: string | null): string | null
    get_uint(key: string | null): number
    get_user_value(key: string | null): GLib.Variant | null
    get_value(key: string | null): GLib.Variant
    set_boolean(key: string | null, val: boolean): void
    set_double(key: string | null, val: number): void
    set_int(key: string | null, val: number): void
    set_string(key: string | null, val: string | null): void
    set_uint(key: string | null, val: number): void
    set_value(key: string | null, value: GLib.Variant): void
    unbind(property: string | null): void
    connect(sigName: "changed", callback: Settings.ChangedSignalCallback): number
    connect_after(sigName: "changed", callback: Settings.ChangedSignalCallback): number
    emit(sigName: "changed", object: string | null, ...args: any[]): void
    connect(sigName: "notify::identifier", callback: (($obj: Settings, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::identifier", callback: (($obj: Settings, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::identifier", ...args: any[]): void
    connect(sigName: "notify::path", callback: (($obj: Settings, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::path", callback: (($obj: Settings, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::path", ...args: any[]): void
    connect(sigName: "notify::path-prefix", callback: (($obj: Settings, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::path-prefix", callback: (($obj: Settings, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::path-prefix", ...args: any[]): void
    connect(sigName: "notify::path-suffix", callback: (($obj: Settings, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::path-suffix", callback: (($obj: Settings, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::path-suffix", ...args: any[]): void
    connect(sigName: "notify::schema-id", callback: (($obj: Settings, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::schema-id", callback: (($obj: Settings, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::schema-id", ...args: any[]): void
    connect(sigName: "notify::schema-id-prefix", callback: (($obj: Settings, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::schema-id-prefix", callback: (($obj: Settings, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::schema-id-prefix", ...args: any[]): void
    connect(sigName: string, callback: (...args: any[]) => void): number
    connect_after(sigName: string, callback: (...args: any[]) => void): number
    emit(sigName: string, ...args: any[]): void
    disconnect(id: number): void
}

export class Settings extends GObject.Object {
    static name: string
    static $gtype: GObject.GType<Settings>
    constructor(config?: Settings.ConstructorProperties) 
    constructor(identifier: string | null, schema_id: string | null) 
    static new(identifier: string | null, schema_id: string | null): Settings
    static new_relocatable(identifier: string | null, schema_id: string | null, schema_id_prefix: string | null, path_prefix: string | null, path_suffix: string | null): Settings
    static new_with_path(identifier: string | null, schema_id: string | null, path: string | null): Settings
    _init(config?: Settings.ConstructorProperties): void
    static resolve_schema_path(schema_id_prefix: string | null, schema_id: string | null, identifier: string | null, path_prefix: string | null, path_suffix: string | null): string | null
}

export module Statusbar {
    export interface ConstructorProperties extends Gtk.Accessible.ConstructorProperties, Gtk.Buildable.ConstructorProperties, Gtk.ConstraintTarget.ConstructorProperties, Gtk.Widget.ConstructorProperties {
    }

}

export interface Statusbar extends Gtk.Accessible, Gtk.Buildable, Gtk.ConstraintTarget {
    /**
     * Adds a widget into the prefix with `priority`. The higher the
     * priority the closer to the start the widget will be added.
     * @param priority the priority
     * @param widget a #GtkWidget to add.
     */
    add_prefix(priority: number, widget: Gtk.Widget): void
    /**
     * Adds a widget into the suffix with `priority`. The higher the
     * priority the closer to the start the widget will be added.
     * @param priority the priority
     * @param widget a #GtkWidget to add.
     */
    add_suffix(priority: number, widget: Gtk.Widget): void
    /**
     * Removes `widget` from the #PanelStatusbar.
     * @param widget a #GtkWidget to remove.
     */
    remove(widget: Gtk.Widget): void
    connect(sigName: "notify::can-focus", callback: (($obj: Statusbar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::can-focus", callback: (($obj: Statusbar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::can-focus", ...args: any[]): void
    connect(sigName: "notify::can-target", callback: (($obj: Statusbar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::can-target", callback: (($obj: Statusbar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::can-target", ...args: any[]): void
    connect(sigName: "notify::css-classes", callback: (($obj: Statusbar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::css-classes", callback: (($obj: Statusbar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::css-classes", ...args: any[]): void
    connect(sigName: "notify::css-name", callback: (($obj: Statusbar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::css-name", callback: (($obj: Statusbar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::css-name", ...args: any[]): void
    connect(sigName: "notify::cursor", callback: (($obj: Statusbar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::cursor", callback: (($obj: Statusbar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::cursor", ...args: any[]): void
    connect(sigName: "notify::focus-on-click", callback: (($obj: Statusbar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::focus-on-click", callback: (($obj: Statusbar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::focus-on-click", ...args: any[]): void
    connect(sigName: "notify::focusable", callback: (($obj: Statusbar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::focusable", callback: (($obj: Statusbar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::focusable", ...args: any[]): void
    connect(sigName: "notify::halign", callback: (($obj: Statusbar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::halign", callback: (($obj: Statusbar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::halign", ...args: any[]): void
    connect(sigName: "notify::has-default", callback: (($obj: Statusbar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::has-default", callback: (($obj: Statusbar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::has-default", ...args: any[]): void
    connect(sigName: "notify::has-focus", callback: (($obj: Statusbar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::has-focus", callback: (($obj: Statusbar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::has-focus", ...args: any[]): void
    connect(sigName: "notify::has-tooltip", callback: (($obj: Statusbar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::has-tooltip", callback: (($obj: Statusbar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::has-tooltip", ...args: any[]): void
    connect(sigName: "notify::height-request", callback: (($obj: Statusbar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::height-request", callback: (($obj: Statusbar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::height-request", ...args: any[]): void
    connect(sigName: "notify::hexpand", callback: (($obj: Statusbar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::hexpand", callback: (($obj: Statusbar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::hexpand", ...args: any[]): void
    connect(sigName: "notify::hexpand-set", callback: (($obj: Statusbar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::hexpand-set", callback: (($obj: Statusbar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::hexpand-set", ...args: any[]): void
    connect(sigName: "notify::layout-manager", callback: (($obj: Statusbar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::layout-manager", callback: (($obj: Statusbar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::layout-manager", ...args: any[]): void
    connect(sigName: "notify::margin-bottom", callback: (($obj: Statusbar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::margin-bottom", callback: (($obj: Statusbar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::margin-bottom", ...args: any[]): void
    connect(sigName: "notify::margin-end", callback: (($obj: Statusbar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::margin-end", callback: (($obj: Statusbar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::margin-end", ...args: any[]): void
    connect(sigName: "notify::margin-start", callback: (($obj: Statusbar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::margin-start", callback: (($obj: Statusbar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::margin-start", ...args: any[]): void
    connect(sigName: "notify::margin-top", callback: (($obj: Statusbar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::margin-top", callback: (($obj: Statusbar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::margin-top", ...args: any[]): void
    connect(sigName: "notify::name", callback: (($obj: Statusbar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::name", callback: (($obj: Statusbar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::name", ...args: any[]): void
    connect(sigName: "notify::opacity", callback: (($obj: Statusbar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::opacity", callback: (($obj: Statusbar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::opacity", ...args: any[]): void
    connect(sigName: "notify::overflow", callback: (($obj: Statusbar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::overflow", callback: (($obj: Statusbar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::overflow", ...args: any[]): void
    connect(sigName: "notify::parent", callback: (($obj: Statusbar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::parent", callback: (($obj: Statusbar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::parent", ...args: any[]): void
    connect(sigName: "notify::receives-default", callback: (($obj: Statusbar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::receives-default", callback: (($obj: Statusbar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::receives-default", ...args: any[]): void
    connect(sigName: "notify::root", callback: (($obj: Statusbar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::root", callback: (($obj: Statusbar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::root", ...args: any[]): void
    connect(sigName: "notify::scale-factor", callback: (($obj: Statusbar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::scale-factor", callback: (($obj: Statusbar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::scale-factor", ...args: any[]): void
    connect(sigName: "notify::sensitive", callback: (($obj: Statusbar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::sensitive", callback: (($obj: Statusbar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::sensitive", ...args: any[]): void
    connect(sigName: "notify::tooltip-markup", callback: (($obj: Statusbar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::tooltip-markup", callback: (($obj: Statusbar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::tooltip-markup", ...args: any[]): void
    connect(sigName: "notify::tooltip-text", callback: (($obj: Statusbar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::tooltip-text", callback: (($obj: Statusbar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::tooltip-text", ...args: any[]): void
    connect(sigName: "notify::valign", callback: (($obj: Statusbar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::valign", callback: (($obj: Statusbar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::valign", ...args: any[]): void
    connect(sigName: "notify::vexpand", callback: (($obj: Statusbar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::vexpand", callback: (($obj: Statusbar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::vexpand", ...args: any[]): void
    connect(sigName: "notify::vexpand-set", callback: (($obj: Statusbar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::vexpand-set", callback: (($obj: Statusbar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::vexpand-set", ...args: any[]): void
    connect(sigName: "notify::visible", callback: (($obj: Statusbar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::visible", callback: (($obj: Statusbar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::visible", ...args: any[]): void
    connect(sigName: "notify::width-request", callback: (($obj: Statusbar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::width-request", callback: (($obj: Statusbar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::width-request", ...args: any[]): void
    connect(sigName: "notify::accessible-role", callback: (($obj: Statusbar, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::accessible-role", callback: (($obj: Statusbar, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::accessible-role", ...args: any[]): void
    connect(sigName: string, callback: (...args: any[]) => void): number
    connect_after(sigName: string, callback: (...args: any[]) => void): number
    emit(sigName: string, ...args: any[]): void
    disconnect(id: number): void
}

/**
 * A panel status bar is meant to be displayed at the bottom of the
 * window. It can contain widgets in the prefix and in the suffix.
 * @class 
 */
export class Statusbar extends Gtk.Widget {
    static name: string
    static $gtype: GObject.GType<Statusbar>
    constructor(config?: Statusbar.ConstructorProperties) 
    /**
     * Create a new #PanelStatusbar.
     * @constructor 
     * @returns a newly created #PanelStatusBar.
     */
    constructor() 
    /**
     * Create a new #PanelStatusbar.
     * @constructor 
     * @returns a newly created #PanelStatusBar.
     */
    static new(): Statusbar
    _init(config?: Statusbar.ConstructorProperties): void
}

export module ThemeSelector {
    export interface ConstructorProperties extends Gtk.Accessible.ConstructorProperties, Gtk.Buildable.ConstructorProperties, Gtk.ConstraintTarget.ConstructorProperties, Gtk.Widget.ConstructorProperties {
        /**
         * The name of the action activated on activation.
         */
        action_name?: string | null
    }

}

export interface ThemeSelector extends Gtk.Accessible, Gtk.Buildable, Gtk.ConstraintTarget {
    /**
     * The name of the action activated on activation.
     */
    action_name: string | null
    /**
     * Gets the name of the action that will be activated.
     * @returns the name of the action.
     */
    get_action_name(): string | null
    /**
     * Sets the name of the action that will be activated.
     * @param action_name the action name.
     */
    set_action_name(action_name: string | null): void
    connect(sigName: "notify::action-name", callback: (($obj: ThemeSelector, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::action-name", callback: (($obj: ThemeSelector, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::action-name", ...args: any[]): void
    connect(sigName: "notify::can-focus", callback: (($obj: ThemeSelector, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::can-focus", callback: (($obj: ThemeSelector, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::can-focus", ...args: any[]): void
    connect(sigName: "notify::can-target", callback: (($obj: ThemeSelector, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::can-target", callback: (($obj: ThemeSelector, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::can-target", ...args: any[]): void
    connect(sigName: "notify::css-classes", callback: (($obj: ThemeSelector, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::css-classes", callback: (($obj: ThemeSelector, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::css-classes", ...args: any[]): void
    connect(sigName: "notify::css-name", callback: (($obj: ThemeSelector, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::css-name", callback: (($obj: ThemeSelector, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::css-name", ...args: any[]): void
    connect(sigName: "notify::cursor", callback: (($obj: ThemeSelector, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::cursor", callback: (($obj: ThemeSelector, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::cursor", ...args: any[]): void
    connect(sigName: "notify::focus-on-click", callback: (($obj: ThemeSelector, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::focus-on-click", callback: (($obj: ThemeSelector, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::focus-on-click", ...args: any[]): void
    connect(sigName: "notify::focusable", callback: (($obj: ThemeSelector, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::focusable", callback: (($obj: ThemeSelector, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::focusable", ...args: any[]): void
    connect(sigName: "notify::halign", callback: (($obj: ThemeSelector, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::halign", callback: (($obj: ThemeSelector, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::halign", ...args: any[]): void
    connect(sigName: "notify::has-default", callback: (($obj: ThemeSelector, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::has-default", callback: (($obj: ThemeSelector, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::has-default", ...args: any[]): void
    connect(sigName: "notify::has-focus", callback: (($obj: ThemeSelector, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::has-focus", callback: (($obj: ThemeSelector, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::has-focus", ...args: any[]): void
    connect(sigName: "notify::has-tooltip", callback: (($obj: ThemeSelector, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::has-tooltip", callback: (($obj: ThemeSelector, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::has-tooltip", ...args: any[]): void
    connect(sigName: "notify::height-request", callback: (($obj: ThemeSelector, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::height-request", callback: (($obj: ThemeSelector, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::height-request", ...args: any[]): void
    connect(sigName: "notify::hexpand", callback: (($obj: ThemeSelector, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::hexpand", callback: (($obj: ThemeSelector, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::hexpand", ...args: any[]): void
    connect(sigName: "notify::hexpand-set", callback: (($obj: ThemeSelector, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::hexpand-set", callback: (($obj: ThemeSelector, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::hexpand-set", ...args: any[]): void
    connect(sigName: "notify::layout-manager", callback: (($obj: ThemeSelector, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::layout-manager", callback: (($obj: ThemeSelector, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::layout-manager", ...args: any[]): void
    connect(sigName: "notify::margin-bottom", callback: (($obj: ThemeSelector, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::margin-bottom", callback: (($obj: ThemeSelector, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::margin-bottom", ...args: any[]): void
    connect(sigName: "notify::margin-end", callback: (($obj: ThemeSelector, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::margin-end", callback: (($obj: ThemeSelector, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::margin-end", ...args: any[]): void
    connect(sigName: "notify::margin-start", callback: (($obj: ThemeSelector, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::margin-start", callback: (($obj: ThemeSelector, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::margin-start", ...args: any[]): void
    connect(sigName: "notify::margin-top", callback: (($obj: ThemeSelector, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::margin-top", callback: (($obj: ThemeSelector, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::margin-top", ...args: any[]): void
    connect(sigName: "notify::name", callback: (($obj: ThemeSelector, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::name", callback: (($obj: ThemeSelector, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::name", ...args: any[]): void
    connect(sigName: "notify::opacity", callback: (($obj: ThemeSelector, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::opacity", callback: (($obj: ThemeSelector, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::opacity", ...args: any[]): void
    connect(sigName: "notify::overflow", callback: (($obj: ThemeSelector, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::overflow", callback: (($obj: ThemeSelector, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::overflow", ...args: any[]): void
    connect(sigName: "notify::parent", callback: (($obj: ThemeSelector, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::parent", callback: (($obj: ThemeSelector, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::parent", ...args: any[]): void
    connect(sigName: "notify::receives-default", callback: (($obj: ThemeSelector, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::receives-default", callback: (($obj: ThemeSelector, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::receives-default", ...args: any[]): void
    connect(sigName: "notify::root", callback: (($obj: ThemeSelector, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::root", callback: (($obj: ThemeSelector, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::root", ...args: any[]): void
    connect(sigName: "notify::scale-factor", callback: (($obj: ThemeSelector, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::scale-factor", callback: (($obj: ThemeSelector, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::scale-factor", ...args: any[]): void
    connect(sigName: "notify::sensitive", callback: (($obj: ThemeSelector, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::sensitive", callback: (($obj: ThemeSelector, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::sensitive", ...args: any[]): void
    connect(sigName: "notify::tooltip-markup", callback: (($obj: ThemeSelector, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::tooltip-markup", callback: (($obj: ThemeSelector, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::tooltip-markup", ...args: any[]): void
    connect(sigName: "notify::tooltip-text", callback: (($obj: ThemeSelector, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::tooltip-text", callback: (($obj: ThemeSelector, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::tooltip-text", ...args: any[]): void
    connect(sigName: "notify::valign", callback: (($obj: ThemeSelector, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::valign", callback: (($obj: ThemeSelector, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::valign", ...args: any[]): void
    connect(sigName: "notify::vexpand", callback: (($obj: ThemeSelector, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::vexpand", callback: (($obj: ThemeSelector, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::vexpand", ...args: any[]): void
    connect(sigName: "notify::vexpand-set", callback: (($obj: ThemeSelector, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::vexpand-set", callback: (($obj: ThemeSelector, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::vexpand-set", ...args: any[]): void
    connect(sigName: "notify::visible", callback: (($obj: ThemeSelector, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::visible", callback: (($obj: ThemeSelector, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::visible", ...args: any[]): void
    connect(sigName: "notify::width-request", callback: (($obj: ThemeSelector, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::width-request", callback: (($obj: ThemeSelector, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::width-request", ...args: any[]): void
    connect(sigName: "notify::accessible-role", callback: (($obj: ThemeSelector, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::accessible-role", callback: (($obj: ThemeSelector, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::accessible-role", ...args: any[]): void
    connect(sigName: string, callback: (...args: any[]) => void): number
    connect_after(sigName: string, callback: (...args: any[]) => void): number
    emit(sigName: string, ...args: any[]): void
    disconnect(id: number): void
}

/**
 * A widget that allow selecting theme preference between "dark",
 * "light" and "follow" the system preference.
 * 
 * <picture>
 *   <source srcset="theme-selector-dark.png" media="(prefers-color-scheme: dark)">
 *   <img src="theme-selector.png" alt="theme-selector">
 * </picture>
 * 
 * Upon activation it will activate the named action in
 * #PanelThemeSelector:action-name.
 * @class 
 */
export class ThemeSelector extends Gtk.Widget {
    static name: string
    static $gtype: GObject.GType<ThemeSelector>
    constructor(config?: ThemeSelector.ConstructorProperties) 
    /**
     * Create a new #ThemeSelector.
     * @constructor 
     * @returns a newly created #PanelThemeSelector.
     */
    constructor() 
    /**
     * Create a new #ThemeSelector.
     * @constructor 
     * @returns a newly created #PanelThemeSelector.
     */
    static new(): ThemeSelector
    _init(config?: ThemeSelector.ConstructorProperties): void
}

export module ToggleButton {
    export interface ConstructorProperties extends Gtk.Accessible.ConstructorProperties, Gtk.Buildable.ConstructorProperties, Gtk.ConstraintTarget.ConstructorProperties, Gtk.Widget.ConstructorProperties {
        /**
         * The area this button will reveal.
         */
        area?: Area | null
        /**
         * The associated #PanelDock
         */
        dock?: Dock | null
    }

}

export interface ToggleButton extends Gtk.Accessible, Gtk.Buildable, Gtk.ConstraintTarget {
    /**
     * The area this button will reveal.
     */
    readonly area: Area
    /**
     * The associated #PanelDock
     */
    dock: Dock
    connect(sigName: "notify::area", callback: (($obj: ToggleButton, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::area", callback: (($obj: ToggleButton, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::area", ...args: any[]): void
    connect(sigName: "notify::dock", callback: (($obj: ToggleButton, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::dock", callback: (($obj: ToggleButton, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::dock", ...args: any[]): void
    connect(sigName: "notify::can-focus", callback: (($obj: ToggleButton, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::can-focus", callback: (($obj: ToggleButton, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::can-focus", ...args: any[]): void
    connect(sigName: "notify::can-target", callback: (($obj: ToggleButton, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::can-target", callback: (($obj: ToggleButton, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::can-target", ...args: any[]): void
    connect(sigName: "notify::css-classes", callback: (($obj: ToggleButton, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::css-classes", callback: (($obj: ToggleButton, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::css-classes", ...args: any[]): void
    connect(sigName: "notify::css-name", callback: (($obj: ToggleButton, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::css-name", callback: (($obj: ToggleButton, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::css-name", ...args: any[]): void
    connect(sigName: "notify::cursor", callback: (($obj: ToggleButton, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::cursor", callback: (($obj: ToggleButton, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::cursor", ...args: any[]): void
    connect(sigName: "notify::focus-on-click", callback: (($obj: ToggleButton, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::focus-on-click", callback: (($obj: ToggleButton, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::focus-on-click", ...args: any[]): void
    connect(sigName: "notify::focusable", callback: (($obj: ToggleButton, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::focusable", callback: (($obj: ToggleButton, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::focusable", ...args: any[]): void
    connect(sigName: "notify::halign", callback: (($obj: ToggleButton, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::halign", callback: (($obj: ToggleButton, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::halign", ...args: any[]): void
    connect(sigName: "notify::has-default", callback: (($obj: ToggleButton, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::has-default", callback: (($obj: ToggleButton, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::has-default", ...args: any[]): void
    connect(sigName: "notify::has-focus", callback: (($obj: ToggleButton, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::has-focus", callback: (($obj: ToggleButton, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::has-focus", ...args: any[]): void
    connect(sigName: "notify::has-tooltip", callback: (($obj: ToggleButton, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::has-tooltip", callback: (($obj: ToggleButton, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::has-tooltip", ...args: any[]): void
    connect(sigName: "notify::height-request", callback: (($obj: ToggleButton, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::height-request", callback: (($obj: ToggleButton, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::height-request", ...args: any[]): void
    connect(sigName: "notify::hexpand", callback: (($obj: ToggleButton, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::hexpand", callback: (($obj: ToggleButton, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::hexpand", ...args: any[]): void
    connect(sigName: "notify::hexpand-set", callback: (($obj: ToggleButton, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::hexpand-set", callback: (($obj: ToggleButton, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::hexpand-set", ...args: any[]): void
    connect(sigName: "notify::layout-manager", callback: (($obj: ToggleButton, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::layout-manager", callback: (($obj: ToggleButton, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::layout-manager", ...args: any[]): void
    connect(sigName: "notify::margin-bottom", callback: (($obj: ToggleButton, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::margin-bottom", callback: (($obj: ToggleButton, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::margin-bottom", ...args: any[]): void
    connect(sigName: "notify::margin-end", callback: (($obj: ToggleButton, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::margin-end", callback: (($obj: ToggleButton, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::margin-end", ...args: any[]): void
    connect(sigName: "notify::margin-start", callback: (($obj: ToggleButton, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::margin-start", callback: (($obj: ToggleButton, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::margin-start", ...args: any[]): void
    connect(sigName: "notify::margin-top", callback: (($obj: ToggleButton, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::margin-top", callback: (($obj: ToggleButton, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::margin-top", ...args: any[]): void
    connect(sigName: "notify::name", callback: (($obj: ToggleButton, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::name", callback: (($obj: ToggleButton, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::name", ...args: any[]): void
    connect(sigName: "notify::opacity", callback: (($obj: ToggleButton, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::opacity", callback: (($obj: ToggleButton, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::opacity", ...args: any[]): void
    connect(sigName: "notify::overflow", callback: (($obj: ToggleButton, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::overflow", callback: (($obj: ToggleButton, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::overflow", ...args: any[]): void
    connect(sigName: "notify::parent", callback: (($obj: ToggleButton, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::parent", callback: (($obj: ToggleButton, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::parent", ...args: any[]): void
    connect(sigName: "notify::receives-default", callback: (($obj: ToggleButton, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::receives-default", callback: (($obj: ToggleButton, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::receives-default", ...args: any[]): void
    connect(sigName: "notify::root", callback: (($obj: ToggleButton, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::root", callback: (($obj: ToggleButton, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::root", ...args: any[]): void
    connect(sigName: "notify::scale-factor", callback: (($obj: ToggleButton, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::scale-factor", callback: (($obj: ToggleButton, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::scale-factor", ...args: any[]): void
    connect(sigName: "notify::sensitive", callback: (($obj: ToggleButton, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::sensitive", callback: (($obj: ToggleButton, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::sensitive", ...args: any[]): void
    connect(sigName: "notify::tooltip-markup", callback: (($obj: ToggleButton, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::tooltip-markup", callback: (($obj: ToggleButton, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::tooltip-markup", ...args: any[]): void
    connect(sigName: "notify::tooltip-text", callback: (($obj: ToggleButton, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::tooltip-text", callback: (($obj: ToggleButton, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::tooltip-text", ...args: any[]): void
    connect(sigName: "notify::valign", callback: (($obj: ToggleButton, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::valign", callback: (($obj: ToggleButton, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::valign", ...args: any[]): void
    connect(sigName: "notify::vexpand", callback: (($obj: ToggleButton, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::vexpand", callback: (($obj: ToggleButton, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::vexpand", ...args: any[]): void
    connect(sigName: "notify::vexpand-set", callback: (($obj: ToggleButton, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::vexpand-set", callback: (($obj: ToggleButton, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::vexpand-set", ...args: any[]): void
    connect(sigName: "notify::visible", callback: (($obj: ToggleButton, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::visible", callback: (($obj: ToggleButton, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::visible", ...args: any[]): void
    connect(sigName: "notify::width-request", callback: (($obj: ToggleButton, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::width-request", callback: (($obj: ToggleButton, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::width-request", ...args: any[]): void
    connect(sigName: "notify::accessible-role", callback: (($obj: ToggleButton, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::accessible-role", callback: (($obj: ToggleButton, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::accessible-role", ...args: any[]): void
    connect(sigName: string, callback: (...args: any[]) => void): number
    connect_after(sigName: string, callback: (...args: any[]) => void): number
    emit(sigName: string, ...args: any[]): void
    disconnect(id: number): void
}

/**
 * The `PanelToggleButton` is a button used to toggle the visibility
 * of a [class`PanelDock]` area.
 * 
 * <picture>
 *   <source srcset="toggle-button-dark.png" media="(prefers-color-scheme: dark)">
 *   <img src="toggle-button.png" alt="toggle-button">
 * </picture>
 * 
 * It will automatically reveal or unreveal the specified area from
 * #PanelToggleButton:dock.
 * @class 
 */
export class ToggleButton extends Gtk.Widget {
    static name: string
    static $gtype: GObject.GType<ToggleButton>
    constructor(config?: ToggleButton.ConstructorProperties) 
    /**
     * Creates a new #PanelToggleButton to hide the `dock` in the `area`.
     * @constructor 
     * @param dock #PanelDock the panel to control
     * @param area #PanelArea the panel area. A value of   [const`PanelArea`.PANEL_AREA_CENTER] invalid.
     * @returns a newly created #PanelToggleButton
     */
    constructor(dock: Dock, area: Area) 
    /**
     * Creates a new #PanelToggleButton to hide the `dock` in the `area`.
     * @constructor 
     * @param dock #PanelDock the panel to control
     * @param area #PanelArea the panel area. A value of   [const`PanelArea`.PANEL_AREA_CENTER] invalid.
     * @returns a newly created #PanelToggleButton
     */
    static new(dock: Dock, area: Area): ToggleButton
    _init(config?: ToggleButton.ConstructorProperties): void
}

export module Widget {
    /**
     * Signal callback interface for `get-default-focus`
     */
    export interface GetDefaultFocusSignalCallback {
        ($obj: Widget): Gtk.Widget | null
    }

    /**
     * Signal callback interface for `presented`
     */
    export interface PresentedSignalCallback {
        ($obj: Widget): void
    }

    export interface ConstructorProperties extends Gtk.Accessible.ConstructorProperties, Gtk.Buildable.ConstructorProperties, Gtk.ConstraintTarget.ConstructorProperties, Gtk.Widget.ConstructorProperties {
        can_maximize?: boolean | null
        /**
         * The child inside this widget.
         */
        child?: Gtk.Widget | null
        /**
         * The icon for this widget.
         */
        icon?: Gio.Icon | null
        /**
         * The icon name for this widget.
         */
        icon_name?: string | null
        id?: string | null
        kind?: string | null
        /**
         * A menu model to display additional options for the page to the user via
         * menus.
         */
        menu_model?: Gio.MenuModel | null
        modified?: boolean | null
        needs_attention?: boolean | null
        reorderable?: boolean | null
        /**
         * The save delegate attached to this widget.
         */
        save_delegate?: SaveDelegate | null
        /**
         * The title for this widget.
         */
        title?: string | null
        /**
         * The tooltip to display in tabs for the widget.
         */
        tooltip?: string | null
    }

}

export interface Widget extends Gtk.Accessible, Gtk.Buildable, Gtk.ConstraintTarget {
    readonly busy: boolean
    can_maximize: boolean
    /**
     * The child inside this widget.
     */
    child: Gtk.Widget
    /**
     * The icon for this widget.
     */
    icon: Gio.Icon
    /**
     * The icon name for this widget.
     */
    icon_name: string | null
    id: string | null
    kind: string | null
    /**
     * A menu model to display additional options for the page to the user via
     * menus.
     */
    menu_model: Gio.MenuModel
    modified: boolean
    needs_attention: boolean
    reorderable: boolean
    /**
     * The save delegate attached to this widget.
     */
    save_delegate: SaveDelegate
    /**
     * The title for this widget.
     */
    title: string | null
    /**
     * The tooltip to display in tabs for the widget.
     */
    tooltip: string | null
    parent_instance: Gtk.Widget & GObject.InitiallyUnowned
    action_set_enabled(action_name: string | null, enabled: boolean): void
    close(): void
    focus_default(): boolean
    /**
     * Closes the widget without any save dialogs.
     */
    force_close(): void
    get_busy(): boolean
    get_can_maximize(): boolean
    /**
     * Gets the child widget of the panel.
     * @returns a #GtkWidget or %NULL
     */
    get_child(): Gtk.Widget | null
    /**
     * Discovers the widget that should be focused as the default widget
     * for the #PanelWidget.
     * 
     * For example, if you want to focus a text editor by default, you might
     * return the #GtkTextView inside your widgetry.
     * @returns the default widget to focus within   the #PanelWidget.
     */
    get_default_focus(): Gtk.Widget | null
    /**
     * Gets a #GIcon for the widget.
     * @returns a #GIcon or %NULL
     */
    get_icon(): Gio.Icon | null
    /**
     * Gets the icon name for the widget.
     * @returns the icon name or %NULL
     */
    get_icon_name(): string | null
    /**
     * Gets the id of the panel widget.
     * @returns The id of the panel widget.
     */
    get_id(): string | null
    get_kind(): string | null
    /**
     * Gets the #GMenuModel for the widget.
     * 
     * #PanelFrameHeader may use this model to display additional options
     * for the page to the user via menus.
     * @returns a #GMenuModel
     */
    get_menu_model(): Gio.MenuModel | null
    /**
     * Gets the modified status of a panel widget
     * @returns the modified status of the panel widget.
     */
    get_modified(): boolean
    get_needs_attention(): boolean
    /**
     * Gets teh position of the widget within the dock.
     * @returns a #PanelPosition or %NULL if the   widget isn't within a #PanelFrame.
     */
    get_position(): Position | null
    get_reorderable(): boolean
    /**
     * Gets the #PanelWidget:save-delegate property.
     * 
     * The save delegate may be used to perform save operations on the
     * content within the widget.
     * 
     * Document editors might use this to save the file to disk.
     * @returns a #PanelSaveDelegate or %NULL
     */
    get_save_delegate(): SaveDelegate | null
    /**
     * Gets the title for the widget.
     * @returns the title or %NULL
     */
    get_title(): string | null
    /**
     * Gets the tooltip for the widget.
     * @returns the tooltip or %NULL
     */
    get_tooltip(): string | null
    insert_action_group(prefix: string | null, group: Gio.ActionGroup): void
    /**
     * Inserts `group` into `widget`.
     * 
     * Children of `widget` that implement [iface`Gtk`.Actionable] can
     * then be associated with actions in `group` by setting their
     * “action-name” to `prefix`.`action-name`.
     * 
     * Note that inheritance is defined for individual actions. I.e.
     * even if you insert a group with prefix `prefix,` actions with
     * the same prefix will still be inherited from the parent, unless
     * the group contains an action with the same name.
     * 
     * If `group` is %NULL, a previously inserted group for `name` is
     * removed from `widget`.
     * @param name the prefix for actions in `group`
     * @param group a `GActionGroup`, or %NULL to remove   the previously inserted group for `name`
     */
    insert_action_group(name: string | null, group: Gio.ActionGroup | null): void
    mark_busy(): void
    maximize(): void
    raise(): void
    set_can_maximize(can_maximize: boolean): void
    /**
     * Sets the child widget of the panel.
     * @param child a #GtkWidget or %NULL
     */
    set_child(child: Gtk.Widget | null): void
    /**
     * Sets a #GIcon for the widget.
     * @param icon a #GIcon or %NULL
     */
    set_icon(icon: Gio.Icon | null): void
    /**
     * Sets the icon name for the widget.
     * @param icon_name the icon name or %NULL
     */
    set_icon_name(icon_name: string | null): void
    /**
     * Sets the id of the panel widget.
     * @param id the id to set for the panel widget.
     */
    set_id(id: string | null): void
    /**
     * Sets the kind of the widget.
     * @param kind the kind of this widget
     */
    set_kind(kind: string | null): void
    /**
     * Sets the #GMenuModel for the widget.
     * 
     * #PanelFrameHeader may use this model to display additional options
     * for the page to the user via menus.
     * @param menu_model a #GMenuModel
     */
    set_menu_model(menu_model: Gio.MenuModel | null): void
    /**
     * Sets the modified status of a panel widget.
     * @param modified the modified status
     */
    set_modified(modified: boolean): void
    set_needs_attention(needs_attention: boolean): void
    set_reorderable(reorderable: boolean): void
    /**
     * Sets the #PanelWidget:save-delegate property.
     * 
     * The save delegate may be used to perform save operations on the
     * content within the widget.
     * 
     * Document editors might use this to save the file to disk.
     * @param save_delegate a #PanelSaveDelegate or %NULL
     */
    set_save_delegate(save_delegate: SaveDelegate | null): void
    /**
     * Sets the title for the widget.
     * @param title the title or %NULL
     */
    set_title(title: string | null): void
    /**
     * Sets the tooltip for the widget to be displayed in tabs.
     * @param tooltip the tooltip or %NULL
     */
    set_tooltip(tooltip: string | null): void
    unmark_busy(): void
    unmaximize(): void
    /**
     * Discovers the widget that should be focused as the default widget
     * for the #PanelWidget.
     * 
     * For example, if you want to focus a text editor by default, you might
     * return the #GtkTextView inside your widgetry.
     * @virtual 
     * @returns the default widget to focus within   the #PanelWidget.
     */
    vfunc_get_default_focus(): Gtk.Widget | null
    vfunc_presented(): void
    connect(sigName: "get-default-focus", callback: Widget.GetDefaultFocusSignalCallback): number
    connect_after(sigName: "get-default-focus", callback: Widget.GetDefaultFocusSignalCallback): number
    emit(sigName: "get-default-focus", ...args: any[]): void
    connect(sigName: "presented", callback: Widget.PresentedSignalCallback): number
    connect_after(sigName: "presented", callback: Widget.PresentedSignalCallback): number
    emit(sigName: "presented", ...args: any[]): void
    connect(sigName: "notify::busy", callback: (($obj: Widget, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::busy", callback: (($obj: Widget, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::busy", ...args: any[]): void
    connect(sigName: "notify::can-maximize", callback: (($obj: Widget, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::can-maximize", callback: (($obj: Widget, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::can-maximize", ...args: any[]): void
    connect(sigName: "notify::child", callback: (($obj: Widget, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::child", callback: (($obj: Widget, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::child", ...args: any[]): void
    connect(sigName: "notify::icon", callback: (($obj: Widget, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::icon", callback: (($obj: Widget, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::icon", ...args: any[]): void
    connect(sigName: "notify::icon-name", callback: (($obj: Widget, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::icon-name", callback: (($obj: Widget, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::icon-name", ...args: any[]): void
    connect(sigName: "notify::id", callback: (($obj: Widget, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::id", callback: (($obj: Widget, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::id", ...args: any[]): void
    connect(sigName: "notify::kind", callback: (($obj: Widget, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::kind", callback: (($obj: Widget, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::kind", ...args: any[]): void
    connect(sigName: "notify::menu-model", callback: (($obj: Widget, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::menu-model", callback: (($obj: Widget, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::menu-model", ...args: any[]): void
    connect(sigName: "notify::modified", callback: (($obj: Widget, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::modified", callback: (($obj: Widget, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::modified", ...args: any[]): void
    connect(sigName: "notify::needs-attention", callback: (($obj: Widget, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::needs-attention", callback: (($obj: Widget, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::needs-attention", ...args: any[]): void
    connect(sigName: "notify::reorderable", callback: (($obj: Widget, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::reorderable", callback: (($obj: Widget, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::reorderable", ...args: any[]): void
    connect(sigName: "notify::save-delegate", callback: (($obj: Widget, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::save-delegate", callback: (($obj: Widget, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::save-delegate", ...args: any[]): void
    connect(sigName: "notify::title", callback: (($obj: Widget, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::title", callback: (($obj: Widget, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::title", ...args: any[]): void
    connect(sigName: "notify::tooltip", callback: (($obj: Widget, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::tooltip", callback: (($obj: Widget, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::tooltip", ...args: any[]): void
    connect(sigName: "notify::can-focus", callback: (($obj: Widget, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::can-focus", callback: (($obj: Widget, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::can-focus", ...args: any[]): void
    connect(sigName: "notify::can-target", callback: (($obj: Widget, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::can-target", callback: (($obj: Widget, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::can-target", ...args: any[]): void
    connect(sigName: "notify::css-classes", callback: (($obj: Widget, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::css-classes", callback: (($obj: Widget, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::css-classes", ...args: any[]): void
    connect(sigName: "notify::css-name", callback: (($obj: Widget, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::css-name", callback: (($obj: Widget, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::css-name", ...args: any[]): void
    connect(sigName: "notify::cursor", callback: (($obj: Widget, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::cursor", callback: (($obj: Widget, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::cursor", ...args: any[]): void
    connect(sigName: "notify::focus-on-click", callback: (($obj: Widget, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::focus-on-click", callback: (($obj: Widget, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::focus-on-click", ...args: any[]): void
    connect(sigName: "notify::focusable", callback: (($obj: Widget, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::focusable", callback: (($obj: Widget, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::focusable", ...args: any[]): void
    connect(sigName: "notify::halign", callback: (($obj: Widget, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::halign", callback: (($obj: Widget, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::halign", ...args: any[]): void
    connect(sigName: "notify::has-default", callback: (($obj: Widget, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::has-default", callback: (($obj: Widget, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::has-default", ...args: any[]): void
    connect(sigName: "notify::has-focus", callback: (($obj: Widget, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::has-focus", callback: (($obj: Widget, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::has-focus", ...args: any[]): void
    connect(sigName: "notify::has-tooltip", callback: (($obj: Widget, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::has-tooltip", callback: (($obj: Widget, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::has-tooltip", ...args: any[]): void
    connect(sigName: "notify::height-request", callback: (($obj: Widget, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::height-request", callback: (($obj: Widget, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::height-request", ...args: any[]): void
    connect(sigName: "notify::hexpand", callback: (($obj: Widget, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::hexpand", callback: (($obj: Widget, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::hexpand", ...args: any[]): void
    connect(sigName: "notify::hexpand-set", callback: (($obj: Widget, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::hexpand-set", callback: (($obj: Widget, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::hexpand-set", ...args: any[]): void
    connect(sigName: "notify::layout-manager", callback: (($obj: Widget, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::layout-manager", callback: (($obj: Widget, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::layout-manager", ...args: any[]): void
    connect(sigName: "notify::margin-bottom", callback: (($obj: Widget, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::margin-bottom", callback: (($obj: Widget, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::margin-bottom", ...args: any[]): void
    connect(sigName: "notify::margin-end", callback: (($obj: Widget, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::margin-end", callback: (($obj: Widget, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::margin-end", ...args: any[]): void
    connect(sigName: "notify::margin-start", callback: (($obj: Widget, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::margin-start", callback: (($obj: Widget, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::margin-start", ...args: any[]): void
    connect(sigName: "notify::margin-top", callback: (($obj: Widget, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::margin-top", callback: (($obj: Widget, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::margin-top", ...args: any[]): void
    connect(sigName: "notify::name", callback: (($obj: Widget, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::name", callback: (($obj: Widget, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::name", ...args: any[]): void
    connect(sigName: "notify::opacity", callback: (($obj: Widget, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::opacity", callback: (($obj: Widget, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::opacity", ...args: any[]): void
    connect(sigName: "notify::overflow", callback: (($obj: Widget, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::overflow", callback: (($obj: Widget, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::overflow", ...args: any[]): void
    connect(sigName: "notify::parent", callback: (($obj: Widget, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::parent", callback: (($obj: Widget, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::parent", ...args: any[]): void
    connect(sigName: "notify::receives-default", callback: (($obj: Widget, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::receives-default", callback: (($obj: Widget, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::receives-default", ...args: any[]): void
    connect(sigName: "notify::root", callback: (($obj: Widget, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::root", callback: (($obj: Widget, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::root", ...args: any[]): void
    connect(sigName: "notify::scale-factor", callback: (($obj: Widget, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::scale-factor", callback: (($obj: Widget, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::scale-factor", ...args: any[]): void
    connect(sigName: "notify::sensitive", callback: (($obj: Widget, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::sensitive", callback: (($obj: Widget, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::sensitive", ...args: any[]): void
    connect(sigName: "notify::tooltip-markup", callback: (($obj: Widget, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::tooltip-markup", callback: (($obj: Widget, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::tooltip-markup", ...args: any[]): void
    connect(sigName: "notify::tooltip-text", callback: (($obj: Widget, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::tooltip-text", callback: (($obj: Widget, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::tooltip-text", ...args: any[]): void
    connect(sigName: "notify::valign", callback: (($obj: Widget, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::valign", callback: (($obj: Widget, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::valign", ...args: any[]): void
    connect(sigName: "notify::vexpand", callback: (($obj: Widget, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::vexpand", callback: (($obj: Widget, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::vexpand", ...args: any[]): void
    connect(sigName: "notify::vexpand-set", callback: (($obj: Widget, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::vexpand-set", callback: (($obj: Widget, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::vexpand-set", ...args: any[]): void
    connect(sigName: "notify::visible", callback: (($obj: Widget, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::visible", callback: (($obj: Widget, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::visible", ...args: any[]): void
    connect(sigName: "notify::width-request", callback: (($obj: Widget, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::width-request", callback: (($obj: Widget, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::width-request", ...args: any[]): void
    connect(sigName: "notify::accessible-role", callback: (($obj: Widget, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::accessible-role", callback: (($obj: Widget, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::accessible-role", ...args: any[]): void
    connect(sigName: string, callback: (...args: any[]) => void): number
    connect_after(sigName: string, callback: (...args: any[]) => void): number
    emit(sigName: string, ...args: any[]): void
    disconnect(id: number): void
}

/**
 * PanelWidget is the base widget class for widgets added to a
 * #PanelFrame. It can be use as-is or you can subclass it.
 * @class 
 */
export class Widget extends Gtk.Widget {
    static name: string
    static $gtype: GObject.GType<Widget>
    constructor(config?: Widget.ConstructorProperties) 
    /**
     * Create a new #PanelWidget.
     * @constructor 
     * @returns a newly created #PanelWidget
     */
    constructor() 
    /**
     * Create a new #PanelWidget.
     * @constructor 
     * @returns a newly created #PanelWidget
     */
    static new(): Widget
    _init(config?: Widget.ConstructorProperties): void
    /**
     * This should be called at class initialization time to specify
     * actions to be added for all instances of this class.
     * 
     * Actions installed by this function are stateless. The only state
     * they have is whether they are enabled or not.
     * @param action_name a prefixed action name, such as "clipboard.paste"
     * @param parameter_type the parameter type
     * @param activate callback to use when the action is activated
     */
    static install_action(widget_class: Widget | Function | GObject.GType, action_name: string | null, parameter_type: string | null, activate: Gtk.WidgetActionActivateFunc): void
    /**
     * Installs an action called `action_name` on `widget_class` and
     * binds its state to the value of the `property_name` property.
     * 
     * This function will perform a few santity checks on the property selected
     * via `property_name`. Namely, the property must exist, must be readable,
     * writable and must not be construct-only. There are also restrictions
     * on the type of the given property, it must be boolean, int, unsigned int,
     * double or string. If any of these conditions are not met, a critical
     * warning will be printed and no action will be added.
     * 
     * The state type of the action matches the property type.
     * 
     * If the property is boolean, the action will have no parameter and
     * toggle the property value. Otherwise, the action will have a parameter
     * of the same type as the property.
     * @param action_name name of the action
     * @param property_name name of the property in instances of `widget_class`   or any parent class.
     */
    static install_property_action(widget_class: Widget | Function | GObject.GType, action_name: string | null, property_name: string | null): void
}

export module Workbench {
    /**
     * Signal callback interface for `activate`
     */
    export interface ActivateSignalCallback {
        ($obj: Workbench): void
    }

    export interface ConstructorProperties extends Gtk.WindowGroup.ConstructorProperties {
        /**
         * The "id" of the workbench.
         * 
         * This is generally used by applications to help destinguish between
         * projects, so that the project-id matches the workbench-id.
         */
        id?: string | null
    }

}

export interface Workbench {
    /**
     * The "id" of the workbench.
     * 
     * This is generally used by applications to help destinguish between
     * projects, so that the project-id matches the workbench-id.
     */
    id: string | null
    parent_instance: Gtk.WindowGroup & GObject.Object
    action_set_enabled(action_name: string | null, enabled: boolean): void
    activate(): void
    add_workspace(workspace: Workspace): void
    /**
     * Locates a workspace in `self` with a type matching `type`.
     * @param workspace_type 
     * @returns a #PanelWorkspace or %NULL
     */
    find_workspace_typed(workspace_type: GObject.GType): Workspace | null
    focus_workspace(workspace: Workspace): void
    /**
     * Calls `foreach_func` for each workspace in the workbench.
     * @param foreach_func a function to call for each workspace
     */
    foreach_workspace(foreach_func: WorkspaceForeach): void
    get_id(): string | null
    remove_workspace(workspace: Workspace): void
    set_id(id: string | null): void
    vfunc_activate(): void
    vfunc_unload_async(cancellable: Gio.Cancellable | null, callback: Gio.AsyncReadyCallback<this> | null): void
    vfunc_unload_finish(result: Gio.AsyncResult): boolean
    connect(sigName: "activate", callback: Workbench.ActivateSignalCallback): number
    connect_after(sigName: "activate", callback: Workbench.ActivateSignalCallback): number
    emit(sigName: "activate", ...args: any[]): void
    connect(sigName: "notify::id", callback: (($obj: Workbench, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::id", callback: (($obj: Workbench, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::id", ...args: any[]): void
    connect(sigName: string, callback: (...args: any[]) => void): number
    connect_after(sigName: string, callback: (...args: any[]) => void): number
    emit(sigName: string, ...args: any[]): void
    disconnect(id: number): void
}

export class Workbench extends Gtk.WindowGroup {
    static name: string
    static $gtype: GObject.GType<Workbench>
    constructor(config?: Workbench.ConstructorProperties) 
    constructor() 
    static new(): Workbench
    /**
     * Creates a new `GtkWindowGroup` object.
     * 
     * Modality of windows only affects windows
     * within the same `GtkWindowGroup`.
     * @constructor 
     * @returns a new `GtkWindowGroup`.
     */
    static new(): Gtk.WindowGroup
    _init(config?: Workbench.ConstructorProperties): void
    /**
     * Finds the workbench that contains `widget`.
     * @param widget a #GtkWidget
     * @returns a #PanelWorkbench or %NULL
     */
    static find_from_widget(widget: Gtk.Widget): Workbench | null
    /**
     * This should be called at class initialization time to specify
     * actions to be added for all instances of this class.
     * 
     * Actions installed by this function are stateless. The only state
     * they have is whether they are enabled or not.
     * @param action_name a prefixed action name, such as "project.open"
     * @param parameter_type the parameter type
     * @param activate callback to use when the action is activated
     */
    static install_action(workbench_class: Workbench | Function | GObject.GType, action_name: string | null, parameter_type: string | null, activate: ActionActivateFunc): void
    /**
     * Installs an action called `action_name` on `workbench_class` and
     * binds its state to the value of the `property_name` property.
     * 
     * This function will perform a few santity checks on the property selected
     * via `property_name`. Namely, the property must exist, must be readable,
     * writable and must not be construct-only. There are also restrictions
     * on the type of the given property, it must be boolean, int, unsigned int,
     * double or string. If any of these conditions are not met, a critical
     * warning will be printed and no action will be added.
     * 
     * The state type of the action matches the property type.
     * 
     * If the property is boolean, the action will have no parameter and
     * toggle the property value. Otherwise, the action will have a parameter
     * of the same type as the property.
     * @param action_name name of the action
     * @param property_name name of the property in instances of `workbench_class`   or any parent class.
     */
    static install_property_action(workbench_class: Workbench | Function | GObject.GType, action_name: string | null, property_name: string | null): void
}

export module Workspace {
    export interface ConstructorProperties extends Gio.ActionGroup.ConstructorProperties, Gio.ActionMap.ConstructorProperties, Gtk.Accessible.ConstructorProperties, Gtk.Buildable.ConstructorProperties, Gtk.ConstraintTarget.ConstructorProperties, Gtk.Native.ConstructorProperties, Gtk.Root.ConstructorProperties, Gtk.ShortcutManager.ConstructorProperties, Adw.ApplicationWindow.ConstructorProperties {
        /**
         * The "id" of the workspace.
         * 
         * This is generally used by applications to help destinguish between
         * types of workspaces, particularly when saving session state.
         */
        id?: string | null
    }

}

export interface Workspace extends Gio.ActionGroup, Gio.ActionMap, Gtk.Accessible, Gtk.Buildable, Gtk.ConstraintTarget, Gtk.Native, Gtk.Root, Gtk.ShortcutManager {
    /**
     * The "id" of the workspace.
     * 
     * This is generally used by applications to help destinguish between
     * types of workspaces, particularly when saving session state.
     */
    id: string | null
    parent_instance: Adw.ApplicationWindow & Gtk.ApplicationWindow & Gtk.Window & Gtk.Widget & GObject.InitiallyUnowned
    action_set_enabled(action_name: string | null, enabled: boolean): void
    get_id(): string | null
    /**
     * Returns the unique ID of the window.
     * 
     *  If the window has not yet been added to a `GtkApplication`, returns `0`.
     * @returns the unique ID for @window, or `0` if the window   has not yet been added to a `GtkApplication`
     */
    get_id(): number
    /**
     * Gets the #PanelWorkbench `self` is a part of.
     * @returns a #PanelWorkbench, or %NULL
     */
    get_workbench(): Workbench | null
    /**
     * Inhibits one or more particular actions in the session.
     * 
     * When the resulting #PanelInhibitor releases it's last reference
     * the inhibitor will be dismissed. Alternatively, you may force the
     * release of the inhibit using panel_inhibitor_uninhibit().
     * @param flags the inhibit flags
     * @param reason the reason for the inhibit
     * @returns a #PanelInhibitor or %NULL
     */
    inhibit(flags: Gtk.ApplicationInhibitFlags, reason: string | null): Inhibitor | null
    set_id(id: string | null): void
    /**
     * Activate the named action within `action_group`.
     * 
     * If the action is expecting a parameter, then the correct type of
     * parameter must be given as `parameter`.  If the action is expecting no
     * parameters then `parameter` must be %NULL.  See
     * g_action_group_get_action_parameter_type().
     * 
     * If the #GActionGroup implementation supports asynchronous remote
     * activation over D-Bus, this call may return before the relevant
     * D-Bus traffic has been sent, or any replies have been received. In
     * order to block on such asynchronous activation calls,
     * g_dbus_connection_flush() should be called prior to the code, which
     * depends on the result of the action activation. Without flushing
     * the D-Bus connection, there is no guarantee that the action would
     * have been activated.
     * 
     * The following code which runs in a remote app instance, shows an
     * example of a "quit" action being activated on the primary app
     * instance over D-Bus. Here g_dbus_connection_flush() is called
     * before `exit()`. Without g_dbus_connection_flush(), the "quit" action
     * may fail to be activated on the primary instance.
     * 
     * 
     * ```c
     * // call "quit" action on primary instance
     * g_action_group_activate_action (G_ACTION_GROUP (app), "quit", NULL);
     * 
     * // make sure the action is activated now
     * g_dbus_connection_flush (...);
     * 
     * g_debug ("application has been terminated. exiting.");
     * 
     * exit (0);
     * ```
     * 
     * @param action_name the name of the action to activate
     * @param parameter parameters to the activation
     */
    activate_action(action_name: string | null, parameter: GLib.Variant | null): void
    /**
     * Looks up the action in the action groups associated with
     * `widget` and its ancestors, and activates it.
     * 
     * If the action is in an action group added with
     * [method`Gtk`.Widget.insert_action_group], the `name` is expected
     * to be prefixed with the prefix that was used when the group was
     * inserted.
     * 
     * The arguments must match the actions expected parameter type,
     * as returned by `g_action_get_parameter_type()`.
     * @param name the name of the action to activate
     * @param args parameters to use
     * @returns %TRUE if the action was activated, %FALSE if the   action does not exist.
     */
    activate_action(name: string | null, args: GLib.Variant | null): boolean
    connect(sigName: "notify::id", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::id", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::id", ...args: any[]): void
    connect(sigName: "notify::content", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::content", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::content", ...args: any[]): void
    connect(sigName: "notify::show-menubar", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::show-menubar", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::show-menubar", ...args: any[]): void
    connect(sigName: "notify::application", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::application", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::application", ...args: any[]): void
    connect(sigName: "notify::child", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::child", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::child", ...args: any[]): void
    connect(sigName: "notify::decorated", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::decorated", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::decorated", ...args: any[]): void
    connect(sigName: "notify::default-height", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::default-height", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::default-height", ...args: any[]): void
    connect(sigName: "notify::default-widget", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::default-widget", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::default-widget", ...args: any[]): void
    connect(sigName: "notify::default-width", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::default-width", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::default-width", ...args: any[]): void
    connect(sigName: "notify::deletable", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::deletable", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::deletable", ...args: any[]): void
    connect(sigName: "notify::destroy-with-parent", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::destroy-with-parent", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::destroy-with-parent", ...args: any[]): void
    connect(sigName: "notify::display", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::display", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::display", ...args: any[]): void
    connect(sigName: "notify::focus-visible", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::focus-visible", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::focus-visible", ...args: any[]): void
    connect(sigName: "notify::focus-widget", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::focus-widget", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::focus-widget", ...args: any[]): void
    connect(sigName: "notify::fullscreened", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::fullscreened", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::fullscreened", ...args: any[]): void
    connect(sigName: "notify::handle-menubar-accel", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::handle-menubar-accel", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::handle-menubar-accel", ...args: any[]): void
    connect(sigName: "notify::hide-on-close", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::hide-on-close", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::hide-on-close", ...args: any[]): void
    connect(sigName: "notify::icon-name", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::icon-name", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::icon-name", ...args: any[]): void
    connect(sigName: "notify::is-active", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::is-active", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::is-active", ...args: any[]): void
    connect(sigName: "notify::maximized", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::maximized", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::maximized", ...args: any[]): void
    connect(sigName: "notify::mnemonics-visible", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::mnemonics-visible", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::mnemonics-visible", ...args: any[]): void
    connect(sigName: "notify::modal", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::modal", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::modal", ...args: any[]): void
    connect(sigName: "notify::resizable", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::resizable", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::resizable", ...args: any[]): void
    connect(sigName: "notify::startup-id", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::startup-id", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::startup-id", ...args: any[]): void
    connect(sigName: "notify::title", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::title", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::title", ...args: any[]): void
    connect(sigName: "notify::titlebar", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::titlebar", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::titlebar", ...args: any[]): void
    connect(sigName: "notify::transient-for", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::transient-for", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::transient-for", ...args: any[]): void
    connect(sigName: "notify::can-focus", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::can-focus", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::can-focus", ...args: any[]): void
    connect(sigName: "notify::can-target", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::can-target", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::can-target", ...args: any[]): void
    connect(sigName: "notify::css-classes", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::css-classes", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::css-classes", ...args: any[]): void
    connect(sigName: "notify::css-name", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::css-name", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::css-name", ...args: any[]): void
    connect(sigName: "notify::cursor", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::cursor", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::cursor", ...args: any[]): void
    connect(sigName: "notify::focus-on-click", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::focus-on-click", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::focus-on-click", ...args: any[]): void
    connect(sigName: "notify::focusable", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::focusable", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::focusable", ...args: any[]): void
    connect(sigName: "notify::halign", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::halign", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::halign", ...args: any[]): void
    connect(sigName: "notify::has-default", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::has-default", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::has-default", ...args: any[]): void
    connect(sigName: "notify::has-focus", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::has-focus", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::has-focus", ...args: any[]): void
    connect(sigName: "notify::has-tooltip", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::has-tooltip", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::has-tooltip", ...args: any[]): void
    connect(sigName: "notify::height-request", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::height-request", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::height-request", ...args: any[]): void
    connect(sigName: "notify::hexpand", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::hexpand", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::hexpand", ...args: any[]): void
    connect(sigName: "notify::hexpand-set", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::hexpand-set", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::hexpand-set", ...args: any[]): void
    connect(sigName: "notify::layout-manager", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::layout-manager", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::layout-manager", ...args: any[]): void
    connect(sigName: "notify::margin-bottom", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::margin-bottom", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::margin-bottom", ...args: any[]): void
    connect(sigName: "notify::margin-end", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::margin-end", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::margin-end", ...args: any[]): void
    connect(sigName: "notify::margin-start", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::margin-start", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::margin-start", ...args: any[]): void
    connect(sigName: "notify::margin-top", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::margin-top", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::margin-top", ...args: any[]): void
    connect(sigName: "notify::name", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::name", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::name", ...args: any[]): void
    connect(sigName: "notify::opacity", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::opacity", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::opacity", ...args: any[]): void
    connect(sigName: "notify::overflow", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::overflow", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::overflow", ...args: any[]): void
    connect(sigName: "notify::parent", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::parent", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::parent", ...args: any[]): void
    connect(sigName: "notify::receives-default", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::receives-default", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::receives-default", ...args: any[]): void
    connect(sigName: "notify::root", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::root", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::root", ...args: any[]): void
    connect(sigName: "notify::scale-factor", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::scale-factor", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::scale-factor", ...args: any[]): void
    connect(sigName: "notify::sensitive", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::sensitive", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::sensitive", ...args: any[]): void
    connect(sigName: "notify::tooltip-markup", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::tooltip-markup", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::tooltip-markup", ...args: any[]): void
    connect(sigName: "notify::tooltip-text", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::tooltip-text", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::tooltip-text", ...args: any[]): void
    connect(sigName: "notify::valign", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::valign", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::valign", ...args: any[]): void
    connect(sigName: "notify::vexpand", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::vexpand", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::vexpand", ...args: any[]): void
    connect(sigName: "notify::vexpand-set", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::vexpand-set", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::vexpand-set", ...args: any[]): void
    connect(sigName: "notify::visible", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::visible", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::visible", ...args: any[]): void
    connect(sigName: "notify::width-request", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::width-request", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::width-request", ...args: any[]): void
    connect(sigName: "notify::accessible-role", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    connect_after(sigName: "notify::accessible-role", callback: (($obj: Workspace, pspec: GObject.ParamSpec) => void)): number
    emit(sigName: "notify::accessible-role", ...args: any[]): void
    connect(sigName: string, callback: (...args: any[]) => void): number
    connect_after(sigName: string, callback: (...args: any[]) => void): number
    emit(sigName: string, ...args: any[]): void
    disconnect(id: number): void
}

export class Workspace extends Adw.ApplicationWindow {
    static name: string
    static $gtype: GObject.GType<Workspace>
    constructor(config?: Workspace.ConstructorProperties) 
    _init(config?: Workspace.ConstructorProperties): void
    /**
     * Finds the workspace that contains `widget`.
     * @param widget a #GtkWidget
     * @returns a #PanelWorkspace or %NULL
     */
    static find_from_widget(widget: Gtk.Widget): Workspace | null
    /**
     * This should be called at class initialization time to specify
     * actions to be added for all instances of this class.
     * 
     * Actions installed by this function are stateless. The only state
     * they have is whether they are enabled or not.
     * @param action_name a prefixed action name, such as "project.open"
     * @param parameter_type the parameter type
     * @param activate callback to use when the action is activated
     */
    static install_action(workspace_class: Workspace | Function | GObject.GType, action_name: string | null, parameter_type: string | null, activate: ActionActivateFunc): void
    /**
     * This should be called at class initialization time to specify
     * actions to be added for all instances of this class.
     * 
     * Actions installed by this function are stateless. The only state
     * they have is whether they are enabled or not.
     * @param action_name a prefixed action name, such as "clipboard.paste"
     * @param parameter_type the parameter type
     * @param activate callback to use when the action is activated
     */
    static install_action(widget_class: Widget | Function | GObject.GType, action_name: string | null, parameter_type: string | null, activate: Gtk.WidgetActionActivateFunc): void
    /**
     * Installs an action called `action_name` on `workspace_class` and
     * binds its state to the value of the `property_name` property.
     * 
     * This function will perform a few santity checks on the property selected
     * via `property_name`. Namely, the property must exist, must be readable,
     * writable and must not be construct-only. There are also restrictions
     * on the type of the given property, it must be boolean, int, unsigned int,
     * double or string. If any of these conditions are not met, a critical
     * warning will be printed and no action will be added.
     * 
     * The state type of the action matches the property type.
     * 
     * If the property is boolean, the action will have no parameter and
     * toggle the property value. Otherwise, the action will have a parameter
     * of the same type as the property.
     * @param action_name name of the action
     * @param property_name name of the property in instances of `workspace_class`   or any parent class.
     */
    static install_property_action(workspace_class: Workspace | Function | GObject.GType, action_name: string | null, property_name: string | null): void
    static new(...args: any[]): any
}

export interface Action {
}

export class Action {
    static name: string
}

export interface ActionMuxerClass {
    parent_class: GObject.ObjectClass
}

export abstract class ActionMuxerClass {
    static name: string
}

export interface ApplicationClass {
    parent_class: Adw.ApplicationClass
}

export abstract class ApplicationClass {
    static name: string
}

export interface DockClass {
    parent_class: Gtk.WidgetClass
    panel_drag_begin: (self: Dock, widget: Widget) => void
    panel_drag_end: (self: Dock, widget: Widget) => void
}

export abstract class DockClass {
    static name: string
}

export interface DocumentWorkspaceClass {
    parent_class: WorkspaceClass
    add_widget: (self: DocumentWorkspace, widget: Widget, position: Position) => boolean
}

export abstract class DocumentWorkspaceClass {
    static name: string
}

export interface FrameClass {
    parent_class: Gtk.WidgetClass
    page_closed: (self: Frame, widget: Widget) => void
    adopt_widget: (self: Frame, widget: Widget) => boolean
}

export abstract class FrameClass {
    static name: string
}

export interface FrameHeaderBarClass {
    parent_class: Gtk.WidgetClass
}

export abstract class FrameHeaderBarClass {
    static name: string
}

export interface FrameHeaderInterface {
    parent_iface: GObject.TypeInterface
    page_changed: (self: FrameHeader, widget: Widget | null) => void
    can_drop: (self: FrameHeader, widget: Widget) => boolean
    add_prefix: (self: FrameHeader, priority: number, child: Gtk.Widget) => void
    add_suffix: (self: FrameHeader, priority: number, child: Gtk.Widget) => void
}

export abstract class FrameHeaderInterface {
    static name: string
}

export interface FrameSwitcherClass {
    parent_class: Gtk.WidgetClass
}

export abstract class FrameSwitcherClass {
    static name: string
}

export interface FrameTabBarClass {
    parent_class: Gtk.WidgetClass
}

export abstract class FrameTabBarClass {
    static name: string
}

export interface GSettingsActionGroupClass {
    parent_class: GObject.ObjectClass
}

export abstract class GSettingsActionGroupClass {
    static name: string
}

export interface GridClass {
    parent_class: Gtk.WidgetClass
}

export abstract class GridClass {
    static name: string
}

export interface GridColumnClass {
    parent_class: Gtk.WidgetClass
}

export abstract class GridColumnClass {
    static name: string
}

export interface InhibitorClass {
    parent_class: GObject.ObjectClass
}

export abstract class InhibitorClass {
    static name: string
}

export interface LayeredSettingsClass {
    parent_class: GObject.ObjectClass
}

export abstract class LayeredSettingsClass {
    static name: string
}

export interface MenuManagerClass {
    parent_class: GObject.ObjectClass
}

export abstract class MenuManagerClass {
    static name: string
}

export interface OmniBarClass {
    parent_class: Gtk.WidgetClass
}

export abstract class OmniBarClass {
    static name: string
}

export interface PanedClass {
    parent_class: Gtk.WidgetClass
}

export abstract class PanedClass {
    static name: string
}

export interface PositionClass {
    parent_class: GObject.ObjectClass
}

export abstract class PositionClass {
    static name: string
}

export interface SaveDelegateClass {
    parent_class: GObject.ObjectClass
    save_async: (self: SaveDelegate, cancellable: Gio.Cancellable | null, callback: Gio.AsyncReadyCallback | null) => void
    save_finish: (self: SaveDelegate, result: Gio.AsyncResult) => boolean
    save: (self: SaveDelegate, task: Gio.Task) => boolean
    discard: (self: SaveDelegate) => void
    close: (self: SaveDelegate) => void
}

export abstract class SaveDelegateClass {
    static name: string
}

export interface SaveDialogClass {
    parent_class: Adw.MessageDialogClass
}

export abstract class SaveDialogClass {
    static name: string
}

export interface SessionClass {
    parent_class: GObject.ObjectClass
}

export abstract class SessionClass {
    static name: string
}

export interface SessionItemClass {
    parent_class: GObject.ObjectClass
}

export abstract class SessionItemClass {
    static name: string
}

export interface SettingsClass {
    parent_class: GObject.ObjectClass
}

export abstract class SettingsClass {
    static name: string
}

export interface StatusbarClass {
    parent_class: Gtk.WidgetClass
}

export abstract class StatusbarClass {
    static name: string
}

export interface ThemeSelectorClass {
    parent_class: Gtk.WidgetClass
}

export abstract class ThemeSelectorClass {
    static name: string
}

export interface ToggleButtonClass {
    parent_class: Gtk.WidgetClass
}

export abstract class ToggleButtonClass {
    static name: string
}

export interface WidgetClass {
    parent_instance: Gtk.WidgetClass
    get_default_focus: (self: Widget) => Gtk.Widget | null
    presented: (self: Widget) => void
}

export abstract class WidgetClass {
    static name: string
    /**
     * This should be called at class initialization time to specify
     * actions to be added for all instances of this class.
     * 
     * Actions installed by this function are stateless. The only state
     * they have is whether they are enabled or not.
     * @param action_name a prefixed action name, such as "clipboard.paste"
     * @param parameter_type the parameter type
     * @param activate callback to use when the action is activated
     */
    static install_action(widget_class: Widget | Function | GObject.GType, action_name: string | null, parameter_type: string | null, activate: Gtk.WidgetActionActivateFunc): void
    /**
     * Installs an action called `action_name` on `widget_class` and
     * binds its state to the value of the `property_name` property.
     * 
     * This function will perform a few santity checks on the property selected
     * via `property_name`. Namely, the property must exist, must be readable,
     * writable and must not be construct-only. There are also restrictions
     * on the type of the given property, it must be boolean, int, unsigned int,
     * double or string. If any of these conditions are not met, a critical
     * warning will be printed and no action will be added.
     * 
     * The state type of the action matches the property type.
     * 
     * If the property is boolean, the action will have no parameter and
     * toggle the property value. Otherwise, the action will have a parameter
     * of the same type as the property.
     * @param action_name name of the action
     * @param property_name name of the property in instances of `widget_class`   or any parent class.
     */
    static install_property_action(widget_class: Widget | Function | GObject.GType, action_name: string | null, property_name: string | null): void
}

export interface WorkbenchClass {
    parent_class: Gtk.WindowGroupClass
    activate: (self: Workbench) => void
    unload_async: (self: Workbench, cancellable: Gio.Cancellable | null, callback: Gio.AsyncReadyCallback | null) => void
    unload_finish: (self: Workbench, result: Gio.AsyncResult) => boolean
}

export abstract class WorkbenchClass {
    static name: string
    /**
     * This should be called at class initialization time to specify
     * actions to be added for all instances of this class.
     * 
     * Actions installed by this function are stateless. The only state
     * they have is whether they are enabled or not.
     * @param action_name a prefixed action name, such as "project.open"
     * @param parameter_type the parameter type
     * @param activate callback to use when the action is activated
     */
    static install_action(workbench_class: Workbench | Function | GObject.GType, action_name: string | null, parameter_type: string | null, activate: ActionActivateFunc): void
    /**
     * Installs an action called `action_name` on `workbench_class` and
     * binds its state to the value of the `property_name` property.
     * 
     * This function will perform a few santity checks on the property selected
     * via `property_name`. Namely, the property must exist, must be readable,
     * writable and must not be construct-only. There are also restrictions
     * on the type of the given property, it must be boolean, int, unsigned int,
     * double or string. If any of these conditions are not met, a critical
     * warning will be printed and no action will be added.
     * 
     * The state type of the action matches the property type.
     * 
     * If the property is boolean, the action will have no parameter and
     * toggle the property value. Otherwise, the action will have a parameter
     * of the same type as the property.
     * @param action_name name of the action
     * @param property_name name of the property in instances of `workbench_class`   or any parent class.
     */
    static install_property_action(workbench_class: Workbench | Function | GObject.GType, action_name: string | null, property_name: string | null): void
}

export interface WorkspaceClass {
    parent_class: Adw.ApplicationWindowClass
}

export abstract class WorkspaceClass {
    static name: string
    /**
     * This should be called at class initialization time to specify
     * actions to be added for all instances of this class.
     * 
     * Actions installed by this function are stateless. The only state
     * they have is whether they are enabled or not.
     * @param action_name a prefixed action name, such as "project.open"
     * @param parameter_type the parameter type
     * @param activate callback to use when the action is activated
     */
    static install_action(workspace_class: Workspace | Function | GObject.GType, action_name: string | null, parameter_type: string | null, activate: ActionActivateFunc): void
    /**
     * This should be called at class initialization time to specify
     * actions to be added for all instances of this class.
     * 
     * Actions installed by this function are stateless. The only state
     * they have is whether they are enabled or not.
     * @param action_name a prefixed action name, such as "clipboard.paste"
     * @param parameter_type the parameter type
     * @param activate callback to use when the action is activated
     */
    static install_action(widget_class: Widget | Function | GObject.GType, action_name: string | null, parameter_type: string | null, activate: Gtk.WidgetActionActivateFunc): void
    /**
     * Installs an action called `action_name` on `workspace_class` and
     * binds its state to the value of the `property_name` property.
     * 
     * This function will perform a few santity checks on the property selected
     * via `property_name`. Namely, the property must exist, must be readable,
     * writable and must not be construct-only. There are also restrictions
     * on the type of the given property, it must be boolean, int, unsigned int,
     * double or string. If any of these conditions are not met, a critical
     * warning will be printed and no action will be added.
     * 
     * The state type of the action matches the property type.
     * 
     * If the property is boolean, the action will have no parameter and
     * toggle the property value. Otherwise, the action will have a parameter
     * of the same type as the property.
     * @param action_name name of the action
     * @param property_name name of the property in instances of `workspace_class`   or any parent class.
     */
    static install_property_action(workspace_class: Workspace | Function | GObject.GType, action_name: string | null, property_name: string | null): void
}

/**
 * Name of the imported GIR library
 * @see https://gitlab.gnome.org/GNOME/gjs/-/blob/master/gi/ns.cpp#L188
 */
export const __name__: string
/**
 * Version of the imported GIR library
 * @see https://gitlab.gnome.org/GNOME/gjs/-/blob/master/gi/ns.cpp#L189
 */
export const __version__: string
// END