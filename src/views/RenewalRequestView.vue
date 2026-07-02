<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type forge from 'node-forge'
import StepIndicator from '@/components/StepIndicator.vue'
import CredentialLoader from '@/components/CredentialLoader.vue'
import PasswordStrengthMeter from '@/components/PasswordStrengthMeter.vue'
import GeneratedFilesList from '@/components/GeneratedFilesList.vue'
import type { CertificateInfo, GeneratedFile } from '@/types/certifica'
import { validateEmail } from '@/services/validation/personValidation'
import { validatePassword } from '@/services/validation/passwordStrength'
import { generateRenewalFiles } from '@/services/certifica/renewalService'
import { translateError } from '@/utils/translateError'

const { t } = useI18n()

const steps = computed(() => [
  t('renewal.steps.credentials'),
  t('renewal.steps.password'),
  t('renewal.steps.download'),
])
const currentStep = ref(0)

const credentials = ref<{
  certificate: forge.pki.Certificate
  certificateInfo: CertificateInfo
  privateKey: forge.pki.rsa.PrivateKey
} | null>(null)

const form = reactive({
  email: '',
  password: '',
  passwordConfirmation: '',
})

const errors = reactive<Record<string, string>>({})
const generating = ref(false)
const generationError = ref('')
const generatedFiles = ref<GeneratedFile[]>([])

const passwordsMatch = computed(
  () => form.password.length > 0 && form.password === form.passwordConfirmation,
)

function setValidationError(field: string, messageKey?: string, params?: Record<string, unknown>): void {
  errors[field] = messageKey ? t(messageKey, params ?? {}) : ''
}

function onCredentialsUnlocked(payload: {
  certificate: forge.pki.Certificate
  certificateInfo: CertificateInfo
  privateKey: forge.pki.rsa.PrivateKey
}): void {
  credentials.value = payload
  currentStep.value = 1
}

async function generateFiles(): Promise<void> {
  if (!credentials.value) return
  const emailResult = validateEmail(form.email)
  const passwordResult = validatePassword(form.password)
  setValidationError('email', emailResult.messageKey)
  setValidationError('password', passwordResult.messageKey, passwordResult.messageParams)
  setValidationError(
    'passwordConfirmation',
    passwordsMatch.value ? undefined : 'validation.password.mismatch',
  )
  if (!emailResult.valid || !passwordResult.valid || !passwordsMatch.value) return

  generating.value = true
  generationError.value = ''
  try {
    const files = await generateRenewalFiles(
      credentials.value.certificateInfo,
      credentials.value.certificate,
      credentials.value.privateKey,
      form.email,
      form.password,
    )
    generatedFiles.value = [files.privateKeyFile, files.renewalFile]
    currentStep.value = 2
  } catch (error) {
    generationError.value = translateError(error, t)
  } finally {
    generating.value = false
  }
}
</script>

<template>
  <section class="card">
    <h1>{{ t('renewal.title') }}</h1>
    <StepIndicator :steps="steps" :current-step="currentStep" />

    <div v-if="currentStep === 0">
      <p>{{ t('renewal.intro') }}</p>
      <CredentialLoader require-valid-certificate @unlocked="onCredentialsUnlocked" />
    </div>

    <form v-else-if="currentStep === 1" @submit.prevent="generateFiles">
      <p>{{ t('renewal.providePassword') }}</p>

      <div class="form-field">
        <label for="renewal-email">{{ t('fields.email') }}</label>
        <input id="renewal-email" v-model="form.email" type="email" autocomplete="email" />
        <span v-if="errors.email" class="field-error">{{ errors.email }}</span>
      </div>

      <div class="form-field">
        <label for="renewal-password">{{ t('fields.password') }}</label>
        <input
          id="renewal-password"
          v-model="form.password"
          type="password"
          autocomplete="new-password"
        />
        <PasswordStrengthMeter :password="form.password" />
        <span v-if="errors.password" class="field-error">{{ errors.password }}</span>
      </div>

      <div class="form-field">
        <label for="renewal-password-confirmation">{{ t('fields.passwordConfirmation') }}</label>
        <input
          id="renewal-password-confirmation"
          v-model="form.passwordConfirmation"
          type="password"
          autocomplete="new-password"
        />
        <span v-if="errors.passwordConfirmation" class="field-error">
          {{ errors.passwordConfirmation }}
        </span>
      </div>

      <p v-if="generationError" class="field-error">{{ generationError }}</p>

      <div class="actions">
        <button type="button" class="button button--secondary" @click="currentStep = 0">
          {{ t('common.back') }}
        </button>
        <button type="submit" class="button button--primary" :disabled="generating">
          {{ generating ? t('common.generating') : t('common.generateFiles') }}
        </button>
      </div>
    </form>

    <div v-else>
      <i18n-t keypath="renewal.success" tag="p">
        <template #certisat>
          <a href="https://certisat.sat.gob.mx" target="_blank" rel="noopener">
            {{ t('common.certisatWeb') }}
          </a>
        </template>
      </i18n-t>
      <GeneratedFilesList :files="generatedFiles" />
    </div>
  </section>
</template>

<style scoped>
.actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

@media (min-width: 640px) {
  .actions {
    flex-direction: row;
  }
}
</style>
