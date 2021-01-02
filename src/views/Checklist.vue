<template>
  <div class="checklist">
    <div class="header">
      <router-link to="home" class="icon"><Icon :name="'arrow'" /></router-link>
      <h1 v-if="!checklist">Loading checklist...</h1>
      <h1 v-else>{{ checklist.name }}</h1>
      <button
        v-if="checklist && !deleting && !deleted"
        class="custom-button icon"
        @click="deleteChecklist"
      >
        <Icon :name="'delete'" />
      </button>
    </div>
    <div v-if="checklist" class="list">
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
import { useStore, Store } from "vuex";
import { useRoute } from "vue-router";
import router from "@/router";
import * as fb from "../firebase";
import { Checklist, State } from "@/store";

export default defineComponent({
  name: "Checklist",
  components: {
    Icon,
  },
  setup() {
    const store: Store<State> = useStore();
    const route = useRoute();

    const contentLoaded = ref(true);
    const deleting = ref(false);
    const deleted = ref(false);

    let currentChecklistVersion: Checklist | undefined = undefined;

    const checklist = computed(() => {
      if (!deleting.value && !deleted.value) {
        currentChecklistVersion = store.state.checklists.find(
          (c: any) => c.id === route.query.id
        );
      }
      return currentChecklistVersion;
    });

    const sortedItems = computed(() => {
      return currentChecklistVersion?.items.slice().sort((a: any, b: any) => {
        return a.done === b.done ? 0 : a.done ? 1 : -1;
      });
    });

    const deleteChecklist = () => {
      if (deleting.value) return;
      deleting.value = true;
      store
        .dispatch("deleteChecklist", checklist.value)
        .then(() => {
          deleted.value = true;
          router.push("home");
        })
        .catch((e) => {
          deleted.value = false;
          console.log(e);
        })
        .finally(() => {
          deleting.value = false;
        });
    };

    return {
      checklist,
      contentLoaded,
      deleteChecklist,
      deleted,
      deleting,
      sortedItems,
    };
  },
});
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  align-items: center;

  a.icon {
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
  button {
    margin-left: auto;
    svg {
      fill: hsl(330, 85%, 44%);
    }
  }
}
h3 {
  margin-top: 25px;
}
.list:not(:empty) {
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
