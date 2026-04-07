// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    ZoomVideoSDKKey: process.env.ZOOM_SDK_KEY,
    ZoomVideoSDKSecret: process.env.ZOOM_SDK_SECRET,
  },

  vite: {
    plugins: [tailwindcss()],
  },

  app: {
    head: {
      title: 'Zoom VideoSDK Vue/Nuxt Quickstart',
      script: [
        { src: '/coi-serviceworker.js', }
      ],
    }
  },

  vue: {
    compilerOptions: {
      isCustomElement: (tag) => tag === 'video-player-container'
    }
  },

  compatibilityDate: '2025-07-07',
})