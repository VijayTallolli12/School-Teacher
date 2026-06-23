# Teacher App Foundation

## Overview

This document describes the foundation architecture for the Teacher App. The foundation provides the structural framework without implementing APIs, authentication, or business logic.

## Project Structure

```
src/
├── api/              # API layer (placeholder)
├── components/       # Reusable UI components
├── constants/        # App constants (placeholder)
├── navigation/       # React Navigation setup
├── screens/          # Screen components
├── services/         # Business services (placeholder)
├── store/            # State management (placeholder)
├── theme/            # Theme system
├── types/            # TypeScript type definitions
└── utils/            # Utility functions (placeholder)
```

## Theme System

Located in `src/theme/`

### Colors (`colors.ts`)
- Primary: #4F46E5 (Indigo)
- Secondary: #10B981 (Emerald)
- Background colors
- Text colors (primary, secondary, light)
- Semantic colors (error, warning, success, info)

### Spacing (`spacing.ts`)
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- xxl: 48px
- xxxl: 64px

### Typography (`typography.ts`)
- Font families (System fonts)
- Font sizes (12px to 40px)
- Font weights (regular, medium, bold)
- Line heights (tight, normal, relaxed)

### Radius (`radius.ts`)
- xs: 4px
- sm: 8px
- md: 12px
- lg: 16px
- xl: 20px
- xxl: 24px
- full: 9999px

### Shadows (`shadows.ts`)
- Five shadow levels (xs, sm, md, lg, xl)
- Platform-specific shadow properties for iOS and Android

## Components

Located in `src/components/`

### AppHeader
Reusable header component with:
- Title display
- Optional back button
- Optional right component slot

### ScreenContainer
Wrapper component for screens with:
- Scrollable/non-scrollable modes
- Custom background color support
- Consistent padding and layout

### LoadingScreen
Loading state component with:
- Activity indicator
- Customizable message

### EmptyState
Empty state component with:
- Title and message
- Optional icon slot

## Screens

Located in `src/screens/`

### Placeholder Screens
- **LoginScreen**: Authentication entry point
- **DashboardScreen**: Main dashboard view
- **AttendanceScreen**: Attendance management
- **HomeworkScreen**: Homework management
- **ExamsScreen**: Exams and assessments
- **ProfileScreen**: User profile

All screens are functional placeholders with basic UI structure.

## Navigation

Located in `src/navigation/`

### Navigation Structure

#### RootNavigator
- Manages top-level navigation between Auth and App stacks
- Currently defaults to Auth stack (authentication logic not implemented)

#### AuthNavigator (Auth Stack)
- LoginScreen

#### AppNavigator (App Stack)
- MainTabs (Bottom Tab Navigator)
- ExamsScreen (Stack screen)

#### MainTabsNavigator (Bottom Tabs)
- Dashboard
- Attendance
- Homework
- Profile

### Navigation Types
All navigation param lists are defined in `src/types/index.ts`:
- `RootStackParamList`
- `AuthStackParamList`
- `AppStackParamList`
- `MainTabParamList`

## Type Definitions

Located in `src/types/index.ts`

### Core Types
- `User`: Teacher user profile
- `Student`: Student information
- `AttendanceRecord`: Attendance data
- `Homework`: Homework assignment
- `Exam`: Exam/assessment details
- Navigation param lists for type-safe navigation

## Dependencies

### React Navigation
- @react-navigation/native
- @react-navigation/native-stack
- @react-navigation/bottom-tabs
- react-native-screens
- react-native-safe-area-context

### Core
- React 19.1.0
- React Native 0.81.5
- Expo ~54.0.34
- TypeScript ~5.9.2

## Implementation Status

✅ **Completed**
- Directory structure
- Theme system (colors, spacing, typography, radius, shadows)
- Type definitions
- Reusable components (AppHeader, ScreenContainer, LoadingScreen, EmptyState)
- Placeholder screens (LoginScreen, DashboardScreen, AttendanceScreen, HomeworkScreen, ExamsScreen, ProfileScreen)
- React Navigation setup (Auth Stack, App Stack, Bottom Tabs)
- App.tsx integration

⏳ **Not Implemented (Future Phases)**
- API layer
- Authentication logic
- Business logic
- State management
- Utility functions
- Constants

## Running the App

```bash
npm start
```

The app will launch with the LoginScreen as the initial screen. Navigation between screens is functional, but authentication flow is not implemented.

## TypeScript

The entire codebase uses TypeScript with strict mode enabled. All components, navigation, and types are fully typed.

## Next Steps

Future phases should implement:
1. Authentication logic and state management
2. API integration
3. Business logic for each screen
4. State management (Redux, Context, or similar)
5. Form validation
6. Data persistence
7. Error handling
8. Testing
