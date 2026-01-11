<template>
  <div v-if="station" class="main-player-content">
    <v-card flat :width="windowWidth" :height="windowHeight">
      <StationDetails :station="station" />
    </v-card>
  </div>
  <div v-else class="loading-container">
    <p>Loading stations...</p>
  </div>
</template>

<script setup lang="ts">
import StationDetails from "@/components/StationDetails";
import { useStationStore } from "@/stores/station";
import { useRoute } from "vue-router";

const route = useRoute();
const stationStore = useStationStore();

const loaded = ref(false);
const selectedCategory = ref(1);

const windowHeight = computed(() => {
  if (process.client && typeof window !== 'undefined') {
    return window.innerHeight || 800;
  }
  return 800; // Default height
});

const windowWidth = computed(() => {
  if (process.client && typeof window !== 'undefined') {
    return window.innerWidth || 1200;
  }
  return 1200; // Default width
});

// Ensure stations are loaded - do this before computed properties
const loadStations = async () => {
  if (stationStore.stations.length === 0) {
    try {
      const stationsData = await import('@/data/stations')
      const data = await stationsData.default()
      stationStore.setStations(data)
    } catch (error) {
      console.error('Failed to load stations:', error)
    }
  }
}

onMounted(async () => {
  console.log('StationList mounted, loading stations...');
  await loadStations();
  console.log('StationList - stations loaded:', stationStore.stations.length);
  nextTick(() => {
    setTimeout(() => {
      loaded.value = true;
    }, 2000);
  });
});

const currenStationIndex = computed(() => {
  if (stationStore.stations.length > 0) {
    // Use == for type coercion matching Vue 2 behavior
    const station = stationStore.stations.find(
      item => item.pathname && item.pathname == route.name
    );
    if (station) {
      return station.id;
    }
  }
  return route.params?.stationId ? Number(route.params.stationId) : 1;
});

const stations = computed(() => stationStore.stations);

const station = computed(() => {
  if (!stations.value || stations.value.length === 0) {
    return null;
  }
  const currentIndex = currenStationIndex.value || 1;
  const found = stations.value.find(item => item.id == currentIndex);
  console.log('StationList - station computed:', { currentIndex, found, stationsCount: stations.value.length });
  return found;
});
</script>

<style scoped>
.main-player-content {
  background: transparent;
  overflow: hidden;
  margin: auto;
  min-height: 100vh;
  min-width: 100vw;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  color: white;
}

h2.categoryTitle {
  font-size: 3.2em;
}

p.categoryDescription {
  color: #6b6666;
}
</style>
