<template>
  <div v-if="loadingItem" class="loading">Loading item details...</div>
  <div v-else class="edit-item">
    <div class="header">
      <div class="title">Edit the item</div>
      <div class="subtitle">Edit an existing item</div>
    </div>
    <div class="content">
      <form @submit.prevent="update">
        <CustomInput :placeholder="'Item name'" v-model.trim="item.text" required />
        <button type="submit"><span>Update</span></button>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { createChecklist, getChecklistFromId, updateChecklist } from "@/services/checklistService";
import { State } from "@/store";
import { computed, defineComponent, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import CustomInput from "@/components/CustomInput.vue";
import { Checklist } from "@/models/checklist";
import { Item } from "@/models/item";

export default defineComponent({
  name: "Edit Item",
  components: { CustomInput },
  setup() {
    const router = useRouter();
    const route = useRoute();

    const baseChecklist = ref<Checklist>();
    const checklist = ref<Checklist>();
    const loadingItem = ref(true);
    const item = ref<Item>();

    const update = async () => {
      if (!checklist.value) return;
      await updateChecklist(checklist.value);
      router.back();
    };

    const getChecklist = async () => {
      loadingItem.value = true;
      const checklistId = route.params.checklistId;
      const itemId = route.params.itemId;

      if (!checklistId || checklistId === "" || checklistId.length === 0) return;
      if (!itemId || itemId === "" || itemId.length === 0) return;

      const checklistResult = await getChecklistFromId(checklistId as string);
      if (!checklistResult) return;
      checklist.value = checklistResult;
      baseChecklist.value = Object.assign({}, checklist.value);
      item.value = checklist.value.items.find((i) => i.id === itemId);
      if (!item.value) throw new Error("Unable to find the item");
      loadingItem.value = false;
    };

    onMounted(async () => {
      await getChecklist();
    });

    return {
      item,
      loadingItem,
      update,
    };
  },
});
</script>

<style lang="scss" scoped>
.edit-item {
  .header {
    .title {
      font-size: 2.5rem;
      font-weight: bold;
    }
    .subtitle {
      font-size: 1.5rem;
    }
  }
  .content {
    display: flex;
    justify-content: center;
    form {
      margin-top: 25px;
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
}
</style>