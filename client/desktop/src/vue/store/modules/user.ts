import { Module } from 'vuex';

interface ModuleState {
  data: object;
  logged: boolean;
}

const module: Module<ModuleState, {}> = {
  state: {
    data: {},
    logged: false,
  },
  getters: {
    data: state => state.data,
    logged: state => state.logged,
  },
  namespaced: true
};

export default module;