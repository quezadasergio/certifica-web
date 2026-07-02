<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { evaluatePasswordStrength } from '@/services/validation/passwordStrength'

const props = defineProps<{ password: string }>()

const { t } = useI18n()

const strength = computed(() => evaluatePasswordStrength(props.password))

const strengthLabel = computed(() =>
  t(`passwordStrength.levels.${strength.value.level}`),
)

const barColor = computed(() => {
  switch (strength.value.level) {
    case 'muy-fuerte':
    case 'fuerte':
      return 'var(--color-success)'
    case 'aceptable':
      return 'var(--color-warning)'
    default:
      return 'var(--color-error)'
  }
})
</script>

<template>
  <div v-if="password.length > 0" class="strength">
    <div class="strength__track">
      <div
        class="strength__bar"
        :style="{ width: `${strength.score}%`, background: barColor }"
      />
    </div>
    <span class="strength__label">
      {{ t('passwordStrength.label', { level: strengthLabel }) }}
    </span>
  </div>
</template>

<style scoped>
.strength {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.strength__track {
  height: 6px;
  border-radius: 3px;
  background: var(--color-border);
  overflow: hidden;
}

.strength__bar {
  height: 100%;
  transition: width 0.2s ease;
}

.strength__label {
  font-size: 0.8rem;
  color: var(--color-text-muted);
}
</style>
