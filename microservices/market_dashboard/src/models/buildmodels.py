"""Train horizon models and save diagnostics/model artifacts locally."""
from pathlib import Path
import sys
import json
import joblib
import pandas as pd

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))
from main import _normalise_csv, _train


def main():
    source = ROOT / "data" / "raw"
    out = ROOT / "data" / "models"
    reports = ROOT / "data" / "reports"
    out.mkdir(parents=True, exist_ok=True)
    reports.mkdir(parents=True, exist_ok=True)
    files = sorted(source.glob("*.csv"))
    if not files:
        print("No raw CSV files. Import one with src/extractors/extract_data.py first.")
        return
    for file in files:
        symbol = file.stem.replace("_raw", "").upper()
        try:
            frame = _normalise_csv(file.read_text(encoding="utf-8-sig"))
            _, models, metrics = _train(symbol, frame)
            joblib.dump(models, out / f"{symbol}_models.joblib")
            (reports / f"{symbol}_metrics.json").write_text(json.dumps(metrics, indent=2), encoding="utf-8")
            print(f"{symbol}: holdout evaluation saved for {', '.join(metrics)} minute horizons")
        except Exception as exc:
            print(f"Skipped {symbol}: {exc}")


if __name__ == "__main__": main()
