import { store } from '@/vue';
import { NavigationGuardNext, Route } from 'vue-router';

export default function (to: Route, from: Route, next: NavigationGuardNext) {
  const currentLayout: string = store.getters['replug/layout'];

  if (to.meta?.layout && currentLayout !== to.meta.layout) {
    switch (currentLayout) {
      case 'app': return next('/app');
      case 'landing': return next('/');
      default:
        throw 'undefined layout';
    }
  }
}