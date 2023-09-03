import { SocketErrors } from '../../../../../shared/enums/Errors'

export default class SocketError extends Error {
  public code: SocketErrors;

  constructor(message: string, code: SocketErrors) {
    super(message);

    this.code = code;
    this.name = `SocketError (code ${code.toString(3)})`;
  }
}