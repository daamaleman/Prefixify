<script setup>
import { computed, onMounted, onUnmounted, toRef } from 'vue'
import ResultDisplay from './ResultDisplay.vue'
import { useConversion } from '../composables/useConversion'

const props = defineProps({
  lang: { type: String, default: 'es' }
})

const langRef = toRef(props, 'lang')
const {
  form,
  prefixes,
  units,
  loading,
  result,
  steps,
  copied,
  canSubmit,
  validationMessage,
  recents,
  favorites,
  presets,
  convert,
  copyResult,
  swapDirection,
  applyPreset,
  applyHistory,
  toggleFavorite
} = useConversion(langRef)

const text = computed(() =>
  props.lang === 'en'
    ? {
        source: 'Source',
        target: 'Target',
        convert: 'Convert',
        converting: 'Converting...',
        value: 'Enter value',
        unit: 'Unit',
        destinationPreview: 'Destination',
        chooseTarget: 'Select target prefix and unit',
        inlineTitle: 'Validation:',
        presets: 'Quick presets',
        format: 'Number format',
        auto: 'Auto',
        scientific: 'Scientific',
        swap: 'Swap',
        favorites: 'Favorites',
        recents: 'Recent',
        apply: 'Use'
      }
    : {
        source: 'Origen',
        target: 'Destino',
        convert: 'Convertir',
        converting: 'Convirtiendo...',
        value: 'Ingresa valor',
        unit: 'Unidad',
        destinationPreview: 'Destino',
        chooseTarget: 'Selecciona prefijo y unidad destino',
        inlineTitle: 'Validación:',
        presets: 'Presets rápidos',
        format: 'Formato numérico',
        auto: 'Auto',
        scientific: 'Científico',
        swap: 'Intercambiar',
        favorites: 'Favoritos',
        recents: 'Recientes',
        apply: 'Usar'
      }
)

const targetPreview = computed(() => {
  if (!form.unitTo) return text.value.chooseTarget
  return `${form.prefixTo || ''}${form.unitTo}`
})

const onKeydown = (event) => {
  if (event.key === 'Enter') {
    event.preventDefault()
    if (canSubmit.value) convert()
  }
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'c' && result.value !== null) {
    event.preventDefault()
    copyResult()
  }
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div class="flex flex-wrap gap-2">
        <button
          v-for="preset in presets"
          :key="preset.id"
          @click="applyPreset(preset)"
          class="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-200 transition hover:scale-[1.03] hover:bg-cyan-500/20"
        >
          {{ preset.label }}
        </button>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-xs text-slate-400">{{ text.format }}</span>
        <select
          v-model="form.numberFormat"
          class="rounded-lg border border-slate-700 bg-slate-950/70 px-2 py-1 text-sm outline-none transition focus:border-cyan-400"
        >
          <option value="auto">{{ text.auto }}</option>
          <option value="scientific">{{ text.scientific }}</option>
        </select>
      </div>
    </div>

    <div class="grid gap-5 md:grid-cols-2">
      <div class="space-y-3 rounded-2xl border border-slate-700/70 bg-slate-900/60 p-4">
        <h2 class="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300/85">{{ text.source }}</h2>
        <input
          v-model="form.value"
          type="number"
          min="0"
          step="any"
          :placeholder="text.value"
          class="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-2xl font-semibold outline-none transition duration-200 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/20"
        />
        <div class="grid grid-cols-2 gap-3">
          <select
            v-model="form.prefixFrom"
            class="rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 outline-none transition duration-200 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/20"
          >
            <option v-for="prefix in prefixes" :key="`from-${prefix.symbol}`" :value="prefix.symbol">
              {{ prefix.symbol || '∅' }} — {{ prefix.name }}
            </option>
          </select>
          <select
            v-model="form.unitFrom"
            class="rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 outline-none transition duration-200 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/20"
          >
            <option value="" disabled>{{ text.unit }}</option>
            <option v-for="unit in units" :key="`uf-${unit.symbol}`" :value="unit.symbol">
              {{ unit.name }} ({{ unit.symbol }})
            </option>
          </select>
        </div>
      </div>

      <div class="space-y-3 rounded-2xl border border-slate-700/70 bg-slate-900/60 p-4">
        <div class="flex items-center justify-between">
          <h2 class="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300/85">{{ text.target }}</h2>
          <button
            @click="swapDirection"
            class="rounded-lg border border-slate-600 px-2 py-1 text-xs text-slate-200 transition hover:border-cyan-400 hover:text-cyan-300"
          >
            {{ text.swap }}
          </button>
        </div>
        <div
          class="flex h-[52px] items-center rounded-xl border border-dashed border-cyan-400/30 bg-slate-950/40 px-4 text-sm text-cyan-200/90 transition-all"
          :class="form.unitTo ? 'shadow-[0_0_16px_rgba(34,211,238,0.12)]' : 'animate-pulse'"
        >
          <span class="mr-2 text-xs uppercase tracking-wider text-cyan-300/70">{{ text.destinationPreview }}:</span>
          <span class="font-semibold">{{ targetPreview }}</span>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <select
            v-model="form.prefixTo"
            class="rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 outline-none transition duration-200 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/20"
          >
            <option v-for="prefix in prefixes" :key="`to-${prefix.symbol}`" :value="prefix.symbol">
              {{ prefix.symbol || '∅' }} — {{ prefix.name }}
            </option>
          </select>
          <select
            v-model="form.unitTo"
            class="rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 outline-none transition duration-200 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/20"
          >
            <option value="" disabled>{{ text.unit }}</option>
            <option v-for="unit in units" :key="`ut-${unit.symbol}`" :value="unit.symbol">
              {{ unit.name }} ({{ unit.symbol }})
            </option>
          </select>
        </div>
      </div>
    </div>

    <p v-if="validationMessage" class="rounded-lg border border-amber-400/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
      <span class="font-semibold">{{ text.inlineTitle }}</span> {{ validationMessage }}
    </p>

    <button
      :disabled="!canSubmit"
      @click="convert"
      class="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 px-5 py-3 text-sm font-bold uppercase tracking-widest text-slate-950 transition duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
      :class="loading ? 'animate-soft-pulse' : ''"
    >
      <svg
        v-if="loading"
        class="h-4 w-4 animate-spin"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="12" cy="12" r="10" class="stroke-slate-900/30" stroke-width="4" />
        <path d="M22 12a10 10 0 0 0-10-10" class="stroke-slate-900" stroke-width="4" />
      </svg>
      {{ loading ? text.converting : text.convert }}
    </button>

    <ResultDisplay
      :result="result"
      :steps="steps"
      :copied="copied"
      :unit="form.unitTo"
      :prefix-to="form.prefixTo"
      :number-format="form.numberFormat"
      :lang="props.lang"
      @copy="copyResult"
    />

    <div class="grid gap-4 md:grid-cols-2">
      <div class="rounded-2xl border border-slate-700/60 bg-slate-900/50 p-4">
        <h3 class="mb-2 text-xs uppercase tracking-[0.2em] text-cyan-300/80">{{ text.favorites }}</h3>
        <div v-if="favorites.length === 0" class="text-sm text-slate-400">—</div>
        <div v-for="item in favorites" :key="`f-${item.id}`" class="mb-2 flex items-center justify-between gap-2 text-sm">
          <button class="truncate text-left text-cyan-200 hover:text-cyan-300" @click="applyHistory(item)">
            {{ item.value }} {{ item.prefixFrom }}{{ item.unitFrom }} → {{ item.prefixTo }}{{ item.unitTo }}
          </button>
          <button @click="toggleFavorite(item.id)" class="text-amber-300">★</button>
        </div>
      </div>
      <div class="rounded-2xl border border-slate-700/60 bg-slate-900/50 p-4">
        <h3 class="mb-2 text-xs uppercase tracking-[0.2em] text-cyan-300/80">{{ text.recents }}</h3>
        <div v-if="recents.length === 0" class="text-sm text-slate-400">—</div>
        <div v-for="item in recents" :key="`r-${item.id}`" class="mb-2 flex items-center justify-between gap-2 text-sm">
          <button class="truncate text-left text-slate-200 hover:text-cyan-300" @click="applyHistory(item)">
            {{ item.value }} {{ item.prefixFrom }}{{ item.unitFrom }} → {{ item.prefixTo }}{{ item.unitTo }}
          </button>
          <button @click="toggleFavorite(item.id)" class="text-slate-400 hover:text-amber-300">
            {{ item.favorite ? '★' : '☆' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
