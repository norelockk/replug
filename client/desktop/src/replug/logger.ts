import { LogLevel } from '../../../../shared/enums/Logger';
import { APP_NAMESPACE } from '@/const';

export default class Logger {
  constructor(private logLevel: LogLevel = LogLevel.INFO, private moduleName: string = '') {
    this.logLevel = logLevel;

    if (moduleName.length > 0)
      this.moduleName = APP_NAMESPACE + '.' + moduleName;
    else
      this.moduleName = 'unknown module';
  }

  private log(level: LogLevel, message: string, ...data: any[]) {
    if (process.env.NODE_ENV === 'production')
      return;

    if (level >= this.logLevel) {
      const now = new Date();
      const timestamp = now.toISOString();

      let logMessage = `[${timestamp}] [${LogLevel[level]}]`;

      if (this.moduleName) {
        logMessage += ` [${this.moduleName}]`;
      }

      logMessage += `: ${message}`;

      if (data.length > 0) {
        logMessage += ` ${JSON.stringify(data)}`;
      }

      console.log(logMessage);
    }
  }

  public info(message: string, ...data: any[]) {
    this.log(LogLevel.INFO, message, ...data);
  }

  public debug(message: string, ...data: any[]) {
    this.log(LogLevel.DEBUG, message, ...data);
  }

  public error(message: string, ...data: any[]) {
    this.log(LogLevel.ERROR, message, ...data);
  }

  public warning(message: string, ...data: any[]) {
    this.log(LogLevel.WARNING, message, ...data);
  }
}
