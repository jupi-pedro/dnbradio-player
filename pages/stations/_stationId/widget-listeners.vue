<template>
<div class="listeners">
  <div class="text-center" v-if="nowplaying.listeners">{{ nowplaying.listeners }} LISTENERS</div>
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

const nowplaying = ref({
  artist: null,
  title: null,
  listeners: null,
  albumyear: null,
  album: null,
  song_type: null,
  label: null
})

const fetchNowplaying = () => {
  if (!station.value) {
    return null;
  }
  return $fetch(station.value.nowplaying_url.url).then((res: any) => {
    switch (station.value.nowplaying_url.type) {
      case 'azuracast':
        nowplaying.value = {
          artist: res.now_playing.streamer_name ?? res.now_playing.song.artist,
          title: res.now_playing.song.title,
          listeners: res.listeners.current,
          albumyear: null,
          album: res.now_playing.song.album,
          song_type: res.now_playing.streamer_name ? 'L' : 'S',
          label: null
        };
      break;
      case 'sam':
        nowplaying.value = res
      break;
      case 'shoutcast':
        let d = res.replace(/(<([^>]+)>)/ig,"").split(',')
        let rejoin = null
        if (d[8]) {
          rejoin = d[6] + ', ' + d[7] + ', ' + d[8]
        } else if (d[7]) {
          rejoin = d[6] + ', ' + d[7]
        } else {
          rejoin = d[6]
        }
        let parts = rejoin.split(' - ')
        let artist = parts[0];
        let title = parts[1] || parts[1];
        let dataObj = { listeners: d[0], status: d[1], peak: d[2], max: d[3], reported: d[4], bitrate: d[5], artist: artist, title: title }
        nowplaying.value.artist = dataObj.artist
        nowplaying.value.title = dataObj.title
        nowplaying.value.listeners = dataObj.listeners
        nowplaying.value.albumyear = null
        nowplaying.value.album = null
        nowplaying.value.song_type = ''
        nowplaying.value.label = null
      break;
    }
  })
}

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
  fetchNowplaying()
  setInterval(() => {
    fetchNowplaying()
  },60000)
})
</script>
<style scoped>
  .listeners {  font-family: 'Roboto', sans-serif; text-align:center; font-weight: 600; font-size: 1.9em; }
</style>
