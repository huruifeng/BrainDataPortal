import os
import pandas as pd
import json
import toml
import re

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

def get_cell2sample_map(dataset):
    if dataset == "all":
        return "Error: Dataset is not specified."

    cell2sample_file = os.path.join("backend","datasets",dataset,'cell_to_sample.json')
    if os.path.exists(cell2sample_file):
        with open(cell2sample_file, 'r') as f:
            data = json.load(f)
        return data
    else:
        return f"Error: cell2sample file not found."

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

def get_config_info(dataset):
    if dataset == "all":
        return "Error: Dataset is not specified."
    else:
        config_file = os.path.join("backend", "datasets", dataset, 'dataset_info.toml')

    if os.path.exists(config_file):
        with open(config_file, 'r') as f:
            config = toml.load(f)
        return config
    else:
        print(config_file + " not found")
        return "Error: Config info file not found"

def get_celltype_list(dataset):
    if dataset == "all":
        return "Error: Dataset is not specified."
    else:
        cellconuts_file = os.path.join("backend", "datasets", dataset, 'clustermarkers', 'cluster_cellcounts.json')

    if os.path.exists(cellconuts_file):
        with open(cellconuts_file, 'r') as f:
            data = json.load(f)
        return list(data.keys()) if data is not None else data.keys()
    else:
        print(cellconuts_file + " not found")
        return "Error: Meta file not found"

def get_celltype_counts(dataset):
    if dataset == "all":
        return "Error: Dataset is not specified."
    else:
        cellconuts_file = os.path.join("backend", "datasets", dataset, 'clustermarkers', 'cluster_cellcounts.json')

    if os.path.exists(cellconuts_file):
        with open(cellconuts_file, 'r') as f:
            data = json.load(f)
        return data
    else:
        print(cellconuts_file + " not found")
        return "Error: Meta file not found"

def get_marker_genes(dataset):
    if dataset == "all":
        return "Error: Dataset is not specified."
    else:
        markergene_file = os.path.join("backend", "datasets", dataset, 'clustermarkers', 'cluster_markergenes_cellcounts.csv')

    if os.path.exists(markergene_file):
        data_df = pd.read_csv(markergene_file, index_col=None, header=0)
        data = data_df.to_dict(orient="split")
        return data
    else:
        print(markergene_file + " not found")
        return "Error: Marker Genes file not found"

def get_degs_celllevel(dataset, celltype):
    if dataset == "all":
        return "Error: Dataset is not specified."
    else:
        degs_file = os.path.join("backend", "datasets", dataset, 'clustermarkers', 'cluster_DEGs_topN.csv')

    if os.path.exists(degs_file):
        degs_df = pd.read_csv(degs_file, index_col=None, header=0)
        degs_df = degs_df.loc[degs_df["cluster_DE"].str.startswith(celltype),["cluster_DE","gene","avg_log2FC","p_val_adj"]]

        ## keep only 4 digits for avg_log2FC
        degs_df["avg_log2FC"] = degs_df["avg_log2FC"].round(4)
        degs_df["p_val_adj"] = degs_df["p_val_adj"].round(4)

        ## split cluster_DE into cluster name and DE
        degs_df["DE"] = [i.split(".")[1] for i in degs_df["cluster_DE"].tolist()]
        degs_df = degs_df.drop("cluster_DE", axis=1)

        ## group by DE
        degs_groups = degs_df.groupby("DE").apply(lambda g: g.drop("DE", axis=1).to_dict(orient='records')).to_dict()

        ## get gene expression data for each DE,format: [{sampleId: 'cell1/spot1', condition: 'PD', value: 8.1053},...]
        cluster_meta = pd.read_csv(os.path.join("backend", "datasets", dataset, 'cellspot_metadata_original.csv'), index_col=0, header=0)
        main_cluster = get_config_info(dataset)["meta_features"]["main_cluster_column"]
        cluster_meta = cluster_meta.loc[cluster_meta[main_cluster]==celltype,:]
        cs_ids = cluster_meta.index.tolist()

        for DE, degs in degs_groups.items():
            for deg in degs:
                expression = []
                gene_name = deg["gene"]
                expr_vals = get_expr_data(dataset, gene_name)

                for cs_i in cs_ids:
                    condation = cluster_meta.loc[cs_i,"Condition"]
                    if condation not in DE:
                        continue
                    expr_val = expr_vals[cs_i] if cs_i in expr_vals else 0
                    expression.append({"sampleId": cs_i, "condition": condation, "value": expr_val})
                deg['expression'] = expression

        return degs_groups
    else:
        print(degs_file + " not found")
        return "Error: DEGs file not found"

def get_degs_pseudobulk(dataset, celltype):
    if dataset == "all":
        return "Error: Dataset is not specified."
    else:
        degs_file = os.path.join("backend", "datasets", dataset, 'clustermarkers', 'cluster_pb_DEGs_topN.csv')

    data = {}
    if os.path.exists(degs_file):
        degs_df = pd.read_csv(degs_file, index_col=None, header=0)
        degs_df = degs_df.loc[degs_df["cluster_DE"].str.startswith(celltype),["cluster_DE","gene","avg_log2FC","p_val_adj"]]

        ## keep only 4 digits for avg_log2FC
        degs_df["avg_log2FC"] = degs_df["avg_log2FC"].round(4)
        degs_df["p_val_adj"] = degs_df["p_val_adj"].round(4)

        ## split cluster_DE into CellType and DE
        # degs_df["cluster_DE"] = degs_df["cluster_DE"].astype(str)
        # degs_df["cluster"] = [i.split(".")[0] for i in degs_df["cluster_DE"].tolist()]
        degs_df["DE"] = [i.split(".")[1] for i in degs_df["cluster_DE"].tolist()]
        degs_df = degs_df.drop("cluster_DE", axis=1)

        ## group by DE
        degs_groups = degs_df.groupby("DE").apply(lambda g: g.drop("DE", axis=1).to_dict(orient='records')).to_dict()

        ## get gene expression data for each DE,format: [{sampleId: 'sample1', condition: 'PD', value: 8.1053},...]
        sample_calletype_df = pd.read_csv(os.path.join("backend", "datasets", dataset,'clustermarkers', 'metadata_sample_cluster_condition.csv'), index_col=0, header=0)
        expr_df = pd.read_csv(os.path.join("backend", "datasets", dataset,'clustermarkers', 'pb_expr_matrix_DEGs_topN.csv'), index_col=0, header=0)
        escaped_celltype = re.escape(celltype)
        pattern = rf"{escaped_celltype}"

        for DE, degs in degs_groups.items():
            for deg in degs:
                expression = []
                gene_name = deg["gene"]
                expr_val_df = expr_df.loc[gene_name,expr_df.columns.str.contains(pattern)]
                samples = expr_val_df.index.tolist()
                for sample_i in samples:
                    condation = sample_calletype_df.loc[sample_i,"condition"]
                    if condation not in DE:
                        continue
                    expr_val = round(expr_val_df[sample_i],2) if expr_val_df[sample_i] != 0 else expr_val_df[sample_i]
                    expression.append({"sampleId": sample_i, "condition": condation, "value": expr_val})
                deg['expression'] = expression

        data = degs_groups

        return data
    else:
        print(degs_file + " not found")
        return "Error: DEGs file not found"

def get_umapembedding(dataset):
    if dataset == "all":
        return "Error: Dataset is not specified."

    umap_file = os.path.join("backend","datasets",dataset,'umap_embeddings_50k.csv')
    if os.path.exists(umap_file):
        data_df = pd.read_csv(umap_file, index_col=None, header=0)
        data = data_df.to_dict(orient="split")
        return data["data"]
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

        data_df.fillna("", inplace=True)
        data = data_df.to_dict(orient="index")
        return data
    else:
        return f"Error: Meta file not found."

def get_metadata_of_sample(dataset, sample="all", features="all"):
    if dataset == "all":
        return "Error: Dataset is not specified."

    meta_file = os.path.join("backend","datasets",dataset,'cellspot_metadata.csv')
    if os.path.exists(meta_file):
        data_df = pd.read_csv(meta_file, index_col=0, header=0)
        if(sample != "all"):
            data_df = data_df.loc[data_df.index.str.startswith(sample),:]
        if(features != "all"):
            data_df = data_df[features]
        cell_metadata = data_df.to_dict(orient="split")

        # get sample metadata
        sample_metadata = get_sample_metadata(dataset)

        ## get cell_metadata_mapping
        cell_metadata_mapping = get_metadata_mapping(dataset)

        data = {"cell_metadata": cell_metadata, "cell_metadata_mapping": cell_metadata_mapping,
                "sample_metadata": sample_metadata}
        return data

    else:
        return f"Error: Meta file not found."

def get_metadata_mapping(dataset):
    if dataset == "all":
        return "Error: Dataset is not specified."

    meta_file = os.path.join("backend","datasets",dataset,'cellspot_meta_mapping.json')
    if os.path.exists(meta_file):
        with open(meta_file, 'r') as f:
            data = json.load(f)
        return data
    else:
        return f"Error: cell_metadata_mapping file not found."


def get_all_metadata(dataset, cols=["all"], rows=["all"]):
    if dataset == "all":
        return "Error: Dataset is not specified."

    meta_file = os.path.join("backend","datasets",dataset,'cellspot_metadata.csv')
    if os.path.exists(meta_file):
        with open(meta_file, 'r') as f:
            data_df = pd.read_csv(meta_file, index_col=0, header=0)

            if cols and cols[0]!= "all" and cols[0] != "":
                data_df = data_df.loc[:,cols]

            if rows and rows[0] == "umap":
                uamp_rows = get_umapembedding(dataset)
                data_df = data_df.loc[[r[0] for r in uamp_rows],:]

            data_df = data_df.fillna('')
            cell_metadata = data_df.to_dict(orient="split")

        ## load cell2sample map file (json)
        # cell2sample = get_cell2sample_map(dataset)

        # get sample metadata
        sample_metadata = get_sample_metadata(dataset)

        ## get cell_metadata_mapping
        cell_metadata_mapping = get_metadata_mapping(dataset)

        data = {"cell_metadata": cell_metadata, "cell_metadata_mapping": cell_metadata_mapping, "sample_metadata": sample_metadata}
        return data
    else:
        return "Error: Meta file not found"

def get_expr_data(dataset, gene):
    gene_expr_file = os.path.join("backend","datasets",dataset, "gene_jsons",gene+".json")
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

    coordinates_file = os.path.join("backend","datasets",dataset,'coordinates','raw_coordinates_slice1_'+sample+".csv")
    scales_file = os.path.join("backend","datasets",dataset,'coordinates','raw_scalefactors_slice1_'+sample+'.json')

    # if os.path.exists(coordinates_file) and os.path.exists(scales_file):
    with open(coordinates_file, 'r') as f:
        coordinates_df = pd.read_csv(coordinates_file, index_col=0, header=0)
        coordinates= coordinates_df.to_dict(orient="index")

    with open(scales_file, 'r') as f:
        scales = json.load(f)


    return {"coordinates": coordinates, "scales": scales}
    # else:
    #     return "Error: Image file not found"

def get_visium_defaults(dataset):
    if dataset == "all":
        return "Error: Dataset is not specified."

    config_info = get_config_info(dataset)
    if config_info and "visium_defaults" in config_info:
        data = config_info["visium_defaults"]
        return data
    else:
        return f"Error: visium_defaults file not found."