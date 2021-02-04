<template>
  <div v-if="loadingItem || !baseChecklist" class="loading">Loading item details...</div>
  <div v-else class="edit-item">
    <Header :title="'Edit the item'" :leadingIcon="true" />
    <form @submit.prevent="update">
      <CustomInput :placeholder="'Item name'" v-model.trim="item.text" required />
      <button type="submit"><span>Update</span></button>
    </form>
  </div>
</template>

<script lang="ts">
import { updateChecklist } from "@/services/checklistService";
import { State } from "@/store";
import { computed, defineComponent, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import CustomInput from "@/components/CustomInput.vue";
import { Checklist } from "@/models/checklist";
import { Item } from "@/models/item";
import Icon from "@/components/Icon.vue";
import Header from "@/components/Header.vue";

export default defineComponent({
  name: "Edit Item",
  components: { CustomInput, Header, Icon },
  setup() {
    const store = useStore<State>();
    const router = useRouter();
    const route = useRoute();

    const checklist = ref<Checklist>();
    const item = ref<Item>();

    const loadingItem = computed(
      () =>
        !store.state.publicFirebaseListenersInitiated ||
        !store.state.privateFirebaseListenersInitiated
    );

    const checklistId = computed(() => route.params.checklistId as string);
    const itemId = computed(() => route.params.itemId as string);

    const baseChecklist = computed(() => {
      checklist.value =
        store.state.publicChecklists.find((c) => c.id === checklistId.value) ||
        store.state.privateChecklists.find((c) => c.id === checklistId.value);
      item.value = checklist.value?.items.find((i) => i.id === itemId.value);
      if (!item.value) throw new Error("Unable to find the item");
      return checklist.value;
    });

    const update = async () => {
      if (!checklist.value) return;
      await updateChecklist(checklist.value);
      goBack();
    };

    const goBack = () => {
      router.push({
        name: "checklist-details",
        params: { checklistId: checklist.value?.id as string },
        query: { from: "private" },
      });
    };

    return {
      baseChecklist,
      item,
      goBack,
      loadingItem,
      update,
    };
  },
});
</script>

<style lang="scss" scoped>
.edit-item {
  form {
    margin: 2rem auto 0;
    width: 100%;
    max-width: 60%;
    display: flex;
    flex-direction: column;
    align-items: center;

    button {
      margin: 2rem 0;
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
      background: linear-gradient(to bottom left, #00aeff, #67bacf);
      transition: 0.15s opacity ease;

      &:hover {
        opacity: 0.7;
      }
    }
  }
}
</style>