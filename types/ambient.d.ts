declare function _(
  id: string,
): string & { printf: (...reps: string[]) => string };
declare function print(args: string): void;
declare function log(obj: object, others?: object[]): void;
declare function log(msg: string, subsitutions?: any[]): void;
declare function logError(err: Error): void;

declare const pkg: {
  version: string;
  name: string;
};

declare const imports: {
  package: typeof pkg;
}

declare module console {
  export function error(...args: any[]): void;
  export function debug(...args: any[]): void;
  export function log(...args: any[]): void;
}

declare interface String {
  format(...replacements: string[]): string;
  format(...replacements: number[]): string;
}
declare interface Number {
  toFixed(digits: number): number;
}

interface TextDecoderOptions {
  fatal?: boolean;
  ignoreBOM?: boolean;
}

declare class TextDecoder {
  constructor(encoding?: string, options?: TextDecoderOptions);
  decode(input?: ArrayBufferView, options?: TextDecoderOptions): string;
}

interface TextEncodeOptions {
  stream?: boolean;
}

declare class TextEncoder {
  constructor();
  encode(input?: string, options?: TextEncodeOptions): Uint8Array;
}

declare function setTimeout(callback: (...argss: any[]) => void, ...args: any[]): void;

declare module "gi://Gtk" {
  export * as default from "gi-types/gtk4";
}

declare module "gi://Gdk" {
  export * as default from "gi-types/gdk4";
}

declare module "gi://Panel" {
  export * as default from "types/panel";
}