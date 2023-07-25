import GLib from 'gi://GLib';

import * as GLib1 from './glib1.js';
import { Result } from "./result.js"

/**
 * Converts a JavaScript Object Notation (JSON) string into an object.
 * @param text A valid JSON string.
 * @param reviver A function that transforms the results. This function is called for each member of the object.
 * If a member contains nested objects, the nested objects are transformed before the parent object is.
 * @returns An object, wrapped around by Result. On bad result, a caught `SyntaxError`.
 */
export function parse(text: string, reviver?: (this: any, key: string, value: any) => any): Result<any, GLib.Error> {
  try {
    const obj = JSON.parse(text, reviver);
    return Result.compose.OK(obj);
  } catch (error) {
    if (error instanceof SyntaxError) {
      const _error = GLib1.Error.new_from_jserror(error);
      return Result.compose.NotOK(_error);
    }
    else throw error;
  }
}
/**
 * Converts a JavaScript value to a JavaScript Object Notation (JSON) string.
 * @param value A JavaScript value, usually an object or array, to be converted.
 * @param replacer A function that transforms the results.
 * @param space Adds indentation, white space, and line break characters to the return-value JSON text to make it easier to read.
 * @returns The string representing the value, wrapped around by Result. On bad result, a caught `TypeError`.
 */
export function stringify(value: any, replacer?: (this: any, key: string, value: any) => any, space?: string | number): Result<string, GLib.Error>;
/**
 * Converts a JavaScript value to a JavaScript Object Notation (JSON) string.
 * @param value A JavaScript value, usually an object or array, to be converted.
 * @param replacer An array of strings and numbers that acts as an approved list for selecting the object properties that will be stringified.
 * @param space Adds indentation, white space, and line break characters to the return-value JSON text to make it easier to read.
 * @returns The string representing the value, wrapped around by Result. On bad result, a caught `TypeError`.
 */
export function stringify(value: any, replacer?: (number | string)[] | null, space?: string | number): Result<string, GLib.Error>;
export function stringify(value: any, replacer?: any, space?: any ): Result<string, GLib.Error> {
  try {
    const obj = JSON.stringify(value, replacer, space);
    return Result.compose.OK(obj);
  } catch (error) {
    if (error instanceof TypeError) {
      const _error = GLib1.Error.new_from_jserror(error);
      return Result.compose.NotOK(_error);
    }
    else throw error;
  }
}
