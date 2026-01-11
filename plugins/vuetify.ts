import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    components,
    directives,
    theme: {
      defaultTheme: 'dark',
      themes: {
        dark: {
          colors: {
            primary: "#3c3c3c",
            secondary: "#909399",
            accent: "#5dcf6c",
            error: "#fa3719",
            info: "#3c3c3c",
            success: "#5dcf6c",
            warning: "#e89082"
          }
        }
      }
    },
    defaults: {
      VBtn: {
        style: 'text-transform: none;'
      }
    }
  })

  nuxtApp.vueApp.use(vuetify)
})
