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
    <i18n-t keypath="footer.text" tag="p" class="app-footer__text">
      <template #author>
        <a
          href="https://github.com/quezadasergio"
          target="_blank"
          rel="noopener noreferrer"
          class="app-footer__link"
        >
          quezadasergio
        </a>
      </template>
    </i18n-t>
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

.app-footer__text {
  margin: 0;
}

.app-footer__link {
  color: var(--color-accent);
  font-weight: 600;
  text-decoration: none;
}

.app-footer__link:hover {
  color: var(--color-accent-dark);
  text-decoration: underline;
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
