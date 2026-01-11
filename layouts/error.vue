<template>
  <v-app theme="dark">
    <ClientOnly>
      <h1 v-if="error.statusCode === 404">
        {{ pageNotFound }}
      </h1>
      <h1 v-else>
        {{ otherError }}
      </h1>
      <NuxtLink to="/">
        Home page
      </NuxtLink>
    </ClientOnly>
  </v-app>
</template>

<script setup lang="ts">
const props = defineProps<{
  error: {
    statusCode: number
    message?: string
  }
}>()

const pageNotFound = "404 Not Found"
const otherError = "An error occurred"

const title = computed(() => 
  props.error.statusCode === 404 ? pageNotFound : otherError
)

useHead({
  title: title.value
})
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
