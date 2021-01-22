<template>
  <input
    class="custom-input"
    :type="type"
    :placeholder="placeholder"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "Custom Input",
  props: {
    modelValue: String,
    type: {
      type: String,
      default: "text",
      validate: (i) => ["text", "email", "password"].includes(i),
    },
    placeholder: {
      type: String,
      default: "",
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
input.custom-input {
  width: 100%;
  padding: 1rem 2rem;
  border: none;
  border-radius: 3rem;
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