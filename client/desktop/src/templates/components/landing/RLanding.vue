<template>
  <div class='replug-landing'>
    <RBackground />
    <RLNavbar />
    <RLContent />
    <RLFooter />
  </div>
</template>

<script lang='ts'>
import Vue from 'vue';

export default Vue.extend({
  components: {
    RLNavbar: async () => await import('./subcomponents/RLNavbar.vue'),
    RLFooter: async () => await import('./subcomponents/RLFooter.vue'),
    RLContent: async () => await import('./subcomponents/RLContent.vue'),
    RBackground: async () => await import('../RBackground.vue'),
  }
});
</script>

<style scoped></style>