from fastapi import APIRouter, HTTPException
from fastapi import Request
from fastapi.responses import JSONResponse, FileResponse


from backend.db import SessionDep
from backend.db_utils.crud import *
from backend.funcs.get_data import *

import os

router = APIRouter()

@router.get("/")
async def read_root():
    return {"Message": "Hello Visium."}


@router.get("/getimagedata")
async def getimagedata(request:Request):
    print("getimagedata() called================")
    dataset_id = request.query_params.get("dataset")
    sample = request.query_params.get("sample")
    print(dataset_id, sample)
    results = get_visium_image_data(dataset_id, sample)

    if "Error" in results:
        raise HTTPException(status_code=404, detail=results)

    image_file = os.path.join("backend","datasets",dataset_id,'images',sample+".png")
    image = FileResponse(image_file, media_type="image/png", filename="sliceImage.png")

    response = {"coordinates": results["coordinates"], "scales": results["scales"], "image": image}
    if "Error" in response:
        raise HTTPException(status_code=404, detail="Error in getting UMAP matrix.")
    return response



