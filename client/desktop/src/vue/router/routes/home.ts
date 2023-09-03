import { RouteConfig } from 'vue-router'

const route: RouteConfig = {
  name: 'Home',
  path: '/',
  meta: {
    layout: 'landing'
  },
  component: async () => await import('@/templates/views/LandingHome.vue')
};

export default route;