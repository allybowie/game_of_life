import { createI18n } from 'vue-i18n';
import english from "../locales/en.json";

const messages = {
  en: english
};

export const i18n = createI18n({
  locale: "en",
  fallbackLocale: "en",
  messages
});