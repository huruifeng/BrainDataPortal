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
        if not get_data_by_id(data_id,session):
            raise HTTPException(status_code=404, detail="Data not found")
        return get_data_by_id(data_id,session)


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
        if not get_sample_by_id(sample_id,session):
            raise HTTPException(status_code=404, detail="Sample not found")
        return get_sample_by_id(sample_id,session)

