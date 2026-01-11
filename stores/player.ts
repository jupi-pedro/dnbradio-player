import { defineStore } from 'pinia'

export const usePlayerStore = defineStore('player', {
  state: () => ({
    visualsEnabled: false,
    initialLoad: true,
  }),
  actions: {
    toggleVisuals() {
      this.visualsEnabled = !this.visualsEnabled
    },
    setInitialLoad(payload: boolean) {
      this.initialLoad = payload
    }
  }
})
