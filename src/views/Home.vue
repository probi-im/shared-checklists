<template>
  <div class="home">
    <Header :title="'Home'" :leadingIcon="false" />
    <div class="container">
      <div class="section">
        <div class="title">Your Private Checklists</div>
        <div class="separator"></div>
        <div class="list">
          <button class="item">Shopping</button>
          <button class="item">Custom Checklist</button>
          <button class="item">Shopping</button>
          <button class="item">Custom Checklist</button>
          <button class="item">Shopping</button>
          <button class="item">Custom Checklist</button>
        </div>
      </div>
      <div class="section">
        <div class="title">Popular Public Checklists</div>
        <div class="separator"></div>
        <div class="list">
          <button class="item">Shopping</button>
          <button class="item">Custom Checklist</button>
          <button class="item">Shopping</button>
          <button class="item">Custom Checklist</button>
        </div>
      </div>
      <div class="section">
        <div class="title">Recent Tasks</div>
        <div class="separator"></div>
        <div class="list">
          <button class="item">Tomatoes</button>
          <button class="item">Graphics Card</button>
          <button class="item">Test item</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useStore } from "vuex";
import Header from "@/components/Header.vue";

export default defineComponent({
  name: "Home",
  components: {
    Header,
  },
  setup() {
    const store = useStore();

    return {};
  },
});
</script>

<style lang="scss" scoped>
@import "@/assets/scss/home.scss";
</style>
