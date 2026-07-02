<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { GeneratedFile } from '@/types/certifica'
import { downloadFile } from '@/services/fileDownload'

defineProps<{ files: GeneratedFile[] }>()

const { t } = useI18n()
</script>

<template>
  <ul class="files">
    <li v-for="file in files" :key="file.fileName" class="files__item">
      <div class="files__info">
        <strong class="files__name">{{ file.fileName }}</strong>
        <span class="files__description">
          {{ t(file.descriptionKey, file.descriptionParams ?? {}) }}
        </span>
      </div>
      <button type="button" class="button button--secondary files__button" @click="downloadFile(file)">
        {{ t('common.download') }}
      </button>
    </li>
  </ul>
</template>

<style scoped>
.files {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.files__item {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  background: #fafafa;
}

.files__info {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  min-width: 0;
}

.files__name {
  word-break: break-all;
}

.files__description {
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

.files__button {
  width: 100%;
}

@media (min-width: 640px) {
  .files__item {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .files__button {
    width: auto;
    flex-shrink: 0;
  }
}
</style>
