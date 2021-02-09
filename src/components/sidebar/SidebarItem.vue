<template>
  <router-link v-if="!requireLogin" class="sidebar-item" active-class="active" :to="to">
    <span v-if="iconName" class="icon"><Icon :name="iconName" /></span>
    {{ label }}
    <div class="overlay"></div>
  </router-link>
  <div v-else class="sidebar-item disabled">
    <span v-if="iconName" class="icon"><Icon :name="iconName" /></span>
    {{ label }}
    <router-link to="login"
      >Log In
      <div class="overlay"></div
    ></router-link>
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
      type: Object,
      required: true,
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
  padding: 0 1rem;
  display: flex;
  align-items: center;
  border-radius: 0.5rem;
  border: 2px solid $dark-border-color;
  text-decoration: none;
  color: $on-background-color;
  font-size: 1.2rem;
  height: 4rem;
  background: $background-color-03dp;
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
    color: $on-background-color;
    border-radius: 0.5rem;
    border: none;
    padding: 0.4rem 0.5rem;
    background: $background-color-24dp;
    margin-left: auto;
    cursor: pointer;
    text-transform: uppercase;
    position: relative;

    &:hover {
      .overlay {
        opacity: 0.04;
      }
    }
    &:focus {
      .overlay {
        opacity: 0.12;
      }
    }
  }

  &.disabled {
    color: $text-disabled-color;
    border-color: $dark-disabled-border-color;
    .icon {
      svg {
        fill: $text-disabled-color;
      }
    }
  }

  &:not(.disabled) {
    button {
      display: none;
    }
    &:hover {
      .overlay {
        opacity: 0.04;
      }
    }
    &:focus,
    &.active {
      .overlay {
        opacity: 0.12;
      }
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
    transition: 0.15s opacity ease;
    pointer-events: none;

    &:hover {
      opacity: 0.04;
    }
  }
}
</style>