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
      <div class="actions"></div>
    </div>
    <div class="search">
      <CustomInput :placeholder="'Search'" v-model.trim="searchQuery" />
    </div>
    <div v-if="user && checklist.allowedUsers.includes(user.id)" class="add-div">
      <CustomInput :placeholder="'New item name'" />
      <button>
        <Icon :name="'add'" />
      </button>
      <!-- <router-link :to="{ name: 'new-item', params: { checklistId: checklist.id } }"
        ><Icon :name="'add'"
      /></router-link> -->
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
import { useRoute } from "vue-router";
import router from "@/router";
import { deleteItem, getChecklistFromId, toggleItemState } from "@/services/checklistService";
import { Checklist } from "@/models/checklist";
import { useStore } from "vuex";
import { State } from "@/store";
import CustomInput from "@/components/CustomInput.vue";

export default defineComponent({
  name: "ChecklistDetails",
  components: {
    CustomInput,
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
@import "@/assets/scss/constants.scss";
@import "@/assets/scss/header.scss";

.checklist-details {
  height: 100%;
  display: flex;
  flex-direction: column;

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