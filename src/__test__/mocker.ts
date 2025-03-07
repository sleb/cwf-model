export const mocker =
  <T>(base: T) =>
  (obj: Partial<T> = {}): T => ({ ...base, ...obj });
