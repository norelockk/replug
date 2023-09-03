export default class ReplugError extends Error {
  constructor(message: string) {
    super(message);

    this.name = 'ReplugError';
  }
}