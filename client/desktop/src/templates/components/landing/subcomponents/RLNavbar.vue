<template>
  <v-app-bar
    app
    dense
    height='72px'
    elevation='0'
  >
    <div class='rp-left hidden-sm-and-down'>
      <v-btn
        tile
        plain
        x-large
        elevation='0'
      >
        <span>Action test</span>
      </v-btn>

      <v-spacer />
    </div>

    <div class='d-flex align-center'>
      <h1 class='replug-logo'></h1>
    </div>

    <div class='d-flex rp-right hidden-xs-only'>
      <v-spacer />

      <v-btn
        v-for='(route, index) in availableLandingRoutes'
        :key='index'
        :to='route.path'
        tile
        plain
        class='hidden-xs-only'
        x-large
        elevation='0'
      >
        <span v-text='route.name'></span>
      </v-btn>
    </div>
  </v-app-bar>
</template>

<script lang='ts'>
import Vue from 'vue';
import { RouteConfig } from 'vue-router';

export default Vue.extend({
  data: () => ({
    availableLandingRoutes: [] as RouteConfig[],
  }),
  methods: {
    navbarCreated(): void {
      const routes = this.$router.options.routes;

      for (const routeIndex in routes) {
        const index: number = parseInt(routeIndex);
        const route: RouteConfig = routes[index];

        if (route.meta?.layout && route.meta.layout === 'landing')  {
          this.availableLandingRoutes.push(route);
        }
      }
    }
  },
  created() {
    this.navbarCreated();
  }
});
</script>

<style scoped>
.v-app-bar {
  background-color: rgba(0, 0, 0, 0.05) !important;
  backdrop-filter: blur(30px);
}

.replug-logo {
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  user-select: none;
  touch-action: none;
}

.replug-logo::before {
  content: 'replug';
}

.v-btn {
  height: 100% !important;
  background-color: transparent !important;
}

.rp-left, .rp-right {
  width: 100%;
  height: 100%;
}
</style>