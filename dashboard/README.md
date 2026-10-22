# Still TV dashboard

Run from the project folder:

```sh
python3 dashboard/server.py
```

Open http://localhost:8765 on the Mac, or http://10.0.0.68:8765 in the TV's Internet browser. Bookmark the address on the TV. Both devices must stay on the same network and the Mac must remain awake. If the Mac's network address changes, use its new address instead.

Features: live local clock/date, remote arrow navigation, editable room name and reminder, 12/24-hour time, and ambient clock mode. Settings are saved in each browser's local storage.

TV shortcuts send Samsung remote commands for YouTube, Netflix, Prime Video, source selection, and Home. The TV did not return its installed-app list, so individual streaming shortcuts remain unverified; use All TV apps if a shortcut is unsupported. The service confirms command delivery, not that the target app appeared. Native Home and input selection leave the dashboard. Return using the TV browser bookmark.

This is a browser dashboard, not a replacement for Samsung's system launcher, and it is not configured to launch when the TV powers on. No TV firmware or startup settings were changed.

Only dist/ is served. The pairing token remains in the parent project's ignored .tv-connection.json, outside the web root. The server is intended for a trusted home network; do not expose port 8765 to the internet.
