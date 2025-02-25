import os
import pandas as pd
import json


def get_umap_chart(dataset, samples, genes, color=None, group=None):
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

    if color and color in data_df.columns.tolist():
        col_ls.append(color)
    if group and group in data_df.columns.tolist():
        col_ls.append(group)

    data_df = data_df.loc[:, col_ls]
    results =  data_df.to_dict(orient="records")
    return results


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