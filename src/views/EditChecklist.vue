<template>
  <div v-if="loadingChecklist || !baseChecklist" class="loading">Loading checklist details...</div>
  <div v-else class="edit-checklist">
    <div class="header">
      <div class="leading">
        <button class="back-button" @click="goBack"><Icon :name="'arrow'" /></button>
      </div>
      <div class="title">Edit the checklist</div>
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
import { updateChecklist } from "@/services/checklistService";
import { State } from "@/store";
import { computed, defineComponent, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import CustomInput from "@/components/CustomInput.vue";
import CustomSelect from "@/components/CustomSelect.vue";
import { Checklist } from "@/models/checklist";
import Icon from "@/components/Icon.vue";

export default defineComponent({
  name: "Edit Checklist",
  components: { CustomInput, CustomSelect, Icon },
  setup() {
    const store = useStore<State>();
    const router = useRouter();
    const route = useRoute();

    const checklist = ref<Checklist>();
    const loadingChecklist = computed(
      () =>
        !store.state.publicFirebaseListenersInitiated ||
        !store.state.privateFirebaseListenersInitiated
    );

    const checklistId = computed(() => route.params.checklistId as string);

    const baseChecklist = computed(() => {
      checklist.value =
        store.state.publicChecklists.find((c) => c.id === checklistId.value) ||
        store.state.privateChecklists.find((c) => c.id === checklistId.value);
      return checklist.value;
    });

    const update = async () => {
      if (!checklist.value) return;
      await updateChecklist(checklist.value);
      goBack();
    };

    const goBack = () => {
      router.push({ name: "private-checklists" });
    };

    return {
      baseChecklist,
      checklist,
      goBack,
      loadingChecklist,
      update,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "@/assets/scss/header.scss";

.edit-checklist {
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