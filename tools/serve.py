"""Servidor estático de desarrollo.

Equivale a `python3 -m http.server`, pero con una cola de conexiones mayor:
el servidor estándar acepta solo 5 conexiones pendientes y, como el navegador
descarga en paralelo muchos módulos ES, algunas peticiones podían rechazarse
de forma intermitente ("Failed to fetch dynamically imported module").

Uso:  python3 tools/serve.py [puerto]      (por defecto, 8000)
"""

import functools
import http.server
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


class Server(http.server.ThreadingHTTPServer):
    request_queue_size = 128
    daemon_threads = True


class Handler(http.server.SimpleHTTPRequestHandler):
    extensions_map = {
        **http.server.SimpleHTTPRequestHandler.extensions_map,
        ".js": "text/javascript",
        ".json": "application/json",
        ".svg": "image/svg+xml",
    }

    def end_headers(self):
        # Evita servir versiones antiguas mientras se edita el contenido.
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def log_message(self, format, *args):
        if "--quiet" not in sys.argv:
            super().log_message(format, *args)


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    port = int(args[0]) if args else 8000
    handler = functools.partial(Handler, directory=str(ROOT))
    with Server(("127.0.0.1", port), handler) as httpd:
        print(f"Sirviendo {ROOT} en http://127.0.0.1:{port}/  (Ctrl+C para detener)")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            pass


if __name__ == "__main__":
    main()
