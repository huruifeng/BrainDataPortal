from fastapi import APIRouter, HTTPException

from backend.db import SessionDep
from backend.db_utils.crud import *

router = APIRouter()


@router.get("/getdata/{data_id}")
async def get_data(data_id: str | uuid.UUID, session: SessionDep):
    if not data_id:
        raise HTTPException(status_code=400, detail="data_id is empty")

    if data_id == "all":
        data = get_all_data(session)
        if not data:
            raise HTTPException(status_code=404, detail="Data table is empty")
        return data
    else:
        data = get_data_by_id(data_id,session)
        if not data:
            raise HTTPException(status_code=404, detail="Data not found")
        return data


@router.get("/getsample/{sample_id}")
async def get_sample(sample_id: str | uuid.UUID, session: SessionDep):
    if not sample_id:
        raise HTTPException(status_code=400, detail="sample_id is empty")

    if sample_id == "all":
        sample = get_all_samples(session)
        if not sample:
            raise HTTPException(status_code=404, detail="Sample table is empty")
        return sample
    else:
        sample = get_sample_by_id(sample_id,session)
        if not sample:
            raise HTTPException(status_code=404, detail="Sample not found")
        return sample

@router.get("/getproject/{project_id}")
async def get_project(project_id: str | uuid.UUID, session: SessionDep):
    if not project_id:
        raise HTTPException(status_code=400, detail="project_id is empty")

    if project_id == "all":
        projects = get_all_projects(session)
        if not projects:
            raise HTTPException(status_code=404, detail="Project table is empty")
        return projects
    else:
        project = get_project_by_id(project_id,session)
        if not project:
            raise HTTPException(status_code=404, detail="project not found")
        return project

@router.get("/getsample_by_conditions/")
async def getsample_conditions(conditions: dict, session: SessionDep):
    samples = get_sample_by_conditions(conditions, session)
    return samples


