import devtools from './libs/devtoolsDetect';

import { LogLevel } from '../../../../shared/enums/Logger';

import AppEntrypoint from '@/vue';
import ReplugError from './errors/ReplugError';
import Emitter from './emitter';
import Logger from './logger';

import { connect } from './services/socket';
import { APP_CODENAME, APP_VERSION, IS_DEVELOPMENT } from '@/const';

import environment from './environment';
import HttpClient from './services/http';

const dtMessage: string[] = [
  'If someone told you to copy/paste something here, there an 11/10 chance you being scammed',
  'Unless you understand exactly what you are doing, close this window and stay safe.',
  'Pasting anything in here could give attackers access to your account'
];

const dtUse = (): void => console.log(`%c${dtMessage.join('\n')}`, 'background: #f00; color: #fff; font-size: 16px; font-weight: bold; padding: 4px;');

export default class Replug {
  // public properties
  public http: HttpClient = new HttpClient({
    baseUrl: environment.HTTP_URL,
    timeout: 30 * 1000
  });
  public socket: WebSocket | boolean = false;
  public logger: Logger = new Logger(IS_DEVELOPMENT ? LogLevel.DEBUG : 0, 'main');
  public emitter: Emitter<any> = new Emitter;

  // private properties
  private static readonly renderElement: HTMLElement | Element | null = document.querySelector('#app') ?? document.getElementById('app');

  constructor(public entrypoint: AppEntrypoint) {
    if (!(entrypoint instanceof AppEntrypoint))
      throw new ReplugError('Invalid entrypoint instance');

    this.entrypoint = entrypoint;

    // bind global load event
    window.onload = this.onload.bind(this);

    // info about devtools
    if (devtools.isOpen) dtUse();
    window.addEventListener('devtoolschange', dtUse);  
  }

  private onload(): void {
    if (!(this.entrypoint instanceof AppEntrypoint))
      throw new ReplugError('App tried to load without proper entrypoint instance');

    try {
      this.entrypoint.$mount(Replug.renderElement as Element);
    } catch (e) {
      throw e;
    }

    this.logger.debug(`replug initialized (v${APP_VERSION.join('.')}-${APP_CODENAME})`);
    this.entrypoint.loaded = true;
  }

  public async loadApp(): Promise<void> {
    
  }
}