type StvpkErrorCode = symbol;

export const Errors = {
  UNSPECIFIED: Symbol.for('UNSPECIFIED'),
  INCLUSION_CHECK_FAILED: Symbol.for('INCLUSION_CHECK_FAILED'),
  EMPTY_PROFILE_INDEX: Symbol.for('EMPTY_PROFILE_INDEX'),
  INCONSISTENT_FOLDER_NAME: Symbol.for('INCONSISTENT_FOLDER_NAME'),
  ADDON_NOT_DOWNLOADED: Symbol.for('ADDON_NOT_DOWNLOADED'),
  ADDON_NOT_USED: Symbol.for('ADDON_NOT_USED'),
  NO_USABLE_PROFILE: Symbol.for('NO_USABLE_PROFILE'),
  SINGLETON_INITIALIZED: Symbol.for('SINGLETON_INITIALIZED'),
  SINGLETON_UNINITIALIZED: Symbol.for('SINGLETON_UNINITIALIZED'),
  DEPENDENCY_UNINITIALIZED: Symbol.for('DEPENDENCY_UNINITIALIZED'),
  UNEXPECTED_TYPE: Symbol.for('UNEXPECTED_TYPE'),
  CANCELLED: Symbol.for('CANCELLED'),
  PATH_NOT_EXIST: Symbol.for('PATH_NOT_EXIST'),
  SETTINGS_NOT_FOUND: Symbol.for('SETTINGS_NOT_FOUND'),
  SETTINGS_CANNOT_WRITE: Symbol.for('SETTINGS_CANNOT_WRITE'),
};

interface StvpkErrorCause {
  readonly code: StvpkErrorCode,
  value?: unknown,
}

export interface StvpkErrorConstructor {
  code: StvpkErrorCode;
  message?: string;
  value?: unknown;
}

// TODO: Prototype instead of class?
export class StvpkError extends Error {

  static log(error: StvpkError) {
    const key = Symbol.keyFor(error.code);
    if (key === undefined)
      throw new TypeError('StvpkErrorCode was not properly constructed');
    log(`Handled: ${key}: ${error.message}`);
  }

  constructor(params: StvpkErrorConstructor = {
    code: Errors.UNSPECIFIED,
  }) {
    const { code, message, value } = params;
    super(message);
    this.cause = {
      code,
      value,
    } as StvpkErrorCause;
  }

  get code(): StvpkErrorCode {
    if (this.cause === null || this.cause === undefined)
      throw new TypeError('StvpkError was not properly constructed');
    const cause = this.cause as StvpkErrorCause;
    return cause.code;
  }
}
