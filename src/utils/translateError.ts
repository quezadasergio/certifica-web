import type { ComposerTranslation } from 'vue-i18n'

/** Traduce errores lanzados con claves i18n o devuelve un mensaje genérico. */
export function translateError(error: unknown, t: ComposerTranslation): string {
  if (error instanceof Error) {
    if (error.message.startsWith('errors.')) {
      return t(error.message)
    }
    return error.message
  }
  return t('errors.generic')
}
