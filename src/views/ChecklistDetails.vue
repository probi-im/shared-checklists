<template>
  <div v-if="loadingChecklist" class="loadin">Loading checklist details...</div>
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
    <div class="content">
      <div class="search">
        <input type="text" placeholder="Search" v-model.trim="searchQuery" />
      </div>
      <div class="list">
        <div
          class="list-item"
          v-for="item in filteredItems"
          :key="item.id"
          :class="{ done: item.done }"
          @click="toggleItem(item.id)"
        >
          <div class="infos">
            <div class="title">{{ item.title || item.text }}</div>
            <div class="subtitle">
              {{ formattedDate(item.createdOn.seconds * 1000) }}
            </div>
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
import { getChecklistFromId } from "@/services/checklistService";
import { Checklist } from "@/models/checklist";

export default defineComponent({
  name: "ChecklistDetails",
  components: {
    Icon,
  },
  setup() {
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

    const toggleItem = (itemId: string) => {
      if (!checklist.value) return;
      const item = checklist.value.items.find((i) => i.id === itemId);
      if (!item) return;
      item.done = !item.done;
    };

    const formattedDate = (dateTimestamp: number) => {
      return format(dateTimestamp, "dd-MM-yyyy HH:mm");
    };

    onMounted(async () => {
      const checklistId = route.params.checklistId;

      if (!checklistId || checklistId === "" || checklistId.length === 0) return;

      const checklistResult = await getChecklistFromId(checklistId as string);
      if (!checklistResult) return;
      checklist.value = checklistResult;
      loadingChecklist.value = false;
    });

    return {
      checklist,
      filteredItems,
      formattedDate,
      loadingChecklist,
      searchQuery,
      toggleItem,
    };
  },
});
</script>

<style lang="scss" scoped>
.checklist-details {
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
  .content {
    margin-top: 2rem;
    display: flex;
    flex-direction: column;
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
    .list {
      margin-top: 2rem;
      .list-item {
        display: block;
        text-decoration: none;
        width: 100%;
        background: linear-gradient(to top right, #fff7, #fffc);
        border-radius: 1rem;
        padding: 1rem;
        cursor: pointer;
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
        &:hover {
          box-shadow: 0 0 10px #fff;
        }
        &:not(:last-child) {
          margin-bottom: 1rem;
        }
      }
    }
  }
}
</style>