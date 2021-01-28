<template>
  <div v-if="loadingChecklists" class="loadin">Loading checklists...</div>
  <div v-else class="private-checklists">
    <div class="header">
      <div class="title">Private Checklists</div>
    </div>
    <div class="search">
      <CustomInput :placeholder="'Search'" v-model.trim="searchQuery" />
    </div>
    <div class="content">
      <List :items="filteredChecklists" :toRouteName="'private-checklist-details'" />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import { useStore } from "vuex";
import { State } from "@/store";
import CustomInput from "@/components/CustomInput.vue";
import List from "@/components/List.vue";
import { Checklist } from "@/models/checklist";

export default defineComponent({
  name: "Private Checklists",
  components: {
    CustomInput,
    List,
  },
  setup() {
    const store = useStore<State>();
    const searchQuery = ref("");

    const checklists = ref<Checklist[]>();
    const loadingChecklists = computed(() => !store.state.privateFirebaseListenersInitiated);

    const privateChecklists = computed(() => store.state.privateChecklists);

    const filteredChecklists = computed(() =>
      privateChecklists.value
        ?.filter(
          (c) =>
            c.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            c.desc?.toLowerCase().includes(searchQuery.value.toLowerCase())
        )
        .sort((a, b) => {
          return a.people < b.people ? 1 : a.people > b.people ? -1 : 0;
        })
    );
    const user = computed(() => store.state.user);

    return {
      searchQuery,
      checklists,
      filteredChecklists,
      loadingChecklists,
      user,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "@/assets/scss/header.scss";

.private-checklists {
  height: 100%;
  display: flex;
  flex-direction: column;

  .search {
    margin-top: 1rem;
    padding: 0 1rem;
  }

  .content {
    flex: 1;
    overflow: auto;
  }
}
</style>
