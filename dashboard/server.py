"""Local TV dashboard. Serves only public assets; pairing token stays on the Mac."""
import json
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
import sys
import threading

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from samsung_tv import connect
ROOT = Path(__file__).parent / 'dist'
LOCK = threading.Lock()
KEYS = {'youtube':'KEY_YOUTUBE', 'netflix':'KEY_NETFLIX', 'prime':'KEY_AMAZON', 'source':'KEY_SOURCE', 'home':'KEY_HOME'}

class Handler(SimpleHTTPRequestHandler):
    def __init__(self,*args,**kwargs):
        super().__init__(*args,directory=str(ROOT),**kwargs)
    def do_POST(self):
        if self.path != '/api/launch':
            self.send_error(404); return
        # Only same-origin requests may use the local remote bridge.
        origin = self.headers.get('Origin')
        if origin and origin != 'http://' + self.headers.get('Host',''):
            self.send_error(403); return
        try:
            length = int(self.headers.get('Content-Length','0'))
            if not 0 < length < 256: raise ValueError('Invalid request')
            app = json.loads(self.rfile.read(length)).get('id')
            if app not in KEYS: raise ValueError('Unknown shortcut')
            with LOCK:
                connect({'method':'ms.remote.control','params':{'Cmd':'Click','DataOfCmd':KEYS[app],'Option':'false','TypeOfRemote':'SendRemoteKey'}})
            self.reply(200, {'sent':True})
        except ValueError as e:
            self.reply(400, {'error':str(e)})
        except Exception:
            self.reply(503, {'error':'Cannot reach the TV. Check power, Wi-Fi, and TV connection permission.'})
    def reply(self,status,data):
        raw=json.dumps(data).encode()
        self.send_response(status)
        self.send_header('Content-Type','application/json')
        self.send_header('Content-Length',str(len(raw)))
        self.end_headers();self.wfile.write(raw)

if __name__ == '__main__':
    print('Still dashboard: http://localhost:8765 — TV: http://10.0.0.68:8765',flush=True)
    ThreadingHTTPServer(('0.0.0.0',8765),Handler).serve_forever()
