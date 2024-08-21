<script setup lang="ts">
import ZoomVideo, { type VideoPlayer, VideoQuality } from "@zoom/videosdk";

const props = defineProps(['slug', 'JWT'])
const topic = props.slug;
const token = props.JWT;
const username = `User-${String(new Date().getTime()).slice(6)}`;
const client = ZoomVideo.createClient();

const videoContainer = ref<HTMLElement | null>(null);
const disableStart = ref(false);
const inSession = ref(false);
const audioMuted = ref(false);
const videoMuted = ref(false);

onMounted(async () => {
  await client.init("en-US", "Global", { patchJsMedia: true });
})

const startCall = async () => {
  disableStart.value = true;
  client.on("peer-video-state-change", renderVideo);
  await client.join(topic, token, username);
  const mediaStream = client.getMediaStream();
  await mediaStream.startAudio();
  await mediaStream.startVideo();
  await renderVideo({ action: 'Start', userId: client.getCurrentUserInfo().userId });
  inSession.value = true;
  disableStart.value = false;
  audioMuted.value = mediaStream.isAudioMuted();
  videoMuted.value = !mediaStream.isCapturingVideo();
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
  inSession.value = false;
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
  videoMuted.value = !mediaStream.isCapturingVideo();
};

const toggleAudio = async () => {
  const mediaStream = client.getMediaStream();
  if (client.getCurrentUserInfo().muted) {
    await mediaStream.unmuteAudio();
  } else {
    await mediaStream.muteAudio();
  }
  audioMuted.value = mediaStream.isAudioMuted();
};
</script>

<template>
  <div class="flex h-full w-full flex-1 flex-col">
    <div class="flex h-[80vh] w-[80vw] overflow-hidden self-center margin-auto" v-show="inSession">
      <video-player-container ref="videoContainer"></video-player-container>
    </div>
    <div class="mx-auto flex w-64 flex-col self-center" v-if="!inSession">
      <button class="bg-blue-500 text-white font-bold py-2 px-4 rounded mb-4 w-64 self-center"
        :class="{ 'opacity-50': disableStart }" @click="startCall" :disabled='disableStart'>
        Join
      </button>
    </div>
    <div class="flex w-full flex-col justify-around self-center" v-if="inSession">
      <div class="flex flex-row self-center m-2">
        <button @click="toggleVideo" class="bg-blue-500 text-white font-bold py-2 px-4 rounded mx-2 w-64 self-center">
          <p v-if="videoMuted">Unmute Video</p>
          <p v-else>Mute Video</p>
        </button>
        <button @click="toggleAudio" class="bg-blue-500 text-white font-bold py-2 px-4 rounded mx-2 w-64 self-center">
          <p v-if="audioMuted">Unmute Audio</p>
          <p v-else>Mute Audio</p>
        </button>
        <button @click="leaveCall" class="bg-blue-500 text-white font-bold py-2 px-4 rounded mx-2 w-64 self-center">
          <p>Leave</p>
        </button>
      </div>
    </div>
  </div>
</template>
