# Data requirements

Automatic source: Yahoo Finance via `yfinance`, using NSE tickers such as `RELIANCE.NS`. The app downloads five-minute candles for the latest month on startup and refreshes the selected stock every five minutes. Yahoo's intraday history is limited to recent data (the provider library documents a 60-day maximum). Data may be delayed or unavailable and is for personal research use only; do not redistribute it or expose it through a public service without verifying Yahoo's terms.

CSV fallback: upload one candle per row with `timestamp` (or `date`), `open`, `high`, `low`, `close`, and `volume`. Column names are case-insensitive. Timestamps must be parseable; prices must be positive; volume must be nonnegative; high/low must contain the open and close. Five-minute candles are required for the named horizon interpretation. Provide at least 100 valid records (more is strongly recommended).

Rows with missing or malformed values and invalid OHLC ranges are removed. Rows are sorted by timestamp, and duplicate timestamps keep the last row. Prices are never interpolated or forward-filled. The UI shows the source data's most recent timestamp and labels all output historical. The app does not infer holidays, repair sessions, or verify provider symbol formats; the uploader is responsible for a consistent market session and licensed data.
