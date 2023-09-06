<template>
  <div class='replug-landing'>
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
    RLContent: async () => await import('./subcomponents/RLContent.vue')
  }
});
</script>

<style scoped></style>