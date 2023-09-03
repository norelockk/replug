import { IS_DEVELOPMENT, IS_PRODUCTION } from '@/const';

import Vue from 'vue';

import Store from './store';
import Router from './router';
import vuetify from './plugins/vuetify';

import AppRoot from '@/templates/App.vue';

Vue.config.devtools = !!IS_DEVELOPMENT;
Vue.config.productionTip = !!IS_PRODUCTION;

export default class AppEntrypoint extends Vue {
  // static properties
  public static store: Store = new Store();
  public static router: Router = new Router();

  // normal properties
  public loaded: boolean = false;
  
  static construct(): AppEntrypoint {
    return new AppEntrypoint();
  }

  constructor() {
    super({
      render: r => r(AppRoot),
      vuetify,
      router: AppEntrypoint.router,
      store: AppEntrypoint.store
    });
  }
}