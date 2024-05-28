<script setup lang="ts">
import ZoomVideo, { type VideoPlayer, VideoQuality } from "@zoom/videosdk";
import { useWorkAroundForSafari } from "/utils";

let videoContainer = document.querySelector('video-player-container') as HTMLElement;
const props = defineProps(['slug', 'JWT'])
const topic = props.slug;
const token = props.JWT;
const username = `User-${String(new Date().getTime()).slice(6)}`;
const client = ZoomVideo.createClient();

onMounted(async () => {
  videoContainer = document.querySelector('video-player-container') as HTMLElement;
  await client.init("en-US", "Global", { patchJsMedia: true });
})


const startCall = async () => {
  client.on("peer-video-state-change", renderVideo);
  await client.join(topic, token, username);
  const mediaStream = client.getMediaStream();
  window.safari ? await useWorkAroundForSafari(client) : await mediaStream.startAudio();
  await mediaStream.startVideo();
  await renderVideo({ action: 'Start', userId: client.getCurrentUserInfo().userId });
};

const renderVideo = async (event: { action: "Start" | "Stop"; userId: number; }) => {
  const mediaStream = client.getMediaStream();
  if (event.action === 'Stop') {
    const element = await mediaStream.detachVideo(event.userId);
    Array.isArray(element) ? element.forEach((el) => el.remove()) : element.remove();
  } else {
    const userVideo = await mediaStream.attachVideo(event.userId, VideoQuality.Video_360P);
    videoContainer.appendChild(userVideo as VideoPlayer);
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
}

const toggleVideo = async () => {
  const mediaStream = client.getMediaStream();
  if (mediaStream.isCapturingVideo()) {
    await mediaStream.stopVideo();
    // update the canvas when the video is stopped
    await renderVideo({ action: 'Stop', userId: client.getCurrentUserInfo().userId });
  } else {
    await mediaStream.startVideo();
    // update the canvas when the video is started
    await renderVideo({ action: 'Start', userId: client.getCurrentUserInfo().userId });
  }
};
</script>

<template>
  <div class="flex flex-1 flex-col h-full min-h-screen relative">
    <h1 class="text-3xl font-bold text-center my-4">Zoom VideoSDK Quickstart</h1>
  <div class="flex flex-row self-center">
    <button id="start-btn" class="bg-blue-500 text-white font-bold py-2 px-4 rounded mb-4 w-64 self-center" @click="startCall">
      Join
    </button>
    <button id="stop-btn" class="hidden bg-blue-500 text-white font-bold py-2 px-4 rounded mb-4 w-64 self-center" @click="leaveCall">
      Leave
    </button>
  </div>
  <div class="flex flex-row self-center m-2">
    <button id="toggle-video-btn" class="hidden bg-blue-500 text-white py-2 text-sm px-2 rounded w-48 self-center" @click="toggleVideo">
      Toggle Video
    </button>
  </div>
  <video-player-container></video-player-container>
  <div class="text-center absolute bottom-2 w-full">
    Do not expose your SDK Secret to the client, when using this in production
    please make sure to use a backend service to sign tokens.
  </div>
  </div>
</template>