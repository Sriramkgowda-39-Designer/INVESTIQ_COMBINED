"""Export a simple price-history PNG for each processed stock (optional)."""
from pathlib import Path
import pandas as pd
import matplotlib.pyplot as plt

ROOT = Path(__file__).resolve().parents[2]


def main():
    source = ROOT / "data" / "processed"
    out = ROOT / "data" / "reports"
    out.mkdir(parents=True, exist_ok=True)
    for file in sorted(source.glob("*_clean.csv")):
        frame = pd.read_csv(file, parse_dates=["timestamp"])
        fig, ax = plt.subplots(figsize=(11, 4))
        ax.plot(frame.timestamp, frame.close, color="#138b7d", linewidth=1.5)
        ax.set(title=f"{file.stem.replace('_clean', '')} historical closes", xlabel="Timestamp", ylabel="Price")
        ax.grid(alpha=.2)
        fig.tight_layout()
        target = out / f"{file.stem.replace('_clean', '')}_price.png"
        fig.savefig(target, dpi=130)
        plt.close(fig)
        print(f"Saved {target.relative_to(ROOT)}")


if __name__ == "__main__": main()
