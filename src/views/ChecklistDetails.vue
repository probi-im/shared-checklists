<template>
  <div v-if="loadingChecklist || !checklistDetails" class="loading">
    Loading checklist details...
  </div>
  <div v-else class="checklist-details">
    <Header
      :title="checklistDetails.name"
      :leadingIcon="true"
      :trailingIconName="
        user && user.id === checklistDetails.createdBy
          ? 'trash'
          : user && checklistDetails.allowedUsers.includes(user.id)
          ? 'delete'
          : user
          ? 'add'
          : ''
      "
      :trailingAction="
        user && user.id === checklistDetails.createdBy
          ? () => del(checklistDetails.id)
          : user && checklistDetails.allowedUsers.includes(user.id)
          ? () => leave(checklistDetails.id)
          : user
          ? () => add(checklistDetails.id)
          : () => {}
      "
    />
    <!-- <div class="header">
      <div class="leading">
        <button class="back-button" @click="goBack"><Icon :name="'arrow'" /></button>
      </div>
      <div class="title">
        {{ checklistDetails.name }}
      </div>
      <div class="actions">
        <button title="Copy checklist ID" @click="copyToClipboard(checklistDetails.id)">
          <Icon :name="'copy'" />
        </button>
        <button
          v-if="user && user.id === checklistDetails.createdBy"
          class="warn"
          title="Delete this checklist"
          @click="del(checklistDetails.id)"
        >
          <Icon :name="'trash'" />
        </button>
        <button
          v-else-if="user && checklistDetails.allowedUsers.includes(user.id)"
          class="warn"
          title="Leave this checklist"
          @click="leave(checklistDetails.id)"
        >
          <Icon :name="'delete'" />
        </button>
        <button
          v-else-if="user"
          class="primary"
          title="Join this checklist"
          @click="add(checklistDetails.id)"
        >
          <Icon :name="'add'" />
        </button>
      </div>
    </div> -->
    <div class="search">
      <CustomInput :placeholder="'Search'" v-model.trim="searchQuery" />
    </div>
    <form
      v-if="user && checklistDetails.allowedUsers.includes(user.id)"
      @submit.prevent="addNewItem"
      class="add-div"
    >
      <CustomInput :placeholder="'New item name'" v-model.trim="newItemName" required />
      <button type="submit">
        <Icon :name="'add'" />
      </button>
    </form>
    <transition-group name="list" class="list" tag="div">
      <div
        class="list-item"
        v-for="item in filteredItems"
        :key="item.id"
        :class="{
          done: item.done,
          locked: !user || !checklistDetails.allowedUsers.includes(user.id),
        }"
        @click="user && checklistDetails.allowedUsers.includes(user.id) ? toggleItem(item.id) : ''"
      >
        <div class="stats">
          <Icon v-if="item.done" :name="'circle_checkbox_filled'" />
          <Icon v-else :name="'circle_checkbox_empty'" />
        </div>
        <div class="infos">
          <div class="title">{{ item.title || item.text }}</div>
          <div class="subtitle">
            {{ formattedDate(item.createdOn.seconds * 1000) }}
          </div>
        </div>
        <div class="actions">
          <button
            title="Edit this item"
            v-if="user && user.id === item.createdBy"
            @click.stop="
              $router.push({
                name: 'edit-item',
                params: { checklistId: checklistDetails.id, itemId: item.id },
              })
            "
          >
            <Icon :name="'edit'" />
          </button>
          <button
            v-if="user && checklistDetails.allowedUsers.includes(user.id)"
            title="Delete this item"
            @click.stop="delItem(item.id)"
            class="warn"
          >
            <Icon :name="'trash'" />
          </button>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import { format } from "date-fns";
import Icon from "@/components/Icon.vue";
import { useRoute, useRouter } from "vue-router";
import {
  addItemToChecklist,
  deleteChecklist,
  deleteItem,
  joinChecklist,
  leaveChecklist,
  toggleItemState,
} from "@/services/checklistService";
import { Checklist } from "@/models/checklist";
import { useStore } from "vuex";
import { State } from "@/store";
import CustomInput from "@/components/CustomInput.vue";
import { v4 as uuid4 } from "uuid";
import Header from "@/components/Header.vue";

export default defineComponent({
  name: "ChecklistDetails",
  components: {
    CustomInput,
    Header,
    Icon,
  },
  setup() {
    const availableReturnUrls = ["public", "private"];
    const store = useStore<State>();
    const route = useRoute();
    const router = useRouter();

    const user = computed(() => store.state.user);

    const checklist = ref<Checklist>();
    const checklistStatus = computed(() =>
      store.state.privateChecklists.find((c) => c.id === checklistId.value) ? "private" : "public"
    );
    const loadingChecklist = computed(() =>
      !user.value
        ? !store.state.publicFirebaseListenersInitiated
        : !store.state.privateFirebaseListenersInitiated
    );

    const checklistId = computed(() => route.params.checklistId as string);

    const checklistDetails = computed(() => {
      return (
        store.state.publicChecklists.find((c) => c.id === checklistId.value) ||
        store.state.privateChecklists.find((c) => c.id === checklistId.value)
      );
    });

    const searchQuery = ref("");

    const newItemName = ref("");

    const returnUrl = computed(
      () =>
        `${
          availableReturnUrls.includes(route.query.from as string)
            ? (route.query.from as string)
            : "public"
        }-checklists`
    );

    const filteredItems = computed(() =>
      checklistDetails.value?.items
        ? checklistDetails.value.items
            .filter((c) => c.text.toLowerCase().includes(searchQuery.value.toLowerCase()))
            // sorting by creation date
            .sort((a, b) => {
              return a.createdOn > b.createdOn ? 1 : a.createdOn < b.createdOn ? -1 : 0;
            })
            // sorting by item state
            .sort((a, b) => {
              return a.done && b.done ? 0 : a.done ? 1 : -1;
            })
        : []
    );

    const goBack = () => {
      router.push({ name: returnUrl.value });
    };

    const del = (checklistId: string) => {
      if (!user.value) return;
      deleteChecklist(checklistId)
        .then(() => {
          goBack();
        })
        .catch((e) => {
          console.error(e);
        });
    };

    const leave = async (checklistId: string) => {
      if (!user.value) return;
      await leaveChecklist(checklistId, user.value.id);
    };

    const add = async (checklistId: string) => {
      if (!user.value) return;
      await joinChecklist(checklistId, user.value.id);
    };

    const toggleItem = async (itemId: string) => {
      if (!checklistDetails.value) return;
      await toggleItemState(checklistDetails.value, itemId);
    };

    const addNewItem = async () => {
      if (
        newItemName.value === "" ||
        !user.value ||
        !checklistDetails.value ||
        !checklistDetails.value.id
      )
        return;
      await addItemToChecklist(
        {
          id: uuid4(),
          createdBy: user.value.id,
          createdOn: new Date(),
          text: newItemName.value,
          done: false,
        },
        checklistDetails.value.id
      );
      newItemName.value = "";
    };

    const delItem = async (itemId: string) => {
      if (!checklistDetails.value) return;
      await deleteItem(checklistDetails.value, itemId);
    };

    const copyToClipboard = async (itemId: string) => {
      try {
        const permissionName = "clipboard-write" as PermissionName;
        const result = await navigator.permissions.query({ name: permissionName });
        if (result.state === "granted" || result.state === "prompt") {
          try {
            await navigator.clipboard.writeText(itemId);
          } catch (error) {
            console.log("copy to clipboard failed (copy failed)");
            console.error(error);
          }
        }
      } catch (error) {
        console.log("copy to clipboard failed (permissions error");
        console.error(error);
      }
    };

    const formattedDate = (dateTimestamp: number) => {
      return format(dateTimestamp, "dd-MM-yyyy HH:mm");
    };

    return {
      add,
      addNewItem,
      checklist,
      checklistDetails,
      copyToClipboard,
      del,
      delItem,
      filteredItems,
      formattedDate,
      // getChecklist,
      goBack,
      leave,
      loadingChecklist,
      newItemName,
      searchQuery,
      toggleItem,
      user: computed(() => store.state.user),
    };
  },
});
</script>

<style lang="scss" scoped>
@import "@/assets/scss/constants.scss";
// @import "@/assets/scss/header.scss";

.checklist-details {
  height: 100%;
  // display: flex;
  // flex-direction: column;

  // .header .actions {
  //   button {
  //     &.primary svg {
  //       fill: blue;
  //     }

  //     &.warn svg {
  //       fill: red;
  //     }
  //   }
  // }

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

  .list {
    padding: 1rem;
    position: relative;

    .list-item {
      display: block;
      text-decoration: none;
      width: 100%;
      background: linear-gradient(to top right, #fff7, #fffc);
      border-radius: 1rem;
      padding: 1rem;
      display: flex;
      align-items: center;

      .stats {
        svg {
          fill: #555;
        }
      }

      .infos {
        margin-left: 1rem;
        color: black;
        .title {
          font-size: 1.5rem;
        }
        .subtitle {
          color: grey;
          margin-top: 0.3rem;
        }
      }

      .actions {
        margin-left: auto;
        display: none;
        opacity: 0;
        align-items: center;

        button {
          background: none;
          border: none;
          cursor: pointer;
          outline: none;

          svg {
            fill: darkgrey;
          }

          &:hover {
            svg {
              fill: blue;
            }
            &.warn {
              svg {
                fill: red;
              }
            }
          }
          &:not(:last-child) {
            margin-right: 1rem;
          }
        }
      }

      &.done {
        background: linear-gradient(to top right, #fff5, #fff8);
        opacity: 0.7;
      }

      &:not(.locked):hover {
        cursor: pointer;
        box-shadow: 0 0 10px #fff;

        .actions {
          display: flex;
          opacity: 1;
        }
      }

      &:not(:last-child) {
        margin-bottom: 1rem;
      }
    }

    .list-enter-active,
    .list-leave-active,
    .list-move {
      transition: 0.3s all ease;
    }
    .list-enter-from,
    .list-leave-to {
      opacity: 0;
      transform: scale(0.5);
    }
  }
}
</style>