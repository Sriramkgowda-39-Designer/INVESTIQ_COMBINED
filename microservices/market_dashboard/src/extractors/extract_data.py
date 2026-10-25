"""Import a user-provided, licensed OHLCV CSV; no market scraper is used."""
import argparse
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("csv", help="Path to a permitted historical OHLCV CSV")
    parser.add_argument("--symbol", required=True, help="Provider symbol, e.g. TCS")
    args = parser.parse_args()
    source = Path(args.csv).expanduser().resolve()
    if not source.is_file(): parser.error(f"CSV not found: {source}")
    target = ROOT / "data" / "raw" / f"{args.symbol.upper()}_raw.csv"
    target.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(source, target)
    print(f"Imported {source.name} to {target.relative_to(ROOT)}")


if __name__ == "__main__": main()
