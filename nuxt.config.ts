export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    "nuxt-chatgpt",
    "nuxt-icon",
    "@invictus.codes/nuxt-vuetify",
  ],
  css: [
    "@/assets/main.css",
  ],
  app: {
    pageTransition: {
      name: "page",
      mode: "out-in",
    },
    head: {
      htmlAttrs: {
        lang: "en",
      },
    },
  },
  nitro: {
    compressPublicAssets: true,
  },
  chatgpt: {
    apiKey: process.env.OPENAI_API_KEY,
  },
});