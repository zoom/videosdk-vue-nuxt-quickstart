// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    ZoomVideoSDKKey: process.env.ZOOM_SDK_KEY,
    ZoomVideoSDKSecret: process.env.ZOOM_SDK_SECRET,
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => tag === 'video-player-container'
    }
  }
})
