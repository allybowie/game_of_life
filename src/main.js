import { createApp } from 'vue';
import { i18n } from "../src/middlewares/i18n.js";
import store from "../src/store/index.js";
import App from './App.vue';

createApp(App).use(i18n).use(store).mount('#app');