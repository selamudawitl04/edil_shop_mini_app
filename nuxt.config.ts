// https://nuxt.com/docs/api/configuration/nuxt-config
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "url";

export default defineNuxtConfig({
  app: {
    head: {
      title: "Edil Shop",
      htmlAttrs: {
        lang: "en",
      },
      link: [
        // Preconnect to both Google Fonts domains
        {
          href: "https://fonts.gstatic.com",
          rel: "preconnect",
          crossorigin: "anonymous",
        },
        {
          href: "https://fonts.googleapis.com",
          rel: "preconnect",
        },

        // Preload the Google Fonts CSS
        {
          href: "https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap",
          rel: "preload",
          as: "style",
        },

        // Include the Google Fonts CSS link (to be loaded normally)
        {
          href: "https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap",
          rel: "stylesheet",
        },
      ],
      script: [
        {
          src: "https://telegram.org/js/telegram-web-app.js?56",
          async: false,
        },
      ],
    },
  },

  // devtools: { enabled: true },
  ssr: false,

  spaLoadingTemplate: false,
  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxtjs/color-mode",
    "@vee-validate/nuxt",
    "@vueuse/nuxt",

    "@nuxtjs/apollo",
    "nuxt-icon",
    "nuxt-headlessui",
    "@nuxt/content",
    "@pinia/nuxt",
    "nuxt-lodash",
    "@pinia-plugin-persistedstate/nuxt",
    "nuxt-emoji-picker",
  ],
  veeValidate: {
    // disable or enable auto imports
    autoImports: true,
    // Use different names for components
    componentNames: {
      Form: "VeeForm",
      Field: "VeeField",
      FieldArray: "VeeFieldArray",
      ErrorMessage: "VeeErrorMessage",
    },
  },
  headlessui: {
    prefix: "Headless",
  },

  // colorMode: {
  //   preference: "system", // default value of $colorMode.preference
  //   fallback: "light", // fallback value if not system preference found
  //   hid: "nuxt-color-mode-script",
  //   globalName: "__NUXT_COLOR_MODE__",
  //   componentName: "ColorScheme",
  //   classPrefix: "",
  //   classSuffix: "",
  //   storageKey: "nuxt-color-mode",
  // },

  // apollo
  apollo: {
    autoImports: true,
    authType: "Bearer",
    authHeader: "Authorization",
    tokenStorage: "cookie",
    proxyCookies: true,
    clients: {
      default: "./client/apollo/anonymous.js",
      auth: "./client/apollo/auth.js",
    },
  },

  components: {
    dirs: [
      {
        path: "~/components",
        global: true,
        prefix: "",
        extensions: ["vue", "js", "ts", "jsx", "tsx"],
      },
    ],
  },

  runtimeConfig: {
    public: {
      EDIL_SHOP_GRAPH_URL: process.env.VITE_EDIL_SHOP_GRAPH_URL,
    },
  },
});
