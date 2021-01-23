<template>
  <div v-if="loadingChecklists" class="loadin">Loading checklists...</div>
  <div v-else class="public-checklists">
    <div class="header">
      <div class="title">Public Checklists</div>
      <!-- <div class="subtitle">List of public checklists available to everyone</div> -->
    </div>
    <div class="search">
      <CustomInput :placeholder="'Search'" v-model.trim="searchQuery" />
    </div>
    <div class="content">
      <List
        :items="filteredChecklists"
        :toRouteName="'public-checklist-details'"
        @list-updated="updateChecklists"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue";
import List from "@/components/List.vue";
import CustomInput from "@/components/CustomInput.vue";
import { getPublicChecklists } from "@/services/checklistService";
import { Checklist } from "@/models/checklist";

export default defineComponent({
  name: "Public Checklists",
  components: {
    CustomInput,
    List,
  },
  setup() {
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

    const updateChecklists = async () => {
      loadingChecklists.value = true;
      checklists.value = await getPublicChecklists();
      loadingChecklists.value = false;
    };

    onMounted(async () => {
      await updateChecklists();
    });

    return {
      searchQuery,
      filteredChecklists,
      loadingChecklists,
      updateChecklists,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "@/assets/scss/header.scss";

.public-checklists {
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
