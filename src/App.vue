<template>
  <main>
    <Sidebar />
    <section class="container">
      <router-view />
    </section>
  </main>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import store from "@/store";
import Sidebar from "@/components/Sidebar.vue";

export default defineComponent({
  name: "App",
  components: { Sidebar },
  mounted() {
    // store.dispatch("login", {
    //   email: "test@test.com",
    //   password: "testmdp",
    // });
  },
  unmounted() {
    store.commit("stopFirebaseListeners");
  },
});
</script>

<style lang="scss">
*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: Avenir, Helvetica, Arial, sans-serif;
}

html,
body {
  height: 100vh;
}

body {
  background: linear-gradient(to top right, #00aeff, #67bacf);
  display: flex;
  align-items: center;
  justify-content: center;
}

main {
  display: flex;
  background: linear-gradient(to top right, #fffa, #fff5);
  backdrop-filter: blur(1rem);
  border-radius: 30px;
  min-width: 1200px;
  width: 1200px;
  min-height: 700px;
  height: 700px;
  border: 1px solid #fffb;

  .container {
    flex: 1;
    padding: 3rem;
    // overflow: auto;
  }
}

.header {
  color: #261d9f;
  // display: flex;
  // align-items: center;
  .buttons {
    margin-left: auto;
    display: flex;
    align-items: center;
  }
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
input[type="text"].custom-input {
  width: 100%;
  padding: 10px 15px;
  border: 2px solid lightgray;
  border-radius: 10px;
  outline: none;
  font-size: 1.2rem;

  &:focus {
    border-color: gray;
  }
}

@media (max-width: 700px) {
  #app {
    width: 90vw;
    padding: 25px;
  }
  .header {
    flex-direction: column;
    text-align: center;

    .buttons {
      margin-top: 15px;
    }
  }
}
</style>
