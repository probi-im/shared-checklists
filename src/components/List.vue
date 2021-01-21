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
    };
  },
});
</script>

<style lang="scss" scoped>
.list {
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