<script setup lang="ts">
const route = useRoute();
const { data: JWT, pending, error } = await useFetch(`/api/token?slug=${route.params.slug}`);
</script>

<template>
  <div class="flex flex-col">
    <h1 class="text-3xl font-bold text-center my-4">{{ route.params.slug }}</h1>
    <ClientOnly>
      <Videocall :slug="route.params.slug" :JWT="JWT" />
    </ClientOnly>
  </div>
</template>
