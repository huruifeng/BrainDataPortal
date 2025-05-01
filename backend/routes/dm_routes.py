import subprocess
from datetime import datetime
from fastapi import APIRouter, Depends, Query
from fastapi.responses import PlainTextResponse
import os

from pydantic import BaseModel
from typing import Optional

from sqlmodel import Session

from backend.db import get_session
from backend.db_utils.crud import insert_study, insert_dataset
from backend.models import Study, Dataset

router = APIRouter()

class SeuratInfo(BaseModel):
    seurat: str
    datatype: str

class DatasetInfo(BaseModel):
    dataset_name: str
    assay: str
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
    n_samples: Optional[int] = None
    brain_super_region: Optional[str] = None
    brain_region: Optional[str] = None
    sample_info: Optional[str] = None

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
    seurat_info: SeuratInfo
    dataset_info: DatasetInfo
    study_info: StudyInfo
    protocol_info: ProtocolInfo

@router.get("/")
async def dm_root():
    return {"Message": "Hello DataManager."}

@router.get("/getseuratobjects")
async def getseuratobjects():
    file_path = "backend/Seurats"
    file_ls = os.listdir(file_path)
    for file in file_ls:
        if not file.endswith(".rds"):
            file_ls.remove(file)
    return file_ls

@router.get("/checkdatasetname")
async def checkdatasetname(name: str):
    path_str = "backend/datasets/" + name
    if os.path.exists(path_str):
        return {"isUnique": False}
    return {"isUnique": True}

@router.post("/processdataset")
async def processdataset(data: SubmissionData, session: Session = Depends(get_session)):
    seurat = data.seurat_info.seurat
    datatype = data.seurat_info.datatype
    dataset_name = data.dataset_info.dataset_name

    print("========get data dict=========")
    study_dict = data.study_info.model_dump()
    protocol_dict = data.protocol_info.model_dump()
    dataset_dict = data.dataset_info.model_dump()

    study_dict["study_id"] = study_dict["study_name"]
    study = Study(**study_dict)

    dataset_dict["dataset_id"] = dataset_name
    dataset_dict["study_id"] = study_dict["study_id"]
    dataset_dict["seurat"] = seurat
    dataset = Dataset(**dataset_dict)

    ## check if dataset exists
    print("=======set dataset path==========")
    dataset_path = "backend/datasets/" + dataset_name
    if not os.path.exists(dataset_path):
        os.makedirs(dataset_path)

    ## process seurat
    print("=======process seurat==========")
    # Open a file to log stdout and stderr
    log_file = open(f"{dataset_path}/extract_seurat_output.log", "w")
    if datatype.lower() in ["scrnaseq", "snrnaseq"]:
        subprocess.Popen(
            ["Rscript", "backend/funcs/extract_SC.R", f"backend/Seurats/{seurat}", dataset_path],
            stdout=log_file,
            stderr=log_file,
        )
    elif datatype.lower() in ["visiumst"]:
        subprocess.Popen(
            ["Rscript", "backend/funcs/extract_Visium.R", f"backend/Seurats/{seurat}", dataset_path],
            stdout=log_file,
            stderr=log_file,
        )
    else:
        return {"message": "Error: Invalid datatype.", "success": False}


    # ## process metadata
    # print("=======process metadata==========")
    # # Open a file to log stdout and stderr
    # log_file = open(f"{dataset_path}/process_metadata_output.log", "w")
    # subprocess.Popen(
    #     ["Rscript", "backend/funcs/extract_metadata.R", f"backend/Seurats/{seurat}", dataset_path],
    #     stdout=log_file,
    #     stderr=log_file,
    # )


    print("=======insert info into database==========")
    # insert_study(study, session)
    # insert_dataset(dataset, session)

    now = datetime.now()
    return {"message": "Data received successfully", "success": True, "jobId": dataset_name + now.strftime("%Y%m%d%H%M%S")}

@router.get("/extractseuratstatus")
async def extractseuratstatus(dataset: str =  Query(...)):
    log_file_path = f"backend/datasets/{dataset}/extract_seurat_output.log"
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
