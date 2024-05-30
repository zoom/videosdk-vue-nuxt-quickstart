<script setup lang="ts">
const route = useRoute();
const { data: JWT, pending, error } = await useFetch(`/api/token?slug=${route.params.slug}`);
</script>

<template>
  <ClientOnly>
    <Videocall :slug="route.params.slug" :JWT="JWT" />
  </ClientOnly>
</template>
