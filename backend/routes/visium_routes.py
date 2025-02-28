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
    slice_sample = request.query_params.get("sample")

    coordinates, scales = get_visium_image_data(dataset_id, slice_sample)

    image_file = os.path.join("backend","datasets",dataset_id,'images',slice_sample+".png")
    image = FileResponse(image_file, media_type="image/png", filename="sliceImage.png")

    response = {"coordinates": coordinates, "scales": scales, "image": image}
    if "Error" in response:
        raise HTTPException(status_code=404, detail="Error in getting UMAP matrix.")
    return response



