<template>
  <div class='replug-app'>
    <RALoading />
  </div>
</template>

<script lang='ts'>
import Vue from 'vue';

export default Vue.extend({
  components: {
    RALoading: async () => await import('./subcomponents/RALoading.vue')
  }
});
</script>

<style scoped></style>