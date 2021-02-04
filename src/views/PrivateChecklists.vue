<template>
  <div v-if="loadingChecklists" class="loading">Loading checklists...</div>
  <div v-else class="private-checklists">
    <Header :title="'Private Checklists'" />
    <div class="search">
      <CustomInput :placeholder="'Search (name, description, ID)'" v-model.trim="searchQuery" />
    </div>
    <form v-if="user" @submit.prevent="addExistingChecklist" class="add-div">
      <CustomInput
        :placeholder="'Existing checklist ID'"
        v-model.trim="existingChecklistId"
        required
      />
      <button type="submit">
        <Icon :name="'add'" />
      </button>
    </form>
    <List :items="filteredChecklists" :toRouteName="'checklist-details'" :from="'private'" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import { useStore } from "vuex";
import { State } from "@/store";
import CustomInput from "@/components/CustomInput.vue";
import List from "@/components/List.vue";
import { Checklist } from "@/models/checklist";
import { joinChecklist } from "@/services/checklistService";
import Icon from "@/components/Icon.vue";
import Header from "@/components/Header.vue";

export default defineComponent({
  name: "Private Checklists",
  components: {
    CustomInput,
    Header,
    Icon,
    List,
  },
  setup() {
    const store = useStore<State>();
    const searchQuery = ref("");
    const existingChecklistId = ref("");

    const checklists = ref<Checklist[]>();
    const loadingChecklists = computed(() => !store.state.privateFirebaseListenersInitiated);

    const privateChecklists = computed(() => store.state.privateChecklists);

    const filteredChecklists = computed(() =>
      privateChecklists.value
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
    const user = computed(() => store.state.user);

    const addExistingChecklist = async () => {
      if (existingChecklistId.value === "" || !user.value) return;
      await joinChecklist(existingChecklistId.value, user.value.id);
      existingChecklistId.value = "";
    };

    return {
      addExistingChecklist,
      checklists,
      existingChecklistId,
      filteredChecklists,
      loadingChecklists,
      searchQuery,
      user,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "@/assets/scss/constants.scss";

.private-checklists {
  height: 100%;
  display: flex;
  flex-direction: column;

  .search {
    margin-top: 1rem;
    padding: 0 1rem;
  }
  .add-div {
    margin: 1rem 1rem 0;
    padding: 1rem;
    display: flex;
    background: #fff5;
    border-radius: 1rem;

    button {
      margin-left: 1rem;
      padding: 0.8rem 1rem;
      font-size: 1.3rem;
      font-weight: bold;
      text-transform: uppercase;
      width: auto;
      color: white;
      border: none;
      border-radius: 0.8rem;
      cursor: pointer;
      outline: none;
      background: $accent-gradient;
      transition: 0.15s opacity ease;

      svg {
        fill: white;
      }

      &:hover {
        opacity: 0.7;
      }
    }
  }
}
</style>
