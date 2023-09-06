<template>
  <v-footer>
    <v-container>
      <v-layout
        fill-height
        row
        wrap
      >
        <!-- More links btw -->
        <v-flex md-3 pt-5 pl-5 sm-6 xs-12>
          <h2 class='mb-3'>More</h2>

          <v-card
            class='white--text'
            color='transparent'
            max-width='400px'
          >
            <v-list-item
              v-for="(link, index) in availableLandingRoutes"
              :key="index"
              :to="link.path"
              color='white'
            >
              <v-list-item-title>
                <v-icon>mdi-note-text</v-icon>&nbsp;
                <span v-text='link.name'></span>
              </v-list-item-title>
            </v-list-item>
          </v-card>
        </v-flex>

        <!-- Socials -->
        <v-flex md-3 pt-5 pl-5 sm-6 xs-12>
          <h2 class='mb-3'>
            <span>Socials</span>&nbsp;
            <v-icon>mdi-open-in-new</v-icon>
          </h2>

          <v-card
            class='white--text'
            color='transparent'
            max-width='400px'
          >
            <v-list-item
              v-for="(social, index) in socials"
              :key="index"
              :href="social.data.url"
              color='white'
              target='_blank'
            >
              <v-list-item-title>
                <v-icon v-text='`mdi-${social.platform}`'></v-icon>&nbsp;
                <span v-text='social.platform.charAt(0).toUpperCase() + social.platform.slice(1)'></span>
              </v-list-item-title>
            </v-list-item>
          </v-card>
        </v-flex>
      </v-layout>

      <v-layout
        row
      >
        <v-flex
          xs-12
          class='text-center'
        >
          <v-card-text
            class='white--text text-xs-center'
          >
            <span>&copy; {{ cy }} <strong>dreamy.codes</strong></span>
            <br>
            <pre>v{{ version.array.join('.') }}-{{ version.codename }} / {{ version.hash }}</pre>
          </v-card-text>
        </v-flex>
      </v-layout>
    </v-container>
  </v-footer>
</template>

<script lang='ts'>
import Vue from 'vue';
import { RouteConfig } from 'vue-router';
import { mapGetters } from 'vuex';

export default Vue.extend({
  data: () => ({
    cy: new Date().getFullYear(),
    availableLandingRoutes: [] as RouteConfig[]
  }),
  computed: {
    ...mapGetters({
      socials: 'replug/socials',
      version: 'replug/version'
    })
  },
  methods: {
    footerCreated(): void {
      const routes = this.$router.options.routes;

      for (const routeIndex in routes) {
        const index: number = parseInt(routeIndex);
        const route: RouteConfig = routes[index];

        if (route.meta?.layout && route.meta?.slot)  {
          if (route.meta.layout === 'landing' && route.meta?.slot === 'footer')
            this.availableLandingRoutes.push(route);
        }
      }
    }
  },
  created() {
    this.footerCreated();
  }
});
</script>

<style scoped>
.v-footer {
  background-color: rgba(0, 0, 0, 0.05) !important;
  backdrop-filter: blur(30px);
}

.v-sheet.v-card:not(.v-sheet--outlined) {
  box-shadow: none !important;
}
</style>