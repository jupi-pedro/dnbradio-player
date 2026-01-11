<template>
<div>
  <div class="upnext" v-if="isJukebox==true && filteredData">
    <span v-if="data">
      <div class="upcoming">
        <br />NEXT LIVE SHOW<br />
        <span v-html="filteredData.host"></span>
        <span v-if="filteredData.location">({{ filteredData.location }})</span>
        <div style="text-transform:uppercase;">STARTS {{ timeTil(filteredData.start) }}</div>
      </div>
    </span>
  </div>
  <div class="upnext" v-else-if="nowplaying.song_type=='L'">
    <span v-if="data">
      <div class="upcoming">
        <br />UP NEXT<br />
        <span v-html="filteredData.host"></span>
        <span v-if="filteredData.location">({{ filteredData.location }})</span>
        <div style="text-transform:uppercase;">STARTS {{ timeTil(filteredData.start) }}</div>
      </div>
    </span>
  </div>
</div>
</template>

<script setup lang="ts">
import moment from 'moment-timezone'
import stations from '@/data/stations'
import { useStationStore } from "@/stores/station";
import { useRoute } from "vue-router";

definePageMeta({
  layout: 'ls-widget'
})

const route = useRoute()
const stationStore = useStationStore()

const timeTil = (value: any) => {
  if (value) {
    return moment(value).fromNow();
  }
  return ''
}

const data = ref<any>(null)
const nowplaying = ref({
  artist: null,
  title: null,
  listeners: null,
  albumyear: null,
  album: null,
  song_type: '',
  label: null
})

const fetchData = () => {
  if (!station.value) return
  $fetch(station.value.schedule.url).then((res: any) => {
    data.value = res;
  })
}

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
        nowplaying.value.title = nowplaying.value.title.replace('(Original Title)', '')
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
        nowplaying.value.title = dataObj.title.replace('(Original Title)', '')
        nowplaying.value.listeners = dataObj.listeners
        nowplaying.value.albumyear = null
        nowplaying.value.album = null
        nowplaying.value.song_type = ''
        nowplaying.value.label = null
      break;
    }
  })
}

const isJukebox = computed(() => {
  if (nowplaying.value.song_type != 'L') {
    return true
  }
  return false
})

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

const filteredData = computed(() => {
  if (!data.value || !data.value.filter) {
    return;
  }
  return data.value.sort((a: any, b: any) => new Date(a.start).getTime() - new Date(b.start).getTime())
  .filter((item: any) => {
    var end = moment.utc({ hour:23, minute:59, second:59 } as any).local().add(1, 'days');
    var start = moment.utc().local();
    let ostart = moment.utc(item.start).local()
    return ostart > start
  })
  .slice(0,1)[0];
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

  fetchNowplaying()
  setInterval(() => {
    fetchNowplaying()
  },10000)
})
</script>
<style scoped>
  .upnext {  font-size:12px; font-family: 'Roboto', sans-serif; text-align:center; font-weight: 600;  width: 100%; }
  .heading { font-size: 1.4em;}
  .artist { font-weight: 600; font-size: 2.4em; margin-top: 15px;}
  .title { font-size: 1.8em; font-weight: 100; }
  .upcoming { font-size: 1.6em; }
</style>