import { APP_CODENAME, APP_DEV_VERSION, APP_SOCIALS, APP_VERSION } from '@/const';
import { AppLayout } from '@/types';
import { Module } from 'vuex';

interface ModuleState {
  socials: object[],
  version: object,
  currentLayout: AppLayout,
}

const socials: object[] = [];

for (const [ socialName, socialData ] of Object.entries(APP_SOCIALS)) socials.push({ data: socialData, platform: socialName });

const module: Module<ModuleState, {}> = {
  state: {
    socials,
    version: {
      hash: APP_DEV_VERSION,
      array: APP_VERSION,
      codename: APP_CODENAME,
    },
    currentLayout: 'landing'
  },
  getters: {
    layout: state => state.currentLayout,
    version: state => state.version,
    socials: state => state.socials,
  },
  mutations: {
    setLayout(state, layout: AppLayout): void {
      state.currentLayout = layout;
    }
  },
  namespaced: true
};

export default module;