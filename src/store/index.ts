import { createStore } from 'vuex'
import * as fb from '../firebase';

fb.checklistsCollection.orderBy('createdOn', 'desc').onSnapshot(async snapshot => {
  let checklists: any[] = [];

  for (const doc of snapshot.docs) {
    let checklist = doc.data();
    checklist.id = doc.id;
    const docs = (await fb.checklistsCollection.doc(doc.id).collection('items').orderBy('createdOn', 'desc').get()).docs;
    let items: any[] = [];
    if (docs.length) {
      docs.forEach(doc => {
        let item = doc.data();
        item.id = doc.id;
        items.push(item);
      });
    }
    checklist.items = items;
    checklists.push(checklist);
  }

  store.commit('setChecklists', checklists);
})

// export interface State {
//   checklists: any[]
// }

const store = createStore({
  state: {
    checklists: []
  },
  mutations: {
    setChecklists(state, checklists) {
      state.checklists = checklists;
    }
  },
  actions: {
  },
  modules: {
  }
});

export default store;
