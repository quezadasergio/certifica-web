<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <RouterLink to="/" class="back-to-home">
    <span class="back-to-home__icon" aria-hidden="true">←</span>
    {{ t('common.backToHome') }}
  </RouterLink>
</template>

<style scoped>
.back-to-home {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  margin-bottom: 1rem;
  padding: 0.35rem 0;
  color: var(--color-accent);
  font-size: 0.95rem;
  font-weight: 600;
  text-decoration: none;
}

.back-to-home:hover {
  color: var(--color-accent-dark);
}

.back-to-home__icon {
  font-size: 1.1rem;
  line-height: 1;
}
</style>
