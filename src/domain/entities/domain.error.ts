export abstract class DomainError extends Error {
  public readonly name = this.constructor.name;
  constructor(message: string) {
    super(message);
  }
}
