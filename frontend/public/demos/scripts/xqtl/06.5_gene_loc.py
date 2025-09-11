import pandas as pd
from pathlib import Path
from glob import glob
import re
import time


def safe_filename(name):
    return re.sub(r"[^a-zA-Z0-9_\-]", "_", name)

print("Collecting unique genes from celltype parquet files...")
files = sorted(glob("celltypes/*.parquet"))
unique_genes = set()
start_time = time.time()

for filepath in files:
    df = pd.read_parquet(filepath, columns=["gene_id"])
    unique_genes.update(df["gene_id"].unique())

print(
    f"Found {len(unique_genes):,} unique genes in {time.time()-start_time:.2f} seconds"
)

print("Parsing gene locations...")
chrom_data = {}
invalid_genes = 0

for gene in unique_genes:
    try:
        chrom, start, end = gene.split("-")[:3]
        entry = {
            "gene_id": gene,
            "position_start": int(start),
            "position_end": int(end),
            "strand": "x",
        }
        chrom_data.setdefault(chrom, []).append(entry)
    except Exception:
        invalid_genes += 1

if invalid_genes:
    print(f"Skipped {invalid_genes:,} invalid gene IDs")

# Write to gene_locations as Parquet
output_dir = Path("gene_locations")
output_dir.mkdir(exist_ok=True)

print("Writing gene location parquet files...")
for chrom, entries in chrom_data.items():
    df = pd.DataFrame(entries)
    df.drop_duplicates(
        subset=["gene_id", "position_start", "position_end", "strand"], inplace=True
    )
    out_path = output_dir / f"{chrom}.parquet"
    df.to_parquet(out_path, index=False)
    print(f"  - {chrom}: {len(df):,} entries")

print("Done.")
