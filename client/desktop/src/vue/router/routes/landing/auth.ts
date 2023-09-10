import { RouteConfig } from "vue-router";

const route: RouteConfig = {
  path: '/auth',
  name: 'Sign in',
  meta: {
    slot: 'navbar',
    layout: 'landing',
    middleware: 'layoutCheck'
  },
  component: async () => await import('@/templates/views/landing/LandingAuth.vue')
};

export default route;