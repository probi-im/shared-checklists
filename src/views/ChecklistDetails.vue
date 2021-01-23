<template>
  <div v-if="loadingChecklist" class="loading">Loading checklist details...</div>
  <div v-else class="checklist-details">
    <div class="header">
      <div class="leading">
        <button class="back-button" @click="$router.back()"><Icon :name="'arrow'" /></button>
      </div>
      <div class="title">
        {{ checklist.name }}
      </div>
      <div class="actions">
        <button
          v-if="user && user.id === checklist.createdBy"
          class="warn"
          @click="del(checklist.id)"
        >
          <Icon :name="'trash'" />
        </button>
        <button
          v-else-if="user && checklist.allowedUsers.includes(user.id)"
          class="warn"
          @click="leave(checklist.id)"
        >
          <Icon :name="'delete'" />
        </button>
        <button v-else @click="add(checklist.id)"><Icon :name="'add'" /></button>
      </div>
    </div>
    <div class="search">
      <CustomInput :placeholder="'Search'" v-model.trim="searchQuery" />
    </div>
    <form
      v-if="user && checklist.allowedUsers.includes(user.id)"
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
          :class="{ done: item.done, locked: !user || !checklist.allowedUsers.includes(user.id) }"
          @click="user && checklist.allowedUsers.includes(user.id) ? toggleItem(item.id) : ''"
        >
          <div class="stats">
            <Icon v-if="item.done" :name="'checkbox_filled'" />
            <Icon v-else :name="'checkbox_empty'" />
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
                  params: { checklistId: checklist.id, itemId: item.id },
                })
              "
            >
              <Icon :name="'edit'" />
            </button>
            <button
              v-if="user && checklist.allowedUsers.includes(user.id)"
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
import { computed, defineComponent, onMounted, ref } from "vue";
import { format } from "date-fns";
import Icon from "@/components/Icon.vue";
import { useRoute, useRouter } from "vue-router";
import {
  addItemToChecklist,
  deleteChecklist,
  deleteItem,
  getChecklistFromId,
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
    const store = useStore<State>();
    const route = useRoute();
    const router = useRouter();

    const user = computed(() => store.state.user);

    const checklist = ref<Checklist>();
    const loadingChecklist = ref(true);

    const searchQuery = ref("");

    const newItemName = ref("");

    const routeAfterRemoval = ref("private-checklists");

    const filteredItems = computed(() =>
      checklist.value?.items
        ? checklist.value.items
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

    const del = async (checklistId: string) => {
      if (!user.value) return;
      // console.log("delete checklist request", checklistId);
      await deleteChecklist(checklistId);
      router.push({ name: routeAfterRemoval.value });
    };

    const leave = async (checklistId: string) => {
      if (!user.value) return;
      // console.log("leave checklist request", checklistId);
      await leaveChecklist(checklistId, user.value.id);
      router.push({ name: routeAfterRemoval.value });
    };

    const add = async (checklistId: string) => {
      if (!user.value) return;
      // console.log("add checklist request", checklistId);
      await joinChecklist(checklistId, user.value.id);
      getChecklist();
    };

    const toggleItem = async (itemId: string) => {
      if (!checklist.value) return;
      await toggleItemState(checklist.value, itemId);
      getChecklist();
    };

    const addNewItem = async () => {
      if (newItemName.value === "" || !user.value || !checklist.value || !checklist.value.id)
        return;
      await addItemToChecklist(
        {
          id: uuid4(),
          createdBy: user.value.id,
          createdOn: new Date(),
          text: newItemName.value,
          done: false,
        },
        checklist.value.id
      );
      newItemName.value = "";
      getChecklist();
    };

    const delItem = async (itemId: string) => {
      if (!checklist.value) return;
      await deleteItem(checklist.value, itemId);
      getChecklist();
    };

    const formattedDate = (dateTimestamp: number) => {
      return format(dateTimestamp, "dd-MM-yyyy HH:mm");
    };

    const getChecklist = async () => {
      const checklistId = route.params.checklistId;

      if (!checklistId || checklistId === "" || checklistId.length === 0) return;

      const checklistResult = await getChecklistFromId(checklistId as string);
      if (!checklistResult) return;
      checklist.value = checklistResult;
      loadingChecklist.value = false;
    };

    onMounted(async () => {
      getChecklist();
    });

    return {
      add,
      addNewItem,
      checklist,
      del,
      delItem,
      filteredItems,
      formattedDate,
      getChecklist,
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
    margin-top: 1rem;
    padding: 0 1rem;
    display: flex;

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