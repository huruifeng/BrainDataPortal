import os
import matplotlib.pyplot as plt
import matplotlib.colors as mcolors
import numpy as np
import pandas as pd
import json

def assign_colors_group(groups):
    """
    Assigns distinct colors to dots based on their belonging groups.
    Ensures 'Other' is always gray.

    Parameters:
    groups (list): A list of group labels.

    Returns:
    dict: A dictionary mapping each group to a HEX color.
    """
    unique_groups = list(set(groups))

    # Ensure 'Other' is assigned gray
    if "Other" in unique_groups:
        unique_groups.remove("Other")

    num_groups = len(unique_groups)  # Update num_groups after removing "Other"

    # Use a colormap for distinct colors
    cmap = plt.get_cmap("tab10" if num_groups <= 10 else "tab20")
    colors = {group: mcolors.to_hex(cmap(i / max(1, num_groups))) for i, group in enumerate(unique_groups)}

    # Assign gray to 'Other'
    colors["Other"] = "#80808080"

    return colors


def assign_colors_continuous(values, cmap_name="viridis"):
    """
    Assigns colors in HEX format based on continuous values.

    Parameters:
    values (list or np.array): A list or array of continuous values.
    cmap_name (str): Name of the colormap to use, like "viridis","Reds", "Purples".

    Returns:
    list: A list of HEX color codes corresponding to the input values.
    """
    values = np.array(values)
    norm = plt.Normalize(vmin=values.min(), vmax=values.max())  # Normalize values
    cmap = plt.get_cmap(cmap_name)  # Get colormap
    colors = [mcolors.to_hex(cmap(norm(v))) for v in values]  # Convert to HEX

    return colors  # Map values to colors


def get_umap_data(dataset, samples, genes):
    umap_embeddings_file = os.path.join("backend","datasets",dataset, 'umap_embeddings_with_meta_100k.csv')
    data_df = pd.read_csv(umap_embeddings_file, index_col=0, header=0)
    ## Cell,UMAP_1,UMAP_2,sample_id,case,sex,age,seurat_clusters,MajorCellTypes,CellSubtypes

    if len(samples) > 0 and not(samples[0] == "all"  or "all" in samples):
        data_df.loc[~data_df['sample_id'].isin(samples), "CellSubtypes"] = "Other"
        data_df = data_df.loc[data_df['sample_id'].isin(samples)]

    if len(genes) > 0:
        for gene in genes:
            gene_expr_file = os.path.join("backend","datasets",dataset, "genes",gene+".json")
            with open(gene_expr_file, 'r') as f:
                cell_expr = json.load(f)
                data_df[gene] = data_df.index.map(cell_expr).fillna(0)
                colors = assign_colors_continuous(data_df[gene], cmap_name="Reds")
                data_df[gene] = data_df[gene].astype(str)
                data_df.loc[:,gene] = colors
        data_df = data_df.loc[:, ["UMAP_1", "UMAP_2"]+genes]
    else:
        color_map = assign_colors_group(data_df['CellSubtypes'])

        data_df['color'] = data_df['CellSubtypes'].map(color_map)
        data_df = data_df.loc[:, ["UMAP_1", "UMAP_2", "CellSubtypes", "color"]]

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