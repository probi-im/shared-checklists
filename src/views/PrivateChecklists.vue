<template>
  <div class="private-checklists">
    <div class="header">
      <div class="title">Private Checklists</div>
      <div class="subtitle">List of your private checklists</div>
    </div>
    <div class="content">
      <div class="search">
        <input type="text" placeholder="Search" v-model.trim="searchQuery" />
      </div>
      <div class="list">
        <div
          class="list-item"
          v-for="checklist in filteredChecklists"
          :key="checklist.title"
        >
          <div class="infos">
            <div class="title">{{ checklist.title }}</div>
            <div class="subtitle">{{ checklist.subtitle }}</div>
          </div>
          <div class="stats">
            <span>{{ checklist.people }}</span>
            <Icon :name="'person'" />
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
  name: "Private Checklists",
  components: {
    Icon,
  },
  setup() {
    const searchQuery = ref("");
    const checklists = ref([
      {
        title: "First checklist",
        subtitle: "This is a shopping list",
        people: 9,
      },
      {
        title: "Second checklist",
        subtitle: "This is a todo list",
        people: 7,
      },
    ]);

    const filteredChecklists = computed(() =>
      checklists.value
        .filter(
          (c) =>
            c.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            c.subtitle.toLowerCase().includes(searchQuery.value.toLowerCase())
        )
        .sort((a, b) => {
          return a.people < b.people ? 1 : a.people > b.people ? -1 : 0;
        })
    );

    return {
      searchQuery,
      checklists,
      filteredChecklists,
    };
  },
});
</script>

<style lang="scss" scoped>
.private-checklists {
  .header {
    .title {
      font-size: 2.5rem;
      font-weight: bold;
    }
    .subtitle {
      font-size: 1.5rem;
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
        width: 100%;
        background: linear-gradient(to top right, #fff7, #fffc);
        border-radius: 1rem;
        padding: 1rem;
        cursor: pointer;
        display: flex;
        align-items: center;

        .title {
          font-size: 1.5rem;
        }

        .stats {
          margin-left: auto;
          display: flex;
          align-items: center;
          background: #fff;
          padding: 0.5rem;
          border-radius: 0.7rem;

          span {
            font-size: 1.1rem;
            font-weight: bold;
            margin-top: 2px;
            color: #555;
          }

          svg {
            margin-left: 0.5rem;
            margin-bottom: 2px;
            fill: #555;
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
