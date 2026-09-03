#!/usr/bin/env python3
"""
htpasswd_gen.py - Genera archivo .htpasswd para nginx
Uso: python3 htpasswd_gen.py [user] [pass]
"""
import sys
import subprocess
import os

USER = sys.argv[1] if len(sys.argv) > 1 else "maxbry"
PASS = sys.argv[2] if len(sys.argv) > 2 else "Navidad2026NCT"

htpasswd_line = subprocess.run(
    ["openssl", "passwd", "-apr1", PASS],
    capture_output=True, text=True
).stdout.strip()

htpasswd_content = f"{USER}:{htpasswd_line}\n"

with open("/workspace/.htpasswd", "w") as f:
    f.write(htpasswd_content)

print(f"Usuario: {USER}")
print(f"Password: {PASS}")
print(f"Guardado en /workspace/.htpasswd")
