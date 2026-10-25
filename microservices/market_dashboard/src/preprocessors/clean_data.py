"""Validate raw CSV files and write cleaned OHLCV candles."""
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))
from main import _normalise_csv


def main():
    raw = ROOT / "data" / "raw"
    out = ROOT / "data" / "processed"
    out.mkdir(parents=True, exist_ok=True)
    files = sorted(raw.glob("*.csv"))
    if not files:
        print("No raw CSV files. Import one with: python src/extractors/extract_data.py FILE.csv --symbol TCS")
        return
    for file in files:
        try:
            frame = _normalise_csv(file.read_text(encoding="utf-8-sig"))
            target = out / f"{file.stem.replace('_raw', '')}_clean.csv"
            frame.to_csv(target, index=False)
            print(f"{target.relative_to(ROOT)}: {len(frame)} valid candles")
        except Exception as exc:
            print(f"Skipped {file.name}: {exc}")


if __name__ == "__main__": main()
