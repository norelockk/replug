import { RouteConfig } from 'vue-router'

const route: RouteConfig = {
  name: 'Terms of service',
  path: '/tos',
  meta: {
    slot: 'footer',
    layout: 'landing',
  },
  component: async () => await import('@/templates/views/landing/LandingTerms.vue')
};

export default route;