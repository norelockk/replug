import { router, store } from '@/vue';
import { RouteConfig } from 'vue-router'

const route: RouteConfig = {
  name: 'Home',
  path: '/',
  meta: {
    slot: 'navbar',
    layout: 'landing',
    middleware: 'layoutCheck'
  },
  component: async () => await import('@/templates/views/LandingHome.vue'),
};

export default route;