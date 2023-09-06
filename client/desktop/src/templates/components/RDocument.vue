<template>
  <div>
    <v-container>
      <div class='my-4'>
        <h1 v-text='$props.documentTitle'></h1>
        <h5 class='font-weight-regular'>Last update: {{ $props.documentUpdated | moment("dddd, MMMM Do YYYY") }}</h5>
      </div>
      <div class='my-2'>
        <div
          v-for='(content, index) in $props.documentContent'
          :key='index'
          class='my-2'
        >
          <h2 v-text='`${index + 1}. ${content.title}`'></h2>
          <p v-if='typeof content.description === "string"' v-text='content.description'></p>
          <ul v-else-if='Array.isArray(content.description)'>
            <li
              v-for='(desc, index) in content.description'
              v-if='typeof desc === "string"'
              :key='index'
              v-text='desc'
              class='my-1'
            >
            </li>
            <li
              v-for='(desc, index) in content.description'
              :key='index'
              v-if='typeof desc === "object"'
              class='my-1'
            >
              <p class='font-weight-bold' style='margin-bottom: 0;' v-text='desc.title'></p>
              <ul>
                <li
                  v-for='(subdesc, subindex) in desc.description'
                  v-if='Array.isArray(subdesc) || typeof subdesc === "string"'
                  :key='subindex'
                  v-text='subdesc'
                >
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </v-container>
  </div>
</template>

<style scoped></style>

<script lang='ts'>
import Vue from 'vue';

export default Vue.extend({
  props: {
    documentTitle: {
      type: String,
      default: 'Document title',
      required: true
    },
    documentUpdated: {
      type: Number,
      default: 0,
      required: false
    },
    documentContent: {
      type: Array,
      required: true,
      default: () => []
    }
  }
});
</script>