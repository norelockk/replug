import { RouteConfig } from "vue-router";

const route: RouteConfig = {
  path: '/:pathMatch(.*)',
  component: async () => await import('@/templates/views/global/GlobalNotFound.vue')
};

export default route;