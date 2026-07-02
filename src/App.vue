<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import AppHeader from '@/components/AppHeader.vue'
import BackToHome from '@/components/BackToHome.vue'

const route = useRoute()
const { t } = useI18n()
const showBackToHome = computed(() => route.name !== 'home')
</script>

<template>
  <AppHeader />
  <main class="main-content">
    <BackToHome v-if="showBackToHome" />
    <RouterView />
  </main>
  <footer class="app-footer">
    {{ t('footer.text') }}
  </footer>
</template>

<style scoped>
.main-content {
  max-width: 960px;
  margin: 0 auto;
  padding: 1rem;
}

.app-footer {
  max-width: 960px;
  margin: 0 auto;
  padding: 1rem 1rem 2rem;
  font-size: 0.8rem;
  color: var(--color-text-muted);
  text-align: center;
}

@media (min-width: 640px) {
  .main-content {
    padding: 1.5rem;
  }

  .app-footer {
    padding: 1rem 1.5rem 2rem;
  }
}
</style>
