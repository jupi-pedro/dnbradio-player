<template>
  <div>
    <div v-if="loading" class="loading-container">
      <p>Loading stations...</p>
    </div>
    <div v-else-if="error" class="error-container">
      <p>Error loading stations: {{ error }}</p>
    </div>
    <StationList v-else />
  </div>
</template>

<script setup lang="ts">
import StationList from "~/components/StationList";
import { useStationStore } from "@/stores/station";
import stations from "@/data/stations";
import { useRoute } from "vue-router";

const route = useRoute();
const stationStore = useStationStore();
const loading = ref(true);
const error = ref<string | null>(null);

console.log('pages/index.vue - component setup');

// Ensure stations are loaded (matching Vue 2 behavior)
onMounted(async () => {
  console.log('pages/index.vue - onMounted');
  try {
    if (stationStore.stations.length === 0) {
      console.log('Loading stations data...');
      const stationsInitData = await stations();
      console.log('Stations loaded:', stationsInitData.length);
      stationStore.setStations(stationsInitData);
    } else {
      console.log('Stations already loaded:', stationStore.stations.length);
    }
  } catch (err: any) {
    console.error('Failed to load stations:', err);
    error.value = err?.message || 'Unknown error';
  } finally {
    loading.value = false;
    console.log('pages/index.vue - loading complete');
  }
});

// Computed properties matching Vue 2 structure
const currenStationIndex = computed(() => {
  if (stationStore.stations.length > 0) {
    // Use == for type coercion matching Vue 2 behavior
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

// Head configuration matching Vue 2
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
.loading-container,
.error-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  color: white;
  font-size: 18px;
}
.error-container {
  color: #fa3719;
}
</style>
