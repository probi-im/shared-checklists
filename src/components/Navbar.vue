<template>
  <div class="navbar">
    <router-link to="home" class="brand">Shared Checklists</router-link>
    <div class="nav">
      <router-link to="settings" class="nav-item">Settings</router-link>
      <router-link to="about" class="nav-item">About</router-link>
      <router-link to="home" class="nav-item">GitHub</router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({});
</script>

<style lang="scss" scoped>
@import "@/assets/scss/navbar.scss";
</style>