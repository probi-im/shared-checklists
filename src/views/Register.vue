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
.register {
  .header h1 {
    font-size: 2.75rem;
    text-transform: uppercase;
  }
}
form {
  margin-top: 25px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  input {
    width: 100%;
    max-width: 60%;
    padding: 0.8rem 1rem;
    border: none;
    border-radius: 2rem;
    font-size: 1.2rem;
    background: linear-gradient(
      to right bottom,
      rgba(255, 255, 255, 0.7),
      rgba(255, 255, 255, 0.3)
    );
    outline: none;

    &:focus {
      box-shadow: 0 0 1rem 0 #fff7;
    }

    &:not(:first-child) {
      margin-top: 1rem;
    }
  }

  button {
    margin: 2rem 0;
    padding: 0.8rem 1rem;
    font-size: 1.3rem;
    font-weight: bold;
    text-transform: uppercase;
    width: auto;
    color: white;
    border: none;
    border-radius: 0.8rem;
    cursor: pointer;
    outline: none;
    background: linear-gradient(to bottom left, #00aeff, #67bacf);
    transition: 0.15s opacity ease;

    &:hover {
      opacity: 0.7;
    }
  }

  h3 {
    a {
      text-decoration: none;
      color: #3d9acf;
    }
  }
}
</style>