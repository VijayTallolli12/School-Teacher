# Teacher Transport Tracking Module — Audit Report

## API Integration (`src/api/transport.ts`)

| Endpoint | Method | File Line | Description |
|---|---|---|---|
| `/api/v1/teacher/transport/routes` | GET | `transport.ts:7` | Get all assigned routes |
| `/api/v1/teacher/transport/vehicles` | GET | `transport.ts:13` | Get all vehicles |
| `/api/v1/teacher/transport/vehicles/:id/location` | GET | `transport.ts:19` | Get vehicle location |
| `/api/v1/teacher/transport/live-status` | GET | `transport.ts:27` | Get live transport dashboard status |
| `/api/v1/teacher/transport/routes/:id` | GET | `transport.ts:35` | Get route detail with stops |

## React Query Hooks (`src/hooks/useTransport.ts`)

| Hook | Type | Cache Key | staleTime | refetchInterval |
|---|---|---|---|---|
| `useAssignedRoutes` | `useQuery` | `['transport', 'routes']` | 5 min | — |
| `useVehicles` | `useQuery` | `['transport', 'vehicles']` | 5 min | — |
| `useVehicleLocation` | `useQuery` | `['transport', 'vehicles', id, 'location']` | 30s | 30s |
| `useLiveTransportStatus` | `useQuery` | `['transport', 'live-status']` | 30s | 30s |
| `useRouteDetail` | `useQuery` | `['transport', 'routes', id]` | 5 min | — |

Real-time updates via `refetchInterval` of 30 seconds on `useVehicleLocation` and `useLiveTransportStatus`.

## Type Definitions (`src/types/index.ts`)

| Interface | Key Fields |
|---|---|
| `Vehicle` | id, name, vehicleNumber, driverName, driverPhone, status, currentLocation, speed, lastUpdate, eta, routeName, capacity, assignedStudents |
| `RouteStop` | id, name, address, latitude, longitude, arrivalTime, departureTime, studentCount |
| `Route` | id, name, description, status, vehicleId, vehicleName, vehicleNumber, driverName, driverPhone, stops[], assignedStudents |
| `VehicleLocation` | vehicleId, vehicleName, vehicleNumber, driverName, latitude, longitude, speed, lastUpdate, eta, status, routeName |
| `ETAData` | routeName, vehicleName, driverName, currentStop, nextStop, estimatedArrival, remainingStops, status |
| `LiveTransportStatus` | activeRoutes, vehiclesInTransit, upcomingArrivals, delayedRoutes, routes[], vehicles[] |
| `TransportStatusType` | `'on_time' \| 'arriving' \| 'delayed' \| 'completed'` |

## Components (`src/components/`)

| Component | Description | Props |
|---|---|---|
| `TransportStatusBadge` | Status pill (On Time / Arriving / Delayed / Completed) | `status: TransportStatusType` |
| `VehicleCard` | Vehicle info card with status, driver, speed, ETA, capacity | `vehicle: Vehicle`, `onPress?` |
| `RouteCard` | Route card with vehicle, driver, stops count, status | `route: Route`, `onPress?` |
| `ETACard` | ETA display with current/next stop, remaining stops | `eta: ETAData` |
| `LiveTrackingHeader` | Live tracking header with vehicle, speed, driver, ETA | `vehicle: VehicleLocation` |
| `TransportEmptyState` | Empty state for transport screens | `title?`, `message?` |

## Screens (`src/screens/`)

### TransportScreen (Dashboard)
- 4 summary cards: Active Routes, In Transit, Upcoming Arrivals, Delayed
- Active Routes list with RouteCard
- Vehicles in Transit list with VehicleCard
- Pull-to-refresh, skeleton loaders, empty state, error handling

### VehicleTrackingScreen (Live Tracking)
- MapView (react-native-maps) with vehicle Marker
- LiveTrackingHeader (vehicle name, speed, driver, route, ETA)
- Vehicle information card (status, route, speed, ETA, coordinates)
- Auto-refresh every 30 seconds
- Map placeholder fallback if react-native-maps unavailable

### RouteDetailScreen (Route Details)
- Route header card (name, status, description)
- Vehicle & Driver card with track vehicle action
- Route Stops with vertical connector, arrival/departure times, student counts
- Pull-to-refresh, skeleton loaders, error handling

## Navigation Updates

| File | Changes |
|---|---|
| `src/types/index.ts:112-114` | Added `Transport`, `VehicleTracking`, `RouteDetail` to `AppStackParamList` |
| `src/screens/index.ts` | Added 3 new screen exports |
| `src/components/index.ts` | Added 6 new component exports |
| `src/navigation/AppNavigator.tsx` | Added 3 new `Stack.Screen` entries |

## Map Integration

- Library: `react-native-maps` (installed via npm)
- Dynamic import with try/catch fallback to placeholder
- Vehicle marker with custom bus icon
- Initial region centered on vehicle coordinates
- `showsCompass: true`, `rotateEnabled: false`

## Real-time Updates

- `useLiveTransportStatus`: auto-refresh every 30 seconds; powers TransportScreen dashboard
- `useVehicleLocation`: auto-refresh every 30 seconds; powers VehicleTrackingScreen

## Performance Considerations

- React Query stale times: static data (routes, vehicles, route detail) at 5 min, live data at 30s
- `refetchInterval` for real-time data avoids manual polling boilerplate
- Map component is conditionally loaded via try/catch to prevent crashes

## Error Handling

| Scenario | Handling |
|---|---|
| Network error | EmptyState with retry button |
| Map library unavailable | Placeholder with explanation |
| Loading | SkeletonList / SkeletonCard |
| No data | TransportEmptyState |
| Pull-to-refresh | RefreshControl on all screens |

## Design System Compliance

- Theme tokens: `colors`, `spacing`, `typography`, `radius`, `shadows` throughout
- Components use `AppCard` (default/interactive variants), `AppHeader`, `ScreenContainer`
- `Ionicons` from `@expo/vector-icons` consistent with UX-2 standard
- Premium SaaS visual style with summary cards, subtle borders, status badges
