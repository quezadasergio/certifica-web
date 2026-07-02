<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type forge from 'node-forge'
import type { CertificateInfo } from '@/types/certifica'
import { parseCertificate, privateKeyMatchesCertificate } from '@/services/crypto/certificateReader'
import { decryptPrivateKeyFromDer } from '@/services/crypto/privateKeyProtector'
import { readFileAsBytes } from '@/services/fileDownload'
import { translateError } from '@/utils/translateError'
import CertificateSummary from './CertificateSummary.vue'

const props = defineProps<{
  requireValidCertificate?: boolean
  certificateLabel?: string
}>()

const emit = defineEmits<{
  unlocked: [
    payload: {
      certificate: forge.pki.Certificate
      certificateInfo: CertificateInfo
      privateKey: forge.pki.rsa.PrivateKey
    },
  ]
}>()

const { t } = useI18n()

const certificateInfo = ref<CertificateInfo | null>(null)
const certificateError = ref('')
const keyError = ref('')
const passwordError = ref('')
const password = ref('')
const unlocked = ref(false)

let loadedCertificate: forge.pki.Certificate | null = null
let encryptedKeyBytes: Uint8Array | null = null

async function onCertificateSelected(event: Event): Promise<void> {
  const file = (event.target as HTMLInputElement).files?.[0]
  certificateError.value = ''
  certificateInfo.value = null
  loadedCertificate = null
  unlocked.value = false
  if (!file) return
  try {
    const parsed = parseCertificate(await readFileAsBytes(file))
    if (props.requireValidCertificate && parsed.info.isExpired) {
      certificateError.value = t('credential.expired')
      return
    }
    loadedCertificate = parsed.certificate
    certificateInfo.value = parsed.info
  } catch (error) {
    certificateError.value = translateError(error, t)
  }
}

async function onKeySelected(event: Event): Promise<void> {
  const file = (event.target as HTMLInputElement).files?.[0]
  keyError.value = ''
  encryptedKeyBytes = null
  unlocked.value = false
  if (!file) return
  encryptedKeyBytes = await readFileAsBytes(file)
}

function unlock(): void {
  passwordError.value = ''
  keyError.value = ''
  if (!loadedCertificate || !certificateInfo.value) {
    certificateError.value = t('credential.selectCertificate')
    return
  }
  if (!encryptedKeyBytes) {
    keyError.value = t('credential.selectPrivateKey')
    return
  }
  try {
    const privateKey = decryptPrivateKeyFromDer(encryptedKeyBytes, password.value)
    if (!privateKeyMatchesCertificate(privateKey, loadedCertificate)) {
      keyError.value = t('credential.mismatch')
      return
    }
    unlocked.value = true
    emit('unlocked', {
      certificate: loadedCertificate,
      certificateInfo: certificateInfo.value,
      privateKey,
    })
  } catch (error) {
    passwordError.value = translateError(error, t)
  }
}
</script>

<template>
  <div>
    <div class="form-field">
      <label for="credential-cer">{{
        certificateLabel ?? t('credential.certificateLabel')
      }}</label>
      <input id="credential-cer" type="file" accept=".cer,.pem,.crt" @change="onCertificateSelected" />
      <span v-if="certificateError" class="field-error">{{ certificateError }}</span>
    </div>

    <div v-if="certificateInfo" class="credential-summary">
      <CertificateSummary :info="certificateInfo" />
    </div>

    <div class="form-field">
      <label for="credential-key">{{ t('credential.privateKeyLabel') }}</label>
      <input id="credential-key" type="file" accept=".key" @change="onKeySelected" />
      <span v-if="keyError" class="field-error">{{ keyError }}</span>
    </div>

    <div class="form-field">
      <label for="credential-password">{{ t('credential.passwordLabel') }}</label>
      <input
        id="credential-password"
        v-model="password"
        type="password"
        autocomplete="current-password"
      />
      <span v-if="passwordError" class="field-error">{{ passwordError }}</span>
    </div>

    <button type="button" class="button button--primary button--block" :disabled="unlocked" @click="unlock">
      {{ unlocked ? t('credential.verified') : t('credential.verify') }}
    </button>
  </div>
</template>

<style scoped>
.credential-summary {
  margin-bottom: 1rem;
  padding: 0.9rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  background: #fafafa;
}
</style>
