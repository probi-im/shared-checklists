import { createStore } from 'vuex'
import * as fb from '../firebase';
import router from '@/router';
import firebase from 'firebase/app';

export interface State {
  checklists: any[],
  firebaseListenersInitiated: Boolean,
  user: any,
}

const store = createStore<State>({
  state: {
    checklists: [],
    firebaseListenersInitiated: false,
    user: null
  },
  mutations: {
    setChecklists(state, checklists) {
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
      try {
        await fb.checklistsCollection.doc(checklistId).update({
          allowedUsers: firebase.firestore.FieldValue.arrayUnion(state.user.id)
        });
      } catch (e) {
        console.log(e);
        throw e;
      }
    },
    async createChecklist({}, checklist) {
      try {
        await fb.checklistsCollection.add(checklist);
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
      } catch(e) {
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
