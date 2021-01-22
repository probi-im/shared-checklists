<template>
  <select
    class="custom-select"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
    :required="required"
  >
    <option v-for="option in options" :key="option.value" :value="option.value">
      {{ option.label }}
    </option>
  </select>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Custom Select",
  props: {
    modelValue: String,
    options: {
      type: Array,
      required: true,
    },
    required: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:modelValue"],
  setup() {},
});
</script>

<style lang="scss" scoped>
select.custom-select {
  width: 100%;
  padding: 1rem 2rem;
  border: none;
  border-radius: 2rem;
  font-size: 1.2rem;
  background: linear-gradient(to right bottom, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.3));
  outline: none;

  &:focus {
    box-shadow: 0 0 1rem 0 #fff7;
  }

  &:not(:first-child) {
    margin-top: 1rem;
  }
}
</style>