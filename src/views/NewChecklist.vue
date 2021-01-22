<template>
  <div class="new-checklist">
    <div class="header">
      <div class="title">Create a new checklist</div>
      <div class="subtitle">Create a new public or private checklist</div>
    </div>
    <div class="content">
      <form @submit.prevent="create">
        <CustomInput :placeholder="'Checklist name'" v-model.trim="checklistName" required />
        <CustomInput :placeholder="'Checklist description'" v-model.trim="checklistDesc" required />
        <select name="checklistStatus" id="checklistStatus" v-model="checklistStatus" required>
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select>
        <button type="submit"><span>Create</span></button>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { createChecklist } from "@/services/checklistService";
import { State } from "@/store";
import { computed, defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import CustomInput from "@/components/CustomInput.vue";

export default defineComponent({
  name: "New Checklist",
  components: { CustomInput },
  setup() {
    const store = useStore<State>();
    const router = useRouter();
    const user = computed(() => store.state.user);

    const checklistDesc = ref("");
    const checklistName = ref("");
    const checklistStatus = ref("private");

    const create = async () => {
      if (!user.value) return;
      await createChecklist({
        allowedUsers: [user.value.id],
        createdBy: user.value.id,
        createdOn: new Date(),
        desc: checklistDesc.value,
        items: [],
        name: checklistName.value,
        status: checklistStatus.value,
        people: 1,
      });
      router.push({
        name: checklistStatus.value === "private" ? "private-checklists" : "public-checklists",
      });
    };

    return {
      checklistDesc,
      checklistName,
      checklistStatus,
      create,
    };
  },
});
</script>

<style lang="scss" scoped>
.new-checklist {
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

      select {
        width: 100%;
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
}
</style>