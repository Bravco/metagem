export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["nuxt-chatgpt"],
  chatgpt: {
    apiKey: process.env.OPENAI_API_KEY,
  },
});