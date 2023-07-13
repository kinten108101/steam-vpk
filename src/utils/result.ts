/**
 * @deprecated
 */
export enum Results {
  OK,
  NOT_OK,
}

/**
 * @deprecated
 */
export type Result<GoodType, BadType> = (ResultOK<GoodType> | ResultNotOK<BadType>);

/**
 * @deprecated
 */
export interface ResultOK<T> {
  readonly code: Results.OK;
  readonly data: T;
}

/**
 * @deprecated
 */
export interface ResultNotOK<T> {
  readonly code: Results.NOT_OK;
  readonly data: T;
}

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
