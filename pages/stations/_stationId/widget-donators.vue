<template>
<div class="donators">
  <small style="color: yellow;">TOP DONATIONS</small>
  <v-divider />
  <div v-for="item in filteredData" :key="item.id" style="text-align:center;">
    {{ item.alias }} ${{ item.gross }}
  </div>
</div>
</template>

<script setup lang="ts">
import stations from '@/data/stations'
import { useStationStore } from "@/stores/station";
import moment from 'moment-timezone'

definePageMeta({
  layout: 'ls-widget'
})

const stationStore = useStationStore()

const data = ref<any[]>([])

const fetchData = () => {
  $fetch('https://dnbradio.com/api/donations').then((res: any) => {
    data.value = res.filter((item: any) => moment(item.date) > moment().subtract(90, 'days'))
      // remove duplicates
      .filter((item: any, index: number, self: any[]) => index === self.findIndex((t: any) => (t.alias === item.alias)))
      // round to nearest dollar
      .map((item: any) => {
        item.gross = Math.round(item.gross);
        return item;
      })
      .sort((a: any, b: any) => b.gross - a.gross);
  })
}

const filteredData = computed(() => {
  return data.value.slice(0, 10)
})

onMounted(async () => {
  if (stationStore.stations.length === 0) {
    const stationsInitData = await stations()
    stationStore.setStations(stationsInitData)
  }
  fetchData()
  setInterval(() => {
    fetchData();
  }, 60000);
})
</script>
<style scoped>
  .donators {  font-family: 'Roboto', sans-serif; text-align:center; font-weight: 600; font-size: 1.9em; }
</style>
