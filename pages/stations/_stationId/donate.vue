<template>
  <div>
    <v-toolbar color="transparent" theme="dark" flat>
      <!-- <v-app-bar-nav-icon></v-app-bar-nav-icon> -->
      <v-btn icon class="ml-2" @click="router.go(-1)">
        <v-icon medium transparent>arrow_back</v-icon>
      </v-btn>
      <v-toolbar-title></v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>

    <v-container>
      <p class="text-center">
        There are several ways to support this station.
        <br /><small>*All donations can be made anonymously.</small>
      </p>
      <v-row dense>
        <v-col cols="12">
          <v-card color="#090909" theme="dark">
            <v-card-title class="headline"
              ><v-icon class="pr-2">mdi-patreon</v-icon> Become a patron on
              Patreon</v-card-title
            >
            <v-card-subtitle
              >Support this station and get perks in return via
              Patreon.</v-card-subtitle
            >
            <v-card-actions>
              <v-btn @click="launchLink('https://patreon.com/dnbradio')"
                >Become a patron</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col cols="12">
          <v-card color="#090909" theme="dark">
            <v-card-title class="headline"
              ><v-icon class="pr-2">mdi-credit-card-outline</v-icon> Donate via
              PayPal</v-card-title
            >
            <v-card-subtitle
              >Support this station via a single or recurring PayPal
              donation.</v-card-subtitle
            >
            <v-card-actions>
              <v-btn @click="launchLink('https://dnbradio.com/donate')"
                >Donate via PayPal</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col cols="12">
          <v-card color="#090909" theme="dark">
            <v-card-title class="headline"
              ><v-icon class="pr-2">mdi-tshirt-crew</v-icon> Buy
              Merch</v-card-title
            >
            <v-card-subtitle
              >Support by buying t-shirts, dogtags, and stickers from our
              shop.</v-card-subtitle
            >
            <v-card-actions>
              <v-btn @click="launchLink('https://shop.dnbradio.com')"
                >Visit Shop</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col cols="12">
          <v-card color="#090909" theme="dark">
            <v-card-title class="headline"
              ><v-icon class="pr-2">mdi-bitcoin</v-icon> Donate
              Bitcoin</v-card-title
            >
            <v-card-subtitle
              >Support this station by sending Bitcoin to our BTC
              wallet.</v-card-subtitle
            >
            <v-card-actions>
              <v-btn @click="showBitcoinAddress">Send Bitcoin</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col cols="12">
          <v-card color="#090909" theme="dark">
            <v-card-title class="headline"
              ><v-icon class="pr-2">mdi-ethereum</v-icon> Donate
              Ethereum</v-card-title
            >
            <v-card-subtitle
              >Support this station by sending Bitcoin to our ETH
              wallet.</v-card-subtitle
            >
            <v-card-actions>
              <v-btn @click="showEthAddress">Send Ethereum</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import stations from "@/data/stations";
import { useStationStore } from "@/stores/station";
import { useRoute, useRouter } from "vue-router";

const route = useRoute()
const router = useRouter()
const stationStore = useStationStore()
const { $dialog } = useNuxtApp()

onMounted(async () => {
  if (stationStore.stations.length === 0) {
    const stationsInitData = await stations();
    stationStore.setStations(stationsInitData);
  }
})

const showBitcoinAddress = () => {
  $dialog.confirm({
    title: "BTC Wallet Address",
    text: "1FGW9JXGPNfvgGMpSKiRSVuaaz6DiYYpyv",
    actions: { true: "OK" }
  });
}

const showEthAddress = () => {
  $dialog.confirm({
    title: "ETH Wallet Address",
    text: "0x5659C68c3176CFF2641CeFA2f4F9eE9C26F66EE6",
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
