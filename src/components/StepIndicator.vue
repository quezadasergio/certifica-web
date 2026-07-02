<script setup lang="ts">
defineProps<{
  steps: string[]
  currentStep: number
}>()
</script>

<template>
  <ol class="steps">
    <li
      v-for="(step, index) in steps"
      :key="step"
      class="steps__item"
      :class="{
        'steps__item--active': index === currentStep,
        'steps__item--done': index < currentStep,
      }"
    >
      <span class="steps__number">{{ index + 1 }}</span>
      <span class="steps__label">{{ step }}</span>
    </li>
  </ol>
</template>

<style scoped>
.steps {
  display: flex;
  flex-wrap: nowrap;
  gap: 0.75rem;
  list-style: none;
  padding: 0;
  margin: 0 0 1.5rem;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
}

.steps__item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-text-muted);
  flex-shrink: 0;
}

.steps__number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.7rem;
  height: 1.7rem;
  border-radius: 50%;
  border: 2px solid currentColor;
  font-size: 0.85rem;
  font-weight: 700;
}

.steps__item--active {
  color: var(--color-accent);
  font-weight: 600;
}

.steps__item--done {
  color: var(--color-success);
}

.steps__item + .steps__item::before {
  content: '›';
  margin-right: 0.5rem;
  color: var(--color-border);
}

.steps__label {
  font-size: 0.9rem;
}
</style>
