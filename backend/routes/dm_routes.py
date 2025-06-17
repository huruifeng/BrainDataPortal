import json
import shutil
import subprocess
from datetime import datetime
import os
import toml

from fastapi import APIRouter, Depends, Query

from pydantic import BaseModel
from typing import Optional

from sqlmodel import Session

from backend.db import get_session
from backend.db_utils.crud import insert_study, insert_dataset, import_sample_sheet
from backend.models import Study, Dataset

router = APIRouter()

class DatasetFileInfo(BaseModel):
    file: str
    datatype: str

class DatasetInfo(BaseModel):
    dataset_name: str
    description: Optional[str] = None
    PI_full_name: str
    PI_email: str
    first_contributor: str
    first_contributor_email: str
    other_contributors: Optional[str] = None
    support_grants: Optional[str] = None
    other_funding_source: Optional[str] = None
    publication_DOI: Optional[str] = None
    publication_PMID: Optional[str] = None
    brain_super_region: Optional[str] = None
    brain_region: Optional[str] = None
    sample_info: Optional[str] = None
    sample_sheet: Optional[str] = None
    n_samples: Optional[int] = None
    organism: Optional[str] = None
    disease: Optional[str] = None

class StudyInfo(BaseModel):
    study_name: str
    description: Optional[str] = None
    team_name: str
    lab_name: str
    submitter_name: str
    submitter_email: str

class ProtocolInfo(BaseModel):
    protocol_id: str
    protocol_name: str
    version: Optional[str] = None
    github_url: Optional[str] = None
    sample_collection_summary: Optional[str] = None
    cell_extraction_summary: Optional[str] = None
    lib_prep_summary: Optional[str] = None
    data_processing_summary: Optional[str] = None
    protocols_io_DOI: Optional[str] = None
    other_reference: Optional[str] = None

class SubmissionData(BaseModel):
    datasetfile_info: DatasetFileInfo
    dataset_info: DatasetInfo
    study_info: StudyInfo
    protocol_info: ProtocolInfo

class MetaFeatureData(BaseModel):
    dataset: str
    selected_features: list
    sample_id_column: str
    major_cluster_column: str
    condition_column: str

@router.get("/")
async def dm_root():
    return {"Message": "Hello DataManager."}

@router.get("/getdatasetfiles")
async def getdatasetfiles():
    file_path = "backend/DatasetFiles"
    file_ls = os.listdir(file_path)
    # for file in file_ls:
    #     if not file.endswith(".rds"):
    #         file_ls.remove(file)
    return file_ls

@router.get("/getsamplesheets")
async def getsamplesheets():
    file_path = "backend/SampleSheets"
    file_ls = os.listdir(file_path)
    # for file in file_ls:
    #     if not file.endswith(".rds"):
    #         file_ls.remove(file)
    return file_ls

@router.get("/checkdatasetname")
async def checkdatasetname(name: str):
    path_str = "backend/datasets/" + name
    if os.path.exists(path_str):
        return {"isUnique": False}
    return {"isUnique": True}

@router.post("/extractdata")
async def extractdata(data: SubmissionData, session: Session = Depends(get_session)):
    dataset_file = data.datasetfile_info.file
    datatype = data.datasetfile_info.datatype
    dataset_name = data.dataset_info.dataset_name
    dataset_path = "backend/datasets/" + dataset_name

    ## check if dataset exists
    if not os.path.exists(dataset_path):
        os.makedirs(dataset_path)

    study_dict = data.study_info.model_dump()
    protocol_dict = data.protocol_info.model_dump()
    dataset_dict = data.dataset_info.model_dump()

    config = {
        "datasetfile": {
            "file": dataset_file,
            "datatype": datatype},
        "dataset": dataset_dict,
        "study": study_dict,
        "protocol": protocol_dict
    }
    with open(f"{dataset_path}/dataset_info.toml", 'w') as f:
        toml.dump(config, f)

    study_dict["study_id"] = study_dict["study_name"]
    study = Study(**study_dict)

    dataset_dict["dataset_id"] = dataset_name
    dataset_dict["assay"] = datatype
    dataset_dict["study_id"] = study_dict["study_id"]
    dataset_dict["dataset_file"] = dataset_file
    dataset = Dataset(**dataset_dict)

    ## process dataset
    # Open a file to log stdout and stderr
    with open(f"{dataset_path}/extractdata_output.log", "w") as log_file:
        if dataset_file != "manuallyupload":
            if datatype.lower() in ["scrnaseq", "snrnaseq"] and dataset_file.endswith(".rds"):
                subprocess.Popen(
                    ["Rscript", "backend/funcs/11_extract_SC.R", f"backend/DatasetFiles/{dataset_file}", dataset_path],
                    stdout=log_file,
                    stderr=log_file,
                )
            elif datatype.lower() in ["visiumst"] and dataset_file.endswith(".rds"):
                subprocess.Popen(
                    ["Rscript", "backend/funcs/11_extract_Visium.R", f"backend/DatasetFiles/{dataset_file}", dataset_path],
                    stdout=log_file,
                    stderr=log_file,
                )
            elif datatype.lower().edswith("qtl") and dataset_file.endswith(".csv"):
               pass
            else:
                return {"message": "Error: Invalid datatype.", "success": False}
        else:
            log_file.write("Manually uploaded dataset.\n")

        try:
            print("=======insert info into database==========")
            log_file.write("Inserting dataset info into database...\n")
            insert_study(study, session)
            insert_dataset(dataset, session)

            if dataset_dict["sample_sheet"] != "None":
                sample_sheet_path = f"backend/SampleSheets/{dataset_dict['sample_sheet']}"
                shutil.copyfile(sample_sheet_path, f"{dataset_path}/{dataset_dict['sample_sheet']}")
                import_sample_sheet(sample_sheet_path, session)

        except Exception as e:
            print(e)
            log_file.write(f"Error: {e}\n")
            return {"message": "Error: Failed to insert dataset info into database.", "success": False}
        finally:
            log_file.write("Done!\n")

    now = datetime.now()
    return {"message": "Data received successfully", "success": True, "jobId": dataset_name + now.strftime("%Y%m%d%H%M%S")}

@router.get("/getprocessingstatus")
async def getprocessingstatus(dataset: str =  Query(...), task: str = Query(...)):
    if task == "extract_data":
        log_file_path = f"backend/datasets/{dataset}/extractdata_output.log"
    if task == "prepare_metadata":
        log_file_path = f"backend/datasets/{dataset}/preparemeta_output.log"
    try:
        with open(log_file_path, "r") as f:
            log_content = f.read()
        if "Done!" in log_content:
            status = "completed"
        else:
            status = "processing"

        processingStatus = {
            "status": status,
            "log": log_content,
        }
        return processingStatus

    except Exception as e:
        status = "failed"
        processingStatus = {
            "status": status,
            "log": str(e),
        }
        return processingStatus


@router.get("/getdatasetfeatures")
async def getdatasetfeatures(dataset: str = Query(...)):
    dataset_path = f"backend/datasets/{dataset}"
    features_file = f"{dataset_path}/raw_metadata_columns.json"
    with open(features_file, "r") as f:
        features = json.load(f)
    return features

@router.post("/preparemetafeatures")
async def preparemetafeatures(data: MetaFeatureData, session: Session = Depends(get_session)):
    dataset = data.dataset
    selected_features = data.selected_features
    sample_id_column = data.sample_id_column
    major_cluster_column = data.major_cluster_column
    condition_column = data.condition_column

    if sample_id_column not in selected_features:
        selected_features.append(sample_id_column)

    if major_cluster_column not in selected_features:
        selected_features.append(major_cluster_column)

    if condition_column not in selected_features:
        selected_features.append(condition_column)

    dataset_path = f"backend/datasets/{dataset}"
    ## load dataset info
    with open(f"{dataset_path}/dataset_info.toml", 'r') as f:
        dataset_info = toml.load(f)
    dataset_info["meta_features"] = {
        "selected_features": selected_features,
        "sample_id_column": sample_id_column,
        "major_cluster_column": major_cluster_column,
        "condition_column": condition_column
    }

    with open(f"{dataset_path}/dataset_info.toml", 'w') as f:
        toml.dump(dataset_info, f)

    ## process meta data
    print("=======process meta data==========")
    # Open a file to log stdout and stderr
    log_file = open(f"{dataset_path}/preparemeta_output.log", "w")
    if dataset_info["seurat"]["datatype"].lower() in ["scrnaseq", "snrnaseq"]:
        subprocess.Popen(
            ["python3", "backend/funcs/rename_meta_SC.py",dataset_path, ",".join(selected_features), sample_id_column, major_cluster_column, condition_column],
            stdout=log_file,
            stderr=log_file,
        )
    elif dataset_info["seurat"]["datatype"].lower() in ["visiumst"]:
        subprocess.Popen(
            ["python3", "backend/funcs/rename_meta_Visium.py",dataset_path, ",".join(selected_features), sample_id_column, major_cluster_column, condition_column],
            stdout=log_file,
            stderr=log_file,
        )
    else:
        return {"message": "Error: Invalid datatype.", "success": False}

    return {"message": "Data received successfully", "success": True}

@router.get("/refreshdatabase")
async def refreshdatabase(session: Session = Depends(get_session)):
    try:
        ## loop through all datasets
        for dataset_i in os.listdir("backend/datasets"):
            dataset_path = f"backend/datasets/{dataset_i}"
            ## load dataset info
            dataset_info_file = f"{dataset_path}/dataset_info.toml"
            if not os.path.exists(dataset_info_file):
                continue

            with open(f"{dataset_path}/dataset_info.toml", 'r') as f:
                dataset_info = toml.load(f)


            print("=======insert info into database==========")
            study_dict= dataset_info["study"]
            study_dict["study_id"] = study_dict["study_name"]
            study = Study(**study_dict)

            dataset_dict = dataset_info["dataset"]
            dataset_dict["dataset_id"] = dataset_dict["dataset_name"]
            dataset_dict["study_id"] = study_dict["study_id"]
            dataset_dict["seurat"] = dataset_info["seurat"]["seurat_file"]
            dataset_dict["n_samples"] = int(dataset_dict["n_samples"])
            dataset = Dataset(**dataset_dict)

            insert_study(study, session)
            insert_dataset(dataset, session)

        return {"message": "Database refreshed successfully", "success": True}
    except Exception as e:
        return {"message": str(e), "success": False}



