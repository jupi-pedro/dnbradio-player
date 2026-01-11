const media = require("simple-media-element");

export default defineNuxtPlugin((nuxtApp) => {
  if (process.client) {
    const sound = media.audio(
      {
        src: "", // default
        type: "audio/mpeg"
      },
      {
        loop: true,
        volume: 1,
        autoplay: true,
        poster:
          "https://res.cloudinary.com/dgp7z9vkg/image/upload/c_scale,w_869/v1597369102/logotags_zoom_1400_dnbr_dnbr-cropped.png",
        preload: "auto"
      }
    );

    // Provide for Vue 3
    nuxtApp.provide('media', media);
    nuxtApp.provide('sound', sound);

    // Also set as global properties for backward compatibility
    nuxtApp.vueApp.config.globalProperties.$media = media;
    nuxtApp.vueApp.config.globalProperties.$sound = sound;

    sound.addEventListener("timeupdate", function(event: any) {
      // Use event bus for events in Vue 3
      nuxtApp.$eventBus.emit("audioProgress", event);
    });
    sound.addEventListener("durationchange", function(event: any) {
      nuxtApp.$eventBus.emit("audioDuration", event);
    });
  }
});

declare module '#app' {
  interface NuxtApp {
    $media: typeof media
    $sound: any
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $media: typeof media
    $sound: any
  }
}
