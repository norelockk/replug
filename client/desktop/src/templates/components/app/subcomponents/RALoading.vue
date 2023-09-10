<template>
  <transition name='fade'>
    <div class='loading' v-if='loading'>
      <v-progress-circular :size='100' :width='10' color='white' indeterminate />
    </div>
  </transition>
</template>

<script lang='ts'>
import Vue from 'vue';
import { mapGetters } from 'vuex';

export default Vue.extend({
  computed: {
    ...mapGetters({
      loading: 'app/lShowing'
    })
  }
})
</script>

<style scoped>
.loading {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-pack: center;
  -moz-align-items: center;
  -ms-align-items: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  -moz-flex-direction: column;
  -ms-flex-direction: column;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -moz-justify-content: center;
  -ms-justify-content: center;
  -webkit-box-pack: center;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  color: #ffffff;
  height: 100vh;
  z-index: 1000000;
  background: #121212;
}

.fade-enter-active,
.fade-leave-active {
  transition: all .5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>