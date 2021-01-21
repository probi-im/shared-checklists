<template>
  <div v-if="loadingChecklist" class="loading">Loading checklist details...</div>
  <div v-else class="checklist-details">
    <div class="header">
      <div class="title">
        <button class="icon" @click="$router.back()"><Icon :name="'arrow'" /></button>
        {{ checklist.name }}
      </div>
      <div class="subtitle">
        {{ checklist.items.length }} items ({{ checklist.items.filter((i) => !i.done).length }}
        left)
      </div>
    </div>
    <div class="add-div">
      <router-link :to="{ name: 'new-item', params: { checklistId: checklist.id } }"
        ><Icon :name="'add'"
      /></router-link>
    </div>
    <div class="search">
      <input type="text" placeholder="Search" v-model.trim="searchQuery" />
    </div>
    <div class="content">
      <div class="list">
        <div
          class="list-item"
          v-for="item in filteredItems"
          :key="item.id"
          :class="{ done: item.done, locked: !user || !checklist.allowedUsers.includes(user.id) }"
          @click="user && checklist.allowedUsers.includes(user.id) ? toggleItem(item.id) : ''"
        >
          <div class="infos">
            <div class="title">{{ item.title || item.text }}</div>
            <div class="subtitle">
              {{ formattedDate(item.createdOn.seconds * 1000) }}
            </div>
          </div>
          <div class="actions">
            <button
              v-if="user && checklist.allowedUsers.includes(user.id)"
              title="Delete this item"
              @click.stop="delItem(item.id)"
              class="warn"
            >
              <Icon :name="'trash'" />
            </button>
          </div>
          <div class="stats">
            <Icon v-if="item.done" :name="'checkbox_filled'" />
            <Icon v-else :name="'checkbox_empty'" />
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
import { useRoute } from "vue-router";
import router from "@/router";
import { deleteItem, getChecklistFromId, toggleItemState } from "@/services/checklistService";
import { Checklist } from "@/models/checklist";
import { useStore } from "vuex";
import { State } from "@/store";

export default defineComponent({
  name: "ChecklistDetails",
  components: {
    Icon,
  },
  setup() {
    const store = useStore<State>();
    const route = useRoute();

    const checklist = ref<Checklist>();
    const loadingChecklist = ref(true);

    const searchQuery = ref("");

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

    const toggleItem = async (itemId: string) => {
      if (!checklist.value) return;
      await toggleItemState(checklist.value, itemId);
      await getChecklist();
    };

    const delItem = async (itemId: string) => {
      if (!checklist.value) return;
      await deleteItem(checklist.value, itemId);
      await getChecklist();
    };

    const formattedDate = (dateTimestamp: number) => {
      return format(dateTimestamp, "dd-MM-yyyy HH:mm");
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
      checklist,
      delItem,
      filteredItems,
      formattedDate,
      getChecklist,
      loadingChecklist,
      searchQuery,
      toggleItem,
      user: computed(() => store.state.user),
    };
  },
});
</script>

<style lang="scss" scoped>
.checklist-details {
  height: 100%;
  display: flex;
  flex-direction: column;
  .header {
    .title {
      display: flex;
      align-items: center;
      font-size: 2.5rem;
      font-weight: bold;
      text-transform: uppercase;

      button {
        margin-right: 1rem;
        border: 2px solid #261d9f;
        border-radius: 40px;
        height: 40px;
        width: 40px;
        display: grid;
        place-content: center;
        outline: none;
        cursor: pointer;

        svg {
          transform: rotate(180deg);
          margin-left: -3px;
          fill: #261d9f;
        }
      }
    }
    .subtitle {
      font-size: 1.5rem;
      margin-top: 0.3rem;
    }
  }
  .add-div {
    display: flex;
    justify-content: flex-end;
    a {
      margin: 0 0 1rem;
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

      svg {
        fill: white;
      }

      &:hover {
        opacity: 0.7;
      }
    }
  }
  .search {
    width: 100%;
    input {
      width: 100%;
      padding: 1rem 2rem;
      border: none;
      border-radius: 3rem;
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
  }
  .content {
    flex: 1;
    overflow: auto;
    margin-top: 2rem;
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

        .infos {
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
          place-content: center;

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
          }
        }

        .stats {
          margin-left: auto;

          svg {
            fill: #555;
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
            display: grid;
            opacity: 1;
          }
          .stats {
            margin-left: 0.8rem;
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