export type Listener<T extends any[]> = (...args: T) => void;

export type VersionCodename = 'indev' | 'alpha' | 'beta' | 'release';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export type AppLayout = 'landing' | 'app';