# Weather scene verification

Browser screenshots. Version 1.9.0 was subsequently signed, directly installed on the Samsung TV, and launched successfully on October 22, 2026 (PID 18571). Physical TV appearance/performance confirmation remains pending.

Toronto live snapshot: October 22, 2026 at 1:15 PM EDT. Clear skies, 18.1°C. Sunrise 7:40 AM; sunset 6:22 PM.

Source: Open-Meteo forecast API; exact response saved in [toronto-live.json](toronto-live.json). Automatic IP city detection was rate-limited, so Toronto was selected by the user.

49 automated regression tests passed. Browser checks passed for 28 supported WMO codes × 4 solar phases (112 combinations), top-right anchoring, correct layer visibility, compact viewport and reduced motion. No browser JavaScript errors.

Sunrise/sunset tint spans 30 minutes before and after the local event, updates each minute, and stays beneath precipitation. Stale or missing solar dates use the reported day/night state without inventing sunrise/sunset. Saved weather remains marked offline.

115 full-size screenshots: 112 simulated weather/phase combinations plus live Toronto, compact layout and reduced motion. Simulations retain the live snapshot temperature; they are visual test fixtures, not forecasts. Representative scenes were visually inspected in the saved overview.

[Overview](overview.jpg) · [Live Toronto](screenshots/toronto-live.png) · [Compact](screenshots/compact.png) · [Reduced motion](screenshots/reduced-motion.png)

## All simulated scenes

- WMO 0: [sunrise](screenshots/wmo-00-sunrise.png) · [day](screenshots/wmo-00-day.png) · [sunset](screenshots/wmo-00-sunset.png) · [night](screenshots/wmo-00-night.png)
- WMO 1: [sunrise](screenshots/wmo-01-sunrise.png) · [day](screenshots/wmo-01-day.png) · [sunset](screenshots/wmo-01-sunset.png) · [night](screenshots/wmo-01-night.png)
- WMO 2: [sunrise](screenshots/wmo-02-sunrise.png) · [day](screenshots/wmo-02-day.png) · [sunset](screenshots/wmo-02-sunset.png) · [night](screenshots/wmo-02-night.png)
- WMO 3: [sunrise](screenshots/wmo-03-sunrise.png) · [day](screenshots/wmo-03-day.png) · [sunset](screenshots/wmo-03-sunset.png) · [night](screenshots/wmo-03-night.png)
- WMO 45: [sunrise](screenshots/wmo-45-sunrise.png) · [day](screenshots/wmo-45-day.png) · [sunset](screenshots/wmo-45-sunset.png) · [night](screenshots/wmo-45-night.png)
- WMO 48: [sunrise](screenshots/wmo-48-sunrise.png) · [day](screenshots/wmo-48-day.png) · [sunset](screenshots/wmo-48-sunset.png) · [night](screenshots/wmo-48-night.png)
- WMO 51: [sunrise](screenshots/wmo-51-sunrise.png) · [day](screenshots/wmo-51-day.png) · [sunset](screenshots/wmo-51-sunset.png) · [night](screenshots/wmo-51-night.png)
- WMO 53: [sunrise](screenshots/wmo-53-sunrise.png) · [day](screenshots/wmo-53-day.png) · [sunset](screenshots/wmo-53-sunset.png) · [night](screenshots/wmo-53-night.png)
- WMO 55: [sunrise](screenshots/wmo-55-sunrise.png) · [day](screenshots/wmo-55-day.png) · [sunset](screenshots/wmo-55-sunset.png) · [night](screenshots/wmo-55-night.png)
- WMO 56: [sunrise](screenshots/wmo-56-sunrise.png) · [day](screenshots/wmo-56-day.png) · [sunset](screenshots/wmo-56-sunset.png) · [night](screenshots/wmo-56-night.png)
- WMO 57: [sunrise](screenshots/wmo-57-sunrise.png) · [day](screenshots/wmo-57-day.png) · [sunset](screenshots/wmo-57-sunset.png) · [night](screenshots/wmo-57-night.png)
- WMO 61: [sunrise](screenshots/wmo-61-sunrise.png) · [day](screenshots/wmo-61-day.png) · [sunset](screenshots/wmo-61-sunset.png) · [night](screenshots/wmo-61-night.png)
- WMO 63: [sunrise](screenshots/wmo-63-sunrise.png) · [day](screenshots/wmo-63-day.png) · [sunset](screenshots/wmo-63-sunset.png) · [night](screenshots/wmo-63-night.png)
- WMO 65: [sunrise](screenshots/wmo-65-sunrise.png) · [day](screenshots/wmo-65-day.png) · [sunset](screenshots/wmo-65-sunset.png) · [night](screenshots/wmo-65-night.png)
- WMO 66: [sunrise](screenshots/wmo-66-sunrise.png) · [day](screenshots/wmo-66-day.png) · [sunset](screenshots/wmo-66-sunset.png) · [night](screenshots/wmo-66-night.png)
- WMO 67: [sunrise](screenshots/wmo-67-sunrise.png) · [day](screenshots/wmo-67-day.png) · [sunset](screenshots/wmo-67-sunset.png) · [night](screenshots/wmo-67-night.png)
- WMO 71: [sunrise](screenshots/wmo-71-sunrise.png) · [day](screenshots/wmo-71-day.png) · [sunset](screenshots/wmo-71-sunset.png) · [night](screenshots/wmo-71-night.png)
- WMO 73: [sunrise](screenshots/wmo-73-sunrise.png) · [day](screenshots/wmo-73-day.png) · [sunset](screenshots/wmo-73-sunset.png) · [night](screenshots/wmo-73-night.png)
- WMO 75: [sunrise](screenshots/wmo-75-sunrise.png) · [day](screenshots/wmo-75-day.png) · [sunset](screenshots/wmo-75-sunset.png) · [night](screenshots/wmo-75-night.png)
- WMO 77: [sunrise](screenshots/wmo-77-sunrise.png) · [day](screenshots/wmo-77-day.png) · [sunset](screenshots/wmo-77-sunset.png) · [night](screenshots/wmo-77-night.png)
- WMO 80: [sunrise](screenshots/wmo-80-sunrise.png) · [day](screenshots/wmo-80-day.png) · [sunset](screenshots/wmo-80-sunset.png) · [night](screenshots/wmo-80-night.png)
- WMO 81: [sunrise](screenshots/wmo-81-sunrise.png) · [day](screenshots/wmo-81-day.png) · [sunset](screenshots/wmo-81-sunset.png) · [night](screenshots/wmo-81-night.png)
- WMO 82: [sunrise](screenshots/wmo-82-sunrise.png) · [day](screenshots/wmo-82-day.png) · [sunset](screenshots/wmo-82-sunset.png) · [night](screenshots/wmo-82-night.png)
- WMO 85: [sunrise](screenshots/wmo-85-sunrise.png) · [day](screenshots/wmo-85-day.png) · [sunset](screenshots/wmo-85-sunset.png) · [night](screenshots/wmo-85-night.png)
- WMO 86: [sunrise](screenshots/wmo-86-sunrise.png) · [day](screenshots/wmo-86-day.png) · [sunset](screenshots/wmo-86-sunset.png) · [night](screenshots/wmo-86-night.png)
- WMO 95: [sunrise](screenshots/wmo-95-sunrise.png) · [day](screenshots/wmo-95-day.png) · [sunset](screenshots/wmo-95-sunset.png) · [night](screenshots/wmo-95-night.png)
- WMO 96: [sunrise](screenshots/wmo-96-sunrise.png) · [day](screenshots/wmo-96-day.png) · [sunset](screenshots/wmo-96-sunset.png) · [night](screenshots/wmo-96-night.png)
- WMO 99: [sunrise](screenshots/wmo-99-sunrise.png) · [day](screenshots/wmo-99-day.png) · [sunset](screenshots/wmo-99-sunset.png) · [night](screenshots/wmo-99-night.png)

Reproduce using `NODE_PATH` pointing to an installed Playwright package, then `node dashboard/tools/check-weather.cjs`. The browser harness uses the saved API response and synthetic weather codes; it makes no external network requests.
