<template>
<div class="alerts">
  <div></div>
</div>
</template>

<script setup lang="ts">
import stations from '@/data/stations'
import { useStationStore } from "@/stores/station";

definePageMeta({
  layout: 'ls-widget'
})

const stationStore = useStationStore()

const data = ref<any[]>([])

const filteredData = computed(() => {
  return data.value.slice(data.value.length-22, data.value.length+22).map((item: any) => {
    return item
  })
})

onMounted(async () => {
  if (stationStore.stations.length === 0) {
    const stationsInitData = await stations()
    stationStore.setStations(stationsInitData)
  }
  $fetch('https://dnbradio.com/swcontrib/SWDnbRadio/assets/pages/alerts.php').then((res: any) => {
    data.value = res
  })
})
</script>
<style>
</style>
