<template>
  <div class="sidebar">
    <div class="header">
      <img src="@/assets/welcome_picture_alpha.png" width="150" />
      Shared Checklists
    </div>
    <div class="nav">
      <template v-for="navItem in navItems">
        <router-link
          v-if="!navItem.requireAuth"
          :key="navItem.title"
          class="nav-item"
          active-class="active"
          :to="navItem.to"
        >
          <span class="icon"><Icon :name="navItem.icon" /></span>
          {{ navItem.title }}
        </router-link>
        <div v-else :key="navItem.title" class="nav-item disabled">
          <span class="icon"><Icon :name="navItem.icon" /></span>
          {{ navItem.title }}
          <router-link to="login">Log In</router-link>
        </div>
      </template>
      <!-- <router-link class="nav-item" active-class="active" to="/public">
        <span class="icon"><Icon :name="'todo-list'" /></span>
        Public Checklists
      </router-link>
      <div class="nav-item disabled">
        <span class="icon"><Icon :name="'todo-list'" /></span>
        My Checklists
        <router-link to="login">Log In</router-link>
      </div>
      <div class="nav-item disabled">
        <span class="icon"><Icon :name="'settings'" /></span>
        Settings
        <router-link to="login">Log In</router-link>
      </div>
      <router-link class="nav-item" active-class="active" to="/">
        <span class="icon"><Icon :name="'about'" /></span>
        About
      </router-link> -->
    </div>
    <div class="bottom">
      <router-link to="login"> Log In / Register </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import Icon from "@/components/Icon.vue";

export default defineComponent({
  name: "Sidebar",
  components: {
    Icon,
  },
  setup() {
    const navItems = ref([
      {
        title: "Public Checklists",
        icon: "todo-list",
        to: "public",
        requireAuth: false,
      },
      {
        title: "My Checklists",
        icon: "todo-list",
        to: "private",
        requireAuth: false,
      },
      {
        title: "Settings",
        icon: "settings",
        to: "settings",
        requireAuth: true,
      },
      { title: "About", icon: "about", to: "about", requireAuth: false },
    ]);
    // const filteredNavItems = computed(() => navItems.value.filter(i => i.))
    return {
      navItems,
    };
  },
});
</script>

<style lang="scss" scoped>
$border-radius: 2rem;
.sidebar {
  width: 350px;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff6;
  border-radius: $border-radius;

  .header {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 1rem 0;
    color: hsl(244, 69%, 37%);
    min-height: 3rem;
    font-size: 2rem;
    font-weight: bold;

    img {
      margin-bottom: 1rem;
    }
  }

  .nav {
    display: flex;
    flex-direction: column;
    padding: 1rem 1.5rem;

    .nav-item {
      padding: 0 0.8rem;
      display: flex;
      align-items: center;
      background: #fff7;
      border-radius: 1rem;
      margin: 0.5rem 0;
      text-decoration: none;
      color: #193199;
      font-size: 1.2rem;
      transition: 0.15s background ease;
      height: 50px;

      .icon {
        margin-right: 0.8rem;
        svg {
          fill: #193199;
        }
      }

      a {
        font-size: 0.8rem;
        text-decoration: none;
        color: inherit;
        border-radius: 0.5rem;
        border: none;
        padding: 0.4rem 0.5rem;
        background: #fffb;
        margin-left: auto;
        cursor: pointer;
        transition: 0.15s background ease;
        text-transform: uppercase;

        &:hover {
          background-color: #fff;
        }
      }

      &.disabled {
        background-color: #fff4;
      }

      &:not(.disabled) button {
        display: none;
      }

      &:not(.disabled):hover,
      &.active {
        background-color: #fff;
      }
    }
  }

  .bottom {
    margin-top: auto;
    min-height: 3rem;
    padding: 1rem;
    display: grid;
    place-content: center;

    a {
      text-decoration: none;
      background: linear-gradient(to bottom left, #00aeff, #67bacf);
      outline: none;
      color: #fff;
      font-size: 1.1rem;
      border: none;
      padding: 0.8rem 1rem;
      border-radius: 0.8rem;
      text-transform: uppercase;
      cursor: pointer;
    }
  }
}
</style>