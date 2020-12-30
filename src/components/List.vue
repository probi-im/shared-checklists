<template>
  <div class="checklists">
    <router-link
      :to="{ path: checklistPath, query: { id: 'list1' } }"
      class="checklist"
    >
      List 1
      <div class="icon"><Icon :name="'arrow'" /></div>
    </router-link>
    <router-link
      :to="{ path: checklistPath, query: { id: 'list2' } }"
      class="checklist"
    >
      List 2
      <div class="icon"><Icon :name="'arrow'" /></div>
    </router-link>
    <router-link
      :to="{ path: checklistPath, query: { id: 'list3' } }"
      class="checklist"
    >
      List 3
      <div class="icon"><Icon :name="'arrow'" /></div>
    </router-link>
    <router-link
      :to="{ path: checklistPath, query: { id: 'list4' } }"
      class="checklist"
    >
      List 4
      <div class="icon"><Icon :name="'arrow'" /></div>
    </router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Icon from "@/components/Icon.vue";

export default defineComponent({
  name: "List",
  components: {
    Icon,
  },
  setup() {
    return {
      checklistPath: "checklist",
    };
  },
});
</script>

<style lang="scss" scoped>
.checklists {
  margin-top: 25px;
}
.checklist {
  padding: 15px;
  border: 2px solid lightgray;
  border-radius: 15px;
  cursor: pointer;
  font-size: 1.3rem;
  font-weight: bold;
  color: darkgray;
  transition: 0.25s all ease;
  display: flex;
  align-items: center;
  text-decoration: none;

  &:not(:first-child) {
    margin-top: 15px;
  }

  .icon {
    margin-left: auto;
    border: 2px solid darkgray;
    border-radius: 100px;
    padding: 3px;
    transition: inherit;

    svg {
      fill: darkgray;
      transition: inherit;
      width: 20px;
      height: 20px;
      transform: translateX(1px);
    }
  }

  &:hover {
    border-color: hsl(244, 53%, 24%);
    color: hsl(244, 53%, 24%);

    .icon {
      border-color: hsl(244, 53%, 24%);
      svg {
        fill: hsl(244, 53%, 24%);
      }
    }
  }
}
</style>
