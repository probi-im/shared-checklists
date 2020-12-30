<template>
  <div class="checklist">
    <div class="header">
      <router-link to="home" class="icon"><Icon :name="'arrow'" /></router-link>
      <h1>List 1</h1>
    </div>
    <h3 v-if="!contentLoaded">Loading checklist items...</h3>
    <div v-else class="list">
      <div
        v-for="item in sortedItems"
        :key="item.id"
        class="item"
        :class="{ done: item.done }"
      >
        <input
          type="checkbox"
          :name="item.id"
          :id="item.id"
          v-model="item.done"
        />
        <label :for="item.id">{{ item.text }}</label>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import Icon from "@/components/Icon.vue";

export default defineComponent({
  name: "Checklist",
  components: {
    Icon,
  },
  setup() {
    const contentLoaded = ref(false);
    const items = ref<any[]>([
      {
        id: 0,
        text: "First item",
        done: false,
      },
      {
        id: 1,
        text: "Second item",
        done: true,
      },
      {
        id: 2,
        text: "Third item",
        done: false,
      },
    ]);

    const sortedItems = computed(() => {
      return items.value.slice().sort((a, b) => {
        return a.done === b.done ? 0 : a.done ? 1 : -1;
      });
    });

    return {
      contentLoaded,
      sortedItems,
    };
  },
  created() {
    setTimeout(() => {
      this.contentLoaded = true;
    }, 2000);
  },
});
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  align-items: center;

  .icon {
    border: 2px solid hsl(244, 53%, 24%);
    border-radius: 100px;
    padding: 3px;
    transform: rotate(-180deg);
    cursor: pointer;

    svg {
      fill: hsl(244, 53%, 24%);
      transition: inherit;
      width: 20px;
      height: 20px;
      transform: translateX(1px);
    }
  }
  h1 {
    margin-left: 20px;
    color: hsl(244, 69%, 37%);
  }
}
h3 {
  margin-top: 25px;
}
.list {
  margin-top: 25px;

  .item {
    display: flex;
    align-items: center;
    padding: 0 15px;
    border: 2px solid darkgray;
    border-radius: 15px;
    cursor: pointer;

    &:not(:first-child) {
      margin-top: 15px;
    }
    input {
      cursor: inherit;
    }
    label {
      padding: 15px 0 15px 15px;
      flex: 1;
      font-size: 1.2rem;
      cursor: inherit;
    }
    &.done {
      border-color: lightgray;

      label {
        color: lightgray;
      }
    }
  }
}
</style>
