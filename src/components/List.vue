<template>
  <div class="list">
    <router-link
      class="list-item"
      v-for="item in items"
      :key="item.id"
      :to="{
        name: toRouteName,
        params: { checklistId: item.id },
      }"
    >
      <div v-if="item.status === 'public' || item.createdBy" class="flags">
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
        <div class="subtitle">{{ item.desc }}</div>
      </div>
      <div class="stats">
        <span>{{ item.people }}</span>
        <Icon :name="'person'" />
      </div>
    </router-link>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import Icon from "@/components/Icon.vue";
import { useStore } from "vuex";
import { State } from "@/store";
export default defineComponent({
  name: "List",
  components: {
    Icon,
  },
  props: {
    items: {
      type: Array,
      required: true,
    },
    keyAttributName: {
      type: String,
      required: false,
    },
    filterAttributName: {
      type: String,
      required: false,
      default: "",
    },
    filterString: {
      type: String,
      required: false,
      default: "",
    },
    toRouteName: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const store = useStore<State>();
    const filteredItems = computed(() =>
      props.items.filter((i: any) =>
        props.filterAttributName
          ? i[props.filterAttributName].toLowerCase().includes(props.filterString.toLowerCase())
          : props.items
      )
    );

    return {
      items: computed(() => props.items),
      keyAttributName: props.keyAttributName,
      toRouteName: props.toRouteName,
      user: computed(() => store.state.user),
    };
  },
});
</script>

<style lang="scss" scoped>
.list {
  padding: 1rem;
  .list-item {
    display: block;
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
</style>