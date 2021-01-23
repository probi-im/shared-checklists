<template>
  <div v-if="loadingChecklist" class="loading">Loading checklist details...</div>
  <div v-else class="edit-checklist">
    <div class="header">
      <div class="title">Edit the checklist</div>
      <div class="subtitle">Edit an existing checklist</div>
    </div>
    <div class="content">
      <form @submit.prevent="update">
        <CustomInput :placeholder="'Checklist name'" v-model.trim="checklist.name" required />
        <CustomInput :placeholder="'Checklist description'" v-model.trim="checklist.desc" />
        <CustomSelect
          v-model.trim="checklist.status"
          :options="[
            { value: 'public', label: 'Public' },
            { value: 'private', label: 'Private' },
          ]"
          required
        />
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
import CustomSelect from "@/components/CustomSelect.vue";
import { Checklist } from "@/models/checklist";

export default defineComponent({
  name: "Edit Checklist",
  components: { CustomInput, CustomSelect },
  setup() {
    const router = useRouter();
    const route = useRoute();

    const baseChecklist = ref<Checklist>();
    const checklist = ref<Checklist>();
    const loadingChecklist = ref(true);

    const update = async () => {
      if (!checklist.value) return;
      await updateChecklist(checklist.value);
      router.back();
    };

    const getChecklist = async () => {
      loadingChecklist.value = true;
      const checklistId = route.params.checklistId;

      if (!checklistId || checklistId === "" || checklistId.length === 0) return;

      const checklistResult = await getChecklistFromId(checklistId as string);
      if (!checklistResult) return;
      checklist.value = checklistResult;
      baseChecklist.value = Object.assign({}, checklist.value);
      loadingChecklist.value = false;
    };

    onMounted(async () => {
      await getChecklist();
    });

    return {
      checklist,
      loadingChecklist,
      update,
    };
  },
});
</script>

<style lang="scss" scoped>
.edit-checklist {
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