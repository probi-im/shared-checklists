<template>
  <div class="register">
    <Header :title="'Register'" />
    <form @submit.prevent="register">
      <CustomInput :type="'email'" :placeholder="'Email address'" v-model.trim="email" required />
      <CustomInput :type="'password'" :placeholder="'Password'" v-model.trim="password" required />
      <CustomInput
        :type="'password'"
        :placeholder="'Password confirmation'"
        v-model.trim="passwordConfirmation"
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
import CustomInput from "@/components/CustomInput.vue";
import Header from "@/components/Header.vue";

export default defineComponent({
  name: "Register",
  components: { CustomInput, Header },
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
@import "@/assets/scss/constants.scss";

form {
  margin: 2rem auto 0;
  width: 100%;
  max-width: 60%;
  display: flex;
  flex-direction: column;
  align-items: center;

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
    color: $on-background-color;
    a {
      text-decoration: none;
      color: #3d9acf;
    }
  }
}
</style>