export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    "nuxt-chatgpt",
    "@nuxt/image",
    "@nuxt/content",
    "nuxt-icon",
    "@invictus.codes/nuxt-vuetify",
    "@vueuse/motion/nuxt",
  ],
  runtimeConfig: {
    private: {
      STRIPE_API_KEY: process.env.STRIPE_API_KEY,
      FIREBASE_TYPE: process.env.FIREBASE_TYPE,
      FIREBASE_PRIVATE_KEY_ID: process.env.FIREBASE_PRIVATE_KEY_ID,
      FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
      FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
      FIREBASE_CLIENT_ID: process.env.FIREBASE_CLIENT_ID,
      FIREBASE_AUTH_URI: process.env.FIREBASE_AUTH_URI,
      FIREBASE_TOKEN_URI: process.env.FIREBASE_TOKEN_URI,
      FIREBASE_AUTH_PROVIDER_X509_CERT_URL: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
      FIREBASE_CLIENT_X509_CERT_URL: process.env.FIREBASE_CLIENT_X509_CERT_URL,
      FIREBASE_UNIVERSE_DOMAIN: process.env.FIREBASE_UNIVERSE_DOMAIN,
    },
    public: {
      APP_DOMAIN: process.env.APP_DOMAIN,
      FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
      FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
      FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
      FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
      FIERBASE_MESSAGING_SENDER_ID: process.env.FIERBASE_MESSAGING_SENDER_ID,
      FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
      FIREBASE_MEASUREMENT_ID: process.env.FIREBASE_MEASUREMENT_ID,
    },
  },
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
          content: "Metagem",
        },
        {
          name: "title",
          content: "Metagem - AI Metadata Generator",
        },
        {
          name: "description",
          content: "AI-powered metadata generator. Generates custom metadata quickly and accurately. Automated system provides fast, reliable results. Easy to use interface. Get the metadata you need in minutes.",
        },
        {
          name: "keywords",
          content: "meta, metadata, seo, seo optimization, online, online reach, online rankings, rankings, web, web app, saas, saas product, startup, targeted audience, generator, automated metadata generator, AI-driven metadata, AI-based metadata, metadata automation, custom metadata, metadata optimization, metadata tagging, metadata analysis, metadata website, metadata search, metadata keywords, metadata creation, metadata generator, metadata management, metadata solutions, metadata software, metadata services, metadata development, metadata tool",
        },
        {
          property: "og:type",
          content: "website",
        },
        {
          property: "og:title",
          content: "Metagem - AI Metadata Generator",
        },
        {
          property: "og:description",
          content: "AI-powered metadata generator. Generates custom metadata quickly and accurately. Automated system provides fast, reliable results. Easy to use interface. Get the metadata you need in minutes.",
        },
        {
          property: "twitter:card",
          content: "summary_large_image",
        },
        {
          property: "twitter:title",
          content: "Metagem - AI Metadata Generator",
        },
        {
          property: "twitter:description",
          content: "AI-powered metadata generator. Generates custom metadata quickly and accurately. Automated system provides fast, reliable results. Easy to use interface. Get the metadata you need in minutes.",
        },
      ],
    },
  },
  nitro: {
    compressPublicAssets: true,
    preset: "firebase",
  },
  vite: {
    define: {
      "process.env.DEBUG": false,
    },
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