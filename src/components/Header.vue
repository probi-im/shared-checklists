<template>
  <div class="header" :class="{ centerText, leadingIcon }">
    {{ title }}
    <button v-if="leadingIcon" class="leading-button" @click="$router.back()">
      <Icon :name="leadingIconName" />
    </button>
    <button v-if="trailingIconName !== ''" class="trailing-button" @click="trailingAction">
      <Icon :name="trailingIconName" />
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Icon from "@/components/Icon.vue";

export default defineComponent({
  components: {
    Icon,
  },
  props: {
    centerText: {
      type: Boolean,
      default: true,
    },
    leadingIcon: {
      type: Boolean,
      default: false,
    },
    leadingIconName: {
      type: String,
      default: "arrow",
    },
    leadingAction: {
      type: Function,
      default: () => {},
    },
    title: {
      type: String,
      default: "",
    },
    trailingIconName: {
      type: String,
      default: "",
    },
    trailingAction: {
      type: Function,
      default: () => {},
    },
  },
});
</script>

<style lang="scss" scoped>
$button-size: 2.7rem;
$header-height: 4rem;
$button-spacing: ($header-height - $button-size) / 2;
.header {
  height: 4rem;
  background: #0005;
  position: relative;
  color: white;
  font-size: 2.2rem;
  display: flex;
  align-items: center;
  font-weight: bold;
  letter-spacing: 2px;
  padding-left: $header-height;
  text-transform: uppercase;

  &.centerText {
    padding-left: 0;
    justify-content: center;
  }

  &:not(.leadingIcon) {
    padding-left: 1.5rem;
  }

  .leading-button,
  .trailing-button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: $button-size;
    height: $button-size;
    background: none;
    border: none;
    border-radius: $button-size;
    display: grid;
    place-content: center;
    transition: 0.15s background ease;

    svg {
      fill: white;
    }
  }
  .leading-button:hover,
  .trailing-button:hover {
    background-color: #fff5;
    cursor: pointer;
  }
  .leading-button {
    left: $button-spacing;

    svg {
      transform: rotate(180deg);
    }
  }
  .trailing-button {
    right: $button-spacing;
  }
}
</style>