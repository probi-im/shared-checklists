import { createStore } from "vuex";
import * as fb from "../firebase";
import router from "@/router";
import firebase from "firebase/app";
import { Checklist } from "@/models/checklist";
import { Item } from "@/models/item";
import { User } from "@/models/user";
import { docToChecklist } from "@/services/checklistService";

export interface State {
  publicChecklists: Checklist[];
  privateChecklists: Checklist[];
  checklists: Checklist[];
  firebaseListenersInitiated: boolean;
  user: User | null;
  publicFirebaseListenersInitiated: boolean;
  privateFirebaseListenersInitiated: boolean;
  publicChecklistsListenerUnsubscribe: Function | null;
  privateChecklistsListenerUnsubscribe: Function | null;
  collectionsListenerUnsubscribe: Function | null;
}

const store = createStore<State>({
  state: {
    publicChecklists: [],
    privateChecklists: [],
    checklists: [],
    firebaseListenersInitiated: false,
    user: null,
    publicFirebaseListenersInitiated: false,
    privateFirebaseListenersInitiated: false,
    publicChecklistsListenerUnsubscribe: null,
    privateChecklistsListenerUnsubscribe: null,
    collectionsListenerUnsubscribe: null
  },
  mutations: {
    setChecklists(state, checklists: Checklist[]) {
      state.checklists = checklists;
    },
    setUserProfile(state, user) {
      state.user = user;
    },
    initializePublicFirebaseListeners(state) {
      state.publicChecklistsListenerUnsubscribe = fb.checklistsCollection
        .where("status", "==", "public")
        .onSnapshot(async snapshot => {
          state.publicChecklists = snapshot.docs.map(doc => docToChecklist(doc));
          // console.log("public checklists:", state.publicChecklists);
          state.publicFirebaseListenersInitiated = true;
        });
      // console.log("public collections listener initialized");
    },
    initializePrivateFirebaseListeners(state) {
      if (!state.user || !state.user.id) return;
      state.privateChecklistsListenerUnsubscribe = fb.checklistsCollection
        .where("allowedUsers", "array-contains", state.user.id)
        .onSnapshot(async snapshot => {
          state.privateChecklists = snapshot.docs.map(doc => docToChecklist(doc));
          // console.log("private checklists:", state.privateChecklists);
          state.privateFirebaseListenersInitiated = true;
        });
      // console.log("private collections listener initialized");
    },
    stopFirebaseListeners(state) {
      if (state.publicChecklistsListenerUnsubscribe) {
        state.publicChecklistsListenerUnsubscribe();
        // console.log("public collections listener stopped");
      }
      if (state.privateChecklistsListenerUnsubscribe) {
        state.privateChecklistsListenerUnsubscribe();
        // console.log("private collections listener stopped");
      }
    }
  },
  actions: {
    async addChecklist({ state }, checklistId) {
      if (!state.user || !state.user.id || !checklistId) return;
      try {
        await fb.checklistsCollection.doc(checklistId).update({
          allowedUsers: firebase.firestore.FieldValue.arrayUnion(state.user.id)
        });
      } catch (e) {
        console.log(e);
        throw e;
      }
    },
    async createChecklist({}, checklist: Checklist) {
      if (!checklist || !checklist.name || !checklist.items) return;
      try {
        await fb.checklistsCollection.add(checklist);
      } catch (e) {
        console.log(e);
        throw e;
      }
    },
    async deleteChecklist({ state }, checklist: Checklist) {
      if (!state.user || !state.user.id || !checklist || !checklist.id || !checklist.allowedUsers)
        return;
      try {
        if (checklist.allowedUsers.includes(state.user.id) && checklist.allowedUsers.length === 1) {
          await fb.checklistsCollection.doc(checklist.id).delete();
        } else {
          await fb.checklistsCollection.doc(checklist.id).update({
            allowedUsers: firebase.firestore.FieldValue.arrayRemove(state.user.id)
          });
        }
      } catch (e) {
        console.log(e);
        throw e;
      }
    },
    async addItemToChecklist({ state }, data: { item: Item; checklist: Checklist }) {
      if (
        !state.user ||
        !state.user.id ||
        !data ||
        !data.item ||
        !data.item.id ||
        !data.item.text ||
        !data.checklist.id ||
        !data.checklist.allowedUsers
      )
        return;
      if (!data.checklist.allowedUsers.includes(state.user.id)) return;
      try {
        await fb.checklistsCollection.doc(data.checklist.id).update({
          items: firebase.firestore.FieldValue.arrayUnion(data.item)
        });
      } catch (e) {
        console.log(e);
        throw e;
      }
    },
    async toggleItemState({ state }, data: { itemId: string; checklist: Checklist }) {
      if (
        !state.user ||
        !state.user.id ||
        !data ||
        !data.itemId ||
        !data.checklist.id ||
        !data.checklist.allowedUsers
      )
        return;
      if (!data.checklist.allowedUsers.includes(state.user.id)) return;
      try {
        const index = data.checklist.items.findIndex(i => i.id === data.itemId);
        if (index === -1) return;
        data.checklist.items[index].done = !data.checklist.items[index].done;
        await fb.checklistsCollection.doc(data.checklist.id).update({
          items: data.checklist.items
        });
      } catch (e) {
        console.log(e);
        throw e;
      }
    },
    async deleteItem({ state }, data: { itemId: string; checklist: Checklist }) {
      if (
        !state.user ||
        !state.user.id ||
        !data ||
        !data.itemId ||
        !data.checklist.id ||
        !data.checklist.allowedUsers
      )
        return;
      if (!data.checklist.allowedUsers.includes(state.user.id)) return;
      try {
        const item = data.checklist.items.find(i => i.id === data.itemId);
        if (!item) return;
        await fb.checklistsCollection.doc(data.checklist.id).update({
          items: firebase.firestore.FieldValue.arrayRemove(item)
        });
      } catch (e) {
        console.log(e);
        throw e;
      }
    },
    async register({ commit }, { email, password }) {
      try {
        const { user } = await fb.auth.createUserWithEmailAndPassword(email, password);
        if (user) {
          commit("setUserProfile", {
            id: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoUrl: user.photoURL
          });
          // commit("initializeFirebaseListeners");
          router.push({ name: "private-checklists" });
        }
      } catch (e) {
        console.log(e);
        throw e;
      }
    },
    async login({ commit }, { email, password }) {
      try {
        const { user } = await fb.auth.signInWithEmailAndPassword(email, password);
        if (user) {
          commit("setUserProfile", {
            id: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoUrl: user.photoURL
          });
          // commit("initializeFirebaseListeners");
          router.push({ name: "private-checklists" });
        }
      } catch (e) {
        console.log(e);
        throw e;
      }
    },
    async logout({ commit }) {
      commit("stopFirebaseListeners");
      await fb.auth.signOut();

      // clear userProfile and redirect to /login
      commit("setUserProfile", null);
      router.push("/login");
    }
  },
  modules: {}
});

export default store;
