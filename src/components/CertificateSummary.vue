<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { CertificateInfo } from '@/types/certifica'

defineProps<{ info: CertificateInfo }>()

const { t, locale } = useI18n()

const dateLocale = computed(() => (locale.value === 'en' ? 'en-US' : 'es-MX'))

function formatDate(date: Date): string {
  return date.toLocaleDateString(dateLocale.value, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>

<template>
  <dl class="summary">
    <div class="summary__row">
      <dt>{{ t('certificateSummary.serialNumber') }}</dt>
      <dd>{{ info.serialNumber }}</dd>
    </div>
    <div class="summary__row">
      <dt>{{ t('certificateSummary.subject') }}</dt>
      <dd>{{ info.subjectName || t('common.emptyValue') }}</dd>
    </div>
    <div class="summary__row">
      <dt>{{ t('certificateSummary.rfc') }}</dt>
      <dd>{{ info.rfc || t('common.emptyValue') }}</dd>
    </div>
    <div v-if="info.curp" class="summary__row">
      <dt>{{ t('certificateSummary.curp') }}</dt>
      <dd>{{ info.curp }}</dd>
    </div>
    <div class="summary__row">
      <dt>{{ t('certificateSummary.issuer') }}</dt>
      <dd>{{ info.issuerName || t('common.emptyValue') }}</dd>
    </div>
    <div class="summary__row">
      <dt>{{ t('certificateSummary.validity') }}</dt>
      <dd>
        {{ formatDate(info.validFrom) }} — {{ formatDate(info.validTo) }}
        <span v-if="info.isExpired" class="summary__badge summary__badge--expired">
          {{ t('certificateSummary.expired') }}
        </span>
        <span v-else class="summary__badge summary__badge--valid">
          {{ t('certificateSummary.valid') }}
        </span>
      </dd>
    </div>
  </dl>
</template>

<style scoped>
.summary {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.summary__row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.15rem 0.5rem;
}

.summary__row dt {
  font-weight: 600;
  color: var(--color-text-muted);
}

.summary__row dd {
  margin: 0;
  word-break: break-word;
}

.summary__badge {
  display: inline-block;
  margin-top: 0.25rem;
  padding: 0.1rem 0.55rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  color: #fff;
}

.summary__badge--valid {
  background: var(--color-success);
}

.summary__badge--expired {
  background: var(--color-error);
}

@media (min-width: 640px) {
  .summary__row {
    grid-template-columns: 10rem 1fr;
    gap: 0.5rem;
  }

  .summary__badge {
    margin-top: 0;
    margin-left: 0.5rem;
  }
}
</style>
