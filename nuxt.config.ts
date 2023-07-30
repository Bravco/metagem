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
          name: "robots",
          content: "robots: index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
        },
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
          content: "meta tagging, seo ai, metadata tags for seo, improve seo, seo metadata, seo meta, website meta data, boost seo, seo with ai, ai for seo, seo and ai, ai powered seo, using ai for seo, metadata generator, meta data and seo, seo enhancement, website reach, improve site seo, ai meta description, seo ai generator, improve seo of your website, meta data generator, enhance seo, improve your website seo, ai seo generator, seo using ai, meta tags to improve seo, meta data in seo, meta descriptio ai, ai meta descriptions, seo metadata tags, generate meta tags for website, website metadata generator, improve seo for your website, seo metadata generator, seo metadata description, seo meta data generator, improve the seo, using ai in seo, boost website seo, boost website seo, website seo improvement, improve seo with meta tags, ai seo description generator",
        },
        {
          property: "og:type",
          content: "website",
        },
        {
          property: "og:site_name",
          content: "Metagem",
        },
        {
          property: "og:url",
          content: "https://metagem.pro",
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
          property: "og:image",
          content: "images/graphics.webp",
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
        {
          property: "twitter:image",
          content: "images/graphics.webp",
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