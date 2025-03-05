from fastapi import APIRouter, HTTPException
from starlette.requests import Request

from backend.db import SessionDep
from backend.db_utils.crud import *
from backend.funcs.get_data import *

router = APIRouter()

@router.get("/")
async def read_root():
    return {"Message": "Hello API."}


@router.get("/getgenelist")
async def getgenelist(request:Request):
    print("getgenelist() called================")
    dataset_id = request.query_params.get("dataset")
    query_str = request.query_params.get("query_str")

    response = get_gene_list(dataset_id, query_str)
    # print (response)
    if "Error" in response:
        raise HTTPException(status_code=404, detail="Error in getting gene list.")
    return response

@router.get("/getsamplelist")
async def getsamplelist(request:Request):
    print("getsamplelist() called================")
    dataset_id = request.query_params.get("dataset")
    query_str = request.query_params.get("query_str")

    response = get_sample_list(dataset_id, query_str)
    # print (response)
    if "Error" in response:
        raise HTTPException(status_code=404, detail="Error in getting sample list.")
    return response

@router.get("/getmetalist")
async def getmetalist(request:Request):
    print("getmetalist() called================")
    dataset_id = request.query_params.get("dataset")
    query_str = request.query_params.get("query_str")

    response = get_meta_list(dataset_id, query_str)
    # print (response)
    if "Error" in response:
        raise HTTPException(status_code=404, detail="Error in getting Meta list.")
    return response


@router.get("/getumapembedding")
async def getumapembedding(request:Request):
    print("getumapembedding() called================")
    dataset_id = request.query_params.get("dataset")

    response = get_umapembedding(dataset_id)
    # print (response)
    if "Error" in response:
        raise HTTPException(status_code=404, detail="Error in getting Meta list.")
    return response


@router.get("/getsamplemetadata")
async def getsamplemetadata(request:Request):
    print("getsamplemetadata() called================")
    dataset_id = request.query_params.get("dataset")
    sample = request.query_params.get("sample")
    meta = request.query_params.get("meta")

    response = get_sample_metadata(dataset_id, sample,meta)
    # print (response)
    if "Error" in response:
        raise HTTPException(status_code=404, detail="Error in getting sample metadata.")
    return response

@router.get("/getexprdata")
async def getexprdata(request:Request):
    print("getgeneexprdata() called================")
    dataset_id = request.query_params.get("dataset")
    gene = request.query_params.get("gene")

    response = get_gene_expr_data(dataset_id, gene)
    # print (response)
    if "Error" in response:
        raise HTTPException(status_code=404, detail="Error in getting expression data.")
    return response

@router.get("/getallmetadata")
async def getallmetadata(request:Request):
    print("getallmetadata() called================")
    dataset = request.query_params.get("dataset_id")
    dataset_type = request.query_params.get("dataset_type")

    if dataset_type == "visium":
        drop_cols = ["UMAP_1", "UMAP_2"]
    else:
        drop_cols = None
    metadata = get_all_metadata(dataset, drop_cols=drop_cols)

    if "Error" in metadata:
        raise HTTPException(status_code=404, detail=meta)

    return metadata

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
