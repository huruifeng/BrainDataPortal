import os
import pandas as pd
import json

# Function to check if a column is continuous or categorical
def is_continuous(series, threshold=0.05):
    """
    Determines if a column is continuous based on its unique value ratio.
    A column is considered categorical if the unique values are below a threshold.
    """
    unique_ratio = series.nunique() / len(series)  # Unique values ratio
    if series.dtype in ['float64', 'float32']:  # Floats are usually continuous
        return True
    elif series.dtype in ['object', 'category']:  # Strings are categorical
        return False
    else:  # Integers: check unique value ratio
        return unique_ratio > threshold  # More unique values → continuous



def get_umap_data(dataset, samples, genes, color=None, group=None):
    print("get_umap_data() called================")
    print(dataset, samples, genes, color, group)
    umap_embeddings_file = os.path.join("backend","datasets",dataset, 'umap_embeddings_with_meta_100k.csv')
    data_df = pd.read_csv(umap_embeddings_file, index_col=0, header=0)
    ## Cell,UMAP_1,UMAP_2,sample_id,case,sex,age,seurat_clusters,MajorCellTypes,CellSubtypes

    if len(samples) > 0 and not(samples[0] == "all"  or "all" in samples):
        data_df.loc[~data_df['sample_id'].isin(samples), "MajorCellTypes"] = "Other"
        data_df = data_df.loc[data_df['sample_id'].isin(samples)]

    if len(genes) > 0 and not(genes[0] == "all" or "all" in genes):
        ## plot expression for each gene
        for gene in genes:
            gene_expr_file = os.path.join("backend","datasets",dataset, "genes",gene+".json")
            with open(gene_expr_file, 'r') as f:
                cell_expr = json.load(f)
                data_df[gene+"_expr"] = data_df.index.map(cell_expr).fillna(0)
        col_ls = ["UMAP_1", "UMAP_2"]+[gene+"_expr" for gene in genes]
    else:
        col_ls = ["UMAP_1", "UMAP_2"]

    color_type = 'Categorical'
    group_type = 'Categorical'
    if color and color in data_df.columns.tolist():
        col_ls.append(color)
        color_type = 'Continuous' if is_continuous(data_df[color]) else 'Categorical'
        group_type = color_type
    if group and group!=color and group in data_df.columns.tolist():
        col_ls.append(group)
        group_type = 'Continuous' if is_continuous(data_df[group]) else 'Categorical'

    data_df = data_df.loc[:, col_ls]
    results =  data_df.to_dict(orient="records")
    return {"main_data": results, "group_type": group_type, "color_type": color_type}


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

def get_meta_names(dataset):
    if dataset == "all":
        return "Error: Dataset is not specified."

    meta_file = os.path.join("backend","datasets",dataset,'metadata_lite.csv')
    if os.path.exists(meta_file):
        with open(meta_file, 'r') as f:
            data_df = pd.read_csv(meta_file, index_col=0, header=0)
            data = data_df.columns.tolist()
        if "sample_id" in data: data.remove("sample_id")
        if "cell_id" in data: data.remove("cell_id")
        if "spot_id" in data: data.remove("spot_id")
        return data
    else:
        return "Error: Meta file not found"