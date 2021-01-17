<template>
  <div class="checklist">
    <div class="header">
      <router-link to="home" class="icon"><Icon :name="'arrow'" /></router-link>
      <h1 v-if="!checklist">Loading checklist...</h1>
      <h1 v-else>{{ checklist.name }}</h1>
      <div v-if="checklist && !deleting && !deleted" class="buttons">
        <button class="custom-button icon" @click="showAddNewItemDialog">
          <Icon :name="'plus'" />
        </button>
        <button class="custom-button icon" @click="deleteChecklist">
          <Icon :name="'delete'" />
        </button>
      </div>
    </div>
    <div v-if="checklist" class="list">
      <div
        v-for="item in sortedItems"
        :key="item.id"
        class="item"
        :class="{ done: item.done }"
        @click="toggleItemState(item.id)"
      >
        <Icon :name="item.done ? 'checkbox_filled' : 'checkbox_empty'" />
        <label :for="item.id">{{ item.text }}</label>
        <button
          v-if="checklist && !deleting && !deleted"
          class="custom-button icon"
          @click.stop="deleteItem(item.id)"
        >
          <Icon :name="'delete'" />
        </button>
      </div>
    </div>

    <Dialog
      v-if="displayAddNewItemDialog"
      title="Add a new item to the checklist"
      :confirmButton="{ text: 'Add', display: true }"
      :exitButton="{ text: 'Cancel', display: true }"
      v-on:confirm="addNewItemDialogConfirmHandler"
      v-on:exit="addNewItemDialogExitHandler"
    >
      <input
        v-model.trim="newItemText"
        class="custom-input"
        type="text"
        name="addNewItemText"
        id="addNewItemText"
        placeholder="Text"
      />
    </Dialog>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import Icon from "@/components/Icon.vue";
import { useStore, Store } from "vuex";
import { useRoute } from "vue-router";
import router from "@/router";
import * as fb from "../firebase";
import { Checklist, State } from "@/store";
import Dialog from "@/components/Dialog.vue";
import { v4 as uuid4 } from "uuid";

export default defineComponent({
  name: "Checklist",
  components: {
    Dialog,
    Icon,
  },
  setup() {
    const store: Store<State> = useStore();
    const route = useRoute();

    const contentLoaded = ref(true);
    const deleting = ref(false);
    const deleted = ref(false);

    const currentChecklistVersion = ref<Checklist | undefined>(undefined);

    const checklist = computed(() => {
      if (!deleting.value && !deleted.value) {
        const newChecklist = store.state.checklists.find(
          (c: any) => c.id === route.query.id
        );
        if (currentChecklistVersion.value && !newChecklist) {
          // checklist has been deleted by someone else
          router.push("home");
          return undefined;
        } else {
          currentChecklistVersion.value = newChecklist;
        }
      }
      return currentChecklistVersion.value;
    });

    const sortedItems = computed(() => {
      return currentChecklistVersion.value?.items
        .slice()
        .sort((a: any, b: any) => {
          return a.done === b.done ? 0 : a.done ? 1 : -1;
        });
    });

    // Adding new item variables and functions
    const newItemText = ref("");
    const displayAddNewItemDialog = ref(false);
    const showAddNewItemDialog = () => {
      displayAddNewItemDialog.value = true;
    };
    const addNewItemDialogConfirmHandler = () => {
      const itemToAdd = {
        id: uuid4(),
        text: newItemText.value,
        done: false,
        createdOn: new Date(),
      };
      store
        .dispatch("addItemToChecklist", {
          item: itemToAdd,
          checklist: checklist.value,
        })
        .then(() => {
          displayAddNewItemDialog.value = false;
          newItemText.value = "";
        })
        .catch((e) => {
          console.log(e);
        });
    };
    const addNewItemDialogExitHandler = () => {
      displayAddNewItemDialog.value = false;
      newItemText.value = "";
    };

    const toggleItemState = (itemId: string) => {
      store
        .dispatch("toggleItemState", {
          itemId,
          checklist: checklist.value,
        })
        .then(() => {})
        .catch((e) => {
          console.log(e);
        });
    };

    const deleteItem = (itemId: string) => {
      store
        .dispatch("deleteItem", {
          itemId,
          checklist: checklist.value,
        })
        .then(() => {})
        .catch((e) => {
          console.log(e);
        });
    };

    const deleteChecklist = () => {
      if (deleting.value) return;
      deleting.value = true;
      store
        .dispatch("deleteChecklist", checklist.value)
        .then(() => {
          deleted.value = true;
          router.push("home");
        })
        .catch((e) => {
          deleted.value = false;
          console.log(e);
        })
        .finally(() => {
          deleting.value = false;
        });
    };

    return {
      addNewItemDialogConfirmHandler,
      addNewItemDialogExitHandler,
      checklist,
      contentLoaded,
      deleteChecklist,
      deleted,
      deleting,
      deleteItem,
      displayAddNewItemDialog,
      newItemText,
      showAddNewItemDialog,
      sortedItems,
      toggleItemState,
    };
  },
});
</script>

<style lang="scss" scoped>
$color: #fffd;
$done-color: #fff7;
.header {
  display: flex;
  align-items: center;

  a.icon {
    border: 2px solid hsl(244, 53%, 24%);
    border-radius: 100px;
    padding: 3px;
    transform: rotate(-180deg);
    cursor: pointer;

    svg {
      fill: hsl(244, 53%, 24%);
      transition: inherit;
      width: 20px;
      height: 20px;
      transform: translateX(1px);
    }
  }
  h1 {
    margin-left: 20px;
    color: hsl(244, 69%, 37%);
  }
  button {
    margin-left: 20px;
    svg {
      fill: hsl(330, 85%, 44%);
    }
  }
  button:first-of-type {
    margin-left: auto;
    svg {
      fill: darkorchid;
    }
  }
}
.list:not(:empty) {
  margin-top: 25px;

  .item {
    display: flex;
    align-items: center;
    padding: 0 15px;
    border: 2px solid $color;
    border-radius: 15px;
    cursor: pointer;
    color: $color;

    &:not(:first-child) {
      margin-top: 15px;
    }
    > svg {
      fill: $color;
    }
    label {
      padding: 15px 0 15px 15px;
      flex: 1;
      font-size: 1.2rem;
      cursor: inherit;
    }
    &.done {
      border-color: $done-color;

      > svg {
        fill: $done-color;
      }
      label {
        color: $done-color;
      }
    }
    button {
      margin-left: 20px;
      padding: 5px;
      svg {
        fill: hsl(330, 85%, 44%);
      }
    }
  }
}
</style>
