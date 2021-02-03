export interface IRequestValidator {
  validate<T>(object: T): Promise<void>;
}
