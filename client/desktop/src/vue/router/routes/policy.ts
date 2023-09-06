import { RouteConfig } from 'vue-router'

const route: RouteConfig = {
  name: 'Privacy policy',
  path: '/privacy',
  meta: {
    slot: 'footer',
    layout: 'landing',
  },
  // component: async () => await import('@/templates/views/LandingHome.vue')
};

export default route;