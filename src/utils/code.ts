import GLib from 'gi://GLib';

import * as GLib1 from './glib1.js';

import { Result } from "./result.js"


export class TextDecoderWrap {
  decoder: TextDecoder;

  constructor(param: { decoder: TextDecoder }) {
    this.decoder = param.decoder;
  }

  unwrap() {
    return this.decoder;
  }

  /**
   * Returns a string containing the text decoded with the method of the specific TextDecoder object.
   *
   * If the error mode is "fatal" and the encoder method encounter an error it WILL THROW a TypeError.
   *
   * @param input Buffer containing the text to decode
   * @param options Object defining the decode options
   */
  decode(input?: ArrayBufferView | ArrayBuffer, options?: TextDecodeOptions): Result<string, GLib.Error> {
    try {
      const obj = this.decoder.decode(input, options);
      return Result.compose.OK(obj);
    } catch (error) {
      if (error instanceof TypeError) {
        const _error = GLib1.Error.new_from_jserror(error);
        return Result.compose.NotOK(_error);
      }
      else throw error;
    }
  }
}

