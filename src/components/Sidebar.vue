<template>
  <div class="sidebar">
    <div class="header">
      <img src="@/assets/welcome_picture_alpha.png" width="150" />
      Shared Checklists
    </div>
    <div class="nav">
      <template v-for="navItem in navItems">
        <router-link
          v-if="!navItem.disabled && (!navItem.requireAuth || user)"
          :key="navItem.title"
          class="nav-item"
          active-class="active"
          :to="navItem.to"
        >
          <span class="icon"><Icon :name="navItem.icon" /></span>
          {{ navItem.title }}
        </router-link>
        <div v-else-if="!navItem.disabled" :key="navItem.title" class="nav-item disabled">
          <span class="icon"><Icon :name="navItem.icon" /></span>
          {{ navItem.title }}
          <router-link to="login">Log In</router-link>
        </div>
      </template>
    </div>
    <div class="bottom">
      <router-link v-if="!user" to="login">
        <span>Log In / Register</span><Icon :name="'login'"
      /></router-link>
      <button v-else @click="logout"><span>Log Out</span><Icon :name="'logout'" /></button>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import Icon from "@/components/Icon.vue";
import { useStore } from "vuex";
import { State } from "@/store";

export default defineComponent({
  name: "Sidebar",
  components: {
    Icon,
  },
  setup() {
    const store = useStore<State>();
    const navItems = ref([
      {
        title: "New Checklist",
        icon: "add",
        to: { name: "new-checklist" },
        requireAuth: true,
      },
      {
        title: "Public Checklists",
        icon: "todo-list",
        to: { name: "public-checklists" },
        requireAuth: false,
      },
      {
        title: "My Checklists",
        icon: "todo-list",
        to: { name: "private-checklists" },
        requireAuth: true,
      },
      {
        title: "Settings",
        icon: "settings",
        to: { name: "settings" },
        requireAuth: true,
        disabled: true,
      },
      {
        title: "About",
        icon: "about",
        to: { name: "about" },
        requireAuth: false,
        disabled: true,
      },
    ]);

    const logout = () => store.dispatch("logout");

    return {
      logout,
      navItems,
      user: computed(() => store.state.user),
    };
  },
});
</script>

<style lang="scss" scoped>
@import "@/assets/scss/sidebar.scss";
</style>