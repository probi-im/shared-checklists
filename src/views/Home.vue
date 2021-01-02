<template>
  <div class="home">
    <div class="header">
      <h1>Shared Checklists</h1>
      <div class="buttons">
        <button class="custom-button icon" @click="showAddListDialog">
          <Icon :name="'plus'" />
        </button>
        <button class="custom-button icon" @click="showCreateNewListDialog">
          <Icon :name="'edit'" />
        </button>
        <button @click="logout" class="custom-button">
          <span>Logout</span>
        </button>
      </div>
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
        v-model.trim="addListId"
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
        v-model.trim="newListName"
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

    // Adding existing Checklist variables and functions
    const addListId = ref("");
    const displayAddListDialog = ref(false);
    const showAddListDialog = () => {
      displayAddListDialog.value = true;
    };
    const addListDialogConfirmHandler = () => {
      store
        .dispatch("addChecklist", addListId.value)
        .then(() => {
          displayAddListDialog.value = false;
          addListId.value = "";
        })
        .catch((e) => {
          console.log(e);
        });
    };
    const addListDialogExitHandler = () => {
      displayAddListDialog.value = false;
      addListId.value = "";
    };

    // Creating new Checklist variables and functions
    const newListName = ref("");
    const displayCreateNewListDialog = ref(false);
    const showCreateNewListDialog = () => {
      displayCreateNewListDialog.value = true;
    };
    const createNewListDialogConfirmHandler = () => {
      const checklistToCreate = {
        name: newListName.value,
        createdOn: new Date(),
        items: [],
        allowedUsers: store.state.user ? [store.state.user.id] : [],
      };
      store
        .dispatch("createChecklist", checklistToCreate)
        .then(() => {
          displayCreateNewListDialog.value = false;
          newListName.value = "";
        })
        .catch((e) => {
          console.log(e);
        });
    };
    const createNewListDialogExitHandler = () => {
      displayCreateNewListDialog.value = false;
      newListName.value = "";
    };

    const logout = () => {
      store.dispatch("logout");
    };

    return {
      addListId,
      addListDialogConfirmHandler,
      addListDialogExitHandler,
      createNewListDialogConfirmHandler,
      createNewListDialogExitHandler,
      displayAddListDialog,
      displayCreateNewListDialog,
      logout,
      newListName,
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
