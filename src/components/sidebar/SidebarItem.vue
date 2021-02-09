<template>
  <router-link v-if="!requireLogin" class="sidebar-item" active-class="active" :to="to">
    <span v-if="iconName" class="icon"><Icon :name="iconName" /></span>
    {{ label }}
    <div class="overlay"></div>
  </router-link>
  <div v-else class="sidebar-item disabled">
    <span v-if="iconName" class="icon"><Icon :name="iconName" /></span>
    {{ label }}
    <router-link to="login">Log In</router-link>
    <div class="overlay"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Icon from "@/components/Icon.vue";

export default defineComponent({
  name: "SidebarItem",
  props: {
    iconName: {
      type: String,
      default: "",
    },
    label: {
      type: String,
      required: true,
    },
    requireLogin: {
      type: Boolean,
      default: false,
    },
    to: {
      type: String,
      default: "",
    },
  },
  components: {
    Icon,
  },
});
</script>

<style lang="scss" scoped>
@import "@/assets/scss/constants.scss";

.sidebar-item {
  padding: 0 0.8rem;
  display: flex;
  align-items: center;
  border-radius: 0.5rem;
  // border: 1px solid white;
  text-decoration: none;
  color: $on-background-color;
  font-size: 1.2rem;
  transition: 0.15s background ease;
  height: 4rem;
  background: $background-color-08dp;
  position: relative;

  .icon {
    margin-right: 0.8rem;
    svg {
      fill: $on-background-color;
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
    .overlay {
      opacity: 0.12;
    }
  }

  &:not(.disabled) {
    button {
      display: none;
    }
    &:hover {
      .overlay {
        opacity: 0.4;
      }
    }
  }

  &:not(.disabled):hover,
  &.active {
    .overlay {
      opacity: 0.2;
    }
  }

  .overlay {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background: $overlay-color;
    opacity: 0;
    border-radius: inherit;
  }
}
</style>