export default class UserModelError extends Error {
  constructor(message: string) {
    super(message);

    this.name = 'UserModelError';
  }
}