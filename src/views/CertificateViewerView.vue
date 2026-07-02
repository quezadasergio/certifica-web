<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import CertificateSummary from '@/components/CertificateSummary.vue'
import type { CertificateInfo } from '@/types/certifica'
import { parseCertificate } from '@/services/crypto/certificateReader'
import { readFileAsBytes } from '@/services/fileDownload'
import { translateError } from '@/utils/translateError'

const { t } = useI18n()

const certificateInfo = ref<CertificateInfo | null>(null)
const error = ref('')

async function onFileSelected(event: Event): Promise<void> {
  const file = (event.target as HTMLInputElement).files?.[0]
  certificateInfo.value = null
  error.value = ''
  if (!file) return
  try {
    certificateInfo.value = parseCertificate(await readFileAsBytes(file)).info
  } catch (parseError) {
    error.value = translateError(parseError, t)
  }
}
</script>

<template>
  <section class="card">
    <h1>{{ t('certificate.title') }}</h1>
    <p>{{ t('certificate.intro') }}</p>

    <div class="form-field">
      <label for="viewer-cer">{{ t('certificate.fileLabel') }}</label>
      <input id="viewer-cer" type="file" accept=".cer,.pem,.crt" @change="onFileSelected" />
      <span v-if="error" class="field-error">{{ error }}</span>
    </div>

    <div v-if="certificateInfo" class="viewer-summary">
      <CertificateSummary :info="certificateInfo" />
    </div>
  </section>
</template>

<style scoped>
.viewer-summary {
  margin-top: 1rem;
  padding: 1rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  background: #fafafa;
}
</style>
