<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  result: { type: Number, default: null },
  steps: { type: Array, default: () => [] },
  copied: { type: Boolean, default: false },
  unit: { type: String, default: '' },
  prefixTo: { type: String, default: '' },
  numberFormat: { type: String, default: 'auto' },
  lang: { type: String, default: 'es' }
})

defineEmits(['copy'])

const animatedValue = ref(null)

watch(
  () => props.result,
  (next, prev) => {
    if (next === null) {
      animatedValue.value = null
      return
    }
    const from = typeof prev === 'number' ? prev : 0
    const to = next
    const duration = 380
    const start = performance.now()
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1)
      animatedValue.value = from + (to - from) * (1 - (1 - p) ** 3)
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  },
  { immediate: true }
)

const formatResult = computed(() => {
  if (animatedValue.value === null || animatedValue.value === undefined) return ''
  const locale = props.lang === 'en' ? 'en-US' : 'es-ES'
  if (props.numberFormat === 'scientific') return Number(animatedValue.value).toExponential(6)
  return Number(animatedValue.value).toLocaleString(locale, { maximumSignificantDigits: 12 })
})

const label = computed(() =>
  props.lang === 'en'
    ? { result: 'Result', copy: 'Copy result', copied: 'Copied' }
    : { result: 'Resultado', copy: 'Copiar resultado', copied: 'Copiado' }
)
</script>

<template>
  <Transition name="fade-up">
    <div
      v-if="result !== null"
      class="rounded-2xl border border-cyan-400/30 bg-slate-900/60 p-5 shadow-[0_8px_30px_rgba(34,211,238,0.08)]"
    >
      <p class="text-xs uppercase tracking-[0.2em] text-cyan-200/80">{{ label.result }}</p>
      <p class="mt-2 break-all text-3xl font-extrabold text-cyan-400 sm:text-4xl">
        {{ formatResult }} {{ prefixTo }}{{ unit }}
      </p>

      <div class="mt-4 space-y-1 text-sm text-slate-300">
        <p v-for="(step, idx) in steps" :key="idx">{{ step }}</p>
      </div>

      <button
        @click="$emit('copy')"
        class="mt-5 inline-flex items-center gap-2 rounded-lg border border-cyan-400/40 bg-cyan-500/10 px-3 py-2 text-sm font-medium text-cyan-300 transition hover:bg-cyan-500/20"
      >
        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 9h10v10H9zM5 5h10v2H7v8H5z" class="fill-current" />
        </svg>
        {{ copied ? label.copied : label.copy }}
      </button>
    </div>
  </Transition>
</template>
