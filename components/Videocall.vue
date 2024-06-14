<script setup lang="ts">
import ZoomVideo, { type VideoPlayer, VideoQuality } from "@zoom/videosdk";
import { useWorkAroundForSafari } from "../utils";

const props = defineProps(['slug', 'JWT'])
const topic = props.slug;
const token = props.JWT;
const username = `User-${String(new Date().getTime()).slice(6)}`;
const client = ZoomVideo.createClient();

const videoContainer = ref<HTMLElement | null>(null);
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
    videoContainer.value?.appendChild(userVideo as VideoPlayer);
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
const toggleAudio = async () => {
  const mediaStream = client.getMediaStream();
  if (client.getCurrentUserInfo().muted) {
    await mediaStream.unmuteAudio();
  } else {
    await mediaStream.muteAudio();
  }
};
</script>

<template>
  <div className="flex h-full w-full flex-1 flex-col">
    <div class="flex h-[80vh] w-[80vw] overflow-hidden self-center margin-auto" v-show="!showStart">
      <video-player-container ref="videoContainer"></video-player-container>
    </div>
    <div className="mx-auto flex w-64 flex-col self-center" v-if="showStart">
      <div className="w-4" />
      <button class="bg-blue-500 text-white font-bold py-2 px-4 rounded mb-4 w-64 self-center"
        :class="{ 'opacity-50': disableStart }" @click="startCall" :disabled='disableStart' v-if="showStart">
        Join
      </button>
    </div>
    <div className="flex w-full flex-col justify-around self-center" v-else>
      <div className="mt-4 flex w-[30rem] flex-1 justify-around self-center rounded-md bg-white p-4">
        <div class="flex flex-row self-center m-2">
          <button @click="toggleVideo" v-if="!showStart"
            class="bg-blue-500 text-white py-2 text-sm px-2 rounded w-48 self-center">
            Toggle Video
          </button>
          <button @click="toggleAudio" v-if="!showStart"
            class="bg-blue-500 text-white py-2 text-sm px-2 rounded w-48 self-center">
            Toggle Audio
          </button>
        </div>
        <button @click="leaveCall" v-if="!showStart"
          class="bg-blue-500 text-white font-bold py-2 px-4 rounded mb-4 w-64 self-center">
          Leave
        </button>
      </div>
    </div>
  </div>
</template>