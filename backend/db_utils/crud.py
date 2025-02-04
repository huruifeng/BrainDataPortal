from backend.models.data import Data
from backend.models.study import Study
from backend.models.sample import Sample
from backend.models.protocol import Protocol
from backend.models.subject import Subject
from backend.models.clinpath import Clinpath

from backend.db import SessionDep

def insert_data(data: Data, session: SessionDep):
    session.add(data)
    session.commit()
    session.refresh(data)
    return data

def insert_study(study: Study, session: SessionDep):
    session.add(study)
    session.commit()
    session.refresh(study)
    return study

def insert_sample(sample: Sample, session: SessionDep):
    session.add(sample)
    session.commit()
    session.refresh(sample)
    return sample

def insert_protocol(protocol: Protocol, session: SessionDep):
    session.add(protocol)
    session.commit()
    session.refresh(protocol)
    return protocol

def insert_subject(subject: Subject, session: SessionDep):
    session.add(subject)
    session.commit()
    session.refresh(subject)
    return subject

def insert_clinpath(clinpath: Clinpath, session: SessionDep):
    session.add(clinpath)
    session.commit()
    session.refresh(clinpath)
    return clinpath




