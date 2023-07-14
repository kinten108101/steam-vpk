import GLib from 'gi://GLib';
import { APP_SHORTNAME } from './const';

const decoder = new TextDecoder('utf-8');

export default {
  init(config: {
    debug: boolean;
  }) {
    GLib.log_set_debug_enabled(config.debug);
    // @ts-ignore
    GLib.log_set_writer_func(customLogWrite);
  },
}

enum Color {
  reset = 0,
  bold = 1,
  red = 31,
  green = 32,
  lightGreen = 92,
  yellow = 33,
  blue = 34,
  pink = 35,
  cyan = 36,
  gray = 37,
  lightMagenta = 95,
};

const Flags  = {
  [1<<0]: 'RECURSION',
  [1<<1]: 'FATAL',
  [1<<2]: 'ERROR',
  [1<<3]: 'CRITICAL',
  [1<<4]: 'WARNING',
  [1<<5]: 'MESSAGE',
  [1<<6]: 'INFO',
  [1<<7]: 'DEBUG',
  [-4]: 'MASK',
}

const ColorMap: { [key: string]: number } = {
  "RECURSION": Color.red,
  "FATAL": Color.red,
  "ERROR": Color.red,
  "CRITICAL": Color.lightMagenta,
  "WARNING": Color.yellow,
  "MESSAGE": Color.lightGreen,
  "INFO": Color.lightGreen,
  "DEBUG": Color.lightGreen,
  "MASK": Color.gray,
}

function _sgr(param: number) {
  return `\x1b[${param}m`
}

function customLogWrite(log_level: GLib.LogLevelFlags, data: { MESSAGE: Uint8Array }) {
  if (!GLib.log_get_debug_enabled() && (log_level == 1<<6 || log_level == 1<<7)) return GLib.LogWriterOutput.HANDLED;
  const date = new Date;
  const msg_jsstr = decoder.decode(data.MESSAGE);
  if (msg_jsstr.includes('corner->class == &GTK_CSS_VALUE_CORNER')) return GLib.LogWriterOutput.HANDLED;
  const flag = Flags[log_level];
  if (flag === undefined) return GLib.LogWriterOutput.UNHANDLED;
  const color = ColorMap[flag];
  if (color === undefined) return GLib.LogWriterOutput.UNHANDLED;
  const stars = (() => {
    if (log_level >= 1<<0 && log_level <= 1<<4) return ' **';
    else return '';
  })();
  print(`${APP_SHORTNAME}-${_sgr(Color.bold)}${_sgr(color)}${flag}${_sgr(Color.reset)}${stars}: ${_sgr(Color.blue)}${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}.${date.getMilliseconds()}${_sgr(Color.reset)}: ${msg_jsstr}`);
  //GLib.log_default_handler(domain, log_level, msg_jsstr, null);
  return GLib.LogWriterOutput.HANDLED;
}
