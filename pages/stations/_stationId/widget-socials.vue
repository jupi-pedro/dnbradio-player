<template>
<div class="socials">
  <span class="group pa-2" v-if="data">
  <v-icon theme="dark">mdi-facebook</v-icon>
  {{ data.facebook.followers }}
  <v-icon theme="dark" style="margin-left:10px;">mdi-instagram</v-icon>
  {{ data.instagram.followers }}
  <v-icon theme="dark" style="margin-left:10px;">mdi-twitter</v-icon>
  {{ data.twitter.followers }}
  </span>
</div>
</template>

<script setup lang="ts">
import stations from '@/data/stations'
import { useStationStore } from "@/stores/station";

definePageMeta({
  layout: 'ls-widget'
})

const stationStore = useStationStore()

const data = ref({
  facebook: {
    followers: 95770
  },
  instagram: {
    followers: 6789
  },
  twitter: {
    followers: 3320
  }
})

const fetchData = () => {
  $fetch('https://dnbradio.com/swcontrib/SWDnbRadio/assets/inc/socials-json.php').then((res: any) => {
    data.value = res;
  })
}

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
  .socials {  font-size:12px; font-family: 'Roboto', sans-serif; text-align:center; font-weight: 600;   }
</style>
