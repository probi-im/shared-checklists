<template>
  <div class="private-checklists">
    <div class="header">
      <div class="title">Private Checklists</div>
      <div class="subtitle">List of your private checklists</div>
    </div>
    <div class="search">
      <input type="text" placeholder="Search" v-model.trim="searchQuery" />
    </div>
    <div class="content">
      <List :items="filteredChecklists" :toRouteName="'private-checklist-details'" />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import { useStore, Store } from "vuex";
import { State } from "@/store";
// import Icon from "@/components/Icon.vue";
import List from "@/components/List.vue";

export default defineComponent({
  name: "Private Checklists",
  components: {
    // Icon,
    List,
  },
  setup() {
    const store: Store<State> = useStore();
    const searchQuery = ref("");
    // const checklists = ref([
    //   {
    //     id: "0",
    //     title: "First checklist",
    //     subtitle: "This is a shopping list",
    //     people: 9,
    //   },
    //   {
    //     id: "1",
    //     title: "Second checklist",
    //     subtitle: "This is a todo list",
    //     people: 7,
    //   },
    // ]);

    const checklists = ref(store.state.checklists);

    const filteredChecklists = computed(() =>
      checklists.value
        .filter(
          (c) =>
            c.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            c.desc.toLowerCase().includes(searchQuery.value.toLowerCase())
        )
        .sort((a, b) => {
          return a.people < b.people ? 1 : a.people > b.people ? -1 : 0;
        })
    );

    return {
      searchQuery,
      checklists,
      filteredChecklists,
    };
  },
});
</script>

<style lang="scss" scoped>
.private-checklists {
  height: 100%;
  display: flex;
  flex-direction: column;
  .header {
    .title {
      font-size: 2.5rem;
      font-weight: bold;
    }
    .subtitle {
      font-size: 1.5rem;
    }
  }
  .search {
    margin-top: 2rem;
    input {
      width: 100%;
      padding: 1rem 2rem;
      border: none;
      border-radius: 3rem;
      font-size: 1.2rem;
      background: linear-gradient(
        to right bottom,
        rgba(255, 255, 255, 0.7),
        rgba(255, 255, 255, 0.3)
      );
      outline: none;

      &:focus {
        box-shadow: 0 0 1rem 0 #fff7;
      }

      &:not(:first-child) {
        margin-top: 1rem;
      }
    }
  }
  .content {
    margin-top: 2rem;
    flex: 1;
    overflow: auto;
  }
}
</style>
