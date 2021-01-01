<template>
  <div class="home">
    <div class="header">
      <h1>Shared Checklist</h1>
      <button class="custom-button icon" @click="showAddListDialog">
        <Icon :name="'plus'" />
      </button>
      <button class="custom-button icon" @click="showCreateNewListDialog">
        <Icon :name="'edit'" />
      </button>
      <button @click="logout" class="custom-button"><span>Logout</span></button>
    </div>

    <List />

    <Dialog
      v-if="displayAddListDialog"
      title="Add an existing Shared Checklist"
      :confirmButton="{ text: 'Add', display: true }"
      :exitButton="{ text: 'Cancel', display: true }"
      v-on:confirm="addListDialogConfirmHandler"
      v-on:exit="addListDialogExitHandler"
    >
      <input
        class="custom-input"
        type="text"
        name="createNewListName"
        id="createNewListName"
        placeholder="Checklist ID"
      />
    </Dialog>

    <Dialog
      v-if="displayCreateNewListDialog"
      title="Create a new Shared Checklist"
      :confirmButton="{ text: 'Create', display: true }"
      :exitButton="{ text: 'Cancel', display: true }"
      v-on:confirm="createNewListDialogConfirmHandler"
      v-on:exit="createNewListDialogExitHandler"
    >
      <input
        class="custom-input"
        type="text"
        name="createNewListName"
        id="createNewListName"
        placeholder="Name ('Shopping', 'Tonight's party', ...)"
      />
    </Dialog>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import List from "@/components/List.vue";
import { useStore } from "vuex";
import Icon from "@/components/Icon.vue";
import Dialog from "@/components/Dialog.vue";

export default defineComponent({
  name: "Home",
  components: {
    Dialog,
    Icon,
    List,
  },
  setup() {
    const store = useStore();
    const displayCreateNewListDialog = ref(false);
    const displayAddListDialog = ref(false);

    const logout = () => {
      store.dispatch("logout");
    };

    const showAddListDialog = () => {
      displayAddListDialog.value = true;
    };

    const addListDialogConfirmHandler = () => {
      displayAddListDialog.value = false;
    };

    const addListDialogExitHandler = () => {
      displayAddListDialog.value = false;
    };

    const showCreateNewListDialog = () => {
      displayCreateNewListDialog.value = true;
    };

    const createNewListDialogConfirmHandler = () => {
      displayCreateNewListDialog.value = false;
    };

    const createNewListDialogExitHandler = () => {
      displayCreateNewListDialog.value = false;
    };

    return {
      addListDialogConfirmHandler,
      addListDialogExitHandler,
      createNewListDialogConfirmHandler,
      createNewListDialogExitHandler,
      displayAddListDialog,
      displayCreateNewListDialog,
      logout,
      showAddListDialog,
      showCreateNewListDialog,
    };
  },
});
</script>

<style lang="scss" scoped>
.header {
  button {
    margin-left: 20px;
  }
  button:first-of-type {
    margin-left: auto;
  }
  svg {
    fill: darkorchid;
  }
}
</style>
