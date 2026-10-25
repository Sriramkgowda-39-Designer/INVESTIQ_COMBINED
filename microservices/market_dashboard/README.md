# InvestIQ

InvestIQ is a local market research dashboard for selected Indian equities. It fetches price history automatically, displays line or candlestick charts across multiple timeframes, and provides experimental price predictions.

## Run locally

Requirements: Python 3.10 or newer and network access for market data.

```powershell
python -m pip install -r requirements.txt
python main.py
```

Open [http://127.0.0.1:8000](http://127.0.0.1:8000). The dashboard starts the automatic feed for Reliance. Select another stock and use **Start automatic feed** to switch the live feed. It refreshes every five minutes by default. Set `AUTO_FETCH_SYMBOL` or `YAHOO_POLL_SECONDS` in a local `.env` file to change those defaults. `.env` and local market data are excluded from Git.

Price history supports 1 day, 1 week, 1 month, 1 year, 3 years, and 5 years, with line and candlestick views. Yahoo Finance provides the charts and intraday feed. A public NSE daily-history source is used as a fallback for longer ranges. Each chart shows its source and latest candle time. The CSV upload remains available for historical datasets.

## Price predictions

Predictions are generated for the currently selected stock and the chosen 1 day, 2 day, 3 day, or 1 week horizon. The first prediction for a stock may take longer while its model is trained; trained models are cached for later requests. The dashboard displays the estimated target price, estimated range, expected change, direction, and target date. Predictions are experimental research output, not guaranteed prices or investment advice.

## Project notes

- `main.py` runs the local web application and API.
- `src/providers/` contains market data adapters.
- `web/index.html` contains the dashboard UI.
- `API.md`, `ARCHITECTURE.md`, `MODELING.md`, and `DATA_REQUIREMENTS.md` describe the implementation and API.
- `AWS_DEPLOYMENT.md` and `COST_ESTIMATE.md` cover optional AWS deployment.

There is no trade execution. Market data may be delayed or unavailable. Review Yahoo Finance and provider terms before using the data beyond personal research.
