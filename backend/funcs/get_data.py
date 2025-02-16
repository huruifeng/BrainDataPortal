import os
import pandas as pd
import json


def get_umap_echart(dataset, samples, genes):
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
                data_df[gene] = data_df.index.map(cell_expr).fillna(0)
        data_df = data_df.loc[:, ["UMAP_1", "UMAP_2","MajorCellTypes"]+genes]

    else:
        data_df = data_df.loc[:, ["UMAP_1", "UMAP_2", "MajorCellTypes"]]

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
        return 0