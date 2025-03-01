import os
import pandas as pd
import json

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

def get_meta_data(dataset, drop_cols=None):
    if dataset == "all":
        return "Error: Dataset is not specified."

    meta_file = os.path.join("backend","datasets",dataset,'umap_embeddings_with_meta_100k.csv')
    if os.path.exists(meta_file):
        with open(meta_file, 'r') as f:
            data_df = pd.read_csv(meta_file, index_col=None, header=0)
            if drop_cols is not None:
                data_df = data_df.drop(drop_cols, axis=1)
            data = data_df.to_dict(orient="records")
            return data
    else:
        return "Error: Meta file not found"


def get_visium_image_data(dataset, sample):
    if dataset == "all":
        return "Error: Dataset is not specified."

    coordinates_file = os.path.join("backend","datasets",dataset,'coordinates',sample+".csv")
    scales_file = os.path.join("backend","datasets",dataset,'coordinates','scalefactors_'+sample+'.json')

    if os.path.exists(coordinates_file) and os.path.exists(scales_file):
        with open(coordinates_file, 'r') as f:
            coordinates_df = pd.read_csv(coordinates_file, index_col=None, header=0)
            coordinates= coordinates_df.to_dict(orient="records")

        with open(scales_file, 'r') as f:
            scales = json.load(f)


        return {"coordinates": coordinates, "scales": scales}
    else:
        return "Error: Image file not found"