import os
import pandas as pd
import json

def get_gene_list(dataset, query_str="AB"):
    if dataset == "all":
        genes_file = os.path.join("backend","datasets", 'gene_list.json')
    else:
        genes_file = os.path.join("backend","datasets",dataset,'gene_list.json')

    if os.path.exists(genes_file):
        with open(genes_file, 'r') as f:
            data = json.load(f)
        if query_str =="all":
            return data
        else:
            return [gene for gene in data if gene.lower().startswith(query_str.lower())]
    else:
        print(genes_file + " not found")
        return "Error: Gene list file not found"

def get_sample_list(dataset, query_str="all"):
    if dataset == "all":
        return "Error: Sample dataset not specified."
    else:
        sample_file = os.path.join("backend","datasets",dataset,'sample_list.json')

    if os.path.exists(sample_file):
        with open(sample_file, 'r') as f:
            data = json.load(f)
        if query_str =="all" or query_str == "":
            return data
        else:
            return [sample for sample in data if sample.lower().startswith(query_str.lower())]
    else:
        print(sample_file + " not found")
        return "Error: Gene list file not found"

def get_meta_list(dataset, query_str="all"):
    if dataset == "all":
        return "Error: Sample dataset not specified."
    else:
        meta_file = os.path.join("backend","datasets",dataset,'meta_list.json')

    if os.path.exists(meta_file):
        with open(meta_file, 'r') as f:
            data = json.load(f)
        if query_str =="all" or query_str == "":
            return data
        else:
            return [meta for meta in data if meta.lower().startswith(query_str.lower())]
    else:
        print(meta_file + " not found")
        return "Error: Gene list file not found"

def get_umapembedding(dataset):
    if dataset == "all":
        return "Error: Dataset is not specified."

    umap_file = os.path.join("backend","datasets",dataset,'umap_embeddings_with_sample_id_50k.csv')
    if os.path.exists(umap_file):
        data_df = pd.read_csv(umap_file, index_col=None, header=0)
        data = data_df.to_dict(orient="records")
        return data
    else:
        return "Error: UMAP file not found"

def get_sample_metadata(dataset, samples=["all"], meta="all"):
    if dataset == "all":
        return "Error: Dataset is not specified."

    meta_file = os.path.join("backend","datasets",dataset,'sample_metadata.csv')
    if os.path.exists(meta_file):
        data_df = pd.read_csv(meta_file, index_col=0, header=0)
        if(len(samples) > 0 and samples[0] != "all"):
            data_df = data_df.loc[samples,:]
        if(meta != "all"):
            data_df = data_df[meta]
        data = data_df.to_dict(orient="index")
        return data
    else:
        return f"Error: Meta file not found."

def get_metadata_of_sample(dataset, sample="all", meta="all"):
    if dataset == "all":
        return "Error: Dataset is not specified."

    meta_file = os.path.join("backend","datasets",dataset,'metadata_lite.csv')
    if os.path.exists(meta_file):
        data_df = pd.read_csv(meta_file, index_col=0, header=0)
        if(sample != "all"):
            data_df = data_df.loc[data_df["sample_id"] == sample,:]
        if(meta != "all"):
            data_df = data_df[meta]
        data = data_df.to_dict(orient="index")
        return data
    else:
        return f"Error: Meta file not found."

def get_all_metadata(dataset, drop_cols=None):
    if dataset == "all":
        return "Error: Dataset is not specified."

    meta_file = os.path.join("backend","datasets",dataset,'metadata_lite_50k.csv')
    if os.path.exists(meta_file):
        with open(meta_file, 'r') as f:
            data_df = pd.read_csv(meta_file, index_col=0, header=0)
            if drop_cols is not None:
                data_df = data_df.drop(drop_cols, axis=1)
            data = data_df.to_dict(orient="index")
            return data
    else:
        return "Error: Meta file not found"

def get_expr_data(dataset, gene):
    gene_expr_file = os.path.join("backend","datasets",dataset, "genes",gene+".json")
    if not os.path.exists(gene_expr_file):
        return "Error: Gene expression file not found"

    with open(gene_expr_file, 'r') as f:
        cell_expr = json.load(f)

    return cell_expr

def get_pseudoexpr_data(dataset, gene):
    gene_expr_file = os.path.join("backend","datasets",dataset, "gene_pseudobulk",gene+".json")
    if not os.path.exists(gene_expr_file):
        return "Error: Pseudobulk expression file not found"

    with open(gene_expr_file, 'r') as f:
        sample_expr = json.load(f)

    return sample_expr

def get_visium_coordinates(dataset, sample):
    if dataset == "all":
        return "Error: Dataset is not specified."

    coordinates_file = os.path.join("backend","datasets",dataset,'coordinates',sample+".csv")
    scales_file = os.path.join("backend","datasets",dataset,'coordinates','scalefactors_'+sample+'.json')

    if os.path.exists(coordinates_file) and os.path.exists(scales_file):
        with open(coordinates_file, 'r') as f:
            coordinates_df = pd.read_csv(coordinates_file, index_col=0, header=0)
            coordinates= coordinates_df.to_dict(orient="index")

        with open(scales_file, 'r') as f:
            scales = json.load(f)


        return {"coordinates": coordinates, "scales": scales}
    else:
        return "Error: Image file not found"