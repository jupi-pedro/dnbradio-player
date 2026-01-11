<template>
  <div>
    <StationList />
  </div>
</template>

<script setup lang="ts">
import StationList from "~/components/StationList";
import { useStationStore } from "@/stores/station";
import stations from "@/data/stations";
import { useRoute } from "vue-router";

const route = useRoute();
const stationStore = useStationStore();

// Ensure stations are loaded
onMounted(async () => {
  if (stationStore.stations.length === 0) {
    const stationsInitData = await stations();
    stationStore.setStations(stationsInitData);
  }
});

// Computed properties matching Vue 2 structure
const currenStationIndex = computed(() => {
  if (stationStore.stations.length > 0) {
    const foundStation = stationStore.stations.find(
      (item) => item.pathname && item.pathname == route.name
    );
    if (foundStation) {
      return foundStation.id;
    }
  }
  return route.params?.stationId ? Number(route.params.stationId) : 1;
});

const stationsList = computed(() => stationStore.stations);

const station = computed(() => {
  if (!stationsList.value || stationsList.value.length === 0) {
    return null;
  }
  const currentIndex = currenStationIndex.value || 1;
  return stationsList.value.find((item) => item.id == currentIndex);
});

const defaultStation = {
  title: "24/7 Drum and Bass Radio Station",
  description: "Daily live shows from around the world",
  name: "dnbradio",
  subtitle: "Tune in on any device",
  twitterId: "dnbradio",
  cover: "https://dnbradio.com/img/logotags.png",
};

const currentStation = computed(() => station.value || defaultStation);

// Head configuration
useHead({
  title: `${currentStation.value.title} : ${currentStation.value.description} [${currentStation.value.name}]`,
  meta: [
    {
      name: "description",
      content: `${currentStation.value.description}`,
    },
    {
      name: "keywords",
      content: `${currentStation.value.title} ${currentStation.value.subtitle}`,
    },
    {
      property: "og:title",
      content: `${currentStation.value.title} -  ${currentStation.value.subtitle}`,
    },
    {
      property: "og:description",
      content: `${currentStation.value.description}`,
    },
    {
      property: "og:image",
      content: `${currentStation.value.cover}`,
    },
    {
      property: "og:site_name",
      content: `${currentStation.value.title}`,
    },
    {
      property: "twitter:card",
      content: `${currentStation.value.title} ${currentStation.value.subtitle}`,
    },
    {
      property: "twitter:site",
      content: `${currentStation.value.twitterId || "dnbradio"}`,
    },
    {
      property: "twitter:creator",
      content: `${currentStation.value.twitterId || "dnbradio"}`,
    },
    {
      property: "twitter:image",
      content: `${currentStation.value.cover}`,
    },
    {
      property: "twitter:title",
      content: `${currentStation.value.title} - ${currentStation.value.subtitle}`,
    },
    {
      property: "twitter:description",
      content: `${currentStation.value.description}`,
    },
    {
      name: "apple-mobile-web-app-capable",
      content: "yes",
    },
  ],
  link: [
    { rel: "image_src", href: `${currentStation.value.cover}` },
    { rel: "favicon", href: `${currentStation.value.cover}` },
    { rel: "shortcut icon", href: `${currentStation.value.cover}` },
    { rel: "icon", href: `${currentStation.value.cover}` },
    { rel: "apple-touch-icon", href: `${currentStation.value.cover}` },
  ],
});
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
</style>
