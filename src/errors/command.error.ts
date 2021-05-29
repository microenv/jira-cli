export class CommandError extends Error {
  public message: string;

  constructor(message: string) {
    super(message);
  }
}
