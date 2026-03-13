import { computed, reactive, ref, watch } from 'vue'
import Swal from 'sweetalert2'

const STORAGE_KEY = 'si-prefix-master-history'

export const prefixes = [
  { symbol: 'Y', name: 'yotta', exponent: 24 },
  { symbol: 'Z', name: 'zetta', exponent: 21 },
  { symbol: 'E', name: 'exa', exponent: 18 },
  { symbol: 'P', name: 'peta', exponent: 15 },
  { symbol: 'T', name: 'tera', exponent: 12 },
  { symbol: 'G', name: 'giga', exponent: 9 },
  { symbol: 'M', name: 'mega', exponent: 6 },
  { symbol: 'k', name: 'kilo', exponent: 3 },
  { symbol: 'h', name: 'hecto', exponent: 2 },
  { symbol: 'da', name: 'deca', exponent: 1 },
  { symbol: '', name: 'base', exponent: 0 },
  { symbol: 'd', name: 'deci', exponent: -1 },
  { symbol: 'c', name: 'centi', exponent: -2 },
  { symbol: 'm', name: 'mili', exponent: -3 },
  { symbol: 'μ', name: 'micro', exponent: -6 },
  { symbol: 'u', name: 'micro (u)', exponent: -6 },
  { symbol: 'n', name: 'nano', exponent: -9 },
  { symbol: 'p', name: 'pico', exponent: -12 },
  { symbol: 'f', name: 'femto', exponent: -15 },
  { symbol: 'a', name: 'atto', exponent: -18 },
  { symbol: 'z', name: 'zepto', exponent: -21 },
  { symbol: 'y', name: 'yocto', exponent: -24 }
]

const unitDefinitions = [
  { symbol: 'm', name: { es: 'metro', en: 'meter' }, factorToSI: 1, dim: { m: 1 } },
  { symbol: 'g', name: { es: 'gramo', en: 'gram' }, factorToSI: 1e-3, dim: { kg: 1 } },
  { symbol: 's', name: { es: 'segundo', en: 'second' }, factorToSI: 1, dim: { s: 1 } },
  { symbol: 'A', name: { es: 'amperio', en: 'ampere' }, factorToSI: 1, dim: { A: 1 } },
  { symbol: 'K', name: { es: 'kelvin', en: 'kelvin' }, factorToSI: 1, dim: { K: 1 } },
  { symbol: 'mol', name: { es: 'mol', en: 'mole' }, factorToSI: 1, dim: { mol: 1 } },
  { symbol: 'cd', name: { es: 'candela', en: 'candela' }, factorToSI: 1, dim: { cd: 1 } },
  { symbol: 'Hz', name: { es: 'hertz', en: 'hertz' }, factorToSI: 1, dim: { s: -1 } },
  { symbol: 'N', name: { es: 'newton', en: 'newton' }, factorToSI: 1, dim: { kg: 1, m: 1, s: -2 } },
  { symbol: 'J', name: { es: 'joule', en: 'joule' }, factorToSI: 1, dim: { kg: 1, m: 2, s: -2 } },
  { symbol: 'W', name: { es: 'watt', en: 'watt' }, factorToSI: 1, dim: { kg: 1, m: 2, s: -3 } },
  { symbol: 'Pa', name: { es: 'pascal', en: 'pascal' }, factorToSI: 1, dim: { kg: 1, m: -1, s: -2 } },
  { symbol: 'V', name: { es: 'volt', en: 'volt' }, factorToSI: 1, dim: { kg: 1, m: 2, s: -3, A: -1 } },
  { symbol: 'Ω', name: { es: 'ohm', en: 'ohm' }, factorToSI: 1, dim: { kg: 1, m: 2, s: -3, A: -2 } }
]

const copy = (obj) => JSON.parse(JSON.stringify(obj))
const getExponent = (symbol) => prefixes.find((prefix) => prefix.symbol === symbol)?.exponent ?? 0
const getUnitDef = (symbol) => unitDefinitions.find((unit) => unit.symbol === symbol)
const isSameDimension = (left, right) => {
  const keys = ['kg', 'm', 's', 'A', 'K', 'mol', 'cd']
  return keys.every((key) => (left?.[key] ?? 0) === (right?.[key] ?? 0))
}

const messages = {
  es: {
    invalidValue: 'El valor debe ser mayor a 0.',
    missingUnits: 'Selecciona unidades de origen y destino.',
    incompatible: 'Las unidades seleccionadas no son compatibles dimensionalmente.',
    conversionError: 'No se pudo completar la conversión.',
    copyError: 'No fue posible copiar al portapapeles.',
    conversionTitle: 'Error de conversión',
    localTag: 'local',
    apiTag: 'API'
  },
  en: {
    invalidValue: 'Value must be greater than 0.',
    missingUnits: 'Select source and target units.',
    incompatible: 'Selected units are not dimensionally compatible.',
    conversionError: 'Could not complete conversion.',
    copyError: 'Could not copy to clipboard.',
    conversionTitle: 'Conversion error',
    localTag: 'local',
    apiTag: 'API'
  }
}

const fireError = async (lang, text) =>
  Swal.fire({
    title: messages[lang].conversionTitle,
    text,
    icon: 'error',
    background: '#0f172a',
    color: '#e2e8f0',
    iconColor: '#fb7185',
    confirmButtonColor: '#0891b2'
  })

const readHistory = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch (error) {
    console.warn('No se pudo leer historial:', error)
    return []
  }
}

export const useConversion = (langRef) => {
  const lang = computed(() => (langRef?.value === 'en' ? 'en' : 'es'))
  const units = computed(() =>
    unitDefinitions.map((unit) => ({ symbol: unit.symbol, name: unit.name[lang.value], dim: copy(unit.dim) }))
  )
  const form = reactive({
    value: '',
    prefixFrom: '',
    unitFrom: '',
    prefixTo: 'k',
    unitTo: '',
    numberFormat: 'auto'
  })
  const loading = ref(false)
  const result = ref(null)
  const steps = ref([])
  const copied = ref(false)
  const history = ref(readHistory())
  const validationMessage = computed(() => {
    if (!Number(form.value) || Number(form.value) <= 0) return messages[lang.value].invalidValue
    if (!form.unitFrom || !form.unitTo) return messages[lang.value].missingUnits
    const from = getUnitDef(form.unitFrom)
    const to = getUnitDef(form.unitTo)
    if (!from || !to || !isSameDimension(from.dim, to.dim)) return messages[lang.value].incompatible
    return ''
  })
  const canSubmit = computed(() => !loading.value && !validationMessage.value)
  const recents = computed(() => history.value.slice(0, 8))
  const favorites = computed(() => history.value.filter((item) => item.favorite))
  const presets = computed(() =>
    lang.value === 'en'
      ? [
          { id: 'length', label: 'Length: km to m', value: 1, from: ['k', 'm'], to: ['', 'm'] },
          { id: 'mass', label: 'Mass: mg to kg', value: 500, from: ['m', 'g'], to: ['k', 'g'] },
          { id: 'energy', label: 'Energy: mJ to kJ', value: 1250, from: ['m', 'J'], to: ['k', 'J'] },
          { id: 'pressure', label: 'Pressure: kPa to Pa', value: 100, from: ['k', 'Pa'], to: ['', 'Pa'] }
        ]
      : [
          { id: 'length', label: 'Longitud: km a m', value: 1, from: ['k', 'm'], to: ['', 'm'] },
          { id: 'mass', label: 'Masa: mg a kg', value: 500, from: ['m', 'g'], to: ['k', 'g'] },
          { id: 'energy', label: 'Energía: mJ a kJ', value: 1250, from: ['m', 'J'], to: ['k', 'J'] },
          { id: 'pressure', label: 'Presión: kPa a Pa', value: 100, from: ['k', 'Pa'], to: ['', 'Pa'] }
        ]
  )

  watch(
    history,
    (value) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
    },
    { deep: true }
  )

  const applyPreset = (preset) => {
    form.value = String(preset.value)
    form.prefixFrom = preset.from[0]
    form.unitFrom = preset.from[1]
    form.prefixTo = preset.to[0]
    form.unitTo = preset.to[1]
  }

  const applyHistory = (entry) => {
    form.value = String(entry.value)
    form.prefixFrom = entry.prefixFrom
    form.unitFrom = entry.unitFrom
    form.prefixTo = entry.prefixTo
    form.unitTo = entry.unitTo
  }

  const toggleFavorite = (id) => {
    const target = history.value.find((item) => item.id === id)
    if (target) target.favorite = !target.favorite
  }

  const swapDirection = () => {
    const next = {
      prefixFrom: form.prefixTo,
      unitFrom: form.unitTo,
      prefixTo: form.prefixFrom,
      unitTo: form.unitFrom
    }
    form.prefixFrom = next.prefixFrom
    form.unitFrom = next.unitFrom
    form.prefixTo = next.prefixTo
    form.unitTo = next.unitTo
  }

  const convert = async () => {
    if (validationMessage.value) {
      await Swal.fire({
        title: 'Validación',
        text: validationMessage.value,
        icon: 'warning',
        background: '#0f172a',
        color: '#e2e8f0',
        iconColor: '#22d3ee',
        confirmButtonColor: '#0891b2'
      })
      return
    }

    loading.value = true
    copied.value = false

    const payload = {
      value: Number(form.value),
      prefix_from: form.prefixFrom,
      unit_from: form.unitFrom,
      prefix_to: form.prefixTo,
      unit_to: form.unitTo
    }

    try {
      let converted = null
      let usedApi = false

      try {
        const response = await fetch('/convert', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        if (response.ok) {
          const data = await response.json()
          if (typeof data.result === 'number') {
            converted = data.result
            usedApi = true
          }
        }
      } catch (error) {
        console.warn('No se encontró endpoint /convert, usando conversión local.', error)
      }

      if (converted === null) {
        await new Promise((resolve) => setTimeout(resolve, 650))
        const fromUnit = getUnitDef(payload.unit_from)
        const toUnit = getUnitDef(payload.unit_to)
        const sourceMultiplier = 10 ** getExponent(payload.prefix_from) * fromUnit.factorToSI
        const targetDivider = 10 ** getExponent(payload.prefix_to) * toUnit.factorToSI
        converted = (payload.value * sourceMultiplier) / targetDivider
      }

      const expFrom = getExponent(payload.prefix_from)
      const expTo = getExponent(payload.prefix_to)
      const fromUnit = getUnitDef(payload.unit_from)
      const toUnit = getUnitDef(payload.unit_to)
      const sourceMultiplier = 10 ** expFrom * fromUnit.factorToSI
      const targetDivider = 10 ** expTo * toUnit.factorToSI

      result.value = converted
      steps.value =
        lang.value === 'en'
          ? [
              `1) Input: ${payload.value} ${payload.prefix_from}${payload.unit_from}`,
              `2) Source factor: 10^${expFrom} × ${fromUnit.factorToSI}`,
              `3) Target factor: 10^${expTo} × ${toUnit.factorToSI}`,
              `4) Conversion: (${payload.value} × ${sourceMultiplier}) / ${targetDivider}`,
              `5) Output: ${converted} ${payload.prefix_to}${payload.unit_to} (${usedApi ? messages[lang.value].apiTag : messages[lang.value].localTag})`
            ]
          : [
              `1) Valor inicial: ${payload.value} ${payload.prefix_from}${payload.unit_from}`,
              `2) Factor origen: 10^${expFrom} × ${fromUnit.factorToSI}`,
              `3) Factor destino: 10^${expTo} × ${toUnit.factorToSI}`,
              `4) Conversión: (${payload.value} × ${sourceMultiplier}) / ${targetDivider}`,
              `5) Resultado: ${converted} ${payload.prefix_to}${payload.unit_to} (${usedApi ? messages[lang.value].apiTag : messages[lang.value].localTag})`
            ]

      history.value = [
        {
          id: crypto.randomUUID(),
          favorite: false,
          value: payload.value,
          prefixFrom: payload.prefix_from,
          unitFrom: payload.unit_from,
          prefixTo: payload.prefix_to,
          unitTo: payload.unit_to,
          result: converted,
          ts: Date.now()
        },
        ...history.value
      ].slice(0, 20)
    } catch (error) {
      console.error('Fallo de conversión:', error)
      await fireError(lang.value, messages[lang.value].conversionError)
    } finally {
      loading.value = false
    }
  }

  const copyResult = async () => {
    if (result.value === null) return
    try {
      await navigator.clipboard.writeText(`${result.value} ${form.prefixTo}${form.unitTo}`)
      copied.value = true
      setTimeout(() => {
        copied.value = false
      }, 1500)
    } catch (error) {
      console.error('Fallo al copiar:', error)
      await fireError(lang.value, messages[lang.value].copyError)
    }
  }

  return {
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
  }
}
