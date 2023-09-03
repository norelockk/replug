import { VersionCodename } from './types';

// Application settings
export const APP_SOCIALS: { [social: string]: object } = {
  discord: {
    url: 'https://discord.gg/DQvst9PGVP'
  }
};
export const APP_VERSION: number[] = [ 1, 0, 0 ];
export const APP_CODENAME: VersionCodename = 'indev';
export const APP_NAMESPACE: string = 'codes.dreamy.replug';

// For debug n' stuff.
export const IS_PRODUCTION: boolean = process.env.NODE_ENV === 'production';
export const IS_DEVELOPMENT: boolean = process.env.NODE_ENV === 'development';

// WebSocket settings
export const SOCKET_STATES: { [k: number]: string; } = {
  [WebSocket.OPEN]: 'open',
  [WebSocket.CONNECTING]: 'connecting',
};
export const SOCKET_TIMEOUT_INTERVAL: number = 1000;
export const SOCKET_MAX_TIMEOUT_COUNT: number = 6;