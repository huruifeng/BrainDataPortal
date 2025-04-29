from fastapi import APIRouter, Depends
import os
import json

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

@router.post("/processdataset")
async def processdataset(data: SubmissionData, session: Session = Depends(get_session)):
    seurat = data.seurat_info.seurat
    datatype = data.seurat_info.datatype
    dataset_name = data.dataset_info.dataset_name

    print("========get dict=========")
    study_dict = data.study_info.model_dump()
    protocol_dict = data.protocol_info.model_dump()
    dataset_dict = data.dataset_info.model_dump()

    print("=======insert study==========")
    study_dict["study_id"] = study_dict["study_name"]
    study = Study(**study_dict)

    print("=======insert dataset==========")
    dataset_dict["dataset_id"] = dataset_name
    dataset_dict["study_id"] = study_dict["study_id"]
    dataset_dict["seurat"] = seurat
    dataset = Dataset(**dataset_dict)

    # Insert into DB
    insert_study(study, session)
    insert_dataset(dataset, session)


    return {"message": "Data received successfully", "data": data}

