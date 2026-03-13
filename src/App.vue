<script setup>
import { onMounted, ref, watch } from 'vue'
import ConverterForm from './components/ConverterForm.vue'

const lang = ref(localStorage.getItem('si-prefix-lang') || 'es')
const theme = ref(localStorage.getItem('si-prefix-theme') || 'dark')

const labels = {
  es: { subtitle: 'Conversor SI elegante, rápido y preciso.', light: 'Claro', dark: 'Oscuro' },
  en: { subtitle: 'Elegant, fast and precise SI converter.', light: 'Light', dark: 'Dark' }
}

onMounted(() => {
  document.documentElement.classList.toggle('dark', theme.value === 'dark')
  document.documentElement.classList.toggle('light', theme.value !== 'dark')
})

watch(theme, (value) => {
  localStorage.setItem('si-prefix-theme', value)
  document.documentElement.classList.toggle('dark', value === 'dark')
  document.documentElement.classList.toggle('light', value !== 'dark')
})

watch(lang, (value) => {
  localStorage.setItem('si-prefix-lang', value)
})
</script>

<template>
  <main class="min-h-screen px-4 py-10 sm:px-6">
    <section class="mx-auto w-full max-w-5xl">
      <header class="mb-8 text-center">
        <div class="mb-4 flex justify-center gap-2">
          <button
            @click="lang = 'es'"
            class="rounded-lg border px-3 py-1 text-xs transition"
            :class="lang === 'es' ? 'border-cyan-400 text-cyan-300' : 'border-slate-700 text-slate-300'"
          >
            ES
          </button>
          <button
            @click="lang = 'en'"
            class="rounded-lg border px-3 py-1 text-xs transition"
            :class="lang === 'en' ? 'border-cyan-400 text-cyan-300' : 'border-slate-700 text-slate-300'"
          >
            EN
          </button>
          <button
            @click="theme = theme === 'dark' ? 'light' : 'dark'"
            class="rounded-lg border border-slate-700 px-3 py-1 text-xs text-slate-300 transition hover:border-cyan-400 hover:text-cyan-300"
          >
            {{ theme === 'dark' ? labels[lang].light : labels[lang].dark }}
          </button>
        </div>
        <h1 class="text-4xl font-extrabold tracking-tight text-cyan-400 drop-shadow md:text-6xl">SI Prefix Master</h1>
        <p class="mt-3 text-sm text-slate-400 md:text-base">{{ labels[lang].subtitle }}</p>
      </header>

      <div class="animate-card-in rounded-3xl border border-cyan-400/20 bg-cardbg p-5 shadow-glow backdrop-blur-xl sm:p-8">
        <ConverterForm :lang="lang" />
      </div>
    </section>
  </main>
</template>
