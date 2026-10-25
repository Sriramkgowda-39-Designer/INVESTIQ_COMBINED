# Architecture

The first runnable release is a single-process local application. `main.py` serves a small browser dashboard and JSON endpoints using Python's standard-library HTTP server. pandas validates uploaded OHLCV data and builds features; scikit-learn trains separate random forest classifiers for 5, 10 and 15 minute horizons. Uploaded candles and model state remain in memory. Prediction records are written to `data/prediction_history.json`.

At startup, a background thread requests Yahoo Finance five-minute history for the selected NSE symbol, validates it, trains the three local models and repeats on a configurable interval. The browser can switch symbols or pause/resume polling through the local API. Status, chart series and saved predictions are served through GET endpoints. CSV remains an optional fallback. Yahoo data is not persisted by the app; it stays in memory. There is no trade execution or cloud resource creation.

For a future low-cost AWS deployment, separate static UI hosting (S3/CloudFront) from a short-lived inference API (API Gateway/Lambda), store permitted datasets and model artifacts in S3, and add DynamoDB only if multi-user prediction retention is needed. Package size, cold starts, market-data licensing and regional pricing must be reviewed before implementation. Do not treat this local release as a deployed serverless application.
