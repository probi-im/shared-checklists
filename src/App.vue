<template>
  <section class="sidebar">
    <Sidebar />
  </section>
  <section class="navbar">
    <Navbar />
  </section>
  <main class="content">
    <router-view />
  </main>
</template>

<script lang="ts">
import { defineComponent, onUnmounted } from "vue";
import store from "@/store";
import Navbar from "@/components/Navbar.vue";
import Sidebar from "@/components/Sidebar.vue";

export default defineComponent({
  name: "App",
  components: { Navbar, Sidebar },
  setup() {
    onUnmounted(() => {
      store.commit("stopFirebaseListeners");
    });
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
  height: 100vh;
}

body {
  background-color: $accent-color;
}

.navbar {
  position: fixed;
  z-index: 2021;
  top: 0;
  left: 0;
  right: 0;
  height: $navbar-height;
  background-color: $primary-color;
}
.sidebar {
  position: fixed;
  z-index: 2021;
  top: $navbar-height;
  bottom: 0;
  left: 0;
  width: $sidebar-width;
  background-color: $secondary-color;
}
.content {
  height: 100%;
  padding: $navbar-height 0 0 $sidebar-width;
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
// input[type="text"].custom-input {
//   width: 100%;
//   padding: 10px 15px;
//   border: 2px solid lightgray;
//   border-radius: 10px;
//   outline: none;
//   font-size: 1.2rem;

//   &:focus {
//     border-color: gray;
//   }
// }

// @media (max-width: 700px) {
//   #app {
//     width: 90vw;
//     padding: 25px;
//   }
//   .header {
//     flex-direction: column;
//     text-align: center;

//     .buttons {
//       margin-top: 15px;
//     }
//   }
// }
</style>
