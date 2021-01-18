<template>
  <div class="checklist-details">
    <div class="header">
      <div class="title">Checklist details</div>
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
            <div class="title">{{ item.title }}</div>
            <div class="subtitle">{{ item.createdAt }}</div>
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
import { computed, defineComponent, ref } from "vue";
import Icon from "@/components/Icon.vue";

export default defineComponent({
  name: "ChecklistDetails",
  components: {
    Icon,
  },
  setup() {
    const searchQuery = ref("");
    const items = ref([
      {
        id: "0",
        title: "First item",
        done: false,
        createdAt: Date.now(),
      },
      {
        id: "1",
        title: "Second item",
        done: true,
        createdAt: Date.now() + 1000,
      },
      {
        id: "2",
        title: "Third item",
        done: false,
        createdAt: Date.now() + 2000,
      },
    ]);

    const filteredItems = computed(() =>
      items.value
        .filter((c) =>
          c.title.toLowerCase().includes(searchQuery.value.toLowerCase())
        )
        // sorting by creation date
        .sort((a, b) => {
          return a.createdAt > b.createdAt
            ? 1
            : a.createdAt < b.createdAt
            ? -1
            : 0;
        })
        // sorting by item state
        .sort((a, b) => {
          return a.done && b.done ? 0 : a.done ? 1 : -1;
        })
    );

    const toggleItem = (itemId: string) => {
      const item = items.value.find((i) => i.id === itemId);
      if (!item) return;
      item.done = !item.done;
    };

    return {
      filteredItems,
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
      font-size: 2.5rem;
      font-weight: bold;
    }
    // .subtitle {
    //   font-size: 1.5rem;
    // }
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
          color: black;
          .title {
            font-size: 1.5rem;
          }
        }

        .stats {
          margin-left: auto;
          display: flex;
          align-items: center;
          // background: #fff;
          padding: 0.5rem;
          border-radius: 0.7rem;

          span {
            font-size: 1.1rem;
            font-weight: bold;
            margin-top: 2px;
            color: #555;
          }

          svg {
            margin-bottom: 2px;
            fill: #555;
          }
        }

        &.done {
          background: linear-gradient(to top right, #fff5, #fff8);
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