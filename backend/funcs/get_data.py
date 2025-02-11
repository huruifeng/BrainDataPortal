import os
import pandas as pd
import json

def get_umap_data(dataset, samples, genes):
    umap_embeddings_file = os.path.join("datasets",dataset, 'umap_embeddings.csv')
    if os.path.exists(umap_embeddings_file):
        data = pd.read_csv(umap_embeddings_file, index_col=0, header=0)

        return data
    else:
        print(umap_embeddings_file + " not found")
        return 0

def get_all_genes(dataset):
    if dataset == "all":
        genes_file = os.path.join("datasets", 'gene_list.json')
    else:
        genes_file = os.path.join("datasets",dataset,'gene_list.json')

    if os.path.exists(genes_file):
        with open(genes_file, 'r') as f:
            data = json.load(f)
        return data
    else:
        print(genes_file + " not found")
        return 0