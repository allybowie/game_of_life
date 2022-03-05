import { createApp } from 'vue';
import { i18n } from "../src/middlewares/i18n.js";
import App from './App.vue';

createApp(App).use(i18n).mount('#app');

// app.use(i18n)

// app.mount('#app');
