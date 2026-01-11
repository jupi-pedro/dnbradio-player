import VuetifyDialog from 'vuetify-dialog'
import 'vuetify-dialog/dist/vuetify-dialog.css'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VuetifyDialog)
})
