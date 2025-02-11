import os
import pandas as pd

def get_umap_data(dataset, samples, genes):
    umap_embeddings_file = os.path.join("datasets",dataset, 'umap_embeddings.csv')
    if os.path.exists(umap_embeddings_file):
        data = pd.read_csv(umap_embeddings_file, index_col=0, header=0)

        return data
    else:
        print(umap_embeddings_file + " not found")
        return 0