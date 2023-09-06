<template>
  <div class='replug-landing-content'>
    <RBackground />

    <transition name='fade' mode='out-in'>
      <router-view />
    </transition>
  </div>
</template>

<script lang='ts'>
import Vue from 'vue';

export default Vue.extend({
  components: {
    RBackground: async () => await import('../../RBackground.vue')    
  }
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all .65s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>