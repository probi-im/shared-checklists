<template>
  <div v-if="loadingChecklists" class="loadin">Loading checklists...</div>
  <div v-else class="private-checklists">
    <div class="header">
      <div class="title">Private Checklists</div>
      <!-- <div class="subtitle">List of your private checklists</div> -->
    </div>
    <div class="search">
      <CustomInput :placeholder="'Search'" v-model.trim="searchQuery" />
    </div>
    <div class="content">
      <List
        :items="filteredChecklists"
        :toRouteName="'private-checklist-details'"
        @list-updated="updateChecklists"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue";
import { useStore, Store } from "vuex";
import { State } from "@/store";
import CustomInput from "@/components/CustomInput.vue";
import List from "@/components/List.vue";
import { getPrivateChecklistsFromUserId } from "@/services/checklistService";
import { Checklist } from "@/models/checklist";

export default defineComponent({
  name: "Private Checklists",
  components: {
    CustomInput,
    List,
  },
  setup() {
    const store: Store<State> = useStore();
    const searchQuery = ref("");

    const checklists = ref<Checklist[]>();
    const loadingChecklists = ref(true);

    const filteredChecklists = computed(() =>
      checklists.value
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

    const updateChecklists = async () => {
      loadingChecklists.value = true;
      if (!store.state.user) return;
      checklists.value = await getPrivateChecklistsFromUserId(store.state.user.id);
      loadingChecklists.value = false;
    };

    onMounted(async () => {
      await updateChecklists();
    });

    return {
      searchQuery,
      checklists,
      filteredChecklists,
      loadingChecklists,
      updateChecklists,
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
