# Application architecture

Still is an offline-capable Tizen widget. Scripts and assets ship together; weather
needs internet access, but there is no application server or build step at runtime.
The current entry point is `dashboard/tizen/index.html`; `dashboard/dist` and the
Python remote bridge are a separate legacy application.

## Ownership and dependencies

- `app.js` composes the application and owns screen state, rendering, dialogs,
  favorite editing, and event bindings. It coordinates the modules below.
- `catalog.js` owns app eligibility, deduplication, display names, and ordering.
  `StillCatalog.normalize(raw, currentAppId)` is pure and accepts device identity
  as data. It does not access storage, the DOM, or Tizen.
- `preferences.js` owns the `still-prefs` persistence boundary.
  `StillPreferences.create({storage, onError})` returns `read()` and `write(prefs)`.
  Storage is injected as a function so denied access is caught. Invalid root data
  and ID lists are normalized; unknown preferences and existing keys are retained.
  Absent favorites stay absent so discovery can select initial defaults.
- `clock.js` owns clock rendering, minute deduplication, and its timer.
  `StillClock.create({element, text, hour24})` returns `tick(hour24)`, `start()`, and
  `stop()`. Starting replaces the previous timer and suspends while hidden.
- `spatial-focus.js` owns directional target selection within the supplied scope.
  `StillFocus.next(scope, current, direction)` returns an element or null. It never
  changes focus itself; the application and remote adapter handle that action.
- `platform.js` owns device integration and browser preview fallbacks, including
  the current app identity. Feature policy should not call Tizen directly.
- `remote.js` owns key normalization, IME behavior, and animated focus reveal.
- `weather.js`, `moon.js`, and `appearance.js` own their respective domain logic.
- `settings.js`, `navigation.js`, `layout.js`, and `logos.js` provide specialized UI.

Dependencies are explicit script tags loaded before their consumers. New modules
use the existing `window.Still*` convention to remain compatible with the widget's
packaging. They do not require a bundler, package installation, or module loader.
`focus.js` is an older, unloaded focus-frame implementation, separate from
`spatial-focus.js`.

## Growing the app

Keep catalog rules pure and platform calls in the adapter. Add persistence
validation in the repository rather than scattering localStorage access across
new screens. Existing weather storage remains owned by the weather feature.

Extract additional screen controllers from `app.js` when adding larger features,
passing the elements and callbacks each controller needs. Application orchestration
and existing view rendering still live in `app.js`; this refactor establishes
boundaries without claiming every screen has already been separated.

Preserve lazy screen rendering, unchanged-catalog DOM reuse, and discovery request
generations: these protect remote focus and discard stale asynchronous results.
Avoid a global rerender for clock or audio updates.

## Verification

Run `node --test dashboard/tests/*.test.cjs` from the repository root. Module tests
exercise the public interfaces, saved-data failures, focus geometry, and timer
lifecycle. Catalog and performance regressions cover the extracted modules.
Browser preview: `python3 scripts/start.py preview`, then open localhost:8766.
Actual app launch, audio, and source switching need a physical TV for verification.
