# AGENTS.md - Development Guidelines for dnbradio-player

## Overview

This is a Nuxt.js 2 static site for dnbradio.com, a drum & bass radio player with live streaming, chat, and schedule features.

## Build/Lint/Test Commands

### Development

```bash
# Start development server with hot reload
pnpm run dev

# Debug mode (generates + starts with devtools)
pnpm run debug

# Generate static site for development branch
pnpm run generate

# Build for production branch
pnpm run build
```

### Deployment

```bash
# Deploy development branch to dnbradio.com/player-{branch}
pnpm run generate && pnpm run upload

# Deploy main branch to production
pnpm run generate-prod && pnpm run upload-prod
```

### Linting

```bash
# Run ESLint on JS/Vue files
pnpm run lint

# Note: No automatic fixing configured - review lint errors manually
```

### Testing

**No test framework is currently configured.** When adding tests:

- Consider Jest for Vue component testing
- Add test scripts to package.json
- Test command should be: `npm test` or `npm run test`

### Single Test Execution

When tests are added, run individual tests using:

```bash
# Jest example (when configured)
npm test -- --testPathPattern=ComponentName.spec.js
npm test -- --testNamePattern="should handle edge case"
```

## Code Style Guidelines

### General

- **Indentation**: 2 spaces (configured in .editorconfig)
- **Line endings**: LF (Unix)
- **Charset**: UTF-8
- **Trailing whitespace**: Trimmed automatically
- **Final newlines**: Required
- **Language**: JavaScript ES6+ with Vue 2

### File Structure

```
├── components/     # Vue components
├── pages/          # Nuxt pages (file-based routing)
├── layouts/        # Page layouts
├── store/          # Vuex store modules
├── models/         # Vuex ORM models
├── plugins/        # Nuxt plugins
├── server/         # Express server (deprecated)
├── static/         # Static assets
└── middleware/     # Nuxt middleware
```

### Vue Components

#### Structure

```vue
<template>
  <!-- Single root element -->
  <v-card>
    <!-- Content -->
  </v-card>
</template>

<script>
import Component from "@/components/Component";

// Named export default
export default {
  // Component name (PascalCase)
  name: "MyComponent",

  // Props with validation
  props: {
    value: {
      type: [String, Number],
      required: true,
    },
  },

  // Reactive data
  data() {
    return {
      localValue: null,
    };
  },

  // Computed properties
  computed: {
    computedValue() {
      return this.value * 2;
    },
  },

  // Methods
  methods: {
    handleClick() {
      // Method implementation
    },
  },

  // Lifecycle hooks
  mounted() {
    // Component mounted logic
  },
};
</script>

<style scoped>
/* Scoped styles */
.my-component {
  /* Styles */
}
</style>
```

#### Naming Conventions

- **Files**: PascalCase (`StationList.vue`)
- **Components**: PascalCase in registration
- **Props**: camelCase
- **Events**: kebab-case or camelCase (consistent within component)
- **CSS classes**: kebab-case

### JavaScript/Vue Script

#### Imports

```javascript
// External libraries first
import Vue from "vue";
import { mapState, mapActions } from "vuex";

// Internal imports (use @ alias for src/)
import Station from "@/models/Station";
import StationDetails from "@/components/StationDetails";

// Relative imports for same directory
import utils from "./utils";
```

#### Vuex Store

```javascript
// store/module.js
export const state = () => ({
  items: [],
});

export const mutations = {
  // SCREAMING_SNAKE_CASE
  SET_ITEMS: (state, items) => {
    state.items = items;
  },
};

export const actions = {
  // camelCase
  async fetchItems({ commit }) {
    const items = await this.$axios.$get("/api/items");
    commit("SET_ITEMS", items);
  },
};
```

#### Vuex ORM Models

```javascript
// models/Model.js
import { Model } from "@vuex-orm/core";

export default class MyModel extends Model {
  static entity = "myModels"; // snake_case

  static fields() {
    return {
      id: this.uid(),
      name: this.string(""),
      createdAt: this.attr(null),
    };
  }
}
```

### Error Handling

#### Vue Components

```javascript
export default {
  methods: {
    async fetchData() {
      try {
        const result = await this.$axios.$get("/api/data");
        this.data = result;
      } catch (error) {
        console.error("Failed to fetch data:", error);
        // Handle error (show notification, fallback, etc.)
        this.$nuxt.error({
          statusCode: 500,
          message: "Failed to load data",
        });
      }
    },
  },
};
```

#### Async Operations

- Use `async/await` over Promises
- Always wrap async operations in try/catch
- Provide meaningful error messages
- Handle loading states appropriately

### Type Checking

- No TypeScript configured
- Use JSDoc for complex functions when needed
- Prop validation required for component props

### Performance

- Use `process.client` checks for client-only code
- Lazy load components when appropriate
- Optimize images and assets
- Use computed properties over methods for reactive data

### Security

- Never commit sensitive data (.env files)
- Validate user input on both client and server
- Use HTTPS for all external requests
- Sanitize data before rendering

### Git Workflow

- Feature branches from main
- Squash commits on merge
- Use conventional commit messages
- Run lint before committing

### Environment Variables

```bash
# Required variables (.env)
NODE_PORT=9000
NODE_HOST=0.0.0.0
NODE_ENV=development

# Optional deployment variables
APP_BRANCH=main
ROUTER_BASE=/
```

### Dependencies

- **Runtime**: Vue 2, Nuxt 2, Vuetify 2
- **Build**: Webpack 4, Babel
- **Package Manager**: pnpm
- **Database**: MongoDB with Mongoose (server-side)

### ESLint Rules (from .eslintrc.js)

- Extends: @nuxtjs, plugin:nuxt/recommended, plugin:vue/essential, eslint:recommended
- `no-console`: off (console.log allowed)
- `no-unused-vars`: off
- `vue/return-in-computed-property`: off
- `no-unreachable`: off
- `vue/no-unused-components`: off
- `space-before-function-paren`: off
- `vue/html-indent`: on
- `vue/multiline-html-element-content-newline`: off

### Nuxt Configuration

- **SSR**: Disabled (static generation)
- **Target**: Static
- **Router Base**: Configurable via env
- **PWA**: Available but commented out

### Browser Support

Modern browsers with ES6+ support. Includes polyfills for:

- fetch
- Object.entries
- Object.values
- IntersectionObserver
- Array.from

### Accessibility

- Use semantic HTML elements
- Provide alt text for images
- Ensure keyboard navigation works
- Use Vuetify components (built-in a11y)

### Internationalization

- No i18n configured currently
- Hard-coded English strings
- Consider vue-i18n for multi-language support

### Monitoring

- Plausible.io for analytics
- No error tracking configured
- Consider Sentry for production error monitoring

---

_This document should be updated when new tools, frameworks, or conventions are adopted._
