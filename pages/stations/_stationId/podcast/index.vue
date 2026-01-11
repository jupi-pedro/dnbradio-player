<template>
  <div>
    <v-toolbar
      color="transparent"
      theme="dark"
      flat
      style="margin:auto; opacity: 0.24;"
    >
      <v-btn class="ml-3" @click="router.go(-1)">
        <v-icon medium transparent>arrow_back</v-icon> Back
      </v-btn>
      <v-divider />
      <v-btn class="ml-6" @click="router.go(-1)">
        <v-icon medium transparent>mdi-radio</v-icon>
        <span class="pl-1">SWITCH TO RADIO</span>
      </v-btn>
    </v-toolbar>
    <v-card color="transparent" flat class="mx-auto">
      <v-list three-line color="transparent" flat>
        <div style="text-align:center;">
          <h1>Live Recordings</h1>
          <h2>Recorded during the live broadcast</h2>
        </div>
        <div style="text-align:center;" v-if="items && items.length">
          <v-btn @click="prevPage()" :disabled="page <= 1" fab
            ><v-icon medium transparent>arrow_back</v-icon></v-btn
          >
          <v-btn @click="nextPage()" :disabled="page >= numPages" fab
            ><v-icon medium transparent>arrow_forward</v-icon></v-btn
          >
          <br /><small>PAGE {{ page }} of {{ numPages }}</small>
          <v-divider style="margin-top: 20px;" />
        </div>

        <template v-for="(item, index) in items" :key="item.title">
          <v-list-item
            @click="router.push('/stations/1/podcast/' + item.id)"
          >
            <v-list-item-avatar>
              <v-img :src="item.image"></v-img>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title v-html="item.artist"></v-list-item-title>
              <v-list-item-subtitle v-html="item.title"></v-list-item-subtitle>
              <v-list-item-subtitle class="text-right" style="margin-top:-60px;"
                ><small
                  >RECORDED:<br />{{ item.timestamp }}</small
                ></v-list-item-subtitle
              >
            </v-list-item-content>
          </v-list-item>
          <v-divider
            v-if="index != 9"
            v-bind:key="index"
            style="margin-bottom: 10px; margin-top: 10px;"
          />
        </template>
      </v-list>
      <div style="text-align:center;" v-if="items && items.length">
        <v-divider style="margin-bottom: 20px;" />

        <v-btn @click="prevPage()" :disabled="page <= 1" fab
          ><v-icon medium transparent>arrow_back</v-icon></v-btn
        >
        <v-btn @click="nextPage()" :disabled="page >= numPages" fab
          ><v-icon medium transparent>arrow_forward</v-icon></v-btn
        >
        <br /><small>PAGE {{ page }} of {{ numPages }}</small>
      </div>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import stations from "@/data/stations";
import { useStationStore } from "@/stores/station";
import { useRoute, useRouter } from "vue-router";

const route = useRoute()
const router = useRouter()
const stationStore = useStationStore()

const pagination = ref<any>(null)
const items = ref<any[] | null>(null)

const page = computed(() => {
  return route.query.page ? Number(route.query.page) : 1;
})

const currenStationIndex = computed(() => {
  return route.params?.stationId ? Number(route.params.stationId) : 1;
})

const stationsList = computed(() => {
  return stationStore.stations;
})

const station = computed(() => {
  const index = currenStationIndex.value || 1;
  return stationsList.value.find(
    item => item.id == Number(route.params.stationId)
  );
})

const numPages = computed(() => {
  if (pagination.value) {
    return Number(pagination.value.total_pages).toLocaleString();
  }
  return 0
})

const nextPage = () => {
  router.push(
    "/stations/" + station.value?.id + "/podcast?page=" + (page.value + 1)
  );
}

const prevPage = () => {
  router.push(
    "/stations/" + station.value?.id + "/podcast?page=" + (page.value - 1)
  );
}

const fetchData = () => {
  if (station.value && station.value.podcast) {
    $fetch(station.value.podcast.url + "?page=" + page.value)
      .then((res: any) => {
        pagination.value = res.pagination;
        items.value = res.data;
      });
  }
}

watch(page, () => {
  fetchData();
})

onMounted(async () => {
  if (stationStore.stations.length === 0) {
    const stationsInitData = await stations();
    stationStore.setStations(stationsInitData);
  }
  
  nextTick(() => {
    if (station.value && station.value.podcast) {
      fetchData();
    } else {
      console.log("no podcast");
    }
  });
})
</script>
<style>
.v-autocomplete__content.v-menu__content .v-card {
  color: #fff;
}
.theme--dark.v-list-item:not(.v-list-item--active):not(.v-list-item--disabled) {
  color: #fff !important;
}
.v-application .primary--text {
  color: #e7ff2c !important;
  caret-color: #e7ff2c !important;
}
.v-select__slot input {
  color: #fff !important;
}
body {
  background: #181818;
}

/** LOCK ROTATION **/
@media screen and (min-width: 320px) and (max-width: 767px) and (orientation: landscape) {
  html {
    transform: rotate(-90deg);
    transform-origin: left top;
    width: 100vh;
    overflow-x: hidden;
    position: absolute;
    top: 100%;
    left: 0;
  }
}
</style>
