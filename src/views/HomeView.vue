<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const options = computed(() => [
  {
    to: '/firma-electronica',
    title: t('home.options.signature.title'),
    description: t('home.options.signature.description'),
  },
  {
    to: '/renovacion',
    title: t('home.options.renewal.title'),
    description: t('home.options.renewal.description'),
  },
  {
    to: '/sellos-digitales',
    title: t('home.options.seal.title'),
    description: t('home.options.seal.description'),
  },
  {
    to: '/certificado',
    title: t('home.options.viewer.title'),
    description: t('home.options.viewer.description'),
  },
])
</script>

<template>
  <section>
    <h1>{{ t('home.title') }}</h1>
    <p class="intro">{{ t('home.intro') }}</p>
    <div class="options">
      <RouterLink v-for="option in options" :key="option.to" :to="option.to" class="option card">
        <h2 class="option__title">{{ option.title }}</h2>
        <p class="option__description">{{ option.description }}</p>
      </RouterLink>
    </div>
  </section>
</template>

<style scoped>
.intro {
  color: var(--color-text-muted);
  margin-bottom: 1.5rem;
}

.options {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.option {
  text-decoration: none;
  color: inherit;
  transition:
    transform 0.12s ease,
    box-shadow 0.12s ease;
}

.option:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgb(0 0 0 / 0.15);
}

.option__title {
  margin: 0 0 0.5rem;
  font-size: 1.05rem;
}

.option__description {
  margin: 0;
  font-size: 0.9rem;
  color: var(--color-text-muted);
}

@media (min-width: 640px) {
  .options {
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  }
}
</style>
