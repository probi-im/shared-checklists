<template>
  <div class="home">
    <div class="header">
      <h1>Shared Checklist</h1>
      <button @click="logout">Logout</button>
    </div>

    <List />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import List from "@/components/List.vue";
import { useStore } from "vuex";

export default defineComponent({
  name: "Home",
  components: {
    List,
  },
  setup() {
    const store = useStore();

    const logout = () => {
      store.dispatch("logout");
    };

    return {
      logout,
    };
  },
});
</script>

<style lang="scss" scoped>
.header button {
  margin-left: auto;
  padding: 10px 15px;
  font-size: 1.2rem;
  width: auto;
  background: linear-gradient(-45deg, hsl(283, 90%, 67%), hsl(236, 100%, 65%));
  color: white;
  border: 2px solid blueviolet;
  border-radius: 10px;
  cursor: pointer;
  outline: none;
}
</style>
