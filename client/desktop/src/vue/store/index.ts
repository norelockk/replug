import Vue from 'vue'
import Vuex from 'vuex'

import Logger from '@/replug/logger';
import { LogLevel } from '../../../../../shared/enums/Logger';

Vue.use(Vuex);

const modules: { [k: string]: object; } = {};
const getModule = require.context('./modules', false, /\.ts$/);

getModule.keys().forEach(fileName => {
  const moduleName = fileName.replace(/(\.\/|\.ts)/g, '');
  const module = getModule(fileName);

  modules[moduleName] = module.default;
});

export default class Store extends Vuex.Store<{}> {
  private readonly logger: Logger = new Logger(LogLevel.DEBUG, 'main.store');

  constructor() {
    super({
      modules
    });

    this.logger.debug('Store initialized');
  }
}