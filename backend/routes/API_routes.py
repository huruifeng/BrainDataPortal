from fastapi import APIRouter, HTTPException
from starlette.requests import Request

from backend.db import SessionDep
from backend.db_utils.crud import *
from backend.funcs.get_data import get_umap_data

router = APIRouter()

@router.get("/")
async def read_root():
    return {"Hello": "World"}

@router.get("/getumapdata/")
async def get_umapdata(request:Request, session: SessionDep):
    samples = request.query_params.getlist("sample_id")
    genes = request.query_params.getlist("gene_id")
    if not samples or not genes:
        raise HTTPException(status_code=400, detail="Sample_id or gene_id is empty")
    response = get_umap_data(samples, genes)
    return response

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


@router.get("/getsample")
async def get_sample(request:Request, session: SessionDep):
    sample_ids = request.query_params.getlist("sample_id")
    project_ids = request.query_params.getlist("project_id")
    conditions = {k: request.query_params.getlist(k) for k, v in request.query_params.items()}

    if not sample_ids and not project_ids:
        raise HTTPException(status_code=400, detail="Project_id or sample_id is empty")

    if project_ids[0] == "all":
        conditions.pop("project_id")
        if sample_ids[0] == "all":
            sample = get_all_samples(session)
            if not sample:
                raise HTTPException(status_code=404, detail="Sample table is empty")
            return sample
        else:
            sample = get_sample_by_conditions(conditions,session)
            if not sample:
                raise HTTPException(status_code=404, detail="Sample not found")
            return sample
    else:
        if sample_ids[0] == "all":
            conditions.pop("sample_id")
            samples = get_sample_by_conditions(conditions,session)
            if not samples:
                raise HTTPException(status_code=404, detail="Sample table is empty")
            return samples
        else:
            sample = get_sample_by_conditions(conditions,session)
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
