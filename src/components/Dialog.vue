<template>
  <div class="dialog" @click="exit">
    <div class="dialog-container" @click.stop>
      <div class="dialog-header">
        <h1>{{ title }}</h1>
      </div>
      <div class="dialog-content"><slot></slot></div>
      <div class="dialog-actions">
        <button v-if="exitButton.display" class="custom-button" @click="exit">
          <span>{{ exitButton.text }}</span>
        </button>
        <button
          v-if="confirmButton.display"
          class="custom-button fill"
          @click="confirm"
        >
          <span>{{ confirmButton.text }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useStore } from "vuex";

export default defineComponent({
  name: "Dialog",
  components: {},
  props: {
    confirmButton: {
      type: Object,
      default: {
        display: true,
        text: "Confirm",
      },
    },
    exitButton: {
      type: Object,
      default: {
        display: true,
        text: "Exit",
      },
    },
    title: {
      type: String,
      default: "Dialog container",
    },
  },
  setup(props) {
    // const displayDialog = ref(props.show);
    // return {
    //   displayDialog,
    // };
  },
  methods: {
    test() {
      console.log("test");
    },
    confirm() {
      this.$emit("confirm");
    },
    exit() {
      this.$emit("exit");
    },
  },
});
</script>

<style lang="scss" scoped>
.dialog {
  position: absolute;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  background-color: #0007;

  &-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    min-width: 200px;
    background-color: white;
    border-radius: 25px;
    box-shadow: 0 5px 20px #444;
    padding: 25px;
    display: flex;
    flex-direction: column;
  }

  &-header {
    margin-bottom: 15px;
  }

  &-content {
    flex: 1;
  }

  &-actions {
    display: flex;
    justify-content: space-between;
    margin-top: 15px;
  }
}

@media (max-width: 700px) {
  .dialog {
    &-container {
      width: 90vw;
    }

    &-header {
      font-size: 0.8rem;
    }
  }
}
</style>