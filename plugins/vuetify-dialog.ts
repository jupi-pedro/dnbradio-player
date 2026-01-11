export default defineNuxtPlugin(async (nuxtApp) => {
  try {
    const VuetifyDialogModule = await import('vuetify-dialog')
    await import('vuetify-dialog/dist/vuetify-dialog.css')
    const VuetifyDialog = VuetifyDialogModule.default || VuetifyDialogModule
    nuxtApp.vueApp.use(VuetifyDialog)
  } catch (error) {
    console.warn('vuetify-dialog not available:', error)
    // Continue without vuetify-dialog
  }
})
