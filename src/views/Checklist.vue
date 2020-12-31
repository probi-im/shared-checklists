<template>
  <div class="checklist">
    <div class="header">
      <router-link to="home" class="icon"><Icon :name="'arrow'" /></router-link>
      <h1 v-if="!contentLoaded || !checklist">Loading checklist items...</h1>
      <h1 v-else>{{ checklist.name }}</h1>
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
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import * as fb from "../firebase";

export default defineComponent({
  name: "Checklist",
  components: {
    Icon,
  },
  setup() {
    const store = useStore();
    const route = useRoute();

    const contentLoaded = ref(false);
    const checklist = ref<any>({});
    const items = ref<any[]>([]);

    fb.checklistsCollection
      .doc(route.query.id as string)
      .collection("items")
      .orderBy("createdOn", "desc")
      .onSnapshot((snapshot) => {
        let nItems = [];
        for (const doc of snapshot.docs) {
          let item = doc.data();
          item.id = doc.id;
          nItems.push(item);
        }
        items.value = nItems;
        contentLoaded.value = true;
      });

    const sortedItems = computed(() => {
      return items.value.slice().sort((a: any, b: any) => {
        return a.done === b.done ? 0 : a.done ? 1 : -1;
      });
    });

    return {
      contentLoaded,
      sortedItems,
      checklist: computed(() =>
        store.state.checklists.find((c: any) => c.id === route.query.id)
      ),
    };
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
