#!/usr/bin/env python3
"""Preview Still locally or launch an already installed TV widget."""

import argparse
import functools
import http.server
from pathlib import Path
import shutil
import subprocess

ROOT = Path(__file__).resolve().parents[1]


def executable(override, name, bundled):
    candidate = override or shutil.which(name) or str(ROOT / bundled)
    if not Path(candidate).is_file():
        raise SystemExit(f"Cannot find {name}. Install the Tizen tools or pass --{name} /absolute/path/{name}.")
    return candidate


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    commands = parser.add_subparsers(dest="command", required=True)
    preview = commands.add_parser("preview", help="Serve the current UI on localhost")
    preview.add_argument("--port", type=int, default=8766)
    tv = commands.add_parser("tv", help="Connect and launch Still on an awake TV")
    tv.add_argument("--host", required=True, help="TV IP address, e.g. 10.0.0.4")
    tv.add_argument("--port", type=int, default=26101)
    tv.add_argument("--sdb", help="Absolute path to the SDK sdb executable")
    tv.add_argument("--tz", help="Absolute path to the SDK tz executable")
    args = parser.parse_args()
    if not 1 <= args.port <= 65535:
        parser.error("--port must be between 1 and 65535")
    if args.command == "preview":
        handler = functools.partial(http.server.SimpleHTTPRequestHandler,
                                    directory=str(ROOT / "dashboard/tizen"))
        with http.server.ThreadingHTTPServer(("127.0.0.1", args.port), handler) as server:
            print(f"Still preview: http://127.0.0.1:{args.port} — Ctrl+C to stop", flush=True)
            try:
                server.serve_forever()
            except KeyboardInterrupt:
                pass
        return
    if not args.host or args.host.startswith("-") or any(c.isspace() for c in args.host):
        parser.error("--host must be a TV IP address or hostname")
    sdb = executable(args.sdb, "sdb", ".tools/tizen-studio/tools/sdb")
    tz = executable(args.tz, "tz", ".tools/tizen-studio/tools/tizen-core/tz")
    endpoint = f"{args.host}:{args.port}"
    try:
        subprocess.run([sdb, "connect", endpoint], check=True, timeout=30)
        subprocess.run([tz, "run", "-p", "StillHome1", "-e", endpoint],
                       check=True, timeout=60)
    except (OSError, subprocess.SubprocessError) as error:
        raise SystemExit(f"Launch failed: {error}\nCheck Developer Mode, host PC IP, network, and that Still is installed.")
    print("Launch command completed. Check the TV screen for Still.")


if __name__ == "__main__":
    main()
