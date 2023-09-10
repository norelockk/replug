import { LOADING_STORE_INITIALIZE } from '@/replug/strings';
import { Module } from 'vuex';

interface ModuleState {
  loadingDelay: number;
  loadingShowing: boolean;
}

let LOADING_QUEUE: { [k: string]: boolean } = {
  [LOADING_STORE_INITIALIZE]: true
}

const module: Module<ModuleState, {}> = {
  state: {
    loadingDelay: 500,
    loadingShowing: true
  },
  getters: {
    lDelay: state => state.loadingDelay,
    lShowing: state => state.loadingShowing,
  },
  mutations: {
    setLoadingDelay(state, number) {
      if (typeof number !== 'number' || state.loadingDelay === number) return;

      state.loadingDelay = number;
    },
    setLoadingShowing(state, boolean) {
      if (typeof boolean !== 'boolean' || state.loadingShowing === boolean) return;

      state.loadingShowing = boolean;
    }
  },
  actions: {
    start({ commit, getters }, str) {
      return new Promise(resolve => {
        if (Object.keys(LOADING_QUEUE).length) {
          if (str in LOADING_QUEUE) return;
        } else {
          commit('setLoadingShowing', true);
        }

        LOADING_QUEUE[str] = true;
        setTimeout(resolve, getters.lDelay);
      })
    },
    finish({ commit, getters }, payload) {
      return new Promise(resolve => {
        let wait: boolean = false;
        let name: string = '';

        if (typeof payload === 'object') {
          name = payload.name;

          if (payload.wait) wait = true;
        } else if (typeof payload === 'string') {
          name = payload;
        }

        if (!name || typeof name !== 'string') return;

        const finished = (): void => {
          if (name in LOADING_QUEUE) delete LOADING_QUEUE[name];
          if (!Object.keys(LOADING_QUEUE).length) commit('setLoadingShowing', false);

          setTimeout(resolve, getters.lDelay);
        };

        if (wait) setTimeout(finished, getters.lDelay); else finished();
      })
    }
  },
  namespaced: true
};

export default module;