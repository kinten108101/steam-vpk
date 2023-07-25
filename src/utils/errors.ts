type FlatErrorCode = Errors;

/**
 * @deprecated See {@link FlatError}.
 */
export enum Errors {
  UNSPECIFIED,
  INCLUSION_CHECK_FAILED,
  EMPTY_PROFILE_INDEX,
  INCONSISTENT_FOLDER_NAME,
  ADDON_NOT_DOWNLOADED,
  ADDON_NOT_USED,
  NO_USABLE_PROFILE,
  SINGLETON_INITIALIZED,
  SINGLETON_UNINITIALIZED,
  DEPENDENCY_UNINITIALIZED,
  UNEXPECTED_TYPE,
  CANCELLED,
  PATH_NOT_EXIST,
  FILE_NOT_EXIST,
  SETTINGS_NOT_FOUND,
  SETTINGS_CANNOT_WRITE,
  SETTINGS_UNEXPECTED_TYPE,
  ID_NOT_MATCH,
  FILE_MALFORMED,
  UNEXPECTED_RESULT_FORMAT,
  BAD_SWITCH_CASE,
  BAD_CONSTRUCTION_ORDER,
  API,
  DIALOG_GO_BACK,
  BIND_MISSING,
}

type FlatErrorDomain = string;

export const ErrorDomains = {
  Store: 'Store',
  Builder: 'Builder',
}

export interface FlatErrorConstructor {
  code?: FlatErrorCode;
  cause?: string;
  domain?: FlatErrorDomain;
  message?: string;
}

const FlatErrorConfigructorDefault = {
  code: Errors.UNSPECIFIED,
};

/**
 * @deprecated Use domain-specific subclasses of {@link Error} instead.
 */
export class FlatError extends Error {
  readonly code?: FlatErrorCode;
  readonly cause?: string;
  readonly msg?: string;
  readonly domain?: FlatErrorDomain;

  constructor(params: FlatErrorConstructor = FlatErrorConfigructorDefault) {
    const { code, cause, message, domain } = params;
    const messageFull = `<${domain}${code ? `::${Errors[code]}` : ''}> ${message}${ cause ? `. Caused by ${cause}` : ''}`;
    super(messageFull);
    console.debug('Thrown ' + messageFull);
    this.code = code;
    this.cause = cause;
    this.msg = message;
    this.domain = domain;
  }

  toString() {
    return this.message;
  }
}
