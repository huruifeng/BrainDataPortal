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
        raise HTTPException(status_code=404, detail="Data not found")
    return data

def get_all_data(session):
    statement = select(Data)  # Create a SELECT query
    result = session.exec(statement)  # Execute the query
    return result.all()  # Fetch all results

def get_sample_by_id(sample_id: str, session):
    if not sample_id:
        raise ValueError("sample_id is empty")
    statement = select(Sample).where(Sample.sample_id == sample_id)  # Create a SELECT query
    sample = session.exec(statement).first()

    if not sample:
        raise HTTPException(status_code=404, detail="Sample not found")
    return sample

def get_all_samples(session):
    statement = select(Sample)
    result = session.exec(statement)
    return result.all()

def get_sample_by_conditions(conditions: dict, session):
    statement = select(Sample).where(conditions)
    result = session.exec(statement)
    return result.all()

def get_project_by_id(project_id: str, session):
    if not id:
        raise ValueError("project id is empty")
    statement = select(Project).where(Project.project_id == project_id)  # Create a SELECT query
    project = session.exec(statement).first()

    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

def get_all_projects(session):
    statement = select(Project)
    result = session.exec(statement)
    return result.all()

## ===================================================
## update functions


