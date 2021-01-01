import { createStore } from 'vuex'
import * as fb from '../firebase';
import router from '@/router';

fb.checklistsCollection.orderBy('createdOn', 'desc').onSnapshot(async snapshot => {
  let checklists: any[] = [];

  for (const doc of snapshot.docs) {
    let checklist = doc.data();
    checklist.id = doc.id;
    // const docs = (await fb.checklistsCollection.doc(doc.id).collection('items').orderBy('createdOn', 'desc').get()).docs;
    // let items: any[] = [];
    // if (docs.length) {
    //   docs.forEach(doc => {
    //     let item = doc.data();
    //     item.id = doc.id;
    //     items.push(item);
    //   });
    // }
    // checklist.items = items;
    checklists.push(checklist);
  }

  store.commit('setChecklists', checklists);
})

export interface State {
  checklists: any[],
  user: any
}

const store = createStore<State>({
  state: {
    checklists: [],
    user: {}
  },
  mutations: {
    setChecklists(state, checklists) {
      state.checklists = checklists;
    },
    setUserProfile(state, user) {
      state.user = user;
    }
  },
  actions: {
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
