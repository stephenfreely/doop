# Maestro E2E flows

User-journey tests for Doop, driven through `testID`s (never visible copy).
These are **not** a substitute for the Jest unit tests under `src/` — Maestro
only covers flows that span multiple screens / native state (navigation,
permissions, GPS, AsyncStorage), not pure functions or component logic.

## Requirements

- A **Dev Client** build installed on the simulator/device —
  `npm run ios` (or `npm run android`). **Expo Go will not work**: the app
  uses `expo-location` foreground tracking and native config (map,
  image picker) that Expo Go doesn't include.
- [Maestro CLI](https://maestro.mobile.dev) installed (`curl -Ls
  "https://get.maestro.mobile.dev" | bash`).
- iOS Simulator booted with the dev build installed (flows are written and
  verified against iOS first; Android should work but hasn't been
  exercised here — see Known flakes).
- No backend setup needed. The app runs against the local `AsyncStorage`
  mock (`src/lib/mockApi.ts`) whenever `EXPO_PUBLIC_SUPABASE_URL` is unset,
  which is the expected state for these flows. Don't set Supabase env vars
  when running them, or flows will hit a real backend with real network
  latency these waits weren't tuned for.

## Running

```bash
# fast critical-path check (auth -> dog -> walk -> stool -> history)
npm run e2e:smoke

# everything, including validation/empty/discard/edit journeys
npm run e2e:full

# a single flow, for debugging
maestro test .maestro/flows/smoke.yaml
```

Override the mock credentials used by the `login` subflow if needed:

```bash
maestro test .maestro --include-tags smoke \
  -e TEST_EMAIL=someone@example.com -e TEST_PASSWORD=SomePass123!
```

## Flow index

| File | Tags | Covers |
| --- | --- | --- |
| `flows/smoke.yaml` | `smoke` | Sign in → add dog → start walk → log stool mid-walk → complete → walk details → history list → open details |
| `flows/auth-validation.yaml` | `full` | Empty submit, invalid email, short password, sign-in ↔ sign-up toggle, successful sign-up |
| `flows/dog-edit.yaml` | `full` | Edit an existing dog's name/breed from Settings |
| `flows/walk-pause-resume-continue.yaml` | `full` | Pause, resume, leave the active-walk screen, continue it from Home |
| `flows/walk-discard.yaml` | `full` | Stop with zero GPS points → retry/discard UI → discard → history stays empty |
| `flows/stool-edit.yaml` | `full` | Log a stool during a walk, then edit its rating/notes from walk details |
| `flows/history-empty.yaml` | `full` | History tab empty state (dog exists, no walks yet) |
| `flows/home-empty-vs-ready.yaml` | `full` | Home's "no dog" empty state vs. the ready state once a dog exists |
| `flows/settings-and-tabs.yaml` | `full` | Tab navigation, Settings screen, sign out |
| `subflows/grant-location.yaml` | — | Launch with location permission pre-granted (no OS dialog tap) |
| `subflows/login.yaml` | — | Sign in through the mock backend |
| `subflows/add-dog.yaml` | — | Create a dog profile with no photo, from Home's empty state |

Not covered, by design:

- **Every** error path — only the ones that are easy to trigger
  deterministically (validation, zero-GPS-points save failure) are
  exercised. Network-failure/mock-exception paths aren't, since the mock
  backend practically never throws.
- **Photo capture/picker UI** — `expo-image-picker`'s native picker and
  camera aren't scriptable through Maestro's accessibility tree reliably,
  and the product doesn't require a photo for any save path. Photo buttons
  have `testID`s (`dog.choose-photo-button`, `stool.take-photo-button`,
  `stool.library-button`) for future use but no flow taps them.
- **Map pixels / exact GPS distance** — flows assert the map testID is
  present and that at least one GPS point was recorded, never a specific
  distance or coordinate.

## `testID` conventions used

`{screen}.{element}`, kebab-case screen name matching the route/feature,
dash-case element name. List rows and dynamic items append a stable
suffix: `history.walk-item.<walkId>`, `walk-details.stool-item.<stoolId>`.
Tab bar buttons use React Navigation's `tabBarButtonTestID` (`tabs.home-tab`,
`tabs.history-tab`, `tabs.settings-tab`), since there's no React Native
view to put a plain `testID` on there.

Shared components (`Button`, `Field`, `EmptyState`, `ErrorState`,
`LoadingState`, `WalkMap`, `WalkListItem`, `StoolLogCard`, `DogAvatar`)
accept and forward `testID` — screens pass theirs down rather than the
component inventing one, so the same component can appear on two screens
with two different stable ids (e.g. `home.loading-state` vs.
`history.loading-state`).

Full id reference by screen:

- **sign-in**: `sign-in.form`, `sign-in.email-field`, `sign-in.password-field`,
  `sign-in.submit-button`, `sign-in.toggle-mode-button`, `sign-in.error-text`,
  `sign-in.mock-mode-notice`
- **dog** (`/dog`, add or edit): `dog.loading-state`, `dog.error-state`,
  `dog.avatar`, `dog.choose-photo-button`, `dog.name-field`,
  `dog.breed-field`, `dog.error-text`, `dog.success-text`, `dog.save-button`
- **home** (tab): `home.loading-state`, `home.error-state`,
  `home.empty-state`, `home.add-dog-button`, `home.dog-avatar`,
  `home.stat-distance`, `home.stat-walks`, `home.start-walk-button`,
  `home.start-error-text`, `home.walks-loading-state`,
  `home.walks-error-state`, `home.walks-list`, `home.walks-empty-state`,
  `home.walk-item.<walkId>`
- **walk-active** (`/walk/active`): `walk-active.map`,
  `walk-active.status-text`, `walk-active.distance-text`,
  `walk-active.points-text`, `walk-active.stool-count-text`,
  `walk-active.tracking-error-text`, `walk-active.save-error-text`,
  `walk-active.retry-save-button`, `walk-active.discard-button`,
  `walk-active.pause-resume-button`, `walk-active.stop-button`,
  `walk-active.log-stool-button`
- **stool** (`/walk/stool`): `stool.loading-state`, `stool.error-state`,
  `stool.take-photo-button`, `stool.library-button`, `stool.rating-1`
  through `stool.rating-7`, `stool.notes-field`, `stool.error-text`,
  `stool.save-button`
- **history** (tab): `history.loading-state`, `history.error-state`,
  `history.empty-state`, `history.list`, `history.walk-item.<walkId>`
- **walk-details** (`/walk/[id]`): `walk-details.loading-state`,
  `walk-details.error-state` (covers both load failure and "not found"),
  `walk-details.map`, `walk-details.stool-empty-state`,
  `walk-details.stool-item.<stoolId>`, `walk-details.add-stool-button`,
  `walk-details.delete-error-text`, `walk-details.delete-button`
- **settings** (tab): `settings.account-email`, `settings.edit-dog-button`,
  `settings.sign-out-button`
- **tabs**: `tabs.home-tab`, `tabs.history-tab`, `tabs.settings-tab`
- **root** (auth gate): `root.loading-state`, `root.error-state`

## Known flakes / timing notes

- **Mock latency**: every mock API call (`src/lib/mockApi.ts`) sleeps
  ~500ms to exercise loading UI. All flows wait with `extendedWaitUntil`
  on a testID, never a fixed `sleep`.
- **GPS on the simulator**: the iOS Simulator reports no location until
  one is simulated. Flows that complete a walk call `setLocation` once
  the active-walk screen is visible, then wait for
  `walk-active.points-text` to contain a non-zero digit before stopping.
  `walk-discard.yaml` relies on the *opposite* — it never calls
  `setLocation`, so the walk has zero points and stopping immediately
  reliably reproduces the "need at least one GPS point" save failure.
- **Location permission**: granted once per flow via
  `subflows/grant-location.yaml`'s `launchApp.permissions` map, not by
  tapping the native OS alert — alert button text/position varies across
  iOS versions and this app has no UI to test the "denied" path
  differently from "never asked", so there's nothing lost by always
  granting.
- **`back` after a pushed screen**: `/dog` and `/walk/[id]` are pushed on
  top of the tab navigator, so the tab bar isn't available to navigate
  back from them — flows use Maestro's `back` command (edge-swipe on
  iOS) instead of a tab tap.
- **Android**: not yet run against these flows. `tabBarButtonTestID` and
  `launchApp.permissions` both work cross-platform per Maestro's docs, but
  the `back` behavior and permission-dialog timing may differ in
  practice — treat the first Android run as a verification pass, not an
  assumption.
