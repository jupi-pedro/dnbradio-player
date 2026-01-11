import stationsData from '@/data/stations'
import { useStationStore } from '@/stores/station'

export default defineNuxtPlugin(async (nuxtApp) => {
  if (process.client) {
    const stationStore = useStationStore()
    const stations = await stationsData()
    stationStore.setStations(stations)
  }
})
