<template>
  <div class="navbar">
    <router-link to="home" class="brand">
      <span class="label">Shared Checklists</span>
    </router-link>
    <div class="nav">
      <router-link to="home" class="nav-item home">
        <Icon :name="'home'" class="icon" />
        <span class="label">Home</span>
      </router-link>
      <router-link to="settings" class="nav-item">
        <Icon :name="'settings'" class="icon" />
        <span class="label">Settings</span>
      </router-link>
      <router-link to="about" class="nav-item">
        <Icon :name="'about'" class="icon" />
        <span class="label">About</span>
      </router-link>
      <router-link to="login" class="nav-item">
        <Icon :name="'github'" class="icon" />
        <span class="label">GitHub</span>
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Icon from "@/components/Icon.vue";

export default defineComponent({
  components: {
    Icon,
  },
});
</script>

<style lang="scss" scoped>
@import "@/assets/scss/navbar.scss";
</style>