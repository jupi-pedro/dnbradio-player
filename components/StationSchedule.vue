<template>
  <div>
    <v-card
      v-show="loaded"
      class="transparent"
      style="margin:auto; margin-top:0px;"
      flat
      :max-width="500"
      v-touch="{
        left: () => swipe('Left'),
        right: () => swipe('Right'),
        up: () => swipe('Up'),
        down: () => swipe('Down')
      }"
    >
      <v-card
        style="margin:auto;
      text-align: center;"
        flat
        theme="dark"
        class="categoryCont transparent"
        v-show="1"
      >
        <v-container fluid>
          <v-row justify="space-around">
            <v-btn
              small
              rounded
              @click="chooseDay(0)"
              :class="isDay(0) ? 'font-weight-bold primary--text' : null"
              >SUN</v-btn
            >
            <v-btn
              small
              rounded
              @click="chooseDay(1)"
              :class="isDay(1) ? 'font-weight-bold primary--text' : null"
              >MON</v-btn
            >
            <v-btn
              small
              rounded
              @click="chooseDay(2)"
              :class="isDay(2) ? 'font-weight-bold primary--text' : null"
              >TUE</v-btn
            >
            <v-btn
              small
              rounded
              @click="chooseDay(3)"
              :class="isDay(3) ? 'font-weight-bold primary--text' : null"
              >WED</v-btn
            >
            <v-btn
              small
              rounded
              @click="chooseDay(4)"
              :class="isDay(4) ? 'font-weight-bold primary--text' : null"
              >THU</v-btn
            >
            <v-btn
              small
              rounded
              @click="chooseDay(5)"
              :class="isDay(5) ? 'font-weight-bold primary--text' : null"
              >FRI</v-btn
            >
            <v-btn
              small
              rounded
              @click="chooseDay(6)"
              :class="isDay(6) ? 'font-weight-bold primary--text' : null"
              >SAT</v-btn
            >
          </v-row>
        </v-container>
        <v-timeline v-if="schedule">
          <v-timeline-item
            v-for="(item, index) in upcoming"
            :key="index"
            medium
            right
            color="transparent lighten-1"
            icon="mic"
          >
            <template v-slot:opposite>
              <div class="text-center">
                <span
                  :class="`headline font-weight-bold primary--text`"
                  v-if="item.start"
                  @click="showEvent(item)"
                  style="cursor: pointer;"
                >
                  <small>
                    {{ localDay(item.start) }}<br />

                    {{ localTime(item.start) }} - {{ localTime(item.end)
                    }}<br />
                    <small>{{ localTZ(item.start) }}</small>
                  </small>
                </span>
              </div>
            </template>
            <div class="py-4">
              <h4
                :class="`mb-2 text-center`"
                style="line-height:normal;cursor: pointer;"
                @click="showEvent(item)"
              >
                <small>{{ item.host }}</small>
              </h4>
              <div
                class="text-center"
                style="line-height:normal;cursor: pointer;"
                @click="showEvent(item)"
              >
                <small>
                  {{ item.title }}
                  <span v-if="item.location">({{ item.location }})</span>
                </small>
              </div>
            </div>
          </v-timeline-item>
        </v-timeline>
      </v-card>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import moment from "moment-timezone";

const props = defineProps<{
  station: any
}>()

const route = useRoute()
const { $dialog } = useNuxtApp()

// Vue 3 doesn't have filters, use functions instead
const localTZ = (value: any) => {
  if (value) {
    return moment(value)
      .local()
      .format("ZZ");
  }
  return ''
}

const localTime = (value: any) => {
  if (value) {
    return moment(value)
      .local()
      .format("HH:mm");
  }
  return ''
}

const localTimeForceToday = (value: any) => {
  let time;
  if (value.indexOf("T") !== -1) {
    time = value.split("T")[1];
  } else {
    time = value;
  }
  if (value) {
    let day = moment().format("YYYY-MM-DDT" + time);
    if (moment().isDST() && moment.parseZone(day).utcOffset() <= -240) {
      return moment(day)
        .subtract(1, "hours")
        .format("HH:mm");
    } else {
      return moment(day).format("HH:mm");
    }
  }
  return ''
}

const localDay = (value: any) => {
  if (value) {
    return moment(value)
      .local()
      .format("dddd");
  }
  return ''
}

const abbrs: Record<string, string> = {
  EST: "Eastern Standard Time",
  EDT: "Eastern Daylight Time",
  CST: "Central Standard Time",
  CDT: "Central Daylight Time",
  MST: "Mountain Standard Time",
  MDT: "Mountain Daylight Time",
  PST: "Pacific Standard Time",
  PDT: "Pacific Daylight Time"
};

(moment.fn as any).zoneName = function() {
  var abbr = this.zoneAbbr();
  return abbrs[abbr] || abbr;
};

const selectedDay = ref<number | null>(null)
const schedule = ref<any[] | null>(null)
const loaded = ref(false)

const showEvent = (payload: any) => {
  let occurs = null;
  switch (payload.occurs) {
    case "even":
    case "odd":
      occurs = "every other " + moment(payload.start).format("dddd");
      break;
    case "last":
      occurs =
        "last " + moment(payload.start).format("dddd") + " of the month";
      break;
    case 1:
      occurs =
        "first " + moment(payload.start).format("dddd") + " of the month";
      break;
    case "weekly":
      occurs = "every " + moment(payload.start).format("dddd");
      break;
  }
  $dialog.confirm({
    title: payload.host,
    text:
      "<strong>" +
      payload.title +
      "</strong>" +
      "<br />" +
      payload.location +
      "<br />" +
      moment(payload.start).format("HH:mm") +
      " - " +
      moment(payload.end).format("HH:mm") +
      (occurs ? " (" + occurs + ")" : "") +
      "<br /><br /><small>" +
      "" +
      payload.description +
      "</small>" +
      (payload.image
        ? '<img src="' +
          payload.image +
          '" style="max-width: 400px;" />'
        : ""),
    fullscreen: false
  });
}

const chooseDay = (val: number) => {
  selectedDay.value = val;
}

const isDay = (val: number) => {
  return selectedDay.value == val;
}

const swipe = (direction: string) => {
  switch (direction) {
    case "left":
      // loadPrev();
      break;
    case "right":
      // loadNext();
      break;
  }
}

const currenStationIndex = computed(() => {
  return route.params.id;
})

const upcoming = computed(() => {
  if (!schedule.value) {
    return null;
  }
  return schedule.value.filter(item => {
    var end = moment
      .utc({ hour: 23, minute: 59, second: 59 } as any)
      .add(6, "days");
    var start = moment.utc({ hour: 0, minute: 0, second: 0 } as any);

    let ostart = moment.utc(item.start);
    return (
      ostart > start &&
      ostart < end &&
      ostart.local().day() == selectedDay.value
    );
  }).sort((a, b) => {
    let a1 = moment.utc(a.start).toISOString();
    let b1 = moment.utc(b.start).toISOString();
    console.log('a1', a1, 'b1', b1);
    return a1.localeCompare(b1);
  });
})

onMounted(() => {
  selectedDay.value = moment().day();
  if (props.station) {
    $fetch(props.station.schedule.url).then((res: any) => {
      schedule.value = res;
    });
  } else {
    console.log("status is not defined yet");
  }
  nextTick(() => {
    loaded.value = true;
  });
})
</script>

<style>
.v-calendar-daily__scroll-area {
  overflow-y: hidden;
}
</style>
