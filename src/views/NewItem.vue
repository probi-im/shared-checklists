<template>
  <div class="new-item">
    <div class="header">
      <div class="title">Add a new item</div>
      <div class="subtitle">Add a new item to the checklist</div>
    </div>
    <div class="content">
      <form @submit.prevent="add">
        <input
          v-model.trim="itemName"
          type="text"
          name="itemName"
          id="itemName"
          placeholder="Item name"
          required
        />
        <button type="submit"><span>Add</span></button>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { Checklist } from "@/models/checklist";
import { addItemToChecklist, getChecklistFromId } from "@/services/checklistService";
import { State } from "@/store";
import { computed, defineComponent, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { v4 as uuid4 } from "uuid";

export default defineComponent({
  name: "New Item",
  components: {},
  setup() {
    const store = useStore<State>();
    const route = useRoute();
    const router = useRouter();

    const user = computed(() => store.state.user);

    const checklist = ref<Checklist>();
    const loadingChecklist = ref(true);

    const itemName = ref("");

    const add = async () => {
      if (!user.value || !checklist.value || !checklist.value.id) return;
      await addItemToChecklist(
        {
          id: uuid4(),
          // createdBy: user.value.id,
          createdBy: "",
          createdOn: new Date(),
          text: itemName.value,
          done: false,
        },
        checklist.value.id
      );
      router.push({
        name: "private-checklist-details",
        params: { checklistId: checklist.value.id },
      });
    };

    const getChecklist = async () => {
      loadingChecklist.value = true;
      const checklistId = route.params.checklistId;

      if (!checklistId || checklistId === "" || checklistId.length === 0) return;

      const checklistResult = await getChecklistFromId(checklistId as string);
      if (!checklistResult) return;
      checklist.value = checklistResult;
      loadingChecklist.value = false;
    };

    onMounted(async () => {
      await getChecklist();
    });

    return {
      itemName,
      add,
    };
  },
});
</script>

<style lang="scss" scoped>
.new-item {
  .header {
    .title {
      font-size: 2.5rem;
      font-weight: bold;
    }
    .subtitle {
      font-size: 1.5rem;
    }
  }
  form {
    margin-top: 25px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

    input,
    select {
      width: 100%;
      max-width: 60%;
      padding: 0.8rem 1rem;
      border: none;
      border-radius: 2rem;
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