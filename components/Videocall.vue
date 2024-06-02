<script setup lang="ts">
import ZoomVideo, { type VideoPlayer, VideoQuality } from "@zoom/videosdk";
import { useWorkAroundForSafari } from "../utils";

const props = defineProps(['slug', 'JWT'])
const topic = props.slug;
const token = props.JWT;
const username = `User-${String(new Date().getTime()).slice(6)}`;
const client = ZoomVideo.createClient();

const videoContainer = ref<HTMLElement>(null);
const disableStart = ref(false);
const showStart = ref(true);

onMounted(async () => {
  await client.init("en-US", "Global", { patchJsMedia: true });
})

const startCall = async () => {
  disableStart.value = true;
  client.on("peer-video-state-change", renderVideo);
  await client.join(topic, token, username);
  const mediaStream = client.getMediaStream();
  // @ts-expect-error window.safari exists only on safari
  window.safari ? await useWorkAroundForSafari(client) : await mediaStream.startAudio();
  await mediaStream.startVideo();
  await renderVideo({ action: 'Start', userId: client.getCurrentUserInfo().userId });
  showStart.value = false;
  disableStart.value = false;
};

const renderVideo = async (event: { action: "Start" | "Stop"; userId: number; }) => {
  const mediaStream = client.getMediaStream();
  if (event.action === 'Stop') {
    const element = await mediaStream.detachVideo(event.userId);
    Array.isArray(element) ? element.forEach((el) => el.remove()) : element.remove();
  } else {
    const userVideo = await mediaStream.attachVideo(event.userId, VideoQuality.Video_360P);
    videoContainer.value.appendChild(userVideo as VideoPlayer);
  }
};

const leaveCall = async () => {
  const mediaStream = client.getMediaStream();
  for (const user of client.getAllUser()) {
    const element = await mediaStream.detachVideo(user.userId);
    Array.isArray(element) ? element.forEach((el) => el.remove()) : element.remove();
  }
  client.off("peer-video-state-change", renderVideo);
  await client.leave();
  showStart.value = true;
}

const toggleVideo = async () => {
  const mediaStream = client.getMediaStream();
  if (mediaStream.isCapturingVideo()) {
    await mediaStream.stopVideo();
    await renderVideo({ action: 'Stop', userId: client.getCurrentUserInfo().userId });
  } else {
    await mediaStream.startVideo();
    await renderVideo({ action: 'Start', userId: client.getCurrentUserInfo().userId });
  }
};
</script>

<template>
  <div class="flex flex-1 flex-col h-full min-h-screen relative">
    <div class="flex flex-row self-center">
      <button id="start-btn" class="bg-blue-500 text-white font-bold py-2 px-4 rounded mb-4 w-64 self-center"
        :class="{ 'opacity-50': disableStart }" @click="startCall" :disabled='disableStart' v-if="showStart">
        Join
      </button>
      <button id="stop-btn" class="bg-blue-500 text-white font-bold py-2 px-4 rounded mb-4 w-64 self-center"
        @click="leaveCall" v-if="!showStart">
        Leave
      </button>
    </div>
    <div class="flex flex-row self-center m-2">
      <button id="toggle-video-btn" class="bg-blue-500 text-white py-2 text-sm px-2 rounded w-48 self-center"
        @click="toggleVideo" v-if="!showStart">
        Toggle Video
      </button>
    </div>
    <div class="flex h-[80vh] w-[80vw] overflow-hidden self-center margin-auto">
      <video-player-container ref="videoContainer"></video-player-container>
    </div>
    <div class="text-center absolute bottom-2 w-full">
      Do not expose your SDK Secret to the client, when using this in production
      please make sure to use a backend service to sign tokens.
    </div>
  </div>
</template>