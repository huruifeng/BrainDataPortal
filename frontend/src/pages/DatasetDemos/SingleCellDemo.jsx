import { Link } from "react-router-dom"

const SingleCellDemo = () => {
  return (
    <div className="docs-container">
      <header className="docs-header">
        <div className="container">
          <Link to="/help/howtouse/demos" className="back-link">
            ← Back to Documentation
          </Link>
          <h1>Single-Cell Data Preparation</h1>
          <p className="subtitle">Step-by-step guide for preparing single-cell RNA-seq data</p>
        </div>
      </header>

      <main className="container">
        <div className="docs-content">
          <div className="tutorial-nav">
            <h3>Table of Contents</h3>
            <ul>
              <li>
                <a href="#overview">Overview</a>
              </li>
              <li>
                <a href="#demo-data">1. Obtaining Demo Data</a>
              </li>
              <li>
                <a href="#data-loading">2. Data Loading and Initial Inspection</a>
              </li>
              <li>
                <a href="#quality-control">3. Quality Control</a>
              </li>
              <li>
                <a href="#filtering">4. Cell and Gene Filtering</a>
              </li>
              <li>
                <a href="#normalization">5. Normalization</a>
              </li>
              <li>
                <a href="#feature-selection">6. Feature Selection</a>
              </li>
              <li>
                <a href="#data-export">7. Data Export for BrainDataPortal</a>
              </li>
              <li>
                <a href="#troubleshooting">Troubleshooting</a>
              </li>
            </ul>
          </div>

          <section id="overview" className="tutorial-section">
            <h2>Overview</h2>
            <p>
              This tutorial will guide you through the complete process of preparing single-cell RNA-seq data for
              analysis in BrainDataPortal. We'll use a publicly available brain dataset as an example and cover all
              essential preprocessing steps.
            </p>
            <div className="info-box">
              <h4>Prerequisites</h4>
              <ul>
                <li>Python 3.8+ with pandas, numpy, scanpy installed</li>
                <li>R 4.0+ with Seurat package (optional)</li>
                <li>Basic understanding of single-cell RNA-seq concepts</li>
              </ul>
            </div>
          </section>

          <section id="demo-data" className="tutorial-section">
            <h2>1. Obtaining Demo Data</h2>
            <p>
              We'll use a publicly available single-cell dataset from the adult mouse brain. This dataset contains
              approximately 10,000 cells from various brain regions.
            </p>

            <h3>Option A: Download from 10x Genomics</h3>
            <div className="code-block">
              <pre>
                <code>{`# Download the demo dataset
wget https://cf.10xgenomics.com/samples/cell/pbmc3k/pbmc3k_filtered_gene_bc_matrices.tar.gz

# Extract the files
tar -xzf pbmc3k_filtered_gene_bc_matrices.tar.gz

# Directory structure should look like:
# filtered_gene_bc_matrices/
# └── hg19/
#     ├── barcodes.tsv
#     ├── genes.tsv
#     └── matrix.mtx`}</code>
              </pre>
            </div>

            <h3>Option B: Use scanpy's built-in datasets</h3>
            <div className="code-block">
              <pre>
                <code>{`import scanpy as sc
import pandas as pd
import numpy as np

# Download and load the PBMC dataset
adata = sc.datasets.pbmc3k_processed()
print(f"Dataset shape: {adata.shape}")
print(f"Genes: {adata.n_vars}, Cells: {adata.n_obs}")`}</code>
              </pre>
            </div>

            <h3>Option C: Load your own 10x data</h3>
            <div className="code-block">
              <pre>
                <code>{`# If you have your own 10x data
adata = sc.read_10x_mtx(
    'path/to/filtered_gene_bc_matrices/hg19/',  # Path to the mtx file
    var_names='gene_symbols',                   # use gene symbols for gene names
    cache=True                                  # write a cache file for faster subsequent reading
)

# Make variable names unique (in case there are duplicates)
adata.var_names_unique()`}</code>
              </pre>
            </div>
          </section>

          <section id="data-loading" className="tutorial-section">
            <h2>2. Data Loading and Initial Inspection</h2>
            <p>
              Once you have the data, let's load it and perform initial inspection to understand the dataset structure.
            </p>

            <div className="code-block">
              <pre>
                <code>{`import scanpy as sc
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

# Set scanpy settings
sc.settings.verbosity = 3  # verbosity level
sc.settings.set_figure_params(dpi=80, facecolor='white')

# Load the data (using Option B from above)
adata = sc.datasets.pbmc3k()

# Basic information about the dataset
print("Dataset Information:")
print(f"Number of cells: {adata.n_obs}")
print(f"Number of genes: {adata.n_vars}")
print(f"Data type: {type(adata.X)}")

# Look at the first few cells and genes
print("\\nFirst 5 cells:")
print(adata.obs.head())
print("\\nFirst 5 genes:")
print(adata.var.head())

# Check if data is sparse
print(f"\\nData sparsity: {(adata.X == 0).sum() / (adata.X.shape[0] * adata.X.shape[1]):.2%}")`}</code>
              </pre>
            </div>

            <div className="warning-box">
              <h4>Important Note</h4>
              <p>
                Single-cell data is typically very sparse (90-95% zeros). This is normal and expected due to technical
                limitations and biological factors like transcriptional bursting.
              </p>
            </div>
          </section>

          <section id="quality-control" className="tutorial-section">
            <h2>3. Quality Control</h2>
            <p>
              Quality control is crucial for identifying low-quality cells and genes that might affect downstream
              analysis.
            </p>

            <h3>Calculate QC Metrics</h3>
            <div className="code-block">
              <pre>
                <code>{`# Calculate QC metrics
# Mitochondrial genes (important for cell viability)
adata.var['mt'] = adata.var_names.str.startswith('MT-')

# Ribosomal genes
adata.var['ribo'] = adata.var_names.str.startswith(('RPS', 'RPL'))

# Hemoglobin genes (potential contamination)
adata.var['hb'] = adata.var_names.str.contains('^HB[^(P)]')

# Calculate QC metrics for each cell
sc.pp.calculate_qc_metrics(
    adata, 
    percent_top=None, 
    log1p=False, 
    inplace=True
)

# Add mitochondrial gene percentage
sc.pp.calculate_qc_metrics(
    adata, 
    qc_vars=['mt'], 
    percent_top=None, 
    log1p=False, 
    inplace=True
)

# Display QC metrics
print("QC Metrics calculated:")
print(adata.obs.columns.tolist())`}</code>
              </pre>
            </div>

            <h3>Visualize QC Metrics</h3>
            <div className="code-block">
              <pre>
                <code>{`# Create QC plots
fig, axes = plt.subplots(2, 2, figsize=(12, 10))

# Total counts per cell
sc.pl.violin(adata, ['total_counts'], 
             jitter=0.4, multi_panel=True, ax=axes[0,0])
axes[0,0].set_title('Total counts per cell')

# Number of genes per cell
sc.pl.violin(adata, ['n_genes_by_counts'], 
             jitter=0.4, multi_panel=True, ax=axes[0,1])
axes[0,1].set_title('Number of genes per cell')

# Mitochondrial gene percentage
sc.pl.violin(adata, ['pct_counts_mt'], 
             jitter=0.4, multi_panel=True, ax=axes[1,0])
axes[1,0].set_title('Mitochondrial gene %')

# Scatter plot: total counts vs genes
sc.pl.scatter(adata, x='total_counts', y='pct_counts_mt', ax=axes[1,1])
axes[1,1].set_title('Total counts vs MT gene %')

plt.tight_layout()
plt.show()

# Print summary statistics
print("\\nQC Summary Statistics:")
print(adata.obs[['total_counts', 'n_genes_by_counts', 'pct_counts_mt']].describe())`}</code>
              </pre>
            </div>
          </section>

          <section id="filtering" className="tutorial-section">
            <h2>4. Cell and Gene Filtering</h2>
            <p>Based on QC metrics, we'll filter out low-quality cells and rarely expressed genes.</p>

            <h3>Filter Cells</h3>
            <div className="code-block">
              <pre>
                <code>{`# Save the original data
adata_raw = adata.copy()

print(f"Starting with {adata.n_obs} cells and {adata.n_vars} genes")

# Filter cells based on QC metrics
# Remove cells with too few or too many genes
sc.pp.filter_cells(adata, min_genes=200)  # Filter out cells with < 200 genes
print(f"After min_genes filter: {adata.n_obs} cells")

# Remove cells with too high mitochondrial gene percentage
adata = adata[adata.obs.pct_counts_mt < 20, :].copy()
print(f"After MT filter: {adata.n_obs} cells")

# Remove cells with extremely high or low total counts
# (adjust these thresholds based on your data)
adata = adata[adata.obs.total_counts < 30000, :].copy()
adata = adata[adata.obs.total_counts > 1000, :].copy()
print(f"After count filters: {adata.n_obs} cells")`}</code>
              </pre>
            </div>

            <h3>Filter Genes</h3>
            <div className="code-block">
              <pre>
                <code>{`# Filter genes
# Remove genes expressed in very few cells
sc.pp.filter_genes(adata, min_cells=3)
print(f"After gene filtering: {adata.n_vars} genes")

# Remove mitochondrial and ribosomal genes for downstream analysis
# (keep them in raw data for QC purposes)
adata_filtered = adata[:, ~adata.var.mt].copy()
adata_filtered = adata_filtered[:, ~adata_filtered.var.ribo].copy()
print(f"After removing MT/ribo genes: {adata_filtered.n_vars} genes")

# Save raw data for later use
adata.raw = adata_raw[adata.obs_names, adata.var_names]`}</code>
              </pre>
            </div>
          </section>

          <section id="normalization" className="tutorial-section">
            <h2>5. Normalization</h2>
            <p>
              Normalization accounts for differences in sequencing depth between cells and makes gene expression values
              comparable across cells.
            </p>

            <div className="code-block">
              <pre>
                <code>{`# Normalize to 10,000 reads per cell
sc.pp.normalize_total(adata, target_sum=1e4)

# Log transform (log1p = log(x + 1))
sc.pp.log1p(adata)

# Save normalized data
adata.layers['normalized'] = adata.X.copy()

print("Normalization completed")
print(f"Data range after normalization: {adata.X.min():.2f} to {adata.X.max():.2f}")

# Plot normalization results
fig, axes = plt.subplots(1, 2, figsize=(12, 5))

# Before normalization (using raw data)
axes[0].hist(np.array(adata.raw.X.sum(axis=1)).flatten(), bins=50, alpha=0.7)
axes[0].set_xlabel('Total counts per cell')
axes[0].set_ylabel('Number of cells')
axes[0].set_title('Before normalization')

# After normalization
axes[1].hist(np.array(adata.X.sum(axis=1)).flatten(), bins=50, alpha=0.7)
axes[1].set_xlabel('Total counts per cell (normalized)')
axes[1].set_ylabel('Number of cells')
axes[1].set_title('After normalization')

plt.tight_layout()
plt.show()`}</code>
              </pre>
            </div>
          </section>

          <section id="feature-selection" className="tutorial-section">
            <h2>6. Feature Selection</h2>
            <p>Identify highly variable genes that capture the most biological variation in the dataset.</p>

            <div className="code-block">
              <pre>
                <code>{`# Find highly variable genes
sc.pp.highly_variable_genes(adata, min_mean=0.0125, max_mean=3, min_disp=0.5)

# Plot highly variable genes
sc.pl.highly_variable_genes(adata)
plt.show()

# Print statistics
n_hvg = sum(adata.var.highly_variable)
print(f"Number of highly variable genes: {n_hvg}")
print(f"Percentage of total genes: {n_hvg/adata.n_vars*100:.1f}%")

# Keep only highly variable genes for downstream analysis
adata_hvg = adata[:, adata.var.highly_variable].copy()
print(f"Dataset after HVG selection: {adata_hvg.shape}")

# Scale data to unit variance
sc.pp.scale(adata_hvg, max_value=10)
print("Data scaling completed")`}</code>
              </pre>
            </div>
          </section>

          <section id="data-export" className="tutorial-section">
            <h2>7. Data Export for BrainDataPortal</h2>
            <p>
              Export the processed data in formats compatible with BrainDataPortal for further analysis and
              visualization.
            </p>

            <div className="code-block">
              <pre>
                <code>{`# Create output directory
import os
output_dir = "processed_data"
os.makedirs(output_dir, exist_ok=True)

# Export processed data as H5AD (recommended format)
adata.write(f"{output_dir}/processed_data.h5ad")
print("Saved processed data as H5AD file")

# Export as CSV files for compatibility
# Expression matrix (normalized)
pd.DataFrame(
    adata.X.toarray() if hasattr(adata.X, 'toarray') else adata.X,
    index=adata.obs_names,
    columns=adata.var_names
).to_csv(f"{output_dir}/expression_matrix.csv")

# Cell metadata
adata.obs.to_csv(f"{output_dir}/cell_metadata.csv")

# Gene metadata
adata.var.to_csv(f"{output_dir}/gene_metadata.csv")

# Export highly variable genes list
hvg_genes = adata.var_names[adata.var.highly_variable].tolist()
pd.DataFrame({'gene': hvg_genes}).to_csv(f"{output_dir}/highly_variable_genes.csv", index=False)

print("\\nExported files:")
print("- processed_data.h5ad (main file)")
print("- expression_matrix.csv")
print("- cell_metadata.csv") 
print("- gene_metadata.csv")
print("- highly_variable_genes.csv")

# Create a summary report
summary = {
    'original_cells': adata_raw.n_obs,
    'original_genes': adata_raw.n_vars,
    'filtered_cells': adata.n_obs,
    'filtered_genes': adata.n_vars,
    'highly_variable_genes': n_hvg,
    'mitochondrial_threshold': 20,
    'min_genes_per_cell': 200,
    'min_cells_per_gene': 3
}

pd.DataFrame([summary]).to_csv(f"{output_dir}/processing_summary.csv", index=False)
print("- processing_summary.csv")

print(f"\\nProcessing complete! Files saved in '{output_dir}/' directory")`}</code>
              </pre>
            </div>

            <div className="success-box">
              <h4>Upload to BrainDataPortal</h4>
              <p>
                Your processed data is now ready for upload to BrainDataPortal. Use the <code>processed_data.h5ad</code>
                file as the primary input, along with the metadata files for additional annotations.
              </p>
            </div>
          </section>

          <section id="troubleshooting" className="tutorial-section">
            <h2>Troubleshooting</h2>

            <div className="troubleshooting-item">
              <h4>Issue: Memory errors during processing</h4>
              <p>
                <strong>Solution:</strong> Process data in chunks or use a machine with more RAM. Consider using sparse
                matrices and avoiding dense operations.
              </p>
              <div className="code-block">
                <pre>
                  <code>{`# Use sparse matrices
import scipy.sparse as sp
if not sp.issparse(adata.X):
    adata.X = sp.csr_matrix(adata.X)`}</code>
                </pre>
              </div>
            </div>

            <div className="troubleshooting-item">
              <h4>Issue: Too many cells filtered out</h4>
              <p>
                <strong>Solution:</strong> Adjust filtering thresholds based on your specific dataset characteristics.
              </p>
              <div className="code-block">
                <pre>
                  <code>{`# Check your data distribution first
print(adata.obs[['total_counts', 'n_genes_by_counts', 'pct_counts_mt']].describe())
# Adjust thresholds accordingly`}</code>
                </pre>
              </div>
            </div>

            <div className="troubleshooting-item">
              <h4>Issue: Gene names not recognized</h4>
              <p>
                <strong>Solution:</strong> Ensure gene symbols are in the correct format (human: HGNC symbols, mouse:
                MGI symbols).
              </p>
              <div className="code-block">
                <pre>
                  <code>{`# Convert gene IDs if needed
# For Ensembl to gene symbol conversion
import mygene
mg = mygene.MyGeneInfo()
gene_info = mg.querymany(adata.var_names.tolist(), scopes='ensembl.gene', fields='symbol', species='human')
# Update gene names based on results`}</code>
                </pre>
              </div>
            </div>
          </section>

          <div className="next-steps">
            <h3>Next Steps</h3>
            <p>After completing this tutorial, you can:</p>
            <ul>
              <li>Upload your processed data to BrainDataPortal</li>
              <li>Perform dimensionality reduction and clustering</li>
              <li>Identify cell types and marker genes</li>
              <li>Conduct differential expression analysis</li>
              <li>Integrate with other omics data types</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  )
}

export default SingleCellDemo
