<template>
  <div class="checklists">
    <router-link
      v-for="checklist in checklists"
      :key="checklist.id"
      :to="{ path: checklistPath, query: { id: checklist.id } }"
      class="checklist"
    >
      {{ checklist.name }}
      <div class="icon"><Icon :name="'arrow'" /></div>
    </router-link>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import Icon from "@/components/Icon.vue";
import { useStore } from "vuex";

export default defineComponent({
  name: "List",
  components: {
    Icon,
  },
  setup() {
    const store = useStore();

    return {
      checklistPath: "checklist",
      checklists: computed(() => store.state.checklists),
    };
  },
});
</script>

<style lang="scss" scoped>
$color: #fff8;
$hover-color: #fff;
.checklists:not(:empty) {
  margin-top: 25px;
}
.checklist {
  padding: 15px;
  border: 2px solid $color;
  border-radius: 15px;
  cursor: pointer;
  font-size: 1.3rem;
  font-weight: bold;
  color: $color;
  transition: 0.15s all ease;
  display: flex;
  align-items: center;
  text-decoration: none;

  &:not(:first-child) {
    margin-top: 15px;
  }

  .icon {
    margin-left: auto;
    border: 2px solid $color;
    border-radius: 100px;
    padding: 3px;
    transition: inherit;

    svg {
      fill: $color;
      transition: inherit;
      width: 20px;
      height: 20px;
      transform: translateX(1px);
    }
  }

  &:hover {
    border-color: $hover-color;
    color: $hover-color;

    .icon {
      border-color: $hover-color;
      svg {
        fill: $hover-color;
      }
    }
  }
}
</style>
