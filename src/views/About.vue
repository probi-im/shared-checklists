<template>
  <div class="about">
    <Header :title="'About'" :leadingIcon="false" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Header from "@/components/Header.vue";

export default defineComponent({
  name: "About",
  components: {
    Header,
  },
});
</script>