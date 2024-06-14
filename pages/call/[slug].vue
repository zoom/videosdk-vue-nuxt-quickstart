<script setup lang="ts">
const route = useRoute();
const { data: JWT } = await useFetch(`/api/token?slug=${route.params.slug}`);
</script>

<template>
  <div class="flex flex-col">
    <h1 className="text-center text-3xl font-bold mb-4 mt-0">
      Session: {{ route.params.slug }}
    </h1>
    <ClientOnly>
      <Videocall :slug="route.params.slug" :JWT="JWT" />
    </ClientOnly>
  </div>
</template>
