export interface Model {
  start(): Promise<void>;
}

export interface LateBinder {
  bind(): void;
}

export interface LateBindee<T extends any> {
  onBind(source: T): void;
}
