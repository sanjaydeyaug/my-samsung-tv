import base64
import json
import os
from pathlib import Path
import socket
import ssl
import struct
import time

HOST = '10.0.0.4'
CONFIG = Path(__file__).with_name('.tv-connection.json')

def connect(command=None):
    config = json.loads(CONFIG.read_text()) if CONFIG.exists() else {}
    name = base64.b64encode(b'Codex TV Remote').decode()
    path = '/api/v2/channels/samsung.remote.control?name=' + name
    if config.get('token'):
        path += '&token=' + config['token']
    context = ssl._create_unverified_context()  # TV uses a self-signed certificate.
    connection = context.wrap_socket(socket.create_connection((HOST, 8002), timeout=10), server_hostname=HOST)
    connection.settimeout(50)
    key = base64.b64encode(os.urandom(16)).decode()
    connection.sendall((f'GET {path} HTTP/1.1\r\nHost: {HOST}:8002\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Key: {key}\r\nSec-WebSocket-Version: 13\r\n\r\n').encode())
    def read(n):
        data = b''
        while len(data) < n:
            part = connection.recv(n - len(data))
            if not part:
                raise ConnectionError('TV closed the connection')
            data += part
        return data
    header = b''
    while not header.endswith(b'\r\n\r\n'):
        header += read(1)
    if b' 101 ' not in header.split(b'\r\n')[0]:
        raise ConnectionError(header.decode())
    deadline = time.monotonic() + 50
    sent = False
    while time.monotonic() < deadline:
        first, second = read(2)
        length = second & 127
        if length == 126:
            length = struct.unpack('!H', read(2))[0]
        elif length == 127:
            length = struct.unpack('!Q', read(8))[0]
        mask = read(4) if second & 128 else None
        payload = read(length)
        if mask:
            payload = bytes(b ^ mask[i % 4] for i, b in enumerate(payload))
        if first & 15 == 8:
            raise ConnectionError('TV closed the connection')
        if first & 15 != 1:
            continue
        event = json.loads(payload)
        print('TV event:', event.get('event'), flush=True)
        if sent and event.get('event') == 'ed.installedApp.get':
            connection.close()
            return event.get('data', {}).get('data', [])
        if event.get('event') == 'ms.channel.connect':
            token = event.get('data', {}).get('token') or config.get('token')
            CONFIG.write_text(json.dumps({'host': HOST, 'token': token}, indent=2))
            CONFIG.chmod(0o600)
            print('Connected successfully; pairing saved locally.', flush=True)
            if command:
                payload = json.dumps(command).encode()
                mask = os.urandom(4)
                length = len(payload)
                header = bytes([0x81, 0x80 | length]) if length < 126 else bytes([0x81, 0x80 | 126]) + struct.pack('!H', length)
                connection.sendall(header + mask + bytes(b ^ mask[i % 4] for i, b in enumerate(payload)))
                if command.get('params', {}).get('event') == 'ed.installedApp.get':
                    sent = True
                    connection.settimeout(10)
                    continue
                time.sleep(0.5)
            connection.close()
            return
        if event.get('event') in ('ms.channel.unauthorized', 'ms.channel.timeOut'):
            raise ConnectionError('Approve Codex TV Remote on the television, then retry.')
    raise TimeoutError('TV approval timed out')

if __name__ == '__main__':
    connect()
