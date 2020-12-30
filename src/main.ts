import { createApp } from 'vue'
import App from './App.vue'
import { auth } from './firebase'
import router from './router'
import store from './store'

let app: any;

auth.onAuthStateChanged(() => {
if (!app) {
  app = createApp(App).use(store).use(router).mount('#app')
}
});
