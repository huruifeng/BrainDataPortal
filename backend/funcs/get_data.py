import os
import pandas as pd
import json

# Function to check if a column is continuous or categorical
from pandas.api.types import (
    is_bool_dtype,
    is_float_dtype,
    is_integer_dtype,
    is_object_dtype,
    CategoricalDtype
)

def is_continuous(series, ratio_threshold=0.05, unique_abs_threshold=10):
    """Improved version handling edge cases."""
    """
    # Test with your DataFrame
    df = pd.DataFrame({
        'A': [1.1, 2.3, 3.4, 4.5],  # Continuous (float, high uniqueness)
        'B': ['cat', 'dog', 'mouse', 'cat'],  # Categorical (object)
        'C': [1, 2, 3, 4],  # Continuous (integer, high uniqueness)
        'D': [1, 1, 2, 2],  # Categorical (integer, low uniqueness)
        'E': [1.0, 1.0, 2.0, 2.0],  # Categorical (float, low uniqueness)
        'F': [True, False, True, False]  # Categorical (boolean)
    })
    
    for col in df.columns:
        result = "Continuous" if is_continuous(df[col]) else "Categorical"
        print(f"Column '{col}': {result}")
    """
    # Handle categorical types first (including explicit category dtype)
    if isinstance(series.dtype, CategoricalDtype):
        return False

    # Handle booleans explicitly
    if is_bool_dtype(series):
        return False

    # Handle numeric types with threshold checks
    if is_float_dtype(series) or is_integer_dtype(series):
        nunique = series.nunique()
        total = len(series)
        return (
                nunique > unique_abs_threshold and
                (nunique / total) > ratio_threshold
        )

    # Handle object/string types (always categorical)
    if is_object_dtype(series):
        return False

    # Default for other types (datetime, etc.)
    return False


def get_gene_expr_data(dataset, gene):
    # print("get_umap_data() called================")
    # print(dataset, samples, genes, color, group)
    ## plot expression for each gene
    gene_expr_file = os.path.join("backend","datasets",dataset, "genes",gene+".json")
    if not os.path.exists(gene_expr_file):
        return "Error: Gene expression file not found"

    with open(gene_expr_file, 'r') as f:
        cell_expr = json.load(f)

    return cell_expr


def get_all_genes(dataset):
    if dataset == "all":
        genes_file = os.path.join("backend","datasets", 'gene_list.json')
    else:
        genes_file = os.path.join("backend","datasets",dataset,'gene_list.json')

    if os.path.exists(genes_file):
        with open(genes_file, 'r') as f:
            data = json.load(f)
        return data
    else:
        print(genes_file + " not found")
        return "Error: Gene list file not found"

def get_meta_data(dataset):
    if dataset == "all":
        return "Error: Dataset is not specified."

    meta_file = os.path.join("backend","datasets",dataset,'umap_embeddings_with_meta_100k_1.csv')
    if os.path.exists(meta_file):
        with open(meta_file, 'r') as f:
            data_df = pd.read_csv(meta_file, index_col=None, header=0)
            data = data_df.to_dict(orient="records")
            return data
    else:
        return "Error: Meta file not found"