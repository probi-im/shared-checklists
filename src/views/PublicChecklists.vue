<template>
  <div v-if="loadingChecklists" class="loadin">Loading checklists...</div>
  <div v-else class="public-checklists">
    <div class="header">
      <div class="title">Public Checklists</div>
      <div class="subtitle">List of public checklists available to everyone</div>
    </div>
    <div class="search">
      <input type="text" placeholder="Search" v-model.trim="searchQuery" />
    </div>
    <div class="content">
      <List :items="filteredChecklists" :toRouteName="'public-checklist-details'" />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue";
import List from "@/components/List.vue";
import { getPublicChecklists } from "@/services/checklistService";
import { Checklist } from "@/models/checklist";

export default defineComponent({
  name: "Public Checklists",
  components: {
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

    onMounted(async () => {
      checklists.value = await getPublicChecklists();
      loadingChecklists.value = false;
    });

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
