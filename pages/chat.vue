<template>
  <div>

          <div style="background-color: #676b6f; border-radius: 10px;">
            <top-menu />
          </div>
      <p class="text-center">
        Our IRC chat room has been in operation since 2003 and is now synced
        with our Discord channel so that you can chat from either location and
        be connected to the main chat room.
        <br /><br /><small>The most mobile friendly option is Discord.</small>
      </p>
      <v-row dense>
        <v-col cols="12">
          <v-card color="#090909" theme="dark">
            <v-card-title class="headline"
              ><v-icon class="pr-2">mdi-discord</v-icon> Join via
              Discord</v-card-title
            >
            <v-card-subtitle
              >Discord is the most mobile friendly chat option.</v-card-subtitle
            >
            <v-card-actions>
              <v-btn @click="launchLink('https://discord.gg/DYb3fay')"
                >Launch Discord</v-btn
              >
              <v-btn @click="launchLink('https://discordapp.com/download')"
                >Download Discord</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col cols="12">
          <v-card color="#090909" theme="dark">
            <v-card-title class="headline"
              ><v-icon class="pr-2">mdi-console</v-icon> IRC
              Webchat</v-card-title
            >
            <v-card-subtitle
              >Use our webchat widget which requires no download and is secured
              over https.</v-card-subtitle
            >
            <v-card-actions>
              <v-btn @click="launchLink('https://chat.dnbradio.com')"
                >Launch Webchat</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col cols="12">
          <v-card color="#090909" theme="dark">
            <v-card-title class="headline"
              ><v-icon class="pr-2">mdi-console</v-icon> Other IRC Clients &amp;
              Server Info</v-card-title
            >
            <v-card-subtitle
              >Get a seamless fully fledge IRC experience by installing a native
              IRC client on your computer.</v-card-subtitle
            >
            <v-card-actions>
              <v-btn @click="seeClients">See Info</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

  </div>
</template>

<script setup lang="ts">
import stations from "@/data/stations";
import { useStationStore } from "@/stores/station";
import { useRoute } from "vue-router";

definePageMeta({
  layout: "legacy"
})

const route = useRoute()
const stationStore = useStationStore()
const { $dialog } = useNuxtApp()

onMounted(async () => {
  if (stationStore.stations.length === 0) {
    const stationsInitData = await stations();
    stationStore.setStations(stationsInitData);
  }
})

const seeClients = () => {
  $dialog.confirm({
    title: "Recommended IRC Clients",
    text:
      "mIRC (Windows)<br />HexChat (Windows, Linux)<br />Textual (MACOS)<br />IRC Cloud (iOS, Windows, MACOS, Web)<br /><br />" +
      "Server: QuakeNet<br />Channel: #dnbradio<br /><br /><small>Visit the quakenet.org website to choose the server " +
      "for your country and then /join #dnbradio after connecting to the server.</small>",
    actions: { true: "OK" }
  });
}

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
        true: "YES, LAUNCH THE LINK."
      }
    })
    .then((res: any) => {
      if (res) {
        window.open(link, "_blank");
      }
    });
}
</script>
<style></style>
