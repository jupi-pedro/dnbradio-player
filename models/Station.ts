// Vuex ORM compatibility layer for Station model
// This provides Station.query().get() API that components expect
import { useStationStore } from '@/stores/station'
import { getActivePinia } from 'pinia'

// Helper to get store safely
function getStore() {
  try {
    const pinia = getActivePinia()
    if (pinia) {
      return useStationStore(pinia)
    }
    // Fallback: works in component context
    return useStationStore()
  } catch (error) {
    console.warn('Station store not available:', error)
    return null
  }
}

// Create a compatibility object that mimics Vuex ORM's Station.query().get() API
class StationQuery {
  get() {
    const store = getStore()
    return store ? store.stations : []
  }

  find(id: string | number) {
    const store = getStore()
    if (!store) return null
    return store.getStationById(id)
  }

  where(field: string, value: any) {
    // Simple where implementation
    return {
      get: () => {
        const store = getStore()
        if (!store) return []
        return store.stations.filter((station: any) => station[field] === value)
      }
    }
  }
}

// Export Station as a class with static query() method
export default class Station {
  static query() {
    return new StationQuery()
  }

  static create({ data }: { data: any[] }) {
    const store = getStore()
    if (store) {
      store.setStations(data)
    }
  }

  static find(id: string | number) {
    const store = getStore()
    if (!store) return null
    return store.getStationById(id)
  }

  static all() {
    const store = getStore()
    return store ? store.stations : []
  }
}
