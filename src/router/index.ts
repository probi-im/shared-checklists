import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/Home.vue";
import About from "../views/About.vue";
import PublicChecklists from "../views/PublicChecklists.vue";
import PrivateChecklists from "../views/PrivateChecklists.vue";
import ChecklistDetails from "../views/ChecklistDetails.vue";
import Checklist from "../views/Checklist.vue";
import NewChecklist from "../views/NewChecklist.vue";
import NewItem from "../views/NewItem.vue";
import EditChecklist from "../views/EditChecklist.vue";
import EditItem from "../views/EditItem.vue";
import Settings from "../views/Settings.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import { auth } from "@/firebase";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "public"
  },
  {
    path: "/home",
    name: "home",
    component: Home
  },
  {
    path: "/public/:checklistId",
    name: "public-checklist-details",
    component: ChecklistDetails
  },
  {
    path: "/public",
    name: "public-checklists",
    component: PublicChecklists
  },
  {
    path: "/private/:checklistId",
    name: "private-checklist-details",
    component: ChecklistDetails
  },
  {
    path: "/private",
    name: "private-checklists",
    component: PrivateChecklists,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/checklist/:checklistId/edit/item/:itemId",
    name: "edit-item",
    component: EditItem,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/checklist/:checklistId/edit",
    name: "edit-checklist",
    component: EditChecklist,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/checklist/:checklistId",
    name: "checklist-details",
    component: ChecklistDetails
  },
  {
    path: "/checklist",
    name: "checklist",
    component: Checklist
  },
  {
    path: "/new-checklist",
    name: "new-checklist",
    component: NewChecklist,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/new-item/:checklistId",
    name: "new-item",
    component: NewItem,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/settings",
    name: "settings",
    component: Settings
  },
  {
    path: "/about",
    name: "about",
    component: About
  },
  {
    path: "/login",
    name: "login",
    component: Login
  },
  {
    path: "/register",
    name: "register",
    component: Register
  },
  {
    path: "/:patchMatch(.*)*",
    name: "not-found",
    component: Home
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth);

  if (requiresAuth && !auth.currentUser) {
    next("login");
  } else {
    next();
  }
});

export default router;
