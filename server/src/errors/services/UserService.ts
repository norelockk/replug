export default class UserServiceError extends Error {
  constructor(message: string) {
    super(message);

    this.name = 'UserServiceError';
  }
}