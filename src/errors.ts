type StvpkErrorCode = symbol;

export const Errors = {
  UNSPECIFIED: Symbol('UNSPECIFIED'),
  INCLUSION_CHECK_FAILED: Symbol('INCLUSION_CHECK_FAILED'),
  EMPTY_PROFILE_INDEX: Symbol('EMPTY_PROFILE_INDEX'),
  INCONSISTENT_FOLDER_NAME: Symbol('INCONSISTENT_FOLDER_NAME'),
  ADDON_NOT_DOWNLOADED: Symbol('ADDON_NOT_DOWNLOADED'),
  ADDON_NOT_USED: Symbol('ADDON_NOT_USED'),
  NO_USABLE_PROFILE: Symbol('NO_USABLE_PROFILE'),
  SINGLETON_INITIALIZED: Symbol('SINGLETON_INITIALIZED'),
  SINGLETON_UNINITIALIZED: Symbol('SINGLETON_UNINITIALIZED'),
  DEPENDENCY_UNINITIALIZED: Symbol('DEPENDENCY_UNINITIALIZED'),
  UNEXPECTED_TYPE: Symbol('UNEXPECTED_TYPE'),
  CANCELLED: Symbol('CANCELLED'),
  PATH_NOT_EXIST: Symbol('PATH_NOT_EXIST'),
  SETTINGS_NOT_FOUND: Symbol('SETTINGS_NOT_FOUND'),
  SETTINGS_CANNOT_WRITE: Symbol('SETTINGS_CANNOT_WRITE'),
};

interface StvpkErrorCause {
  readonly code: StvpkErrorCode,
  value?: unknown,
}

export interface StvpkErrorConstructor {
  code: StvpkErrorCode;
  msg?: string;
  // TODO: unknown vs any
  val?: unknown;
}

// TODO: Prototype instead of class?
export class StvpkError extends Error {
  static log(error: StvpkError) {
    // TODO: log error code
    log(`Handled StvpkError: ${error.code.toString()}: ${error.message}`);
  }

  constructor(params: StvpkErrorConstructor = {
    code: Errors.UNSPECIFIED,
  }) {
    const {code, msg, val} = params;
    super(msg, {
      cause: {
        code,
        val,
      } as StvpkErrorCause,
    });
  }

  get code(): StvpkErrorCode {
    if (this.cause === null || this.cause === undefined) {
      throw new TypeError('StvpkError was not properly constructed');
    }
    return (<StvpkErrorCause>this.cause).code;
  }
}
