import {Link} from "react-router-dom"

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
                            <li><a href="#overview">Overview</a></li>
                            <li><a href="#demo-data">1. Obtaining Demo Data</a></li>
                            <li><a href="#data-loading">2. Data Loading and Initial Inspection</a></li>
                            <li><a href="#data-extraction">3. Data Extraction from Seurat Object</a></li>
                            <li><a href="#metadata-processing">4. Metadata Processing</a></li>
                            <li><a href="#cluster-markers">5. Computing cluster markers</a></li>
                            <li><a href="#feature-selection">6. Feature Selection</a></li>
                            <li><a href="#data-export">7. Data Export for BrainDataPortal</a></li>
                            <li><a href="#troubleshooting">Troubleshooting</a></li>
                        </ul>
                    </div>

                    <section id="overview" className="tutorial-section">
                        <h2>Overview</h2>
                        <p>
                            This tutorial will guide you through the complete process of preparing single-cell RNA-seq
                            data for use in BrainDataPortal. We will use a brain dataset as an example and
                            cover all essential preprocessing steps.
                        </p>
                        <div className="info-box">
                            <h4>Prerequisites</h4>
                            <ul>
                                <li>Python 3.8+ with pandas, numpy,json installed</li>
                                <li>R 4.0+ with Seurat, tidyverse, presto packages installed</li>
                                <li>Basic understanding of single-cell RNA-seq concepts</li>
                            </ul>
                        </div>
                    </section>

                    <section id="demo-data" className="tutorial-section">
                        <h2>1. Obtaining Demo Data</h2>
                        <p>
                            We will use a single-cell dataset from human brain. This dataset
                            contains 10 subjects, approximately 50,000 cells from brain middle temporal gyrus region.
                        </p>

                        <h3>Download the demo dataset</h3>
                        <div className="troubleshooting-item">
                            1. Seurat object file: <a href="https://github.com/braindataportal/braindataportal.github.io/blob/main/data/pbmc3k_filtered_gene_bc_matrices.tar.gz" target="_blank">snRNAseq_MTG_10samples.rds</a> <br/>
                            2. Sample metadata file: <a href="https://github.com/braindataportal/braindataportal.github.io/blob/main/data/pbmc3k_filtered_gene_bc_matrices.tar.gz" target="_blank">Sample_snRNAseq_MTG_10samples.csv</a><br/>
                            3. Dataset configuration file: <a href="https://github.com/braindataportal/braindataportal.github.io/blob/main/data/pbmc3k_filtered_gene_bc_matrices.tar.gz" target="_blank">dataset_info.toml</a>
                        </div>
                        <div className="alert-box">
                            <h4>Important Note</h4>
                            <p>
                                Dataset configuration file name must be <strong>dataset_info.toml</strong>
                            </p>
                        </div>

                    </section>

                    <section id="data-loading" className="tutorial-section">
                        <h2>2. Data Loading and Initial Inspection</h2>
                        <p>
                            Once you have the data, Load it and perform initial inspection to understand the dataset structure. <br/>
                            Full code in Notebook: <a href="/demos/notebooks/sc/11_extract_SC.html" target="_blank">11.extract_SC_v5.R</a>. <br/>
                            You may need to pay attention to the input arguments: <strong>seurat_obj_file</strong>, <strong>output_dir</strong>, <strong>cluster_col</strong>
                        </p>

                        <div className="code-block">
              <pre>
                <code>{`## Rscript 11.extract_SC_v5.R
... ...
# Get the arguments
seurat_obj_file <- "snRNAseq_MTG_10samples.rds"
output_dir <- "snRNAseq_MTG_10samples"
cluster_col <- "Complex_Assignment"

# Load the Seurat object
seurat_obj <- readRDS(seurat_obj_file)
capture.output(str(seurat_obj), file = paste0(output_dir, "/seurat_obj_structure.txt"))
... ...
`}
                </code>
              </pre>
                        </div>

                        <div className="warning-box">
                            <h4>Important Note</h4>
                            <p>
                                The above code will generate a file named<strong>seurat_obj_structure.txt</strong> in the output directory. Check this file to see the structure of the Seurat object, Make sure the the necessary data is present.
                            </p>
                        </div>
                    </section>

                    <section id="data-extraction" className="tutorial-section">
                        <h2>3. Data Extraction from Seurat Object</h2>
                        <p>
                            After check the structure of the Seurat object, we can extract the data and metadata from the object. <br />
                            Full code in Notebook: <a href="/demos/notebooks/sc/11_extract_SC.html" target="_blank">11.extract_SC_v5.R</a>.<br/>

                        </p>
                        <div className="warning-box">
                            <h4>Important Note</h4>
                            <p>
                                 Seurat v5 has a different structure compared to v4, you may need to adjust the following codes accordingly.
                            </p>
                        </div>

                        <h3>v5 Seurat Object</h3>
                        <div className="code-block">
              <pre>
                <code>{`
## 1. Extract normalized data
norm_data <- seurat_obj[["RNA"]]@layers[["data"]]   # This is a sparse matrix

## 2. Get gene and cell names from LogMaps
gene_names <- dimnames(seurat_obj[["RNA"]]@features)[[1]]
cell_names <- dimnames(seurat_obj[["RNA"]]@cells)[[1]]

## 3. Convert to triplet format (sparse matrix summary)
triplet <- summary(norm_data)

## 4. Map i and j indices to gene and cell names
triplet$Gene <- gene_names[triplet$i]
triplet$Cell <- cell_names[triplet$j]

## 5. Reorder and rename
long_data <- triplet %>% select(Cell, Gene, Expression = x)
`}</code>
              </pre>
                        </div>
                        <h3>v4 Seurat Object</h3>
                        <div className="code-block">
              <pre>
                <code>{`
## 1. Extract the normalized counts
normalized_counts <- seurat_obj@assays$RNA@data  # This is a sparse matrix

## 2. Convert sparse matrix to triplet format (long format)
long_data <- summary(normalized_counts)

## 3. Get row (gene) and column (cell) names
long_data$Gene <- rownames(normalized_counts)[long_data$i]
long_data$Cell <- colnames(normalized_counts)[long_data$j]
long_data$Expression <- long_data$x

## 4. Keep only necessary columns
long_data <- long_data[, c("Gene", "Cell", "Expression")]

`}</code>
              </pre>
                        </div>
                    </section>

                    <section id="metadata-processing" className="tutorial-section">
                        <h2>4. Metadata processing</h2>
                        <p>
                            This step processes single cell metadata for visualization, including: <br />
                            - Metadata filtering and renaming <br />
                            - UMAP embedding sampling <br />
                            - Expression data splitting and saving<br />
                            - Pseudo-bulk level expression calculation<br />
                        </p>
                        <p>
                            Full code in Notebook: <a href="/demos/notebooks/sc/31_rename_meta.html" target="_blank">31_rename_meta.ipynb</a>.
                        </p>

                        <div className="code-block">
              <pre>
                <code>{`dataset_path = "snRNAseq_MTG_10samples"  ## This is the output directory from the previous step 

## a list of metadata columns to keep, pick features that you want to visualize
kept_features =["nCount_RNA", "nFeature_RNA", "sex", "cell_type", "phase", 
                "G2M_score", "S_score","leiden_res_0.10","leiden_res_0.20", 
                "case", "sample_id"]
sample_col = "sample_id"
cluster_col = "Complex_Assignment"
condition_col = "case"`}</code>
              </pre>
                        </div>
                    </section>

                    <section id="cluster-markers" className="tutorial-section">
                        <h2>5. Computing cluster markers</h2>
                        <p>This step includes:<br/>- Finding cell type specific markers<br/>- Calculating differential expression within cell types<br/>- Performing pseudo-bulk analysis</p>
                        <p>
                            Full code in Notebook: <a href="/demos/notebooks/sc/21_clustermarkers.html" target="_blank">21_clustermarkers.R</a>.<br/>
                        </p>
                        <div className="code-block">
              <pre>
                <code>{`seurat_obj_file <- "snRNAseq_MTG_10samples.rds"
output_dir <- "snRNAseq_MTG_10samples"
cluster_col <- "Complex_Assignment"
condition_col <- "case"
sample_col <- "sample_id"
seurat_type <- "snrnaseq"`}</code>
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
                            Export the processed data in formats compatible with BrainDataPortal for further analysis
                            and visualization.
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
                                Your processed data is now ready for upload to BrainDataPortal. Use
                                the <code>processed_data.h5ad</code>
                                file as the primary input, along with the metadata files for additional annotations.
                            </p>
                        </div>
                    </section>

                    <section id="troubleshooting" className="tutorial-section">
                        <h2>Troubleshooting</h2>

                        <div className="troubleshooting-item">
                            <h4>Issue: Memory errors during processing</h4>
                            <p>
                                <strong>Solution:</strong> Process data in chunks or use a machine with more RAM.
                                Consider using sparse
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
                                <strong>Solution:</strong> Adjust filtering thresholds based on your specific dataset
                                characteristics.
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
                                <strong>Solution:</strong> Ensure gene symbols are in the correct format (human: HGNC
                                symbols, mouse:
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
