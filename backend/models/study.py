import numpy as np
from sqlmodel import SQLModel, Field, Relationship
import uuid
from typing import Optional


class StudyBase(SQLModel):
    study_id: str = Field(index=True, unique=True, primary_key=True)
    study_name: str = Field(index=True, unique=True)
    description: str = Field(default="NA")

    team_name: str = Field(index=True)
    lab_name: str = Field(index=True)

    team_dataset_id: str = Field(default="NA")
    dataset_name: str = Field(default="NA")

    submitter_name: str = Field(default="NA")
    submitter_email: str = Field(default="NA")

class Study(StudyBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    dataset: list["Dataset"] = Relationship(back_populates="study")

class StudyCreate(StudyBase):
    pass

class StudyUpdate(SQLModel):
    study_name: Optional[str] = Field(default="NA")
    description: Optional[str] = Field(default="NA")
    team_dataset_id: Optional[str] = Field(default="NA")
    dataset_name: Optional[str] = Field(default="NA")

    submitter_name: Optional[str] = Field(default="NA")
    submitter_email: Optional[str] = Field(default="NA")

class StudyPublic(StudyBase):
    id: uuid.UUID

class StudiesPublic(SQLModel):
    data: list[StudyPublic]
    count: int
