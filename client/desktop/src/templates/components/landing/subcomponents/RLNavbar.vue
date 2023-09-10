<template>
  <v-app-bar app dense height='72px' elevation='0'>
    <v-btn v-for='(route, index) in availableLandingActions' :to='route.path' style='height: 100%;' tile plain x-large
      class='hidden-sm-and-down'
      elevation='0'>
      <span v-text='route.name'></span>
    </v-btn>

    <v-spacer class='hidden-sm-and-down' />

    <div class='d-flex align-center'>
      <h1 class='replug-logo'></h1>
    </div>

    <v-spacer class='hidden-xs-only' />

    <v-btn v-for='(route, index) in availableLandingRoutes' :to='route.path' :tile='route.path !== "/auth"'
      :plain='route.path !== "/auth"' :rounded='route.path === "/auth"'
      :color='route.path === "/auth" ? "blue darken-3" : "transparent"' elevation='0' class='hidden-xs-only'
      :x-large='route.path !== "/auth"'>
      <span v-text='route.name'></span>
    </v-btn>
  </v-app-bar>
</template>

<script lang='ts'>
import Vue from 'vue';
import { RouteConfig } from 'vue-router';

export default Vue.extend({
  data: () => ({
    availableLandingRoutes: [] as RouteConfig[],
    availableLandingActions: [] as RouteConfig[],
  }),
  methods: {
    navbarCreated(): void {
      const routes = this.$router.options.routes;

      for (const routeIndex in routes) {
        const index: number = parseInt(routeIndex);
        const route: RouteConfig = routes[index];

        if (route.meta?.layout && route.meta?.slot) {
          if (route.meta.layout !== 'landing') return;

          switch (route.meta.slot) {
            case 'navbar': {
              this.availableLandingRoutes.push(route);
              break;
            }
            case 'navbar-action': {
              this.availableLandingActions.push(route);
              break;
            }
          }
        }
      }

      this.availableLandingRoutes = this.availableLandingRoutes.sort((a, b) => a.path.length - b.path.length);
      this.availableLandingActions = this.availableLandingActions.sort((a, b) => a.path.length - b.path.length);
    }
  },
  created() {
    this.navbarCreated();
  }
});
</script>

<style scoped>
.v-app-bar {
  background-color: rgba(0, 0, 0, 0) !important;
  transition: all 0.25s ease;
}

.v-app-bar.v-app-bar--is-scrolled {
  background-color: rgba(0, 0, 0, 0.05) !important;
  backdrop-filter: blur(2.22px);
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
</style>