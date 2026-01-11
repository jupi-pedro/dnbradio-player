# Debug Information for Blank Screen Issue

## Changes Made:

1. **StationList Component:**
   - Added loading state check
   - Added default window dimensions (800x1200) to prevent 0x0 rendering
   - Added error handling for station loading
   - Added v-if check for station before rendering StationDetails

2. **StationDetails Component:**
   - Changed `loaded` initial value from `false` to `true` to show content immediately
   - Added `v-if="props.station"` guard on root div

3. **pages/index.vue:**
   - Added loading state with visual feedback
   - Added error handling

## To Debug:

1. Open browser console (F12) and check for errors
2. Check Network tab to see if stations data is loading
3. Check if Vuetify is initializing properly
4. Verify Pinia store is working

## Common Issues:

- If you see "Cannot read property of undefined" - check if $sound, $device, or $dialog are available
- If you see "Station is null" - check if stations are loading from data/stations.js
- If you see Vuetify errors - check if vuetify plugin is loading
