<template>
  <div class="register">
    <div class="header"><h1>Register</h1></div>
    <form @submit.prevent="register">
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
      <input
        v-model.trim="passwordConfirmation"
        type="password"
        name="passwordConfirmation"
        id="passwordConfirmation"
        placeholder="Password confirmation"
        required
      />
      <button type="submit"><span>Register</span></button>
      <h3>
        Already have an account ?
        <router-link to="login">Log in here</router-link>
      </h3>
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
    const passwordConfirmation = ref("");

    const register = () => {
      if (password.value !== passwordConfirmation.value) return;
      try {
        store.dispatch("register", {
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
      passwordConfirmation,
      register,
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

  h3 {
    a {
      text-decoration: none;
      color: hsl(268, 100%, 65%);
    }
  }
}
</style>