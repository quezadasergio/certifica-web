<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { setAppLocale, type AppLocale } from '@/i18n'

const { locale } = useI18n()

const isSpanish = computed(() => locale.value === 'es')

function setLocale(nextLocale: AppLocale): void {
  if (locale.value !== nextLocale) {
    setAppLocale(nextLocale)
  }
}
</script>

<template>
  <div
    class="lang-switch"
    role="group"
    :aria-label="isSpanish ? 'Idioma de la interfaz' : 'Interface language'"
  >
    <button
      type="button"
      class="lang-switch__option"
      :class="{ 'lang-switch__option--active': isSpanish }"
      :aria-pressed="isSpanish"
      @click="setLocale('es')"
    >
      ES
    </button>
    <button
      type="button"
      class="lang-switch__option"
      :class="{ 'lang-switch__option--active': !isSpanish }"
      :aria-pressed="!isSpanish"
      @click="setLocale('en')"
    >
      EN
    </button>
  </div>
</template>

<style scoped>
.lang-switch {
  display: inline-flex;
  padding: 0.15rem;
  border-radius: 999px;
  background: rgb(255 255 255 / 0.15);
  border: 1px solid rgb(255 255 255 / 0.35);
}

.lang-switch__option {
  min-width: 2.5rem;
  padding: 0.25rem 0.55rem;
  border: none;
  border-radius: 999px;
  background: transparent;
  color: rgb(255 255 255 / 0.85);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    color 0.15s ease;
}

.lang-switch__option--active {
  background: #fff;
  color: var(--color-primary);
}

.lang-switch__option:not(.lang-switch__option--active):hover {
  color: #fff;
}
</style>
