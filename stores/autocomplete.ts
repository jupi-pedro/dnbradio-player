import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Autocomplete {
  id: string | number
  name: string
  tags: any
}

export const useAutocompleteStore = defineStore('autocomplete', () => {
  const autocompletes = ref<Autocomplete[]>([])

  function setAutocompletes(newAutocompletes: Autocomplete[]) {
    autocompletes.value = newAutocompletes
  }

  function addAutocomplete(autocomplete: Autocomplete) {
    autocompletes.value.push(autocomplete)
  }

  function removeAutocomplete(id: string | number) {
    const index = autocompletes.value.findIndex(a => a.id == id)
    if (index !== -1) {
      autocompletes.value.splice(index, 1)
    }
  }

  return {
    autocompletes,
    setAutocompletes,
    addAutocomplete,
    removeAutocomplete
  }
})
