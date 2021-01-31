<template>
  <transition-group name="list" class="list" tag="div">
    <router-link
      class="list-item"
      v-for="item in items"
      :key="item.id"
      :to="{
        name: toRouteName,
        params: { checklistId: item.id },
        query: { from },
      }"
    >
      <div class="flags">
        <div v-if="item.status === 'public'" class="icon" title="This checklist is public">
          <Icon :name="'public'" />
        </div>
        <div v-else class="icon" title="This checklist is private">
          <Icon :name="'public_off'" />
        </div>
        <div
          v-if="user && user.id === item.createdBy"
          class="icon"
          title="You created this checklist"
        >
          <Icon :name="'lock'" />
        </div>
      </div>
      <div class="infos">
        <div class="title">{{ item.name }}</div>
        <div class="subtitle">
          {{ item.items.length }} item{{ item.items.length > 1 ? "s" : "" }} ({{
            item.items.filter((i) => !i.done).length
          }}
          left)
        </div>
      </div>
      <div class="actions">
        <button
          title="Edit this checklist"
          v-if="user && user.id === item.createdBy"
          @click.prevent="
            $router.push({
              name: 'edit-checklist',
              params: { checklistId: item.id },
            })
          "
        >
          <Icon :name="'edit'" />
        </button>
        <button
          title="Delete this checklist"
          v-if="user && user.id === item.createdBy"
          @click.prevent="del(item.id)"
          class="warn"
        >
          <Icon :name="'trash'" />
        </button>
        <button
          title="Leave this checklist"
          v-else-if="user && item.allowedUsers.includes(user.id)"
          @click.prevent="leave(item.id)"
          class="warn"
        >
          <Icon :name="'delete'" />
        </button>
        <button title="Join this checklist" v-else-if="user" @click.prevent="add(item.id)">
          <Icon :name="'add'" />
        </button>
      </div>
      <div class="stats">
        <span>{{ item.people }}</span>
        <Icon :name="'person'" />
      </div>
    </router-link>
  </transition-group>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import Icon from "@/components/Icon.vue";
import { useStore } from "vuex";
import { State } from "@/store";
import { deleteChecklist, joinChecklist, leaveChecklist } from "@/services/checklistService";
export default defineComponent({
  name: "List",
  components: {
    Icon,
  },
  props: {
    from: {
      type: String,
      required: true,
    },
    items: {
      type: Array,
      required: true,
    },
    toRouteName: {
      type: String,
      required: true,
    },
  },
  emits: ["listUpdated"],
  setup(props, { emit }) {
    const store = useStore<State>();
    const user = computed(() => store.state.user);

    const del = async (checklistId: string) => {
      if (!user.value) return;
      // console.log("delete checklist request", checklistId);
      await deleteChecklist(checklistId);
      emit("listUpdated");
    };

    const leave = async (checklistId: string) => {
      if (!user.value) return;
      // console.log("leave checklist request", checklistId);
      await leaveChecklist(checklistId, user.value.id);
      emit("listUpdated");
    };

    const add = async (checklistId: string) => {
      if (!user.value) return;
      // console.log("add checklist request", checklistId);
      await joinChecklist(checklistId, user.value.id);
      emit("listUpdated");
    };

    return {
      add,
      del,
      from: props.from,
      items: computed(() => props.items),
      leave,
      toRouteName: props.toRouteName,
      user,
    };
  },
});
</script>

<style lang="scss" scoped>
.list {
  padding: 1rem;
  .list-item {
    text-decoration: none;
    width: 100%;
    background: linear-gradient(to top right, #fff7, #fffc);
    border-radius: 1rem;
    padding: 0 1rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    height: 5rem;

    .flags {
      margin-right: 0.6rem;
      .icon {
        &:not(:first-child) {
          margin-top: 0.3rem;
        }
      }
      svg {
        fill: darkgrey;
        width: 1.2rem;
      }
    }

    .infos {
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
      .actions {
        display: flex;
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
</style>