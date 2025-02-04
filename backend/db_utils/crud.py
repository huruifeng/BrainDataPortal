import uuid

from fastapi import Depends, HTTPException
from sqlmodel import Session, select

from backend.models.data import Data
from backend.models.study import Study
from backend.models.sample import Sample
from backend.models.protocol import Protocol
from backend.models.subject import Subject
from backend.models.clinpath import Clinpath

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
        raise HTTPException(status_code=404, detail="Data not found")

    return data

def get_all_data(session):
    statement = select(Data)  # Create a SELECT query
    result = session.exec(statement)  # Execute the query
    return result.all()  # Fetch all results




