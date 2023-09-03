<template>
  <v-app class='replug'>
    <v-main>
      <transition name='fade' mode='out-in'>
        <RApp v-if='layout === "app"' />
        <RLanding v-if='layout === "landing"' />
      </transition>
    </v-main>
  </v-app>
</template>

<script lang='ts'>
import Vue from 'vue';
import { mapGetters } from 'vuex';

export default Vue.extend({
  computed: {
    ...mapGetters({
      layout: 'replug/layout'
    })
  },
  components: {
    RApp: async () => await import('./components/app/RApp.vue'),
    RLanding: async () => await import('./components/landing/RLanding.vue'),
  }
});
</script>

<style>
html {
  overflow-y: auto;
}

.v-application {
  font-family: 'Poppins', sans-serif;
}
</style>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 1.15s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>