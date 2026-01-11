<template>
  <v-card flat :width="windowWidth" :height="windowHeight" class="main-player-content">
    <StationDetails :station="station" />
  </v-card>
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
  if (process.client) {
    return window.innerHeight;
  }
  return 0;
});

const windowWidth = computed(() => {
  if (process.client) {
    return window.innerWidth;
  }
  return 0;
});

const currenStationIndex = computed(() => {
  if (stationStore.stations.length > 0) {
    const station = stationStore.stations.find(
      item => item.pathname && item.pathname === route.name
    );
    if (station) {
      return station.id;
    }
  }
  return route.params?.stationId ? Number(route.params.stationId) : 1;
});

const stations = computed(() => stationStore.stations);

const station = computed(() => {
  const currentIndex = currenStationIndex.value || 1;
  return stations.value.find(item => item.id == currentIndex);
});

onMounted(() => {
  nextTick(() => {
    setTimeout(() => {
      loaded.value = true;
    }, 2000);
  });
});
</script>

<style scoped>
.main-player-content {
  background: transparent;
  overflow: hidden;
  margin: auto;
}

h2.categoryTitle {
  font-size: 3.2em;
}

p.categoryDescription {
  color: #6b6666;
}
</style>
