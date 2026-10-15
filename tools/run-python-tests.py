"""Ejecuta tests/python.html en Chrome sin interfaz y espera a su resultado.

La página descarga Pyodide (Python en WebAssembly) y ejecuta todos los ejemplos
de las lecciones, así que necesita conexión a internet y tarda más que las demás
pruebas. Uso: python3 tools/run-python-tests.py URL_BASE CHROME
"""
import html
import json
import shutil
import subprocess
import sys
import tempfile
import time
import urllib.request

base, chrome = sys.argv[1], sys.argv[2]
profile = tempfile.mkdtemp()
port = 9333
proc = subprocess.Popen([chrome, "--headless=new", "--disable-gpu", "--no-first-run", f"--user-data-dir={profile}",
                         f"--remote-debugging-port={port}", f"{base}/tests/python.html"],
                        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
title = ""
try:
    deadline = time.time() + 300
    while time.time() < deadline:
        time.sleep(2)
        try:
            pages = json.load(urllib.request.urlopen(f"http://127.0.0.1:{port}/json", timeout=5))
        except OSError:
            continue
        titles = [p.get("title", "") for p in pages if p.get("type") == "page"]
        done = [t for t in titles if t.startswith("RESULT ")]
        if done:
            title = done[0]
            break
finally:
    proc.terminate()
    shutil.rmtree(profile, ignore_errors=True)

if not title:
    print("python.html        sin resultado (¿sin conexión para descargar Pyodide?)")
    sys.exit(1)
head, summary, details = (html.unescape(title).split(" | ", 2) + ["", ""])[:3]
status = head.replace("RESULT ", "").strip()
print(f"python.html        {status}  ({summary})")
for d in json.loads(details or "[]"):
    print("   ", d)
sys.exit(0 if status == "pass" else 1)
