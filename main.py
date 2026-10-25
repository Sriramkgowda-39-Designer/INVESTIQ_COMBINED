"""
InvestIQ Main Application Entrypoint
Running `python main.py` runs the entire unified platform!
"""
from run import start, shutdown
import signal
import time

if __name__ == "__main__":
    signal.signal(signal.SIGINT, shutdown)
    signal.signal(signal.SIGTERM, shutdown)
    start()

    try:
        while True:
            time.sleep(1.0)
    except KeyboardInterrupt:
        shutdown()
