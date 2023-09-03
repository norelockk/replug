<template>
  <div>
    <v-parallax
      src=''
    >
      <v-row
        align='center'
        justify='center'
      >
        <v-col
          class='text-center text-white replug-slogans'
          cols='12'
        >
          <h1 class='replug-logo'></h1>
          <h3 style='font-weight: 200; letter-spacing: 6px;'>Music is everything</h3>
          <h6 style='font-weight: 400; letter-spacing: 2px;'>Join a party. Be a DJ. Or just listen.</h6>

          <div class='my-5'>
            <h5 style='font-weight: 900;' v-if="!preDev">Coming soon.</h5>
            <v-btn
              elevation='0'
              v-else
              @click='access'
              color='transparent'
              style='backdrop-filter: blur(30px); background-color: rgba(0, 0, 0, 0.05) !important;'
            >
              <v-icon>mdi-door-sliding-lock</v-icon>
              <span>&nbsp;Access to indev</span>
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-parallax>

    <!-- temp iframe -->
    <!-- <iframe ref='iframe' frameborder='0' src='youtube.html'></iframe> -->
  </div>
</template>

<script lang='ts'>
import { IS_DEVELOPMENT } from '@/const';
import { mapGetters } from 'vuex';
import Vue from 'vue';

export default Vue.extend({
  data: () => ({
    preDev: IS_DEVELOPMENT,
  }),
  methods: {
    access(): void {
      this.$store.commit('replug/setLayout', 'app');

      setTimeout(this.$store.commit, 3000, 'replug/setLayout', 'landing');
    }
  },
  computed: {
    ...mapGetters({
      socials: 'replug/socials'
    })
  }
});
</script>

<style scoped>
.replug-logo {
  font-size: 3rem;
  font-weight: 500;
}

.replug-slogans {
  user-select: none;
  font-family: 'Poppins', sans-serif;
  touch-action: none;
}

.replug-logo::before {
  content: 'replug';
}
</style>