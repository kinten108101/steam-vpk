type StvpkErrorCode = symbol;

export const Errors = {
  SINGLETON_INITIALIZED: Symbol('SINGLETON_INITIALIZED'),
  SINGLETON_UNINITIALIZED: Symbol('SINGLETON_UNINITIALIZED'),
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
