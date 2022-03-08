import { createI18n } from 'vue-i18n/dist/vue-i18n.esm-bundler.js';
const english = require("../locales/en.json");

const messages = {
  'en': english
};

const options = {
    locale: "en",
    fallbackLocale: "en",
    messages
}

export const i18n = createI18n(options);