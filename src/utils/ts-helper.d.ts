export type ValueOf<T> = T[keyof T];
export type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

export interface globalThis {
  config: {
    name: string,
    version: string,
    prefix: string,
    libdir: string,
    flatpak: string,
    toString(): string,
  },
}
