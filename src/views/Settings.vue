<template>
  <div class="settings">
    <Header :title="'Settings'" :leadingIcon="false" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Header from "@/components/Header.vue";

export default defineComponent({
  name: "Settings",
  components: {
    Header,
  },
});
</script>