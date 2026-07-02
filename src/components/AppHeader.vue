<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import LanguageSwitch from './LanguageSwitch.vue'

const { t } = useI18n()
</script>

<template>
  <header class="app-header">
    <div class="app-header__inner">
      <LanguageSwitch />
      <RouterLink to="/" class="app-header__brand">
        <span class="app-header__logo">Certifica</span>
        <span class="app-header__subtitle">{{ t('header.subtitle') }}</span>
      </RouterLink>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  background: var(--color-primary);
  color: #fff;
  padding: 0.75rem 1rem;
}

.app-header__inner {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 0.75rem 1rem;
  max-width: 960px;
  margin: 0 auto;
}

.app-header__brand {
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: inherit;
  min-width: 0;
}

.app-header__logo {
  font-size: 1.35rem;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.app-header__subtitle {
  font-size: 0.82rem;
  opacity: 0.85;
  line-height: 1.3;
}

@media (min-width: 640px) {
  .app-header {
    padding: 0.9rem 1.5rem;
  }

  .app-header__logo {
    font-size: 1.5rem;
  }

  .app-header__subtitle {
    font-size: 0.85rem;
  }
}
</style>
