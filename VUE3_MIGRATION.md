# Vue 3 Migration Guide

This document outlines the migration from Vue 2/Nuxt 2 to Vue 3/Nuxt 3.

## ✅ Completed Migrations

### 1. Dependencies (package.json)
- ✅ Updated to Nuxt 3.9.0
- ✅ Updated to Vue 3.4.15
- ✅ Updated to Vuetify 3.5.10
- ✅ Replaced Vuex with Pinia 2.1.7
- ✅ Added mitt for event bus
- ✅ Updated all related dependencies

### 2. Configuration
- ✅ Created `nuxt.config.ts` (Nuxt 3 format)
- ✅ Migrated runtime config to new format
- ✅ Updated build configuration for Vite
- ✅ Created `app.vue` for Nuxt 3

### 3. State Management
- ✅ Created Pinia stores:
  - `stores/player.ts` - Player state
  - `stores/station.ts` - Station data
  - `stores/autocomplete.ts` - Autocomplete data
- ✅ Removed Vuex ORM, replaced with Pinia stores

### 4. Plugins
- ✅ Updated `plugins/vuetify.ts` for Vuetify 3
- ✅ Updated `plugins/createjs.ts` for Vue 3
- ✅ Updated `plugins/headful.ts` for Vue 3
- ✅ Created `plugins/eventbus.ts` for Vue 3 event system
- ✅ Created `plugins/init-stations.ts` to initialize station data

### 5. Layouts
- ✅ Updated `layouts/default.vue`
- ✅ Updated `layouts/error.vue`
- ✅ Updated `layouts/legacy.vue`
- ✅ Updated `layouts/ls-widget.vue`

### 6. Middleware
- ✅ Updated `middleware/user-agent.ts` for Nuxt 3

### 7. Components (Examples)
- ✅ Updated `components/StationList.vue`
- ✅ Updated `components/Logo.vue` (minimal changes needed)

### 8. Pages (Examples)
- ✅ Updated `pages/stations/_stationId/index.vue`

## 🔄 Remaining Work

### Components to Update

The following components still need Vue 3 migration:

1. **components/StationDetails.vue** - Large component, needs:
   - Replace `this.$store` with `usePlayerStore()` and `useStationStore()`
   - Replace `this.$route` with `useRoute()`
   - Replace `this.$router` with `useRouter()`
   - Replace `this.$config` with `useRuntimeConfig()`
   - Replace `this.$axios` with `$fetch` or `useFetch`
   - Replace `Station.query().get()` with Pinia store
   - Update all computed properties and methods

2. **components/StationSchedule.vue**
3. **components/StationCalendar.vue**
4. **components/TopMenu.vue**

### Pages to Update

All pages in `pages/` directory need updates:

1. **pages/home.vue**
2. **pages/archive.vue**
3. **pages/chat.vue**
4. **pages/verify/_token.vue**
5. **pages/stations/_stationId/chat.vue**
6. **pages/stations/_stationId/donate.vue**
7. **pages/stations/_stationId/schedule.vue**
8. **pages/stations/_stationId/podcast/index.vue**
9. **pages/stations/_stationId/podcast/_epid.vue**
10. **pages/stations/_stationId/widget-*.vue** (all widget pages)

### Migration Patterns

#### 1. Store Access
**Before (Vuex):**
```javascript
this.$store.state.player.visualsEnabled
this.$store.commit('player/TOGGLE_VISUALS')
this.$store.dispatch('player/SET_INITIAL_LOAD', false)
```

**After (Pinia):**
```javascript
const playerStore = usePlayerStore()
playerStore.visualsEnabled
playerStore.toggleVisuals()
playerStore.setInitialLoad(false)
```

#### 2. Route Access
**Before:**
```javascript
this.$route.params.stationId
this.$route.name
```

**After:**
```javascript
const route = useRoute()
route.params.stationId
route.name
```

#### 3. Router Access
**Before:**
```javascript
this.$router.push('/path')
```

**After:**
```javascript
const router = useRouter()
router.push('/path')
// or
await navigateTo('/path')
```

#### 4. Runtime Config
**Before:**
```javascript
this.$config.APP_VERSION
```

**After:**
```javascript
const config = useRuntimeConfig()
config.public.APP_VERSION
```

#### 5. Axios/API Calls
**Before:**
```javascript
this.$axios.get('/api/endpoint')
```

**After:**
```javascript
const { data } = await $fetch('/api/endpoint')
// or
const { data } = await useFetch('/api/endpoint')
```

#### 6. Vuex ORM Queries
**Before:**
```javascript
Station.query().get()
Station.create({ data: stations })
```

**After:**
```javascript
const stationStore = useStationStore()
stationStore.stations
stationStore.setStations(stations)
```

#### 7. Component Definition
**Before:**
```javascript
export default {
  data() {
    return { count: 0 }
  },
  computed: {
    doubled() {
      return this.count * 2
    }
  },
  methods: {
    increment() {
      this.count++
    }
  }
}
```

**After (Composition API):**
```javascript
<script setup lang="ts">
const count = ref(0)
const doubled = computed(() => count.value * 2)
const increment = () => {
  count.value++
}
</script>
```

**Or (Options API - still works in Vue 3):**
```javascript
export default {
  data() {
    return { count: 0 }
  },
  // ... rest stays the same
}
```

#### 8. Template Changes
**Before:**
```vue
<client-only>
  <component />
</client-only>
```

**After:**
```vue
<ClientOnly>
  <component />
</ClientOnly>
```

#### 9. Head Management
**Before:**
```javascript
head() {
  return {
    title: 'Page Title',
    meta: [...]
  }
}
```

**After:**
```javascript
useHead({
  title: 'Page Title',
  meta: [...]
})
```

### Vuetify 3 Changes

1. **Props**: Some component props changed (check Vuetify 3 migration guide)
2. **Slots**: Some slot names changed
3. **Icons**: Icon usage may need updates
4. **Theming**: Theme configuration moved to plugin

### Breaking Changes to Watch For

1. **Global Properties**: `this.$nuxt` is no longer available
2. **Event Bus**: Use `$eventBus` from plugin instead of Vue instance
3. **Process checks**: `process.client` still works, but prefer `import.meta.client`
4. **Async Data**: Use `useFetch` or `useAsyncData` instead of `asyncData`
5. **Vuex ORM**: Completely removed, use Pinia stores instead

## Testing Checklist

After migration, test:

- [ ] All pages load correctly
- [ ] Station switching works
- [ ] Audio playback works
- [ ] Now playing updates
- [ ] Chat functionality
- [ ] Schedule display
- [ ] Podcast pages
- [ ] Widget pages
- [ ] Navigation
- [ ] Responsive design
- [ ] Dark theme
- [ ] Visual effects (stars/plankton)

## Next Steps

1. Install dependencies: `pnpm install`
2. Update remaining components using patterns above
3. Update remaining pages
4. Test thoroughly
5. Fix any runtime errors
6. Update deployment scripts if needed

## Notes

- Options API still works in Vue 3, so gradual migration is possible
- Some components may work with minimal changes
- Focus on components that use Vuex, Vuex ORM, or deprecated APIs first
- Test incrementally as you migrate each component/page
