# Local API

All endpoints are available at `http://127.0.0.1:8000` while `python main.py` is running.

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/status` | Historical mode, loaded symbol, data timestamp and metrics |
| GET | `/api/series` | Most recent 120 uploaded timestamps and closes |
| GET | `/api/history` | Saved local predictions |
| POST | `/api/market/start` | Start/replace automatic Yahoo Finance polling; JSON `{ "symbol": "RELIANCE" }` |
| POST | `/api/market/stop` | Pause Yahoo Finance polling |
| POST | `/api/upload` | JSON body `{ "symbol": "TCS", "csv": "...CSV text..." }` |
| POST | `/api/predict` | JSON body `{ "horizon": 5 }`; horizon is 5, 10 or 15 |
| POST | `/api/explain` | Optional Bedrock explanation; same horizon body |

Errors return JSON `{ "error": "..." }` with HTTP 400 for invalid uploads or requests. Uploads are capped at 15 MB. Yahoo Finance polling runs in the local app process, with a default 300-second interval and a 60-second minimum. This development server binds to loopback only and is not intended to be exposed to the internet.
