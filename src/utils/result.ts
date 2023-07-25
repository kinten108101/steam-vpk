/**
 * @deprecated See {@link Result}.
 */
export enum Results {
  OK,
  NOT_OK,
}

/**
 * @deprecated See {@link Result}.
 */
export type Result<GoodType, BadType> = (ResultOK<GoodType> | ResultNotOK<BadType>);

/**
 * @deprecated See {@link Result}.
 */
export interface ResultOK<T> {
  readonly code: Results.OK;
  readonly data: T;
}

/**
 * @deprecated See {@link Result}.
 */
export interface ResultNotOK<T> {
  readonly code: Results.NOT_OK;
  readonly data: T;
}

/**
 * @deprecated The Result pattern (at least in the current implementation) has proven to be incompatible with the JS programming style and the GTK/GJS ecosystem. Overall, it does not provide enough advantages over the try/catch pattern to justify its usage. Future code should avoid this pattern / avoid importing this module, and legacy code will be refactored in a future PR.
 */
export const Result = {
  compose: {
    OK<T>(data: T) {
      const a: ResultOK<T> = { code: Results.OK, data };
      return a;
    },
    NotOK<T>(data: T) {
      const a: ResultNotOK<T> = { code: Results.NOT_OK, data };
      return a;
    }
  },
}
