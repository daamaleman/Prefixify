  <p align="center">
    <img src="./prefixify_banner.png" alt="Prefixify Banner" width="100%" />
  </p>

  <h1 align="center">Prefixify</h1>
  <p align="center"><b>La forma inteligente de escalar el SI.</b></p>
  <p align="center"><i>La forma más inteligente de escalar unidades del SI: de yocto a yotta, en segundos.</i></p>

  <p align="center">
    <img src="https://img.shields.io/badge/Vue-3-42b883?style=for-the-badge&logo=vue.js&logoColor=white" alt="Vue 3" />
    <img src="https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
    <img src="https://img.shields.io/badge/Tailwind-3-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/SweetAlert2-UI-ff5f7e?style=for-the-badge" alt="SweetAlert2" />
    <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="MIT" />
  </p>

  ---

  ## 🧭 Navegación rápida

  - [✨ Características](#-características)
  - [🚀 Instalación](#-instalación-rápida)
  - [📦 Scripts](#-scripts-disponibles)
  - [🗂️ Estructura](#️-estructura-del-proyecto)
  - [🧠 Nota técnica](#-nota-técnica)

  ---

  ## ✨ Características

  - Conversión entre prefijos SI (`yocto` a `yotta`)
  - Soporte para unidades base y derivadas: `m, g, s, A, K, mol, cd, Hz, N, J, W, Pa, V, Ω`
  - Interfaz bilingüe (`ES/EN`)
  - Tema oscuro/claro persistente en `localStorage`
  - Historial reciente y favoritos
  - Presets rápidos para conversiones comunes
  - Copia del resultado al portapapeles
  - Validaciones con SweetAlert2
  - UI responsive con Tailwind CSS

  <details>
  <summary><b>📚 Ver unidades incluidas</b></summary>

  | Tipo | Unidades |
  |---|---|
  | Base | m, g, s, A, K, mol, cd |
  | Derivadas | Hz, N, J, W, Pa, V, Ω |

  </details>

  ---

  ## ⚙️ Stack

  - Vue 3
  - Vite
  - Tailwind CSS
  - SweetAlert2

  ## 🚀 Instalación rápida

  ```bash
  git clone https://github.com/username/prefixify.git
  cd prefixify
  npm install
  npm run dev
  ```

  Abre en tu navegador:

  ```text
  http://localhost:5173
  ```

  ## 📦 Scripts disponibles

  ```bash
  npm run dev      # entorno de desarrollo
  npm run build    # build de producción
  npm run preview  # vista previa del build
  ```

  <details>
  <summary><b>💡 Flujo recomendado</b></summary>

  1. Ejecuta `npm run dev` mientras desarrollas.
  2. Verifica con `npm run build` antes de publicar.
  3. Usa `npm run preview` para validar el build final.

  </details>

  ## 🗂️ Estructura del proyecto

  ```text
  Prefixify/
  ├── index.html
  ├── package.json
  ├── tailwind.config.js
  ├── postcss.config.js
  ├── vite.config.js
  ├── src/
  │   ├── App.vue
  │   ├── main.js
  │   ├── style.css
  │   ├── components/
  │   │   ├── ConverterForm.vue
  │   │   └── ResultDisplay.vue
  │   └── composables/
  │       └── useConversion.js
  └── README.md
  ```

  ## 🧠 Nota técnica

  El frontend intenta usar un endpoint opcional `POST /convert`.
  Si no existe, aplica la conversión localmente desde `src/composables/useConversion.js`.

  ---

  ## 📜 Licencia

  MIT
