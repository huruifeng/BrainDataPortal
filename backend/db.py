from typing import Annotated
from sqlmodel import Session, SQLModel
from sqlmodel import create_engine
from fastapi import Depends

from backend.models.data import Data
from backend.models.study import Study
from backend.models.sample import Sample
from backend.models.protocol import Protocol
from backend.models.subject import Subject
from backend.models.clinpath import Clinpath

# DATABASE_URL = "sqlite:///./database.db"
DATABASE_URL = "postgresql://huruifeng:123456&Abc@localhost:5432/braindataportal"
engine = create_engine(DATABASE_URL, echo=True)

def create_db_and_tables():
    ## Create database and tables only if they don't exist
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_session)]