<template>
  <div class="login">
    <div class="header"><h1>Login</h1></div>
    <form @submit.prevent="login">
      <input
        v-model.trim="email"
        type="email"
        name="email"
        id="email"
        placeholder="Email address"
        required
      />
      <input
        v-model.trim="password"
        type="password"
        name="password"
        id="password"
        placeholder="Password"
        required
      />
      <button type="submit"><span>Login</span></button>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useStore } from "vuex";

export default defineComponent({
  name: "Login",
  components: {},
  setup() {
    const store = useStore();

    const email = ref("");
    const password = ref("");

    const login = () => {
      try {
        store.dispatch("login", {
          email: email.value,
          password: password.value,
        });
      } catch (e) {
        console.log(e);
      }
    };

    return {
      email,
      password,
      login,
    };
  },
});
</script>

<style lang="scss" scoped>
form {
  margin-top: 25px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  > *:not(:first-child) {
    margin-top: 15px;
  }

  input {
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

  button {
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
      background: linear-gradient(
        -45deg,
        hsl(283, 90%, 67%),
        hsl(236, 100%, 65%)
      );
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    &:hover {
      background: linear-gradient(
        -45deg,
        hsla(283, 90%, 67%, 0.15),
        hsl(236, 100%, 65%, 0.15)
      );
    }
  }
}
</style>