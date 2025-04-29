from fastapi import APIRouter, HTTPException
import os

router = APIRouter()

@router.get("/")
async def read_root():
    return {"Message": "Hello DataManager."}

@router.get("/getseuratobjects")
async def getseuratobjects():
    file_path = "backend/Seurats"
    file_ls = os.listdir(file_path)
    for file in file_ls:
        if not file.endswith(".rds"):
            file_ls.remove(file)
    return file_ls