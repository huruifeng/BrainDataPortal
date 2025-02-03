import uuid

import numpy as np
from fastapi import APIRouter, HTTPException
import pandas as pd
from db import engine

router = APIRouter()

@router.get("/import_csv/{table}", tags=["db"])
async def import_csv(table: str):
    empty_data_lst = [None, "none","Null","null","na", np.nan, "Unknown","unknown","NaN","nan","N/A"]
    if table == "sample":
        # Logic to import sample data
        ## read the csv file

        ## insert the data into the database

        return {"success": True,"message": "Sample data imported successfully"}
    elif table == "protocol":
        try:
            df = pd.read_csv("files/Protocol.csv")
            df['id'] = [uuid.uuid4() for _ in range(len(df))]
            df.replace(empty_data_lst, "NA", inplace=True)
            df.to_sql(table, engine, if_exists="append", index=False)
            return {"success": True, "message": "Protocol data imported successfully"}
        except Exception as e:
            print(e)
            return {"success": False, "message": str(e)}

    elif table == "subject":
        try:
            df = pd.read_csv("files/Subject.csv")
            df['id'] = [uuid.uuid4() for _ in range(len(df))]
            df.replace(empty_data_lst, "NA", inplace=True)

            df.loc[df['age_at_collection']=="NA", 'age_at_collection'] = -1
            df.loc[df['age_at_onset']=="NA", 'age_at_onset'] = -1
            df.loc[df['age_at_diagnosis']=="NA", 'age_at_diagnosis'] = -1
            df.loc[df['first_motor_symptom']=="NA", 'first_motor_symptom'] = -1
            df.loc[df['smoking_years']=="NA", 'smoking_years'] = -1
            df.loc[df['time_from_baseline']=="NA", 'time_from_baseline'] = -1

            df.to_sql(table, engine, if_exists="append", index=False)
            return {"success": True, "message": "Protocol data imported successfully"}
        except Exception as e:
            print(e)
            return {"success": False, "message": str(e)}

    elif table == "data":
        try:
            df = pd.read_csv("files/Data.csv")
            df['id'] = [uuid.uuid4() for _ in range(len(df))]
            df.replace(empty_data_lst, "NA", inplace=True)
            df.loc[df['replicate_count']=="NA", 'replicate_count'] = -1
            df.loc[df['repeated_sample']=="NA", 'repeated_sample'] = -1
            df.loc[df['time']=="NA", 'time'] = -1

            df.to_sql(table, engine, if_exists="append", index=False)
            return {"success": True, "message": "Protocol data imported successfully"}
        except Exception as e:
            print(e)
            return {"success": False, "message": str(e)}

    elif table == "clinpath":
        try:
            df = pd.read_csv("files/Clinpath.csv")
            df['id'] = [uuid.uuid4() for _ in range(len(df))]
            df.replace(empty_data_lst, "NA", inplace=True)
            df.loc[df['path_year_death']=="NA", 'path_year_death'] = -1
            df.loc[df['age_at_death']=="NA", 'age_at_death'] = -1
            df.loc[df['brain_weight']=="NA", 'brain_weight'] = -1
            df.loc[df['duration_pmi']=="NA", 'duration_pmi'] = -1

            df.to_sql(table, engine, if_exists="append", index=False)
            return {"success": True, "message": "Protocol data imported successfully"}
        except Exception as e:
            print(e)
            return {"success": False, "message": str(e)}

    elif table == "study":
        try:
            df = pd.read_csv("files/Study.csv")
            df['id'] = [uuid.uuid4() for _ in range(len(df))]
            df.replace(empty_data_lst, "NA", inplace=True)
            df.to_sql(table, engine, if_exists="append", index=False)
            return {"success": True, "message": "Protocol data imported successfully"}
        except Exception as e:
            print(e)
            return {"success": False, "message": str(e)}
    else:
        return {"success": False, "message": "Invalid path/table"}

