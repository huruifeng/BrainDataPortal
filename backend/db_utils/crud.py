import uuid

from fastapi import Depends, HTTPException
from sqlmodel import Session, select

from backend.models import *

from backend.db import get_session


## ===================================================
## insert functions
def insert_data(data: Data, session: Session = Depends(get_session)):
    session.add(data)
    session.commit()
    session.refresh(data)
    return data

def insert_study(study: Study, session: Session = Depends(get_session)):
    session.add(study)
    session.commit()
    session.refresh(study)
    return study

def insert_sample(sample: Sample, session: Session = Depends(get_session)):
    session.add(sample)
    session.commit()
    session.refresh(sample)
    return sample

def insert_protocol(protocol: Protocol, session: Session = Depends(get_session)):
    session.add(protocol)
    session.commit()
    session.refresh(protocol)
    return protocol

def insert_subject(subject: Subject, session: Session = Depends(get_session)):
    session.add(subject)
    session.commit()
    session.refresh(subject)
    return subject

def insert_clinpath(clinpath: Clinpath, session: Session = Depends(get_session)):
    session.add(clinpath)
    session.commit()
    session.refresh(clinpath)
    return clinpath

## ===================================================
## read functions
def get_data_by_id(id: uuid.UUID, session):
    if not id:
        raise ValueError("id is empty")
    data = session.get(Data, id)

    if not data:
        raise HTTPException(status_code=404, detail="Sample not found")
    return data

def get_all_data(session):
    statement = select(Data)  # Create a SELECT query
    result = session.exec(statement)  # Execute the query
    return result.all()  # Fetch all results

def get_all_samples(session):
    statement = select(Sample)
    result = session.exec(statement)
    return result.all()

def get_sample_by_conditions(conditions: dict, session):
    query = select(Sample)
    for key, value in conditions.items():
        if hasattr(Sample, key):
            query = query.where(getattr(Sample, key).in_(value))
        else:
            pass

    result = session.exec(query)
    return result.all()

def get_dataset_by_id(dataset_id: str, session):
    if not id:
        raise ValueError("dataset id is empty")
    statement = select(Dataset).where(Dataset.dataset_id == dataset_id)  # Create a SELECT query
    result = session.exec(statement).first()

    if not result:
        raise HTTPException(status_code=404, detail="Dataset not found")
    return result

def get_all_datasets(session):
    statement = select(Dataset)
    result = session.exec(statement)
    return result.all()

## ===================================================
## update functions


