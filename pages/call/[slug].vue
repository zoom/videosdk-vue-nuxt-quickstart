<script setup lang="ts">
const route = useRoute();
const { data: JWT } = await useFetch(`/api/token?slug=${route.params.slug}`);
</script>

<template>
  <div class="flex flex-col">
    <ClientOnly>
      <Videocall :slug="route.params.slug" :JWT="JWT" />
    </ClientOnly>
  </div>
</template>
