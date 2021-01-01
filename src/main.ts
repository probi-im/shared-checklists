import { createApp } from 'vue'
import App from './App.vue'
import { auth } from './firebase'
import router from './router'
import store from './store'

let app: any;

auth.onAuthStateChanged((user) => {
if (!app) {
  app = createApp(App).use(store).use(router).mount('#app')

  if (user) {
    store.commit('setUserProfile', {
      id: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoUrl: user.photoURL
    });
    store.commit('initializeFirebaseListeners');
  } else {
    store.commit('setUserProfile', null);
  }
}
});
