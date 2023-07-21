export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    "nuxt-chatgpt",
    "@nuxt/image",
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
      meta: [
        {
          name: "author",
          content: "metagen",
        },
        {
          name: "title",
          content: "metagen - AI Metadata Generator",
        },
        {
          name: "description",
          content: "AI-powered website for generating custom metadata quickly and accurately. Automated system provides fast, reliable results. Easy to use interface. Get the metadata you need in minutes.",
        },
        {
          name: "keywords",
          content: "automated metadata generator, AI-driven metadata, AI-based metadata, metadata automation, custom metadata, metadata optimization, metadata tagging, metadata analysis, metadata website, metadata search, metadata keywords, metadata creation, metadata generator, metadata management, metadata solutions, metadata software, metadata services, metadata development, metadata tool",
        },
        {
          property: "og:type",
          content: "website",
        },
        {
          property: "og:title",
          content: "metagen - AI Metadata Generator",
        },
        {
          property: "og:description",
          content: "AI-powered website for generating custom metadata quickly and accurately. Automated system provides fast, reliable results. Easy to use interface. Get the metadata you need in minutes.",
        },
        {
          property: "twitter:card",
          content: "summary_large_image",
        },
        {
          property: "twitter:title",
          content: "metagen - AI Metadata Generator",
        },
        {
          property: "twitter:description",
          content: "AI-powered website for generating custom metadata quickly and accurately. Automated system provides fast, reliable results. Easy to use interface. Get the metadata you need in minutes.",
        },
      ],
    },
  },
  nitro: {
    compressPublicAssets: true,
  },
  chatgpt: {
    apiKey: process.env.OPENAI_API_KEY,
  },
  image: {
    provider: "netlify",
    netlify: {
      baseURL: process.env.IMAGES_URL,
    },
  },
});