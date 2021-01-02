import { createStore } from 'vuex'
import * as fb from '../firebase';
import router from '@/router';
import firebase from 'firebase/app';

export interface Item {
  id: string,
  text: string,
  done: boolean,
  createdOn: Date
}

export interface Checklist {
  id: string,
  name: string,
  items: Item[],
  allowedUsers: string[],
  createdOn: Date
}

export interface State {
  checklists: Checklist[],
  firebaseListenersInitiated: boolean,
  user: any,
}

const store = createStore<State>({
  state: {
    checklists: [],
    firebaseListenersInitiated: false,
    user: null
  },
  mutations: {
    setChecklists(state, checklists: Checklist[]) {
      state.checklists = checklists;
    },
    setUserProfile(state, user) {
      state.user = user;
    },
    initializeFirebaseListeners(state) {
      if (!state.user || !state.user.id) return;
      fb.checklistsCollection.where('allowedUsers', 'array-contains', state.user.id ? state.user.id : 'invalid_userid').orderBy('createdOn', 'desc').onSnapshot(async snapshot => {
        let checklists: any[] = [];

        for (const doc of snapshot.docs) {
          let checklist = doc.data();
          checklist.id = doc.id;
          checklists.push(checklist);
        }

        store.commit('setChecklists', checklists);
      })
      state.firebaseListenersInitiated = true;
    }
  },
  actions: {
    async addChecklist({ state }, checklistId) {
      if (!checklistId) return;
      try {
        await fb.checklistsCollection.doc(checklistId).update({
          allowedUsers: firebase.firestore.FieldValue.arrayUnion(state.user.id)
        });
      } catch (e) {
        console.log(e);
        throw e;
      }
    },
    async createChecklist({ }, checklist: Checklist) {
      if (!checklist || !checklist.name || !checklist.items) return;
      try {
        await fb.checklistsCollection.add(checklist);
      } catch (e) {
        console.log(e);
        throw e;
      }
    },
    async deleteChecklist({ state }, checklist: Checklist) {
      if (!state.user || !state.user.id || !checklist || !checklist.id || !checklist.allowedUsers) return;
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
    async login({ commit }, { email, password }) {
      try {
        const { user } = await fb.auth.signInWithEmailAndPassword(email, password);
        if (user) {
          commit('setUserProfile', {
            id: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoUrl: user.photoURL
          });
          commit('initializeFirebaseListeners');
          router.push('home');
        }
      } catch (e) {
        console.log(e);
        throw e;
      }
    },
    async logout({ commit }) {
      await fb.auth.signOut()

      // clear userProfile and redirect to /login
      commit('setUserProfile', {})
      router.push('/login')
    }
  },
  modules: {
  }
});

export default store;
