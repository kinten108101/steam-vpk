import GLib from 'gi://GLib';

export function getShortTraceGjs() {
  const stack = String(new Error().stack).split('\n');
  // eslint-disable-next-line prefer-destructuring
  const firstLine = stack[2];
  if (firstLine === undefined) {
    throw new Error('stack trace bad edit');
  }
  const functionName = firstLine.slice(0, firstLine.indexOf('@'));
  return functionName;
}

export namespace Log {
  export interface ConfigructorProperties {
    buildtype: string,
    prefix: string,
    implementations: {
      printRaw: ((message: string) => void),
      getShortTrace: (() => string),
    },
  }
}

interface LogLevel {
  enabled: boolean;
}

export class Log {
  private static instance: Log;

  static init(param: Log.ConfigructorProperties) {
    if (Log.instance) {
      throw new Error('Log module has already been initialized!');
    }
    Log.instance = new Log(param);
  }

  static getInstance() {
    if (!Log.instance) {
      throw new Error('Log module has not been initialized!');
    }
    return Log.instance;
  }

  static colorCode = {
    reset: 0,
    red: 31,
    green: 32,
    yellow: 33,
    blue: 34,
    pink: 35,
    cyan: 36,
    gray: 37,
  };

  printRaw: ((message: string) => void);
  getShortTrace: (() => string);
  prefix: string;

  info: {} & LogLevel = {
    enabled: false,
  }

  warn: {} & LogLevel = {
    enabled: false,
  }

  error: {} & LogLevel = {
    enabled: false,
  }

  debug: {} & LogLevel = {
    enabled: false,
  }

  constructor(param: Log.ConfigructorProperties) {
    [
      this.info,
      this.warn,
      this.error,
    ].forEach(x => {
      x.enabled = true;
    })
    switch (param.buildtype) {
    case 'debug':
      this.debug.enabled = true;
      break;
    }
    this.prefix = param.prefix;
    this.printRaw = param.implementations.printRaw;
    this.getShortTrace = param.implementations.getShortTrace;
  }

  static info(content: any) {
    const _Log = Log.getInstance();
    const source = _Log.info;
    if (!source.enabled)
      return;
    const date = new Date();
    const trace = _Log.getShortTrace();
    const logWord = ' INFO'; // max 5 chars
    const color = Log.colorCode.green;
    _Log.printRaw(`${date.toISOString()} \x1b[${color}m${logWord}\x1b[${Log.colorCode.reset}m ${_Log.prefix}::${trace}: ${resolveContent(content)}`);
  }

  static error(content: any) {
    const _Log = Log.getInstance();
    const source = _Log.error;
    if (!source.enabled)
      return;
    const date = new Date();
    const trace = _Log.getShortTrace();
    const logWord = 'ERROR'; // max 5 chars
    const color = Log.colorCode.red;
    _Log.printRaw(`${date.toISOString()} \x1b[${color}m${logWord}\x1b[${Log.colorCode.reset}m ${_Log.prefix}::${trace}: ${resolveContent(content)}`);
  }

  static warn(content: any) {
    const _Log = Log.getInstance();
    const source = _Log.warn;
    if (!source.enabled)
      return;
    const date = new Date();
    const trace = _Log.getShortTrace();
    const logWord = ' WARN'; // max 5 chars
    const color = Log.colorCode.yellow;
    _Log.printRaw(`${date.toISOString()} \x1b[${color}m${logWord}\x1b[${Log.colorCode.reset}m ${_Log.prefix}::${trace}: ${resolveContent(content)}`);
  }

  static debug(content: any) {
    const _Log = Log.getInstance();
    const source = _Log.debug;
    if (!source.enabled)
      return;
    const date = new Date();
    const trace = _Log.getShortTrace?.();
    const logWord = 'DEBUG'; // max 5 chars
    const color = Log.colorCode.blue;
    _Log.printRaw(`${date.toISOString()} \x1b[${color}m${logWord}\x1b[${Log.colorCode.reset}m ${_Log.prefix}::${trace}: ${resolveContent(content)}`);
  }
}

function resolveContent(content: any) {
  if (typeof content === 'string') return content;
  else if (content instanceof GLib.Error) {
    const error = content;
    return `${GLib.quark_to_string(error.domain)}(${error.code}) ${error.message}\n${error.stack}`;
  } else if (content instanceof Error) {
    const error = content;
    return `${String(error)}\n${error.stack}`;
  } else {
    return String(content);
  }
}
