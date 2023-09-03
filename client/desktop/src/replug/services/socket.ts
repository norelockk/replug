import { SOCKET_STATES, SOCKET_MAX_TIMEOUT_COUNT, SOCKET_TIMEOUT_INTERVAL, IS_DEVELOPMENT } from '@/const';
import { validateUrl } from '@/utils';

import SocketError from '../errors/SocketError';
import Logger from '../logger';

import { SocketErrors } from '../../../../../shared/enums/Errors';
import { LogLevel } from '../../../../../shared/enums/Logger';

const PROTOCOL: string = window.location.protocol.includes('https') ? 'wss://' : 'ws://';
const LOGGER: Logger = new Logger(IS_DEVELOPMENT ? LogLevel.DEBUG : 0, 'services.WebSocket');

export let CONNECTED: boolean = false;

let TARGET: string = '';
let TIMEOUT: number = 0;
let INSTANCE: WebSocket | boolean = false;
let TIMEOUT_COUNT: number = 0;

let DISCONNECT_BY_USER: boolean = false;

const handleTimeout = (): void => {
  // increase timeout counter
  TIMEOUT_COUNT++;

  if (TIMEOUT_COUNT >= SOCKET_MAX_TIMEOUT_COUNT) {
    // clear instance
    if (INSTANCE && INSTANCE instanceof WebSocket) INSTANCE = false;

    // clear timeout
    if (TIMEOUT_COUNT > 0) TIMEOUT_COUNT = 0;
    if (TIMEOUT !== 0) {
      clearTimeout(TIMEOUT);
      TIMEOUT = 0;
    }

    // throw an error uwu
    throw new SocketError('Cannot connect to WS service', SocketErrors.CONNECTION_ERROR);
  } else {
    // connect to old target again
    connect(TARGET);
  }
};

const open = (): void => {
  // set connected state
  if (!CONNECTED) {
    CONNECTED = true;

    LOGGER.debug('connected to WS service', TARGET);
  }

  // clear timeout
  if (TIMEOUT_COUNT > 0) TIMEOUT_COUNT = 0;
  if (TIMEOUT !== 0) {
    clearTimeout(TIMEOUT);
    TIMEOUT = 0;
  }

  // setup disconnection by user
  window.onbeforeunload = handleUserDisconnect;

  // todo: send handshake data to server
};

const close = (): void => {
  // clear instance and connection state
  if (INSTANCE && INSTANCE instanceof WebSocket) INSTANCE = false;
  if (CONNECTED) CONNECTED = false;

  // make an timeout if user didn't requested the disconnection
  if (!DISCONNECT_BY_USER) TIMEOUT = setTimeout(handleTimeout, SOCKET_TIMEOUT_INTERVAL);
};

const message = (message: MessageEvent): void => {
  // skip keeping alive message
  if (message.data === '-') return;

  if (typeof message.data === 'string') {
    let json;

    try {
      json = JSON.parse(message.data);
    } catch (e) {
      throw new SocketError(`Failed to parse socket message: ${message.data}`, SocketErrors.PARSE_ERROR);
    } finally {
      if (json) {
        const [header, ...data] = json;

        LOGGER.debug('Received JSON data', json);
      }
    }
  } else {

  }
};

const handleUserDisconnect = (): void => {
  if (CONNECTED && !DISCONNECT_BY_USER) {
    DISCONNECT_BY_USER = true;
    window.onbeforeunload = null;
  }
}

export const connect = (target: string): WebSocket | boolean => {
  if (typeof target !== 'string' || !validateUrl(target))
    throw new SocketError(typeof target !== 'string' ? 'not a string' : 'invalid', SocketErrors.INVALID_TARGET);

  LOGGER.info('trying to connect to WS service');

  if (CONNECTED) return false;

  if (INSTANCE && INSTANCE instanceof WebSocket) {
    switch (INSTANCE.readyState) {
      case WebSocket.CLOSING:
      case WebSocket.CLOSED: {
        // clear old instance
        INSTANCE = false;

        break;
      }
      default: throw new SocketError(`Socket instance is in '${SOCKET_STATES[INSTANCE.readyState]}' state and it cannot be overrided`, SocketErrors.NO_OVERRIDE);
    }

    return false;
  } else {
    // change old target to new one (if needed or if it's null)
    if (target !== TARGET) TARGET = target;

    // making new instance and enabling support for arraybuffer
    INSTANCE = new WebSocket(PROTOCOL + TARGET);
    INSTANCE.binaryType = 'arraybuffer';

    // setup events
    INSTANCE.onopen = open;
    INSTANCE.onclose = close;
    INSTANCE.onmessage = message;

    // return instance back
    return INSTANCE;
  }
};