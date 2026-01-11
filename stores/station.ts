import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Station {
  id: string | number
  pathname?: string
  name: string
  title: string
  subtitle: string
  description: string
  nowplaying_url: string
  schedule: any
  podcast: any
  streams: any
  cover: string
  website: string
  facebook: string
  twitter: string
  twitterId: string
  instagram: string
  soundcloud: string
  tags: any
}

export const useStationStore = defineStore('station', () => {
  const stations = ref<Station[]>([])

  const getStationById = computed(() => {
    return (id: string | number) => {
      return stations.value.find(s => s.id == id)
    }
  })

  const getStationByPathname = computed(() => {
    return (pathname: string) => {
      return stations.value.find(s => s.pathname === pathname)
    }
  })

  function setStations(newStations: Station[]) {
    stations.value = newStations
  }

  function addStation(station: Station) {
    stations.value.push(station)
  }

  function updateStation(id: string | number, updates: Partial<Station>) {
    const index = stations.value.findIndex(s => s.id == id)
    if (index !== -1) {
      stations.value[index] = { ...stations.value[index], ...updates }
    }
  }

  function removeStation(id: string | number) {
    const index = stations.value.findIndex(s => s.id == id)
    if (index !== -1) {
      stations.value.splice(index, 1)
    }
  }

  async function fetchStations() {
    if (stations.value.length === 0) {
      const stationsData = await import('@/data/stations')
      const data = await stationsData.default()
      stations.value = data
    }
  }

  function getAllStations() {
    return stations.value
  }

  return {
    stations,
    getStationById,
    getStationByPathname,
    setStations,
    addStation,
    updateStation,
    removeStation,
    fetchStations,
    getAllStations
  }
})
