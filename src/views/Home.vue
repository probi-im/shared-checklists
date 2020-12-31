<template>
  <div class="home">
    <h1>Shared Checklist</h1>
    <List />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import List from "@/components/List.vue";

export default defineComponent({
  name: "Home",
  provide: {
    Symbol,
  },
  components: {
    List,
  },
});
</script>

<style lang="scss" scoped>
h1 {
  color: hsl(244, 69%, 37%);
}
</style>
