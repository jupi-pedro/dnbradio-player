<template>
  <div class="marquee" style="width: 100%; text-align:center; font-weight: 600; font-size:16px;">
      <p>{{ marquees[0].text }}</p>
  </div>
</template>

<script setup lang="ts">
import stations from '@/data/stations'
import { useStationStore } from "@/stores/station";
import { useRoute } from "vue-router";

definePageMeta({
  layout: 'ls-widget'
})

const route = useRoute()
const stationStore = useStationStore()

const marquees = ref([
  {
    text: 'EST. 2003 - PAYPAL.ME/RADIODNB - PATREON.COM/DNBRADIO - DNBRADIO.COM/PLAYER - DNBRADIO.COM/SCHEDULE'
  }
])

const currenStationIndex = computed(() => {
  return route.params?.stationId ? Number(route.params.stationId) : 1
})

const stationsList = computed(() => {
  return stationStore.stations
})

const station = computed(() => {
  const index = currenStationIndex.value || 1
  return stationsList.value.find((item) => item.id == index)
})

onMounted(async () => {
  if (stationStore.stations.length === 0) {
    const stationsInitData = await stations()
    stationStore.setStations(stationsInitData)
  }
})
</script>
<style scoped>
  .marquee {  font-family: 'Roboto', sans-serif;  }
</style>
