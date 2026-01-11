<template>
  <v-tabs theme="dark" grow>
    <v-tab>home</v-tab>
    <v-tab @click="launchPlay">play
    </v-tab>
    <v-tab>schedule</v-tab>
    <v-tab>archive</v-tab>
    <v-tab>playlist</v-tab>
    <v-tab>shop</v-tab>
    <v-tab>chat</v-tab>
  </v-tabs>
</template>

<script setup lang="ts">
const router = useRouter()

const launchPlay = () => {
  router.push('/stations/1')
}
</script>