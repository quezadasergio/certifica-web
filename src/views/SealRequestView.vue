<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type forge from 'node-forge'
import StepIndicator from '@/components/StepIndicator.vue'
import CredentialLoader from '@/components/CredentialLoader.vue'
import PasswordStrengthMeter from '@/components/PasswordStrengthMeter.vue'
import GeneratedFilesList from '@/components/GeneratedFilesList.vue'
import type { CertificateInfo, GeneratedFile } from '@/types/certifica'
import { validatePassword } from '@/services/validation/passwordStrength'
import { generateSealRequestFiles } from '@/services/certifica/sealRequestService'
import { translateError } from '@/utils/translateError'

const { t } = useI18n()

const steps = computed(() => [
  t('seal.steps.credentials'),
  t('seal.steps.branches'),
  t('seal.steps.download'),
])
const currentStep = ref(0)

const credentials = ref<{
  certificate: forge.pki.Certificate
  certificateInfo: CertificateInfo
  privateKey: forge.pki.rsa.PrivateKey
} | null>(null)

interface BranchForm {
  name: string
  password: string
  passwordConfirmation: string
  error: string
}

const branches = reactive<BranchForm[]>([
  { name: '', password: '', passwordConfirmation: '', error: '' },
])

const generating = ref(false)
const generationError = ref('')
const generatedFiles = ref<GeneratedFile[]>([])

function onCredentialsUnlocked(payload: {
  certificate: forge.pki.Certificate
  certificateInfo: CertificateInfo
  privateKey: forge.pki.rsa.PrivateKey
}): void {
  credentials.value = payload
  currentStep.value = 1
}

function addBranch(): void {
  branches.push({ name: '', password: '', passwordConfirmation: '', error: '' })
}

function removeBranch(index: number): void {
  if (branches.length > 1) branches.splice(index, 1)
}

function validateBranches(): boolean {
  let allValid = true
  for (const branch of branches) {
    branch.error = ''
    if (branch.name.trim().length === 0) {
      branch.error = t('validation.branch.nameRequired')
    } else {
      const passwordResult = validatePassword(branch.password)
      if (!passwordResult.valid) {
        branch.error = t(passwordResult.messageKey!, passwordResult.messageParams ?? {})
      } else if (branch.password !== branch.passwordConfirmation) {
        branch.error = t('validation.password.mismatch')
      }
    }
    if (branch.error) allValid = false
  }
  return allValid
}

async function generateFiles(): Promise<void> {
  if (!credentials.value || !validateBranches()) return
  generating.value = true
  generationError.value = ''
  try {
    const result = await generateSealRequestFiles(
      credentials.value.certificateInfo.rfc,
      branches.map((branch) => ({ name: branch.name, password: branch.password })),
      credentials.value.certificate,
      credentials.value.privateKey,
    )
    generatedFiles.value = [...result.branchFiles, result.packageFile]
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
    <h1>{{ t('seal.title') }}</h1>
    <StepIndicator :steps="steps" :current-step="currentStep" />

    <div v-if="currentStep === 0">
      <p>{{ t('seal.intro') }}</p>
      <CredentialLoader require-valid-certificate @unlocked="onCredentialsUnlocked" />
    </div>

    <form v-else-if="currentStep === 1" @submit.prevent="generateFiles">
      <p>{{ t('seal.branchesIntro') }}</p>

      <fieldset v-for="(branch, index) in branches" :key="index" class="branch">
        <legend>{{ t('seal.sealLabel', { number: index + 1 }) }}</legend>

        <div class="form-field">
          <label :for="`branch-name-${index}`">{{ t('seal.branchName') }}</label>
          <input
            :id="`branch-name-${index}`"
            v-model="branch.name"
            type="text"
            maxlength="64"
            :placeholder="t('seal.branchPlaceholder')"
          />
        </div>

        <div class="form-field">
          <label :for="`branch-password-${index}`">{{ t('fields.password') }}</label>
          <input
            :id="`branch-password-${index}`"
            v-model="branch.password"
            type="password"
            autocomplete="new-password"
          />
          <PasswordStrengthMeter :password="branch.password" />
        </div>

        <div class="form-field">
          <label :for="`branch-confirmation-${index}`">{{ t('fields.passwordConfirmation') }}</label>
          <input
            :id="`branch-confirmation-${index}`"
            v-model="branch.passwordConfirmation"
            type="password"
            autocomplete="new-password"
          />
        </div>

        <span v-if="branch.error" class="field-error">{{ branch.error }}</span>

        <button
          v-if="branches.length > 1"
          type="button"
          class="button button--secondary branch__remove"
          @click="removeBranch(index)"
        >
          {{ t('common.remove') }}
        </button>
      </fieldset>

      <button type="button" class="button button--secondary branch-add" @click="addBranch">
        {{ t('seal.addBranch') }}
      </button>

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
      <i18n-t keypath="seal.success" tag="p">
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
.branch {
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: 1rem;
  margin-bottom: 1rem;
}

.branch legend {
  font-weight: 600;
  color: var(--color-accent);
  padding: 0 0.4rem;
}

.branch__remove,
.branch-add {
  width: 100%;
}

.branch__remove {
  margin-top: 0.5rem;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1.25rem;
}

@media (min-width: 640px) {
  .branch__remove,
  .branch-add {
    width: auto;
  }

  .actions {
    flex-direction: row;
  }
}
</style>
