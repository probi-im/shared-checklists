<template>
  <div v-if="loadingChecklists" class="loading">Loading checklists...</div>
  <div v-else class="public-checklists">
    <Header :title="'Public Checklists'" />
    <div class="search">
      <CustomInput :placeholder="'Search (name, description, ID)'" v-model.trim="searchQuery" />
    </div>
    <List :items="filteredChecklists" :toRouteName="'checklist-details'" :from="'public'" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import List from "@/components/List.vue";
import CustomInput from "@/components/CustomInput.vue";
import { useStore } from "vuex";
import { State } from "@/store";
import Header from "@/components/Header.vue";

export default defineComponent({
  name: "Public Checklists",
  components: {
    CustomInput,
    Header,
    List,
  },
  setup() {
    const searchQuery = ref("");
    const store = useStore<State>();

    const loadingChecklists = computed(() => !store.state.publicFirebaseListenersInitiated);

    const publicChecklists = computed(() => store.state.publicChecklists);

    const filteredChecklists = computed(() =>
      publicChecklists.value
        ?.filter(
          (c) =>
            c.id?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            c.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            c.desc?.toLowerCase().includes(searchQuery.value.toLowerCase())
        )
        .sort((a, b) => {
          return a.people < b.people ? 1 : a.people > b.people ? -1 : 0;
        })
    );

    return {
      searchQuery,
      filteredChecklists,
      loadingChecklists,
    };
  },
});
</script>

<style lang="scss" scoped>
.public-checklists {
  height: 100%;
  display: flex;
  flex-direction: column;

  .search {
    margin-top: 1rem;
    padding: 0 1rem;
  }
}
</style>
