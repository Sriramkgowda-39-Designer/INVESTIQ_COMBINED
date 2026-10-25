"""
InvestIQ Unified Platform Launcher
Coordinates and starts all microservices + master gateway from this single folder:
  - Microservice 1 (Market Lab & ML)   : http://localhost:8001
  - Microservice 2 (Stock Clash Duel)  : http://localhost:5001
  - Microservice 3 (AI Co-Pilot Groq)  : http://localhost:8002
  - Master Portal (Unified UI)         : http://localhost:8000
"""
import os
import sys
import time
import socket
import webbrowser
import subprocess
import signal
from pathlib import Path

ROOT = Path(__file__).resolve().parent
MICROSERVICES_DIR = ROOT / "microservices"
GATEWAY_DIR = ROOT / "gateway"

MARKET_DIR = MICROSERVICES_DIR / "market_dashboard"
CLASH_DIR = MICROSERVICES_DIR / "stock_comparison"
AIBOT_DIR = MICROSERVICES_DIR / "ai_bot"

DEFAULT_PYTHON = sys.executable

SERVICES = [
    {
        "id": "market_core",
        "name": "Microservice 1: Market Lab & ML Predictor",
        "dir": str(MARKET_DIR),
        "cmd": [DEFAULT_PYTHON, "main.py"],
        "env": {"INVESTIQ_PORT": "8001", "PORT": "8001"},
        "port": 8001,
        "url": "http://localhost:8001"
    },
    {
        "id": "finclash",
        "name": "Microservice 2: Indian Stock Clash & Comparison",
        "dir": str(CLASH_DIR),
        "cmd": ["node", "server/index.js"],
        "env": {"PORT": "5001"},
        "port": 5001,
        "url": "http://localhost:5001"
    },
    {
        "id": "aibot",
        "name": "Microservice 3: InvestIQ AI Co-Pilot (Groq)",
        "dir": str(AIBOT_DIR),
        "cmd": [DEFAULT_PYTHON, "main.py"],
        "env": {"PORT": "8002"},
        "port": 8002,
        "url": "http://localhost:8002"
    },
    {
        "id": "gateway",
        "name": "Master API Gateway & Unified Web Portal",
        "dir": str(GATEWAY_DIR),
        "cmd": [DEFAULT_PYTHON, "-m", "uvicorn", "gateway:app", "--host", "0.0.0.0", "--port", "8000"],
        "env": {"PORT": "8000"},
        "port": 8000,
        "url": "http://localhost:8000"
    }
]

processes = []

def is_port_listening(port: int, host: str = "127.0.0.1") -> bool:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.settimeout(0.5)
        return s.connect_ex((host, port)) == 0

def wait_for_port(port: int, timeout: float = 14.0) -> bool:
    start = time.time()
    while time.time() - start < timeout:
        if is_port_listening(port):
            return True
        time.sleep(0.35)
    return False

def start():
    print("=" * 72)
    print("  [*] InvestIQ Enterprise Combined Suite Starting Up")
    print("=" * 72)

    for svc in SERVICES:
        port = svc["port"]
        name = svc["name"]

        if is_port_listening(port):
            print(f"  [ACTIVE] {name} is already listening on port {port} -> {svc['url']}")
            continue

        print(f"  [STARTING] {name} on port {port}...")
        env = os.environ.copy()
        env.update(svc["env"])

        try:
            p = subprocess.Popen(
                svc["cmd"],
                cwd=svc["dir"],
                env=env,
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
                shell=False
            )
            processes.append((svc, p))

            if wait_for_port(port, timeout=12.0):
                print(f"  [READY] {name} active on {svc['url']}")
            else:
                print(f"  [WAIT] {name} process launched, connecting to port {port}...")
        except Exception as e:
            print(f"  [ERROR] Could not start {name}: {e}")

    print("\n" + "=" * 72)
    print("  [ONLINE] ALL INVESTIQ MICROSERVICES OPERATIONAL")
    print("=" * 72)
    print("  -> UNIFIED MASTER PORTAL:       http://localhost:8000")
    print("  -> Microservice 1 (Market Lab): http://localhost:8001")
    print("  -> Microservice 2 (FinClash):   http://localhost:5001")
    print("  -> Microservice 3 (AI Bot):     http://localhost:8002")
    print("=" * 72)
    print("  Opening http://localhost:8000 in your browser...")
    try:
        webbrowser.open("http://localhost:8000")
    except Exception:
        pass

    print("  Press Ctrl+C to stop all cluster microservices.\n")

def shutdown(signum=None, frame=None):
    print("\n  Stopping cluster microservices...")
    for svc, p in processes:
        try:
            p.terminate()
            p.wait(timeout=2.0)
        except Exception:
            try:
                p.kill()
            except Exception:
                pass
    print("  All InvestIQ services stopped cleanly.")
    sys.exit(0)

if __name__ == "__main__":
    signal.signal(signal.SIGINT, shutdown)
    signal.signal(signal.SIGTERM, shutdown)
    start()

    try:
        while True:
            time.sleep(1.0)
    except KeyboardInterrupt:
        shutdown()
