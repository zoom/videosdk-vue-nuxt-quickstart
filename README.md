# Zoom VideoSDK Vue Nuxt Quickstart

This is a quickstart for using the Zoom Video SDK for [Vue](https://vuejs.org/) using [Nuxt 3](https://nuxt.com/)

## Prerequisites:

- Node LTS
- Bun (or npm)
- Zoom Video SDK [credentials](https://developers.zoom.us/docs/video-sdk/get-credentials/)

1. Clone the repository

```bash
git clone https://github.com/zoom/videosdk-nuxt-quickstart.git
```

2. Create an `.env` file in the root directory

```bash
cd videosdk-nuxt-quickstart
cp .env.example .env
```

Fill in the `ZOOM_SDK_KEY` and `ZOOM_SDK_SECRET` with your credentials.

3. Install the dependencies

```bash
bun install
```

4. Run the development server

```bash
bun run dev
```

Open a browser and visit `http://localhost:3000`.
