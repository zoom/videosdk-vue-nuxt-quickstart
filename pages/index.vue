<script setup lang="ts">
const sessionName = ref('');
const create = async () => {
  const slug = sessionName.value
  if (slug)
    await navigateTo(`/call/${slug}`)
}
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold text-center my-4">Zoom VideoSDK Nuxt Quickstart</h1>
    <div class="flex self-center flex-col">
      <input type="text" placeholder="Session Name"
        class="bg-gray-200 text-gray-700 border border-gray-300 rounded py-2 px-4 w-64 self-center"
        v-model="sessionName" />
      <br />
      <button id="start-btn" class="bg-blue-500 text-white font-bold py-2 px-4 rounded mb-4 w-64 self-center"
        @click="create">
        Create
      </button>
    </div>
  </div>
</template>
