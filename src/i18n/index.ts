import { createI18n } from 'vue-i18n'
import es from './locales/es'
import en from './locales/en'

export type AppLocale = 'es' | 'en'

const STORAGE_KEY = 'certifica-locale'

function getInitialLocale(): AppLocale {
  const saved = localStorage.getItem(STORAGE_KEY)
  return saved === 'en' ? 'en' : 'es'
}

export const i18n = createI18n({
  legacy: false,
  locale: getInitialLocale(),
  fallbackLocale: 'es',
  messages: { es, en },
})

export function setAppLocale(locale: AppLocale): void {
  i18n.global.locale.value = locale
  localStorage.setItem(STORAGE_KEY, locale)
  document.documentElement.lang = locale
}

document.documentElement.lang = getInitialLocale()
