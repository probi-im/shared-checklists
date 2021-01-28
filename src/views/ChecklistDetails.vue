<template>
  <div v-if="loadingChecklist || !checklistDetails" class="loading">
    Loading checklist details...
  </div>
  <div v-else class="checklist-details">
    <div class="header">
      <div class="leading">
        <button class="back-button" @click="goBack"><Icon :name="'arrow'" /></button>
      </div>
      <div class="title">
        {{ checklistDetails.name }}
      </div>
      <div class="actions">
        <button
          v-if="user && user.id === checklistDetails.createdBy"
          class="warn"
          @click="del(checklistDetails.id)"
        >
          <Icon :name="'trash'" />
        </button>
        <button
          v-else-if="user && checklistDetails.allowedUsers.includes(user.id)"
          class="warn"
          @click="leave(checklistDetails.id)"
        >
          <Icon :name="'delete'" />
        </button>
        <button v-else @click="add(checklistDetails.id)"><Icon :name="'add'" /></button>
      </div>
    </div>
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
    <div class="content">
      <div class="list">
        <div
          class="list-item"
          v-for="item in filteredItems"
          :key="item.id"
          :class="{
            done: item.done,
            locked: !user || !checklistDetails.allowedUsers.includes(user.id),
          }"
          @click="
            user && checklistDetails.allowedUsers.includes(user.id) ? toggleItem(item.id) : ''
          "
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
      </div>
    </div>
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

export default defineComponent({
  name: "ChecklistDetails",
  components: {
    CustomInput,
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
      checklistStatus.value === "public"
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

    const del = async (checklistId: string) => {
      if (!user.value) return;
      await deleteChecklist(checklistId);
      goBack();
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

    const formattedDate = (dateTimestamp: number) => {
      return format(dateTimestamp, "dd-MM-yyyy HH:mm");
    };

    return {
      add,
      addNewItem,
      checklist,
      checklistDetails,
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
@import "@/assets/scss/header.scss";

.checklist-details {
  height: 100%;
  display: flex;
  flex-direction: column;

  .header .actions {
    button {
      svg {
        fill: blue;
      }

      &.warn svg {
        fill: red;
      }
    }
  }

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
  .content {
    flex: 1;
    overflow: auto;
    display: flex;
    flex-direction: column;

    .list {
      padding: 1rem;

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

          .title {
            color: #141b55;
            font-size: 1.5rem;
          }
          .subtitle {
            color: grey;
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

          .infos {
            .title {
              color: #141b5599;
            }
            .subtitle {
              color: #80808099;
            }
          }

          .stats {
            svg {
              fill: #55555599;
            }
          }
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
    }
  }
}
</style>