from fastapi import APIRouter, HTTPException
from starlette.requests import Request

from backend.db import SessionDep
from backend.db_utils.crud import *
from backend.funcs.get_data import *

router = APIRouter()

@router.get("/")
async def read_root():
    return {"Hello": "World"}

@router.get("/getumapdata")
async def getumapdata(request:Request):
    print("getumapdata() called================")
    dataset = request.query_params.get("dataset")
    samples = request.query_params.getlist("samples[]")
    genes = request.query_params.getlist("genes[]")

    response = get_umap_chart(dataset,samples, genes)
    # print (response)
    if not response:
        raise HTTPException(status_code=404, detail="Error in getting UMAP matrix.")
    return response

@router.get("/getgenemeta")
async def getallgenemeta(request:Request):
    dataset = request.query_params.get("dataset_id")
    genes = get_all_genes(dataset)
    meta = get_meta_names(dataset)

    if "Error" in genes:
        raise HTTPException(status_code=404, detail="Gene list file is missing")

    if "Error" in meta:
        raise HTTPException(status_code=404, detail="Dataset not specified or Meta file is missing")

    response = {"genes": genes, "meta": meta}
    return response

@router.get("/getdata/{data_id}")
async def getdata(data_id: str | uuid.UUID, session: SessionDep):
    if not data_id:
        raise HTTPException(status_code=400, detail="data_id is empty")

    if data_id == "all":
        data = get_all_data(session)
        if not data:
            raise HTTPException(status_code=404, detail="Sample table is empty")
        return data
    else:
        data = get_data_by_id(data_id,session)
        if not data:
            raise HTTPException(status_code=404, detail="Sample not found")
        return data


@router.get("/getsample")
async def getsample(request:Request, session: SessionDep):
    sample_ids = request.query_params.getlist("sample_id")
    dataset_ids = request.query_params.getlist("dataset_id")
    conditions = {k: request.query_params.getlist(k) for k, v in request.query_params.items()}

    if not sample_ids and not dataset_ids:
        raise HTTPException(status_code=400, detail="Dataset_id or sample_id is empty")

    if dataset_ids[0] == "all":
        conditions.pop("dataset_id")
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


@router.get("/getdataset/{dataset_id}")
async def getdataset(dataset_id: str | uuid.UUID, session: SessionDep):
    if not dataset_id:
        raise HTTPException(status_code=400, detail="dataset_id is empty")

    if dataset_id == "all":
        datasets = get_all_datasets(session)
        if not datasets:
            raise HTTPException(status_code=404, detail="Dataset table is empty")
        return datasets
    else:
        dataset = get_dataset_by_id(dataset_id,session)
        if not dataset:
            raise HTTPException(status_code=404, detail="dataset not found")
        return dataset
