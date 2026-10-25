# Backtesting

The current evaluation is a chronological classification holdout, not a trading strategy backtest. It reports direction accuracy, balanced accuracy, test sample count and a majority-class baseline independently for each horizon. It does not include transaction costs, slippage, fills, capital constraints, overlapping-position logic or returns. It therefore makes no claim about profitability.

Prediction history stores locally generated inference outputs in `data/prediction_history.json` (up to the latest 1,000 records). Historical outcome matching and rolling re-evaluation are future work.
