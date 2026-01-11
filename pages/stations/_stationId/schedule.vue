<template>
  <div>
    <v-toolbar
      color="transparent"
      theme="dark"
      flat
      :max-width="560"
      style="margin:auto;"
      v-if="hideNav==false"
    >
      <!-- <v-app-bar-nav-icon></v-app-bar-nav-icon> -->
      <v-btn icon class="ml-2" @click="router.go(-1)">
        <v-icon medium transparent>arrow_back</v-icon>
      </v-btn>
      <v-toolbar-title></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="view = 'calendar'" v-if="view == 'schedule'">
        <v-icon>mdi-calendar-month</v-icon>
      </v-btn>
      <v-btn icon @click="view = 'schedule'" v-if="view == 'calendar'">
        <v-icon>mdi-calendar-week</v-icon>
      </v-btn>
    </v-toolbar>
    <div class="text-center" v-if="station && view && !hideTitle">
      <small>UPCOMING SCHEDULE</small>
      <h2 class="categoryTitle">{{ station.title }}</h2>
      <h4 class="categorySubtitle" style="text-transform: uppercase;">
        <small>{{ station.subtitle }}</small>
      </h4>
      <div>
        {{ tz }}
        {{ dst }}
      </div>
    </div>
    <div v-if="station && view == 'schedule'">
      <StationSchedule :station="station" />
    </div>
    <div v-if="station && view == 'calendar'"  :class="themeClass">
      <StationCalendar :station="station" />
    </div>
  </div>
</template>

<script setup lang="ts">
import stations from "@/data/stations";
import { useStationStore } from "@/stores/station";
import { useRoute, useRouter } from "vue-router";
import StationSchedule from "~/components/StationSchedule";
import StationCalendar from "~/components/StationCalendar";
import moment from "moment-timezone";

const route = useRoute()
const router = useRouter()
const stationStore = useStationStore()

// Vue 3 doesn't have filters, use computed or functions
const localTZ = (value: any) => {
  if (value) {
    return moment(value).format("ZZ");
  }
  return ''
}

const abbrs: Record<string, string> = {
  EST: "Eastern Standard Time",
  EDT: "Eastern Daylight Time",
  CST: "Central Standard Time",
  CDT: "Central Daylight Time",
  MST: "Mountain Standard Time",
  MDT: "Mountain Daylight Time",
  PST: "Pacific Standard Time",
  PDT: "Pacific Daylight Time"
};

(moment.fn as any).zoneName = function() {
  var abbr = this.zoneAbbr();
  return abbrs[abbr] || abbr;
};

const view = ref("")
const hideNav = ref(false)
const hideTitle = ref(false)
const themeClass = ref("")

const dst = computed(() => {
  return moment().isDST() ? "DST" : "";
})

const tz = computed(() => {
  return moment.tz.guess();
})

const currenStationIndex = computed(() => {
  return route.params?.stationId ? Number(route.params.stationId) : 0;
})

const stationsList = computed(() => {
  return stationStore.stations;
})

const station = computed(() => {
  const index = currenStationIndex.value || 0;
  return stationsList.value.find(
    item => item.id == currenStationIndex.value
  );
})

onMounted(async () => {
  if (route.query.calendar) {
    view.value = "calendar";
  } else {
    view.value = "schedule";
  }
  hideNav.value = route.query?.hideNav === 'true' || false;
  hideTitle.value = route.query?.hideTitle === 'true' || false;
  themeClass.value = 'invertTrue' || "";
  if (stationStore.stations.length === 0) {
    const stationsInitData = await stations();
    stationStore.setStations(stationsInitData);
  }
})
</script>
<style>

.invertTrue img {
  filter: invert(1);
}
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
</style>
