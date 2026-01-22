# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Expo React Native application using:
- **Expo SDK ~54** with file-based routing (expo-router)
- **React Native 0.81.5** with React 19.1.0
- **TypeScript** with strict mode enabled
- **New Architecture** enabled (app.json:10)
- **React Compiler** experimental feature enabled (app.json:49)
- **Typed Routes** experimental feature enabled (app.json:48)
- **EAS Build** configured with development, preview, and production profiles

## Development Commands

### Package Manager
This project uses **Yarn** (yarn.lock present). Always use `yarn` commands, not npm.

### Common Commands
- `yarn start` - Start Expo development server
- `yarn ios` - Start on iOS simulator
- `yarn android` - Start on Android emulator
- `yarn web` - Start web development server
- `yarn lint` - Run ESLint

### EAS Build
- Development build: `eas build --profile development`
- Preview build: `eas build --profile preview`
- Production build: `eas build --profile production` (auto-increments version)

## Architecture

### Routing Structure
The app uses **Expo Router** with file-based routing:
- `app/_layout.tsx` - Root layout with theme provider and Stack navigator
- `app/(tabs)/_layout.tsx` - Tab navigation layout (Home, Explore)
- `app/(tabs)/index.tsx` - Home screen
- `app/(tabs)/explore.tsx` - Explore screen
- `app/modal.tsx` - Modal screen (Stack.Screen with modal presentation)
- **unstable_settings anchor** set to `(tabs)` in root layout (app/_layout.tsx:8-10)

### Theme System
The app implements a comprehensive light/dark theme system:

**Theme Management:**
- `constants/theme.ts` - Exports `Colors` (light/dark color tokens) and `Fonts` (platform-specific font stacks)
- `hooks/use-color-scheme.ts` - Re-exports React Native's `useColorScheme` hook
- `hooks/use-theme-color.ts` - Hook that combines theme detection with color token lookup

**Themed Components Pattern:**
All themed components follow this pattern (see ThemedView/ThemedText):
1. Accept optional `lightColor` and `darkColor` props
2. Use `useThemeColor` hook to resolve the correct color based on scheme
3. Apply the color to the appropriate style property

### Platform-Specific Components
The codebase uses platform extensions for targeted implementations:
- `icon-symbol.ios.tsx` - Uses native SF Symbols via expo-symbols
- `icon-symbol.tsx` - Fallback using Material Icons for Android/web
- SF Symbol names must be manually mapped to Material Icons in the MAPPING object

**Adding new icons:**
1. Add SF Symbol name to iOS component (accepts any SF Symbol)
2. Add corresponding Material Icon mapping in the fallback component's MAPPING object

### Component Organization
- `components/` - Shared UI components
- `components/ui/` - Core UI primitives (icon-symbol, collapsible)
- `components/themed-*.tsx` - Theme-aware wrappers around React Native primitives
- `components/haptic-tab.tsx` - Custom tab button with haptic feedback

### Path Aliases
TypeScript is configured with `@/*` path alias pointing to the project root (tsconfig.json:6-8):
```typescript
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
```

### Platform Considerations
- **iOS:** Supports tablets, bundle ID: `me.kutrumbos.unlockapp`, uses SF Symbols natively
- **Android:** Edge-to-edge enabled, predictive back gesture disabled, adaptive icon with monochrome support
- **Web:** Static output mode, uses Material Icons

## Node Version
This project uses Node.js 22.21.1 (specified in .tool-versions). Use a version manager like asdf or nvm to match this version.

## Key Configuration Notes
- Custom URL scheme: `unlockapp://`
- EAS Project ID: `2237babc-f340-40c1-9744-b27f1c54e260`
- ESLint uses flat config format with expo preset
- Strict TypeScript mode enabled
- React Navigation theme integration in root layout
