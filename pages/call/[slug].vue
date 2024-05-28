<script setup lang="ts">
const route = useRoute();
const { data: JWT, pending, error } = await useFetch(`/api/token?slug=${route.params.slug}`);
</script>

<template>
  <div>
    {{JWT}}
    <Videocall />
  </div>
</template>
