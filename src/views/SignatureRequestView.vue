<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import StepIndicator from '@/components/StepIndicator.vue'
import PasswordStrengthMeter from '@/components/PasswordStrengthMeter.vue'
import GeneratedFilesList from '@/components/GeneratedFilesList.vue'
import type { GeneratedFile } from '@/types/certifica'
import {
  validateCurp,
  validateEmail,
  validateRfc,
} from '@/services/validation/personValidation'
import { validatePassword } from '@/services/validation/passwordStrength'
import { generateSignatureRequestFiles } from '@/services/certifica/signatureRequestService'
import { translateError } from '@/utils/translateError'

const { t } = useI18n()

const steps = computed(() => [
  t('signature.steps.applicant'),
  t('signature.steps.password'),
  t('signature.steps.download'),
])
const currentStep = ref(0)

const form = reactive({
  rfc: '',
  curp: '',
  email: '',
  useLegalRepresentative: false,
  legalRepresentativeRfc: '',
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

function validateApplicantStep(): boolean {
  const rfcResult = validateRfc(form.rfc)
  const curpResult = validateCurp(form.curp)
  const emailResult = validateEmail(form.email)
  setValidationError('rfc', rfcResult.messageKey)
  setValidationError('curp', curpResult.messageKey)
  setValidationError('email', emailResult.messageKey)
  setValidationError('legalRepresentativeRfc')
  if (form.useLegalRepresentative) {
    const legalResult = validateRfc(form.legalRepresentativeRfc)
    setValidationError(
      'legalRepresentativeRfc',
      legalResult.valid ? undefined : 'validation.rfc.legalRepresentative',
    )
  }
  return (
    rfcResult.valid && curpResult.valid && emailResult.valid && !errors.legalRepresentativeRfc
  )
}

function validatePasswordStep(): boolean {
  const passwordResult = validatePassword(form.password)
  setValidationError('password', passwordResult.messageKey, passwordResult.messageParams)
  setValidationError(
    'passwordConfirmation',
    passwordsMatch.value ? undefined : 'validation.password.mismatch',
  )
  return passwordResult.valid && passwordsMatch.value
}

function goToPasswordStep(): void {
  if (validateApplicantStep()) currentStep.value = 1
}

async function generateFiles(): Promise<void> {
  if (!validatePasswordStep()) return
  generating.value = true
  generationError.value = ''
  try {
    const files = await generateSignatureRequestFiles(
      {
        rfc: form.rfc,
        curp: form.curp,
        email: form.email,
        legalRepresentativeRfc: form.useLegalRepresentative
          ? form.legalRepresentativeRfc
          : undefined,
      },
      form.password,
    )
    generatedFiles.value = [files.privateKeyFile, files.requestFile]
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
    <h1>{{ t('signature.title') }}</h1>
    <StepIndicator :steps="steps" :current-step="currentStep" />

    <form v-if="currentStep === 0" @submit.prevent="goToPasswordStep">
      <p>{{ t('signature.provideData') }}</p>

      <div class="form-field">
        <label for="rfc">{{ t('fields.rfc') }}</label>
        <input id="rfc" v-model="form.rfc" type="text" maxlength="13" autocomplete="off" />
        <span v-if="errors.rfc" class="field-error">{{ errors.rfc }}</span>
      </div>

      <div class="form-field">
        <label for="curp">{{ t('fields.curp') }}</label>
        <input id="curp" v-model="form.curp" type="text" maxlength="18" autocomplete="off" />
        <span v-if="errors.curp" class="field-error">{{ errors.curp }}</span>
      </div>

      <div class="form-field">
        <label for="email">{{ t('fields.email') }}</label>
        <input id="email" v-model="form.email" type="email" autocomplete="email" />
        <span v-if="errors.email" class="field-error">{{ errors.email }}</span>
      </div>

      <div class="form-field form-field--checkbox">
        <label>
          <input v-model="form.useLegalRepresentative" type="checkbox" />
          {{ t('signature.legalRepresentative') }}
        </label>
        <span class="field-hint">{{ t('signature.legalRepresentativeHint') }}</span>
      </div>

      <div v-if="form.useLegalRepresentative" class="form-field">
        <label for="legal-rfc">{{ t('signature.legalRepresentativeRfc') }}</label>
        <input
          id="legal-rfc"
          v-model="form.legalRepresentativeRfc"
          type="text"
          maxlength="13"
          autocomplete="off"
        />
        <span v-if="errors.legalRepresentativeRfc" class="field-error">
          {{ errors.legalRepresentativeRfc }}
        </span>
      </div>

      <p class="required-note">{{ t('common.requiredFields') }}</p>
      <button type="submit" class="button button--primary">{{ t('common.continue') }}</button>
    </form>

    <form v-else-if="currentStep === 1" @submit.prevent="generateFiles">
      <p>{{ t('signature.providePassword') }}</p>

      <div class="form-field">
        <label for="password">{{ t('fields.password') }}</label>
        <input id="password" v-model="form.password" type="password" autocomplete="new-password" />
        <PasswordStrengthMeter :password="form.password" />
        <span v-if="errors.password" class="field-error">{{ errors.password }}</span>
      </div>

      <div class="form-field">
        <label for="password-confirmation">{{ t('fields.passwordConfirmation') }}</label>
        <input
          id="password-confirmation"
          v-model="form.passwordConfirmation"
          type="password"
          autocomplete="new-password"
        />
        <span v-if="errors.passwordConfirmation" class="field-error">
          {{ errors.passwordConfirmation }}
        </span>
      </div>

      <p class="field-hint">{{ t('signature.keyGenerationHint') }}</p>
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
      <p>{{ t('signature.success') }}</p>
      <GeneratedFilesList :files="generatedFiles" />
      <p class="field-hint next-steps">{{ t('signature.nextSteps') }}</p>
    </div>
  </section>
</template>

<style scoped>
.actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.form-field--checkbox label {
  font-weight: 600;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
}

.next-steps {
  margin: 1rem 0;
}

@media (min-width: 640px) {
  .actions {
    flex-direction: row;
  }
}
</style>
