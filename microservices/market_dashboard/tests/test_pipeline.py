"""Small contract checks; generated candles here are test fixtures, not market data."""
import unittest

import numpy as np
import pandas as pd

import main
from src.providers.yahoo import yahoo_frame_to_ohlcv


class PipelineTests(unittest.TestCase):
    def setUp(self):
        rng = np.random.default_rng(7)
        stamps = pd.date_range("2025-01-06 03:45:00+00:00", periods=220, freq="5min")
        close = 100 + np.cumsum(rng.normal(0, .4, len(stamps)))
        self.csv = pd.DataFrame({"timestamp": stamps, "open": close-rng.uniform(0, .2, len(stamps)), "high": close+.5, "low": close-.5, "close": close, "volume": rng.integers(100, 1000, len(stamps))}).to_csv(index=False)

    def test_csv_is_sorted_deduplicated_and_validated(self):
        frame = main._normalise_csv(self.csv)
        self.assertEqual(len(frame), 220)
        self.assertTrue(frame.timestamp.is_monotonic_increasing)
        with self.assertRaises(ValueError):
            main._normalise_csv("timestamp,open,high,low,close,volume\n2025-01-01,0,1,0,1,1\n" * 110)

    def test_three_horizons_train_and_return_holdout_metrics(self):
        frame = main._normalise_csv(self.csv)
        features, models, metrics = main._train("TEST", frame)
        self.assertEqual(set(models), {"5", "10", "15"})
        self.assertEqual(set(metrics), {"5", "10", "15"})
        self.assertGreater(len(features), 100)
        self.assertTrue(all(0 <= m["accuracy"] <= 1 and m["test_rows"] > 0 for m in metrics.values()))

    def test_yahoo_history_converts_to_expected_market_schema(self):
        history = pd.DataFrame({"Open": [100], "High": [102], "Low": [99], "Close": [101], "Volume": [900]}, index=pd.DatetimeIndex(["2026-10-14T04:00:00+05:30"], name="Datetime"))
        frame = yahoo_frame_to_ohlcv(history)
        self.assertEqual(list(frame.columns), ["timestamp", "open", "high", "low", "close", "volume"])
        self.assertEqual(frame.iloc[0].close, 101)


if __name__ == "__main__":
    unittest.main()
