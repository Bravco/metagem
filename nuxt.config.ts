export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    "nuxt-chatgpt",
    "nuxt-icon",
  ],
  css: [
    "@mdi/font/css/materialdesignicons.css",
    "vuetify/lib/styles/main.sass",
    "@/assets/main.css",
  ],
  chatgpt: {
    apiKey: process.env.OPENAI_API_KEY,
  },
  build: {
    transpile: ["vuetify"],
  },
  nitro: {
    compressPublicAssets: true,
  },
  vite: {
    define: {
      "process.env.DEBUG": false,
    },
  },
});