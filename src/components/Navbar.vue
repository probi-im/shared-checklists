<template>
  <div class="navbar">
    <router-link to="home" class="brand">
      <span class="label">Shared Checklists</span>
    </router-link>
    <div class="nav">
      <router-link
        v-for="navItem in navItems"
        :key="navItem.label"
        :to="{ name: navItem.toName }"
        class="nav-item home"
      >
        <Icon :name="navItem.iconName" class="icon" />
        <span class="label">{{ navItem.label }}</span>
      </router-link>
      <a href="https://github.com" target="_blank" class="nav-item external-link">
        <Icon :name="'github'" class="icon" />
        <span class="label">GitHub</span>
        <Icon :name="'blank_open'" class="icon small" />
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import Icon from "@/components/Icon.vue";

export default defineComponent({
  components: {
    Icon,
  },
  setup() {
    const navItems = ref([
      {
        label: "Home",
        iconName: "home",
        toName: "home",
      },
      {
        label: "Settings",
        iconName: "settings",
        toName: "settings",
      },
      {
        label: "About",
        iconName: "about",
        toName: "about",
      },
    ]);

    return {
      navItems,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "@/assets/scss/navbar.scss";
</style>