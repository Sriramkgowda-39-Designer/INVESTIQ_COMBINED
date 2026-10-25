# Modeling

The runnable baseline computes lagged returns, RSI, MACD, EMA spread, ATR percent, relative volume, VWAP distance, candle range and minute of day. It trains separate random forests for the next one, two or three rows (5/10/15 minutes when the input cadence is five minutes).

Rows remain chronological: 70% fit, 15% validation reserve, 15% final holdout. Holdout accuracy, balanced accuracy and majority-class accuracy are reported. The model then refits on all available labeled rows for the latest inference. A forest's class score is not calibrated probability; the UI labels it as an uncalibrated score. It abstains below 55% maximum class score. No expected price is returned because a separately evaluated regression model has not been built.

The old starter advertised XGBoost but did not supply a working, leakage-safe pipeline. The local implementation selects scikit-learn to run in this environment. Chronos and Bedrock are not included. Model quality must be assessed on representative, licensed intraday data and against baselines before any real-world use.
