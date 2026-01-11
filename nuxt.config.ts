// https://nuxt.com/docs/api/configuration/nuxt-config
/// <reference types="nuxt" />
const rightNow = new Date();
const APP_VERSION = rightNow
  .toISOString()
  .slice(2, 16)
  .replace(/-/g, ".")
  .replace(/:/g, "")
  .replace(/T/g, ".");

export default defineNuxtConfig({
  compatibilityDate: '2026-01-11',
  ssr: false,
  telemetry: false,
  runtimeConfig: {
    // Private keys (only available on server-side)
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
    AWS_ACCESS_REGION: process.env.AWS_ACCESS_REGION,
    MONGO_INITDB_HOST: process.env.MONGO_INITDB_HOST,
    MONGO_INITDB_DATABASE: process.env.MONGO_INITDB_DATABASE,
    MONGO_INITDB_ROOT_USERNAME: process.env.MONGO_INITDB_ROOT_USERNAME,
    MONGO_INITDB_ROOT_PASSWORD: process.env.MONGO_INITDB_ROOT_PASSWORD,
    // Public keys (exposed to client-side)
    public: {
      APP_VERSION: process.env.APP_VERSION || APP_VERSION,
      APP_BRANCH: process.env.APP_BRANCH || "",
      APP_BASE_URL: process.env.ROUTER_BASE || "/",
    }
  },
  devServer: {
    port: Number(process.env.NODE_PORT) || 8000,
    host: process.env.NODE_HOST || "0.0.0.0",
  },
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/device',
    '@vueuse/nuxt',
  ],
  plugins: [
    { src: "~/plugins/eventbus.ts", mode: "client" },
    { src: "~/plugins/vuetify.ts", mode: "client" },
    { src: "~/plugins/createjs.ts", mode: "client" },
    { src: "~/plugins/headful.ts", mode: "client" },
    { src: "~/plugins/init-stations.ts", mode: "client" },
  ],
  app: {
    head: {
      titleTemplate: "%s - dnbradio.com",
      title: "dnbradio - Listen live 24/7 to drum & bass mixes, liquid, jungle, & neuro streamed globally",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "description",
          content: "24/7 drum & bass, jungle, neuro, and drum funk with live dj's streaming worldwide",
        },
      ],
      link: [
        {
          rel: "icon",
          type: "image/png",
          href: "https://dnbradio.com/img/logotags.png",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons",
        },
        {
          rel: "image_src",
          type: "image/png",
          href: "https://dnbradio.com/img/logotags.png",
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "192x192",
          href: "https://dnbradio.com/img/logotags.png",
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "32x32",
          href: "https://dnbradio.com/img/logotags.png",
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "96x96",
          href: "https://dnbradio.com/img/logotags.png",
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "16x16",
          href: "https://dnbradio.com/img/logotags.png",
        },
      ],
      script: [
        { src: "https://code.createjs.com/1.0.0/soundjs.min.js", defer: true },
        {
          src: "https://plausible.io/js/script.js",
          defer: true,
          "data-domain": "dnbradio.com",
        },
      ],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
    baseURL: process.env.ROUTER_BASE || '/',
  },
  vite: {
    define: {
      'process.env.DEBUG': false,
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/assets/variables.scss";`
        }
      }
    },
    plugins: [
      {
        name: 'fix-vuetify-dialog',
        enforce: 'pre',
        resolveId(id) {
          if (id === 'vuetify/lib') {
            return { id: 'vuetify', external: false }
          }
        }
      }
    ],
    optimizeDeps: {
      exclude: ['vuetify']
    },
    resolve: {
      alias: {
        'vuetify/lib': 'vuetify'
      }
    }
  },
  nitro: {
    preset: 'static',
    prerender: {
      routes: [
        "/",
        "/stations/1",
        "/stations/1/widget-chat",
        "/stations/1/widget-vis",
        "/stations/1/widget-upnext",
        "/stations/1/widget-nowplaying",
        "/stations/1/widget-donators",
        "/stations/1/widget-listeners",
        "/stations/1/widget-marquee",
        "/stations/1/widget-socials",
        "/stations/1/donate",
        "/stations/1/schedule",
        "/stations/1/chat",
        "/stations/1/podcast",
        "/stations/2",
        "/stations/2/schedule",
        "/stations/2/chat",
        "/stations/2/podcast",
        "/stations/2/widget-upnext",
        "/stations/2/widget-nowplaying",
        "/stations/3",
        "/stations/3/schedule",
        "/stations/3/chat",
        "/stations/3/podcast",
        "/stations/4",
        "/stations/4/schedule",
        "/stations/4/chat",
        "/stations/4/podcast",
        "/stations/5",
        "/stations/5/schedule",
        "/stations/5/chat",
        "/stations/5/podcast",
        "/stations/5/widget-vis",
        "/stations/5/widget-upnext",
        "/stations/5/widget-nowplaying",
        "/stations/5/widget-donators",
        "/stations/5/widget-listeners",
        "/stations/5/widget-marquee",
        "/stations/5/widget-socials",
        "/stations/5/widget-chat",
        "/stations/4/widget-vis",
        "/stations/4/widget-upnext",
        "/stations/4/widget-nowplaying",
        "/stations/4/widget-donators",
        "/stations/4/widget-listeners",
        "/stations/4/widget-marquee",
        "/stations/4/widget-socials",
      ]
    }
  },
})
