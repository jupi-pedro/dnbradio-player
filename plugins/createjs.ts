export default defineNuxtPlugin(async (nuxtApp) => {
  if (process.client) {
    try {
      const mediaModule = await import("simple-media-element");
      const media = mediaModule.default || mediaModule;
      
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

      // Provide for Vue 3 - this is the recommended way
      nuxtApp.provide('media', media);
      nuxtApp.provide('sound', sound);

      // Wait for eventBus to be available
      if (nuxtApp.$eventBus) {
        sound.addEventListener("timeupdate", function(event: any) {
          nuxtApp.$eventBus.emit("audioProgress", event);
        });
        sound.addEventListener("durationchange", function(event: any) {
          nuxtApp.$eventBus.emit("audioDuration", event);
        });
      }
    } catch (error) {
      console.error('Failed to initialize media:', error);
      // Provide fallback values
      nuxtApp.provide('media', null);
      nuxtApp.provide('sound', null);
    }
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
