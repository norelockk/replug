import { RouteConfig } from 'vue-router'

const route: RouteConfig = {
  name: 'Home',
  path: '/',
  meta: {
    slot: 'navbar-action',
    layout: 'landing',
    middleware: 'layoutCheck'
  },
  component: async () => await import('@/templates/views/landing/LandingHome.vue'),
};

export default route;