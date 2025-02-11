import numpy as np
from sqlmodel import SQLModel, Field, Relationship
import uuid
from typing import Optional


class StudyBase(SQLModel):
    study_id: str = Field(index=True, unique=True, primary_key=True)
    name: str = Field(index=True, unique=True)
    description: str = Field(default="NA")

    ASAP_team_name: str = Field(index=True)
    ASAP_lab_name: str = Field(index=True)

    team_dataset_id: str = Field(default="NA")
    dataset_name: str = Field(default="NA")

    PI_full_name: str = Field(index=True)
    PI_email: str = Field(index=True)
    contributor_names: str = Field(default="NA")
    submitter_name: str = Field(default="NA")
    submitter_email: str = Field(default="NA")
    ASAP_grant_id: str = Field(default="NA")
    publication_DOI: str = Field(default="NA")
    publication_PMID: str = Field(default="NA")
    number_of_samples: int = Field(default=np.nan)
    brain_regions: str = Field(default="NA")
    types_of_samples: str = Field(default="NA")
    DUA_version: str = Field(default="NA")

    ## Optional fields
    other_funding_source: Optional[str] | None = Field(default="NA")
    PI_ORCHID: Optional[str] | None = Field(default="NA")
    PI_google_scholar_id: Optional[str] | None = Field(default="NA")
    preprocessing_references: Optional[str] | None = Field(default="NA")
    metadata_version_date: Optional[str] | None = Field(default="NA")

class Study(StudyBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    dataset: list["Dataset"] = Relationship(back_populates="study")

class StudyCreate(StudyBase):
    pass

class StudyUpdate(SQLModel):
    ASAP_team_name: Optional[str] = Field(default="NA")
    ASAP_lab_name: Optional[str] = Field(default="NA")
    project_name: Optional[str] = Field(default="NA")
    team_dataset_id: Optional[str] = Field(default="NA")
    project_dataset: Optional[str] = Field(default="NA")
    project_description: Optional[str] = Field(default="NA")
    PI_full_name: Optional[str] = Field(default="NA")
    PI_email: Optional[str] = Field(default="NA")
    contributor_names: Optional[str] = Field(default="NA")
    submitter_name: Optional[str] = Field(default="NA")
    submitter_email: Optional[str] = Field(default="NA")
    ASAP_grant_id: Optional[str] = Field(default="NA")
    other_funding_source: Optional[str] = Field(default="NA")
    publication_DOI: Optional[str] = Field(default="NA")
    publication_PMID: Optional[str] = Field(default="NA")
    number_of_brain_samples: Optional[int] = Field(default="NA")
    brain_regions: Optional[str] = Field(default="NA")
    types_of_samples: Optional[str] = Field(default="NA")
    DUA_version: Optional[str] = Field(default="NA")

    PI_ORCHID: Optional[str] = Field(default="NA")
    PI_google_scholar_id: Optional[str] = Field(default="NA")
    preprocessing_references: Optional[str] = Field(default="NA")
    metadata_version_date: Optional[str] = Field(default="NA")

class StudyPublic(StudyBase):
    id: uuid.UUID

class StudiesPublic(SQLModel):
    data: list[StudyPublic]
    count: int
