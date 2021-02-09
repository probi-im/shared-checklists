<template>
  <div class="sidebar">
    <div class="nav">
      <SidebarItem
        v-for="navItem in navItems"
        :key="navItem.title"
        :iconName="navItem.icon"
        :label="navItem.title"
        :to="navItem.to"
        :requireLogin="!navItem.disabled && navItem.requireAuth && !user"
      />
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
import SidebarItem from "@/components/sidebar/SidebarItem.vue";
import { useStore } from "vuex";
import { State } from "@/store";

export default defineComponent({
  name: "Sidebar",
  components: {
    Icon,
    SidebarItem,
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
      navItems: navItems.value.filter((i) => !i.disabled),
      user: computed(() => store.state.user),
    };
  },
});
</script>

<style lang="scss" scoped>
@import "@/assets/scss/sidebar.scss";
</style>