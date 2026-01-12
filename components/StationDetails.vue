<template>
  <div v-if="props.station" v-show="loaded" class="overlap-screen">
    <div class="viscanvas-container" id="viscanvas-container">
      <canvas id="viscanvas"></canvas>
    </div>
    <div
      :class="[
        windowWidth >= 500 ? 'animate-border' : 'animate-border animation-none',
        windowHeight > windowWidth ? 'full-width' : 'fixed-width'
      ]"
    >
      <v-toolbar
        min-width="300"
        color="transparent"
        dark
        flat
        class="user-v-toolbar"
      >
        <v-btn
          v-if="currentVis"
          icon
          style="opacity: 1"
          @click="playerToggleVisuals"
          value="vis"
        >
          <v-icon medium dark :size="windowHeight > windowWidth ? 32: 24">mdi-brightness-2</v-icon>
        </v-btn>
        <v-btn v-else icon style="opacity: 0.3" @click="playerToggleVisuals" value="vis">
          <v-icon medium dark :size="windowHeight > windowWidth ? 32: 24">mdi-brightness-2</v-icon>
        </v-btn>
        <v-spacer></v-spacer>

        <v-btn
          icon
          @click="showStationDetails = !showStationDetails"
          style="opacity: 0.3"
        >
          <v-icon medium dark :size="windowHeight > windowWidth ? 32: 24">mdi-home</v-icon>
        </v-btn>

        <v-btn
          icon
          @click="launchPopup"
          v-if="$device.isDesktop"
          style="opacity: 0.3"
        >
          <v-icon medium dark :size="windowHeight > windowWidth ? 32: 24">mdi-open-in-new</v-icon>
        </v-btn>
      </v-toolbar>
      <div class="transparent user-v-card" :class="(windowHeight > windowWidth) ? 'big-font': 'normal-font'"
        v-touch="{
          left: () => swipe('Left'),
          right: () => swipe('Right'),
          up: () => swipe('Up'),
          down: () => swipe('Down'),
        }"
      >
        <div flat class="categoryCont transparent user-categorycont-card" v-if="station">
          <div style="height: auto">
            <p class="station-title">STATION</p>
            <h2 class="categoryTitle">{{ station.title }}</h2>
            <h4 class="category-subtitle">{{ station.subtitle }}</h4>
            <p class="category-description">{{ station.description }}</p>
            <p class="fade user-listeners" v-if="nowplaying && nowplaying.listeners">
              {{ nowplaying.listeners }} listeners
            </p>
            <div v-else class="user-blank"/>
          </div>
          <div
            :style="`background-image: url(${cover})`"
            class="user-image-mark"
            :class="[isLoading || isPlaying ? 'pulse' : 'faded', (windowHeight > windowWidth) ? 'big-image': '']"
            @click="playIfStopped()"/>
          </div>
        <div style="flex-shrink: 0; margin-top: auto;">
          <v-card-text class="user-card-text" p0 :class="(windowHeight > windowWidth) ? 'big-font': 'normal-font'">
            <p v-if="isOffline" class="offline-indicator indicator-text">DEVICE OFFLINE!</p>
            <p v-else-if="isLoading" class="indicator-text wait-indicator">Please Wait...</p>
            <p v-else-if="isStalled" class="offline-indicator indicator-text">{{ stalledMessage || 'Connection error. Please try again later.' }}</p>
            <p v-else-if="!isPlaying" class="indicator-text stop-text">STOPPED</p>
            <div v-else>
              <p v-if="nowplaying.streamer" class="indicator-text stop-text">LIVE BROADCAST</p>
              <p v-else class="indicator-text stop-text">PLAYLIST ROTATION</p>
            </div>
            <div v-if="artist || title">
              <p v-html="decodeURIComponent(artist.replace(/\\'/g, '\''))" class="user-title bold-title-700"></p>
              <p v-html="decodeURIComponent(title.replace(/\\'/g, '\''))" class="user-title"></p>
            </div>
            <p v-else class="user-play-indicator">
              CLICK PLAY TO<br />START YOUR STREAM
            </p>
          </v-card-text>

          <v-card-actions p0 fluid>
            <v-row justify="space-around" class="user-button-group">
              <v-btn icon @click="loadPrev(false)">
                <v-icon medium dark :size="windowHeight > windowWidth ? 32: 24">skip_previous</v-icon>
              </v-btn>
              <v-btn icon @click="volDown">
                <v-icon medium dark :size="windowHeight > windowWidth ? 32: 24">mdi-volume-minus</v-icon>
              </v-btn>
              <v-icon size="50" v-if="!isPlaying" @disable="isLoading" @click="play">play_circle_filled</v-icon>
              <v-icon size="50" v-if="isPlaying" @click="pause">pause_circle_filled</v-icon>
              <v-btn icon @click="volUp">
                <v-icon medium dark :size="windowHeight > windowWidth ? 32: 24">mdi-volume-plus</v-icon>
              </v-btn>
              <v-btn icon @click="loadNext(false)">
                <v-icon medium dark :size="windowHeight > windowWidth ? 32: 24">skip_next</v-icon>
              </v-btn>
            </v-row>
          </v-card-actions>

          <v-bottom-navigation class="flat stationNav" grow>
            <button
            :disabled="!station || !station.podcast"
            @click="router.push('/stations/' + currIndex + '/podcast')"
            class="nav-button"
            >
              <v-icon dark size="24">voicemail</v-icon>
              <p>podcast</p>
            </button>
            <button
              :disabled="!station"
              @click="router.push('/stations/' + currIndex + '/schedule')"
              value="calendar"
              class="nav-button"
            >
            <v-icon dark size="24">mdi-calendar-month</v-icon>
              <p>schedule</p>
            </button>
            <button
              @click="router.push('/stations/' + currIndex + '/donate')"
              value="favorite"
              class="nav-button"
            >
            <v-icon dark color="red" size="24">favorite</v-icon>
              <p>donate</p>
            </button>
            <button
              :disabled="!station"
              @click="launchLink('https://shop.dnbradio.com')"
              value="shop"
              class="nav-button"
            >
              <v-icon dark size="24">mdi-tshirt-crew</v-icon>
              <p>merch</p>
            </button>
            <button
              :disabled="!station"
              @click="router.push('/stations/' + currIndex + '/chat')"
              value="chat"
              class="nav-button"
            >
              <v-icon dark size="24">mdi-forum-outline</v-icon>
              <p>chat</p>
            </button>
          </v-bottom-navigation>
          <div class="bottom-indicator">
              <v-btn
                small
                type="text"
                rounded
                color="transparent"
                @click="router.push('/stations/' + currIndex + '/donate')"
              >
              <p class="hidden-sm-and-up user-keep-up" :class="(windowHeight > windowWidth) ? 'middle-font': 'normal-font'">
                Keepin' the beats rollin' on dnbradio!
              </p>
              <p class="hidden-xs-only user-keep-up user-keep-up-big" :class="(windowHeight > windowWidth) ? 'middle-font': 'normal-font'">
                Keepin' the beats rollin' on dnbradio!
              </p>
              </v-btn>
              <br />
              <a
                  href="https://github.com/dnbradio/dnbradio-player"
                  title="Contribute to dnbradio-player on GitHub"
                  target="_blank"
                  class="user-footer-link"
                  >dnbradio-player/{{ APP_BRANCH }}:v{{ APP_VERSION }}/{{userAgent}}
                  <img
                    :src="`${APP_BASE_URL}github-mark-white.svg`"
                    height="12"
                    alt="GitHub"
                    style="margin-left: 3px"
                  />
              </a>
          </div>
        </div>
      </div>

    </div>
    <v-dialog
      v-model="showStationDetails"
      fullscreen
      transition="dialog-top-transition"
    >
      <v-card v-if="station">
        <v-toolbar dark>
          <v-btn icon dark @click="showStationDetails = false">
            <v-icon :size="windowHeight > windowWidth ? 32: 24">mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>Station Info</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items> </v-toolbar-items>
        </v-toolbar>
        <v-card-subtitle class="pb-0">
          <v-row justify="space-between">
            <v-col class="flex-grow-1" cols="9">
              <h2>{{ station.title }} - {{ station.subtitle }}</h2>
              <br />{{ station.description }}
            </v-col>
            <v-col class="flex-shrink-0">
              <v-img
                :max-width="150"
                :src="cover"
                aspect-ratio="1"
                style="background-color: transparent"
              ></v-img>
            </v-col>
          </v-row>
        </v-card-subtitle>

        <v-card-text class="text--primary">
          <div class="pb-2" v-if="station.website">
            <v-btn rounded @click="launchLink(station.website)">
              <v-icon left :size="windowHeight > windowWidth ? 32: 24">mdi-web</v-icon>Website
            </v-btn>
          </div>
          <div class="pb-6" v-if="station.podcast && station.podcast.website">
            <v-btn rounded @click="launchLink(station.podcast.website)">
              <v-icon left :size="windowHeight > windowWidth ? 32: 24">voicemail</v-icon> Podcast
            </v-btn>
          </div>

          <div class="pb-2" v-if="station.facebook">
            <v-btn rounded @click="launchLink(station.facebook)">
              <v-icon left :size="windowHeight > windowWidth ? 32: 24">mdi-facebook</v-icon>
              <p>Facebook</p>
            </v-btn>
          </div>
          <div class="pb-2" v-if="station.twitter">
            <v-btn rounded @click="launchLink(station.twitter)">
              <v-icon left :size="windowHeight > windowWidth ? 32: 24">mdi-twitter</v-icon>
              <p>Twitter</p>
            </v-btn>
          </div>
          <div class="pb-2" v-if="station.instagram">
            <v-btn rounded @click="launchLink(station.instagram)">
              <v-icon left :size="windowHeight > windowWidth ? 32: 24">mdi-instagram</v-icon>
              <p>Instagram</p>
            </v-btn>
          </div>
          <div class="pb-2" v-if="station.soundcloud">
            <v-btn rounded @click="launchLink(station.soundcloud)">
              <v-icon left :size="windowHeight > windowWidth ? 32: 24">mdi-soundcloud</v-icon>
              <p>Soundcloud</p>
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import plankton from "@/vis/plankton";
import stars from "@/vis/stars";
import { usePlayerStore } from "@/stores/player";
import { useStationStore } from "@/stores/station";
import { useRoute, useRouter } from "vue-router";

const props = defineProps<{
  station: any | null
}>()

const route = useRoute()
const router = useRouter()
const playerStore = usePlayerStore()
const stationStore = useStationStore()
const config = useRuntimeConfig()
const { $device, $sound, $dialog } = useNuxtApp()
const pageTitle = ref<string | null>(null)
const pageDescription = ref<string | null>(null)
const pageImage = ref<string | null>(null)
const pageKeywords = ref<string | null>(null)
const currentVis = ref<string | null>(null)
const visOn = ref(false)
const npInterval = ref<any>(null)
const bottomNav = ref("favorite")
const shuffleOn = ref(false)
const likedOn = ref(false)
const showStationDetails = ref(false)
const loaded = ref(true) // Start as true to show content immediately
const nowplaying = ref({
  artist: null,
  title: null,
  listeners: null,
  albumyear: null,
  album: null,
  song_type: null,
  label: null,
  streamer: null
})
const isPlaying = ref(false)
const isLoading = ref(false)
const isStalled = ref(false)
const stalledInterval = ref<any>(null)
const stalledMessage = ref("")
const stalledRetriesRemaining = ref(90)
const stalledRetriesOfflineRemaining = ref(225)
const playerToggleVisuals = () => {
  playerStore.toggleVisuals()
}
const attachListeners = () => {
  console.log("attachListeners", [$sound], (window as any).$media);
  if (npInterval.value) {
    clearInterval(npInterval.value);
  }
  $sound.onloaded = () => {
    isLoading.value = false;
    console.log("loaded", $sound);
  };
  $sound.addEventListener("progress", (event: any) => {
    if (stalledInterval.value) {
      clearInterval(stalledInterval.value);
    }
  });
  $sound.addEventListener("playing", (event: any) => {
    if (stalledInterval.value) {
      clearInterval(stalledInterval.value);
    }
  });
  $sound.onplay = () => {
    isLoading.value = false;
    isPlaying.value = true;
    stalledMessage.value = "";
    stalledRetriesRemaining.value = 90;
    stalledRetriesOfflineRemaining.value = 225;
    if (stalledInterval.value) {
      clearInterval(stalledInterval.value);
    }
    isStalled.value = false;
    console.log("onplay called", $sound);
    npInterval.value = setInterval(() => {
      if (!isOffline.value) {
        fetchNowplaying();
      }
    }, 15000);
  };
  $sound.addEventListener("stalled", (err: any) => {
    console.log("STALLED CAUGHT", err, $sound);
  });
  $sound.addEventListener("abort", (err: any) => {
    console.log("ABORT CAUGHT", err, $sound);
  });
  $sound.addEventListener("emptied", (err: any) => {
    console.log("EMPTIED CAUGHT", err, $sound);
  });
  $sound.addEventListener("suspend", (err: any) => {
    if (stalledInterval.value) {
      clearInterval(stalledInterval.value);
    }
    console.log("SUSPEND CAUGHT", err, $sound);
  });
  $sound.addEventListener("error", (err: any) => {
    console.log("ERROR CAUGHT", $sound);
    if (!$sound) {
      return;
    }
    isStalled.value = true;
    if (stalledInterval.value) {
      clearInterval(stalledInterval.value);
    }
    stalledInterval.value = setInterval(() => {
      console.log("retrying playback...", stalledRetriesRemaining.value);
      if (isOffline.value) {
        console.log(
          "skipping retry (device offline)",
          stalledRetriesOfflineRemaining.value
        );
        stalledRetriesOfflineRemaining.value--;
        if (stalledRetriesOfflineRemaining.value == 0) {
          console.log("giving up");
          clearInterval(stalledInterval.value);
          stalledRetriesRemaining.value = 90;
          stalledRetriesOfflineRemaining.value = 225;
          if ($sound) {
            $sound.pause();
          }
        }
        return;
      }
      console.log(
        "readystate",
        $sound?.readyState,
        "paused",
        $sound?.paused,
        "ended",
        $sound?.ended,
        "networkState",
        ($sound as any)?.networkState,
        "buffered",
        ($sound as any)?.buffered
      );
      if ($sound?.readyState < 2) {
        return;
      }
      stalledMessage.value = "Retrying in 3s...";
      initPlayer();
      setTimeout(() => {
        if (!$sound) {
          return;
        }
        console.log("running play()");
        $sound.play();
      }, 1500);
      stalledRetriesRemaining.value--;
      if (stalledRetriesRemaining.value == 0) {
        console.log("giving up");
        clearInterval(stalledInterval.value);
        stalledRetriesRemaining.value = 90;
        stalledRetriesOfflineRemaining.value = 225;
        if ($sound) {
          $sound.pause();
        }
      }
    }, 3000);
  });

  if (navigator.mediaSession) {
    navigator.mediaSession.setActionHandler("play", () => {
      $sound.play();
      isPlaying.value = true;
    });
    navigator.mediaSession.setActionHandler("pause", () => {
      $sound.pause();
      $sound.src = "";
      isPlaying.value = false;
    });
    navigator.mediaSession.setActionHandler("previoustrack", () => {
      loadPrev(true);
      isPlaying.value = false;
    });
    navigator.mediaSession.setActionHandler("nexttrack", () => {
      loadNext(true);
      isPlaying.value = false;
    });
  }
}

const initStream = () => {
  if (playerVisualsEnabled.value) {
    console.log('restarting stars');
    startStars(); // restart
  } else {
    stopStars();
  }
  if ($sound?.src == props.station?.streams?.[0]?.url) {
    if ($sound?.paused) {
      $sound.play();
    }
    console.log("stream already loaded");
    isPlaying.value = true;
    return true;
  }
  const streamUrl = props.station?.streams?.[0]?.url
    ? props.station.streams[0].url
    : null;
  const streamMimeType = props.station?.streams?.[0]?.mimetype;
  if (streamUrl) {
    const unixtime = new Date().getTime();
    $sound.src = streamUrl + '?' + unixtime.toString();
    $sound.type = streamMimeType;
    attachListeners();
    return true;
  } else {
    return false;
  }
}

const initPlayer = async (auto?: boolean) => {
  if ($sound && paused.value == true && readyState.value == 4) {
    play();
    isLoading.value = false;
    return;
  }
  isLoading.value = true;

  // fetch station info
  fetchNowplaying()
    .then(() => {
      if (!props.station) {
        throw "station not ready";
      }
      isLoading.value = false;
    })
    .catch((err) => {
      console.log(err);
      });
  }

const togglePlankton = () => {
  if (visOn.value == false) {
    currentVis.value = "plankton";
    visOn.value = true;
    plankton();
  } else {
    currentVis.value = null;
    var element = document.getElementById("viscanvas");
    if (element && element.parentNode) {
      element.parentNode.removeChild(element);
    }
    if (window.animId) {
      cancelAnimationFrame(window.animId);
    }
    let tela = window.document.createElement("canvas");
    tela.id = "viscanvas";
    const container = document.getElementById("viscanvas-container");
    if (container) {
      container.appendChild(tela);
    }
    visOn.value = false;
    if (window.timeouts) {
      for (var i = 0; i < window.timeouts.length; i++) {
        clearTimeout(window.timeouts[i]);
      }
    }
  }
};

const launchPopup = () => {
  pause();
  let wind: Window | null = null;
  let windowopen = false;
  if (windowopen == true && wind) {
    wind.focus();
    return true;
  } else {
    let width = 422;
    let height = 600;
    if (
      (window.innerHeight == height || window.outerHeight == height) &&
      (window.innerWidth == width || window.outerWidth == width)
    ) {
      return false;
    }
    var props =
      "width=" +
      width +
      ",height=" +
      height +
      ",left=25,top=25,screenX=100,screenY=100,resizable=0,scrollbars=0,toolbar=no,location=no,status=no,menubar=no,copyhistory=no,directories=no";
    wind = window.open(window.location.href, "formPopup", props);
    windowopen = true;
    return true;
  }
};
const launchLink = (link: string) => {
  $dialog
    .confirm({
      title: "Do you want to proceed?",
      text:
        "You are about to launch the following external link in a new browser tab:" +
        "<br /><br />" +
        link,
      actions: {
        false: "Cancel",
        true: "YES, LAUNCH THE LINK.",
      },
    })
    .then((res: any) => {
      if (res) {
        window.open(link, "_blank");
      }
    });
}

const playIfStopped = () => {
  if (!isPlaying.value) {
    initPlayer();
  }
}

const swipe = (direction: string) => {
  switch (direction) {
    case "left":
      loadPrev();
      break;
    case "right":
      loadNext();
      break;
  }
}

const loadPodcast = () => {
  if (npInterval.value) {
    clearInterval(npInterval.value);
  }
  if ($sound) {
    $sound.pause();
    $sound.src = null;
  }
  router.push("/stations/" + currIndex.value + "/podcast");
}

const loadPrev = (auto?: boolean) => {
  if (npInterval.value) {
    clearInterval(npInterval.value);
  }
  if ($sound) {
    const unixtime = new Date().getTime();
    $sound.src = previousStation.value.streams[0].url + '?' + unixtime.toString();
  }
  if (shuffleOn.value) {
    loadRandom();
    return;
  }
  router.push("/stations/" + prevIndex.value);
  nextTick(() => {
    pause();
  });
}

const loadNext = (auto?: boolean) => {
  console.log("loadNext");
  if (npInterval.value) {
    clearInterval(npInterval.value);
  }
  if ($sound) {
    const unixtime = new Date().getTime();
    $sound.src = nextStation.value.streams[0].url + '?' + unixtime.toString();
  }
  if (shuffleOn.value) {
    loadRandom();
    return;
  }
  router.push("/stations/" + nextIndex.value);
  nextTick(() => {
    pause();
  });
}

const loadRandom = () => {
  if ($sound) {
    $sound.pause();
    const unixtime = new Date().getTime();
    $sound.src = previousStation.value.streams[0].url + '?' + unixtime.toString();
  }
  router.push("/stations/" + randomIndex.value);
}

const play = async () => {
  isPlaying.value = true;
  if ($sound) {
    $sound.play();
    fetchNowplaying();
    isLoading.value = false;
  } else {
    await initPlayer();
  }
}

const pause = () => {
  isPlaying.value = false;
  isLoading.value = false;
  if (npInterval.value) {
    clearInterval(npInterval.value);
  }
  if ($sound) {
    $sound.pause();
  }
}

const volUp = () => {
  if ($sound.volume == 1) {
    return;
  }
  let newVol = $sound.volume + 0.1;
  newVol = newVol > 1 ? 1 : newVol;
  $sound.volume = newVol;
}

const volDown = () => {
  if ($sound.volume == 0) {
    return;
  }
  let newVol = $sound.volume - 0.1;
  newVol = newVol < 0 ? 0 : newVol;
  $sound.volume = newVol;
}
const decodeHTMLEntities = (text: string) => {
  var entities = [
    ["amp", "&"],
    ["apos", "'"],
    ["#x27", "'"],
    ["#x2F", "/"],
    ["#39", "'"],
    ["#47", "/"],
    ["lt", "<"],
    ["gt", ">"],
    ["nbsp", " "],
    ["quot", '"'],
  ];

  for (var i = 0, max = entities.length; i < max; ++i)
    text = text.replace(
      new RegExp("&" + entities[i][0] + ";", "g"),
      entities[i][1]
    );

  return text;
}

const fetchNowplaying = () => {
  if (!props.station) {
    return Promise.resolve();
  }
  return $fetch(props.station.nowplaying_url.url)
    .then((res: any) => {
      switch (props.station.nowplaying_url.type) {
        case 'azuracast':
          const npdata = {
            artist: res.now_playing.streamer_name ?? res.now_playing.song.artist,
            title: res.now_playing.song.title,
            listeners: res.listeners.current,
            albumyear: null,
            album: res.now_playing.song.album,
            song_type: res.now_playing.streamer_name ? 'L' : 'S',
            label: null
          };
          Object.assign(nowplaying.value, npdata);
        break;
        case "icecast":
          nowplaying.value = res?.icestats?.source;
          nowplaying.value.artist = nowplaying.value.title.split(" - ")[0];
          nowplaying.value.title = nowplaying.value.title
            .replace("(Original Title)", "")
            .split(" - ")[1];
          nowplaying.value.album = props.station.server_description;
          nowplaying.value.listeners = nowplaying.value.listeners || 0;
          pageTitle.value =
            nowplaying.value.artist +
            " - " +
            nowplaying.value.title +
            " [" +
            nowplaying.value.listeners +
            " tuned] - " +
            props.station.name;
          pageDescription.value = props.station.subtitle;
          pageKeywords.value =
            props.station.description + " " + props.station.subtitle;
          pageImage.value = props.station.cover;
          break;
        case "sam":
          nowplaying.value = res;
          nowplaying.value.title = nowplaying.value.title.replace(
            "(Original Title)",
            ""
          );
          nowplaying.value.album = props.station.name;
          pageTitle.value =
            nowplaying.value.artist +
            " - " +
            nowplaying.value.title +
            " [" +
            nowplaying.value.listeners +
            " tuned] - " +
            props.station.name;
          pageDescription.value = props.station.subtitle;
          pageKeywords.value =
            props.station.description + " " + props.station.subtitle;
          pageImage.value = props.station.cover;
          break;
        case "jt":
          nowplaying.value = res;
          nowplaying.value.artist = nowplaying.value.h1;
          nowplaying.value.title = nowplaying.value.h2;
          nowplaying.value.listeners = nowplaying.value.listening;
          nowplaying.value.albumyear = null;
          nowplaying.value.album = props.station.name;
          nowplaying.value.song_type = "";
          nowplaying.value.label = null;
          pageTitle.value = nowplaying.value.h1;
          pageDescription.value = props.station.subtitle;
          pageKeywords.value =
            props.station.description + " " + props.station.subtitle;
          pageImage.value = props.station.cover;
          break;
        case "shoutcast":
          const d = res;
          let parts = d.songtitle.split(" - ");
          let artist = parts[0];
          let title = parts[1];
          let data = {
            listeners: d.currentlisteners,
            status: d.streamstatus,
            peak: d.peaklisteners,
            max: d.maxlisteners,
            bitrate: d.bitrate,
            artist: artist,
            title: title,
          };

          nowplaying.value.artist = data.artist;
          nowplaying.value.title = data.title.replace(
            "(Original Title)",
            ""
          );
          nowplaying.value.listeners = data.listeners;
          nowplaying.value.albumyear = null;
          nowplaying.value.album = props.station.name;
          nowplaying.value.song_type = "";
          nowplaying.value.label = null;
          pageTitle.value =
            nowplaying.value.artist +
            " - " +
            nowplaying.value.title +
            " [" +
            nowplaying.value.listeners +
            " tuned] - " +
            props.station.name;
          pageDescription.value = props.station.subtitle;
          pageKeywords.value =
            props.station.description + " " + props.station.subtitle;
          pageImage.value = props.station.cover;
          break;
        default:
          nowplaying.value.artist = props.station.name;
          nowplaying.value.title = props.station.subtitle;
          nowplaying.value.listeners = null;
          nowplaying.value.albumyear = null;
          nowplaying.value.album = props.station.name;
          nowplaying.value.song_type = "";
          nowplaying.value.label = null;
          pageTitle.value =
            nowplaying.value.artist +
            " - " +
            nowplaying.value.title +
            " - " +
            props.station.name;
          pageDescription.value = props.station.subtitle;
          pageKeywords.value =
            props.station.description + " " + props.station.subtitle;
          pageImage.value = props.station.cover;
          break;
      }

      // navigator
      if (navigator && navigator.mediaSession) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: nowplaying.value.title,
          artist: nowplaying.value.artist,
          artwork: [
            {
              src:
                "https://res.cloudinary.com/dgp7z9vkg/image/fetch/c_scale,w_96/v1586048258/" +
                pageImage.value,
              sizes: "96x96",
              type: "image/png",
            },
            {
              src:
                "https://res.cloudinary.com/dgp7z9vkg/image/fetch/c_scale,w_128/v1586048258/" +
                pageImage.value,
              sizes: "128x128",
              type: "image/png",
            },
            {
              src:
                "https://res.cloudinary.com/dgp7z9vkg/image/fetch/c_scale,w_192/v1586048258/" +
                pageImage.value,
              sizes: "192x192",
              type: "image/png",
            },
            {
              src:
                "https://res.cloudinary.com/dgp7z9vkg/image/fetch/c_scale,w_256/v1586048258/" +
                pageImage.value,
              sizes: "256x256",
              type: "image/png",
            },
            {
              src:
                "https://res.cloudinary.com/dgp7z9vkg/image/fetch/c_scale,w_348/v1586048258/" +
                pageImage.value,
              sizes: "384x384",
              type: "image/png",
            },
            {
              src:
                "https://res.cloudinary.com/dgp7z9vkg/image/fetch/c_scale,w_512/v1586048258/" +
                pageImage.value,
              sizes: "512x512",
              type: "image/png",
            },
          ],
        });
      }
    })
    .catch((err: any) => {
      console.log("cannot fetch nowplaying", err.message);
    });
}

const startStars = () => {
  currentVis.value = "stars";
  var element = document.getElementById("viscanvas");
  if (element) {
    element.style.display = "block";
  }
  stars();
}

const stopStars = () => {
  currentVis.value = "";
  var element = document.getElementById("viscanvas");
  if (element) {
    element.style.display = "none";
  }
  if ((window as any).animId) {
    cancelAnimationFrame((window as any).animId);
  }
}
const APP_BASE_URL = computed(() => {
  return config.public.APP_BASE_URL;
})

const userAgent = computed(() => {
  if (!navigator) return "";
  if (!process.client) return "";
  return navigator.userAgent;
})

const playerVisualsEnabled = computed(() => {
  return playerStore.visualsEnabled;
})

const stations = computed(() => {
  return stationStore.stations;
})

const nextStationIndex = computed(() => {
  let index = stations.value.findIndex(
    (station) => station.id === props.station.id
  );
  if (index === stations.value.length - 1) {
    return 0;
  } else {
    return index + 1;
  }
})

const nextStation = computed(() => {
  return stations.value[nextStationIndex.value];
})

const previousStationIndex = computed(() => {
  let index = stations.value.findIndex(
    (station) => station.id === props.station.id
  );
  if (index === 0) {
    return stations.value.length - 1;
  } else {
    return index - 1;
  }
})

const previousStation = computed(() => {
  return stations.value[previousStationIndex.value];
})

const APP_BRANCH = computed(() => {
  return config.public.APP_BRANCH || "main";
})

const APP_VERSION = computed(() => {
  return config.public.APP_VERSION;
})

const isOffline = computed(() => {
  // Nuxt 3 doesn't have $nuxt.isOffline, use navigator.onLine
  if (process.client) {
    return !navigator.onLine;
  }
  return false;
})

const windowHeight = computed(() => {
  if (process.client) {
    return window.innerHeight;
  }
  return 0;
})

const windowWidth = computed(() => {
  if (process.client) {
    return window.innerWidth;
  }
  return 0;
})

const paused = computed(() => {
  return $sound?.paused || false;
})

const readyState = computed(() => {
  return $sound?.readyState || 0;
})

const currIndex = computed(() => {
  return route.params.stationId ? Number(route.params.stationId) : 1;
})

const randomIndex = computed(() => {
  let stationsList = stationStore.stations;
  let currIdx = stationsList.find((item) => item.id == props.station.id)?.id;
  if (!currIdx) return 1;
  let rand = null;
  while (rand === null || rand === currIdx) {
    rand = Math.round(Math.random() * stationsList.length);
  }
  return rand;
})

const nextIndex = computed(() => {
  let stationsList = stationStore.stations;
  let currIdx = stationsList.find((item) => item.id == props.station.id)?.id;
  if (!currIdx) return 1;
  let nextIdx = currIdx + 1;
  if (nextIdx > stationsList.length) {
    nextIdx = 1;
  }
  return nextIdx;
})

const prevIndex = computed(() => {
  let stationsList = stationStore.stations;
  let currIdx = stationsList.find((item) => item.id == props.station.id)?.id;
  if (!currIdx) return 1;
  let prevIdx = currIdx - 1;
  if (prevIdx < 1) {
    prevIdx = stationsList.length;
  }
  return prevIdx;
})

const cover = computed(() => {
  return props.station?.cover || "https://picsum.photos/350/165?random";
})

const artist = computed(() => {
  return nowplaying.value ? nowplaying.value.artist : null;
})

const title = computed(() => {
  return nowplaying.value ? nowplaying.value.title : null;
})

const albumyear = computed(() => {
  return nowplaying.value ? nowplaying.value.album_year : null;
})

const song_type = computed(() => {
  return nowplaying.value ? nowplaying.value.song_type : null;
})

const label = computed(() => {
  return nowplaying.value ? nowplaying.value.label : null;
})

const listeners = computed(() => {
  return nowplaying.value ? nowplaying.value.listeners : null;
})

const streamurl = computed(() => {
  return props.station?.streams?.[0]?.url;
})

// Use useHead instead of vue-headful - make it reactive
const headTitle = computed(() => pageTitle.value || 'dnbradio.com')
const headDescription = computed(() => pageDescription.value || '')
const headKeywords = computed(() => pageKeywords.value || '')
const headImage = computed(() => pageImage.value || '')

useHead({
  title: headTitle,
  meta: [
    {
      name: 'description',
      content: headDescription
    },
    {
      name: 'keywords',
      content: headKeywords
    },
    {
      property: 'og:image',
      content: headImage
    }
  ]
})

onMounted(() => {
  console.log('route', route)
  if (playerStore.initialLoad) {
    // setTimeout(()=> {
    //   playerToggleVisuals();
    // }, 800);
  }
  playerStore.setInitialLoad(false);
  console.log("sound readyState", $sound?.readyState);
  if (
    $sound?.readyState > 0 &&
    $sound?.paused == false &&
    ($sound as any)?.ended == false
  ) {
    isPlaying.value = true;
  }
  pageTitle.value =
    "dnbradio.com : All flavors of dnb from dj's across the globe! [dnbradio.com [all flavors]] - dnbradio.com";
  pageDescription.value = "All flavors of dnb from dj's across the globe!";
  pageImage.value = "https://dnbradio.com/img/logotags.png";
  pageKeywords.value = "dnbradio.com all flavors";
  // navigator
  nextTick(() => {
    loaded.value = true;
    // initStream();
    fetchNowplaying();

    // try again if empty
    setTimeout(() => {
      // no artist or title
      if (!nowplaying.value.artist || !nowplaying.value.title) {
        fetchNowplaying();
      }
    }, 2000);
  });
})

watch(playerVisualsEnabled, (val) => {
  if (val === false) {
    stopStars();
  } else {
    startStars();
  }
})

watch(streamurl, (val) => {
  console.log("streamurl changed", val);
  initStream();
})
</script>

<style>
.pulse {
  transform: scale(1);
  /* animation: pulse 2s infinite; */
  animation: pulse 2s 3;
}
.faded {
  opacity: 0.4;
}
@keyframes pulse {
  0% {
    transform: scale(0.95);
  }

  70% {
    transform: scale(1);
  }

  100% {
    transform: scale(0.95);
  }
}
.iconoff {
  opacity: 0.6;
}
.iconon {
  opacity: 1;
}
.iconon.theme--dark.v-btn.v-btn--icon {
  color: #fb1313;
}
html {
  overflow-y: auto;
  font-size: 16px;
}
.v-application--wrap {
  z-index: 100;
}
.viscanvas-container {
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 0;
  top: 0px;
  left: 0px;
}
#viscanvas {
  top: 0px;
  left: 0px;
  display: block;
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 0;
}
</style>
<style scoped>
.v-item-group.v-bottom-navigation .v-btn {
  min-width: auto;
}
.v-bottom-navigation {
  position: static !important;
}
.animate-border {
  --angle: 45deg;
  border: 1px solid;
  border-image: linear-gradient(var(--angle), #090909, #302f2f, #000000) 1;
  padding: 1rem;
  padding-bottom: 2rem;
  backdrop-filter: blur(10px);
  background: linear-gradient(90deg, rgb(0,10,0,0.3), transparent);
  position: absolute;
  top:50%;
  left: 50%;
  transform: translate(-50%, -50%);
  min-width: 300px;
  height: calc(100% - 20px);
}
.full-width{
  width: 100%;
}
.fixed-width {
  max-width: 500px;
}


@media screen and (max-width: 768px) {
  .animate-border {
    border: none;
  }

}
.animation-none {
  animation: none;
}

@keyframes rotate {
  to {
    --angle: 360deg;
  }
}

@property --angle {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}

.user-v-toolbar{
  margin: auto;
  opacity: 1;
  position: relative;
  z-index: 1000
}
.user-v-card {
  margin-top: -43px;
  position: relative;
  z-index: 1;
  height: calc(100% - 12px);
  display: flex;
  flex-direction: column;
}
.user-categorycont-card{
  margin-top: -10px;
  text-align: center;
  flex: 1;
  display: flex;
  flex-direction: column;
}
.station-title{
  font-size: 0.64rem;
  margin: 0;
}
.category-subtitle {
  font-size: 0.65rem;
  line-height: 0.95rem;
  font-weight: 700;
  text-align: center;
  text-transform: uppercase;
  margin: 5px 0;
}
.category-description {
  font-size: 0.8rem;
  line-height: 1.6rem;
  margin:5px 0;

}
.user-listeners{
  font-size: 0.8rem;
  line-height: 1.6rem;
  text-align: center;
  opacity: 0.4;
  margin: 5px 0;
}
.user-blank{
  height: 29.2px;
}
.indicator-text {
  font-size: 0.7rem;
  line-height: 1.375rem;
  font-weight: 700;
  letter-spacing: 0.1px;
  text-align: center;
}
.offline-indicator{
  color:red;
}
.wait-indicator{
  color: yellow;
}
.stop-text{
  font-weight: 400;
  margin: 0;
}
.user-card-text{
  text-align: center;
}

.user-title{
  font-size: 0.875rem;
  line-height: 1.375rem;
  text-align: center;
  word-break: normal;
  margin: 0;
}
.bold-title-700 {
  font-weight: 700;
}
.user-play-indicator{
  font-size: 0.7rem;
  line-height: 1.375rem;
  font-weight: 400;
  text-align: center;
  margin-bottom: 0;
}
.user-button-group{
  align-items: center;
}
.user-button-group button {
  color: #a0a0a0!important;
  align-items: center;
}
.stationNav{
  border: 0px;
  height: auto!important;
  margin: 10px auto 0px;
  box-shadow: none;
  background-color: transparent!important;
  justify-content: space-around!important;
  position: static !important;
}
.bottom-indicator{
  margin-top: 10px; color: rgb(99, 99, 99);
  text-align: center;
}
.user-keep-up{
  font-size: 0.5rem;
  font-weight: 500;
  line-height: normal;
  margin: 0;
}
.user-keep-up-big{
  font-size: 0.6rem;
}
.user-footer-link{
  text-decoration: none;
  color: #a0a0a0;
  font-size: 0.5625em;
  opacity: 0.4;
}
.user-image-mark {
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center center;
  flex: 1;
  max-width: 270px;
  margin: auto;
  width: 100%;
}
.big-image{
  max-width: 70%;
  width: 100%;
}
.big-font{
  font-size: 1rem;
}
.middle-font{
  font-size: 1rem;
}
.normal-font {
  font-size: 1rem;
}
.nav-button {
  opacity: 1;
  color: rgba(255, 255, 255, 0.7) !important;
  background-color: transparent;
  border-radius: 0;
  box-shadow: none;
  flex: 1;
  font-size: 0.75rem;
  height: inherit;
  max-width: 168px;
  min-width: 80px;
  position: relative;
  text-transform: none;
  flex-direction: column;
  align-items: center;
  display: inline-flex;
  font-weight: 500;
  letter-spacing: 0.0892857143rem;
  justify-content: center;
  outline: 0;
  text-decoration: none;
  text-indent: 0.0892857143rem;
  transition-duration: 0.28s;
  transition-property: box-shadow, transform, opacity;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  user-select: none;
  vertical-align: middle;
  white-space: nowrap;
}

.nav-button:hover::before{
  opacity: 0.08;
}
.nav-button:before{
    background-color: rgba(255, 255, 255, 0.7);
    border-radius: inherit;
    bottom: 0;
    color: inherit;
    content: "";
    left: 0;
    opacity: 0;
    pointer-events: none;
    position: absolute;
    right: 0;
    top: 0;
    transition: opacity 0.2s cubic-bezier(0.4, 0, 0.6, 1);
}
.nav-button .v-icon {
  color:inherit;
}
@media screen and (max-width: 500px) {
  .animate-border {
    max-width: calc(100% - 2rem);
    padding:0px;
  }
  .user-image-mark{
    width: 75%;
    max-width: 270px;
  }

}
</style>
<style scoped>
.overlap-screen{
  width: 100%;
  height: 100%;
  position: fixed;
  z-index: 0;
  top: 0px;
  left: 0px;
}

</style>