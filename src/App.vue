<template>
  <aside class="sidebar-section" :class="{ opened: sidebarOpened }">
    <Sidebar />
  </aside>
  <div class="backdrop" @click="closeSidebar"></div>
  <nav class="navbar-section">
    <Navbar />
    <button class="toggler" :class="{ sidebarOpened }" @click="toggleSidebar">
      <Icon :name="sidebarOpened ? 'delete' : 'menu'" />
    </button>
  </nav>
  <main class="content-section" :class="{ sidebarOpened }">
    <router-view />
  </main>
</template>

<script lang="ts">
import { defineComponent, onUnmounted, ref } from "vue";
import store from "@/store";
import Navbar from "@/components/Navbar.vue";
import Sidebar from "@/components/Sidebar.vue";
import Icon from "@/components/Icon.vue";

export default defineComponent({
  name: "App",
  components: { Icon, Navbar, Sidebar },
  setup() {
    const sidebarOpened = ref(false);
    const closeSidebar = () => {
      sidebarOpened.value = false;
    };
    const toggleSidebar = () => {
      sidebarOpened.value = !sidebarOpened.value;
    };
    onUnmounted(() => {
      store.commit("stopFirebaseListeners");
    });

    return { closeSidebar, sidebarOpened, toggleSidebar };
  },
});
</script>

<style lang="scss">
@import "@/assets/scss/reset.scss";
@import "@/assets/scss/constants.scss";

$navbar-height: 4rem;
$sidebar-width: 20rem;

* {
  font-family: "Roboto", sans-serif;
}
html,
body,
#app {
  height: 100%;
  max-height: 100%;
}

html {
  overflow-y: scroll;
}

body {
  background-color: $dark-bg;
}

.backdrop {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  opacity: 0;
  background: #0007;
  z-index: 2020;
  transition: 0.15s opacity ease;
  transform: translateX(100%);
  cursor: pointer;
}

.navbar-section {
  position: fixed;
  z-index: 2021;
  bottom: 0;
  left: 0;
  right: 0;
  height: $navbar-height;
  background-color: $primary-color;
  display: flex;

  .toggler {
    background: none;
    border: none;
    border-radius: 2rem;
    transition: 0.15s background ease, 0.25s transform ease;
    width: 4rem;
    height: 4rem;
    display: grid;
    place-content: center;

    svg {
      fill: white;
      width: 1.5rem;
      height: 1.5rem;
    }
  }
  .toggler:hover {
    cursor: pointer;
  }
  .toggler.sidebarOpened {
    transform: rotate(-90deg);
  }
}
.sidebar-section {
  position: fixed;
  z-index: 2021;
  top: 0;
  bottom: $navbar-height;
  right: 0;
  width: $sidebar-width;
  background-color: $accent-color;
  transform: translateX(100%);
  transition: 0.15s transform ease;
  display: flex;
  flex-direction: column;

  &.opened {
    transform: translateX(0);
  }
}
.sidebar-section.opened ~ .backdrop {
  opacity: 1;
  transform: translateX(0);
}
.content-section {
  min-height: 100%;
  padding-bottom: $navbar-height;
  transition: 0.15s transform ease;
}
.container {
  padding: 3rem;
}

button.custom-button {
  padding: 10px 15px;
  font-size: 1.3rem;
  font-weight: bold;
  text-transform: uppercase;
  width: auto;
  color: white;
  border: 2px solid blueviolet;
  border-radius: 10px;
  cursor: pointer;
  outline: none;
  background-color: transparent;

  span {
    background: linear-gradient(-45deg, hsl(283, 90%, 67%), hsl(236, 100%, 65%));
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  &:hover {
    background: linear-gradient(-45deg, hsla(283, 90%, 67%, 0.15), hsl(236, 100%, 65%, 0.15));
  }

  &.icon {
    padding: 10px;
    border-radius: 100%;
  }

  &.fill {
    color: rgb(236, 226, 255);
    border: none;
    background: linear-gradient(-45deg, hsl(283, 90%, 67%), hsl(236, 100%, 65%));
    padding: 12px 17px;

    span {
      background: initial;
      background-clip: initial;
      -webkit-text-fill-color: initial;
    }

    &:hover {
      background: linear-gradient(-45deg, hsl(283, 56%, 57%), hsl(236, 69%, 53%));
    }
  }
}

// @media (max-width: 700px) {
//   .navbar-section {
//     .toggler {
//       display: grid;
//     }
//   }
//   .sidebar-section {
//     transform: translateX(-100%);
//   }
//   .content-section {
//     &.sidebarOpened {
//       padding-left: 0;
//       transform: translateX($sidebar-width);
//     }
//   }
// }
</style>
