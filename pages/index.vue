<template>
  <div>
    <NuxtLink to="/home">Go to Home</NuxtLink>
    <br />
    <NuxtLink to="/stations/1">Go to Player</NuxtLink>
  </div>
</template>

<script setup lang="ts">
// Redirect to home page
const router = useRouter()
onMounted(() => {
  router.push('/home')
})
</script>
