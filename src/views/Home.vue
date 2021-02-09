<template>
  <div class="home">
    <Header :title="'Home'" :leadingIcon="false" />
    <div class="container">
      <div class="section">
        <div class="title">
          Popular Public Checklists
          <router-link :to="{ name: 'public-checklists' }">View all</router-link>
        </div>
        <div class="separator"></div>
        <div class="list">
          <router-link
            v-for="checklist in publicChecklists"
            :key="checklist.id"
            class="item"
            :to="{ name: 'checklist-details', params: { checklistId: checklist.id } }"
          >
            <div class="item-title">{{ checklist.name }}</div>
            <div class="item-subtitle">
              {{ checklist.people }} member{{ checklist.people > 1 ? "s" : "" }}
            </div>
            <div class="overlay"></div>
          </router-link>
        </div>
      </div>
      <div class="section">
        <div class="title">
          Your Checklists
          <router-link v-if="user" :to="{ name: 'private-checklists' }">View all</router-link>
        </div>
        <div class="separator"></div>
        <div v-if="user" class="list">
          <router-link
            v-for="checklist in privateChecklists"
            :key="checklist.id"
            class="item"
            :to="{ name: 'checklist-details', params: { checklistId: checklist.id } }"
          >
            <div class="item-title">{{ checklist.name }}</div>
            <div class="item-subtitle">
              {{ checklist.items.length }} item{{ checklist.items.length > 1 ? "s" : "" }}
            </div>
            <div class="overlay"></div>
          </router-link>
        </div>
        <div v-else class="no-user">
          <Icon :name="'info'" />
          <span>
            You have to <router-link :to="{ name: 'login' }">log in</router-link> the view your
            private checklists
          </span>
        </div>
      </div>
      <!-- <div class="section">
        <div class="title">Recent Tasks</div>
        <div class="separator"></div>
        <div class="list">
          <button class="item">Tomatoes</button>
          <button class="item">Graphics Card</button>
          <button class="item">Test item</button>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useStore } from "vuex";
import Header from "@/components/Header.vue";
import { State } from "@/store";
import Icon from "@/components/Icon.vue";

export default defineComponent({
  name: "Home",
  components: {
    Header,
    Icon,
  },
  setup() {
    const store = useStore<State>();

    const publicChecklists = computed(() => store.state.publicChecklists);
    const privateChecklists = computed(() => store.state.privateChecklists);
    const user = computed(() => store.state.user);

    return {
      publicChecklists: publicChecklists.value.sort((a, b) =>
        a.people === b.people ? 0 : a.people < b.people ? 1 : -1
      ),
      privateChecklists,
      user,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "@/assets/scss/home.scss";
</style>
