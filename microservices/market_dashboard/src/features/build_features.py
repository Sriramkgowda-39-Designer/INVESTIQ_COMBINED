"""Build technical features for every cleaned OHLCV CSV."""
from pathlib import Path
import sys
import pandas as pd

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))
from main import _make_features


def main():
    source = ROOT / "data" / "processed"
    out = ROOT / "data" / "features"
    out.mkdir(parents=True, exist_ok=True)
    files = sorted(source.glob("*_clean.csv"))
    if not files:
        print("No cleaned CSV files. Run src/preprocessors/clean_data.py first.")
        return
    for file in files:
        frame = pd.read_csv(file, parse_dates=["timestamp"])
        result = _make_features(frame)
        target = out / f"{file.stem.replace('_clean', '')}_features.csv"
        result.to_csv(target, index=False)
        print(f"{target.relative_to(ROOT)}: {len(result)} rows")


if __name__ == "__main__": main()
