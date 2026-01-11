import mitt from 'mitt'

type Events = {
  audioProgress: any
  audioDuration: any
  [key: string]: any
}

const emitter = mitt<Events>()

export default defineNuxtPlugin(() => {
  return {
    provide: {
      eventBus: emitter
    }
  }
})

declare module '#app' {
  interface NuxtApp {
    $eventBus: typeof emitter
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $eventBus: typeof emitter
  }
}
