from sqlmodel import SQLModel, Field, Relationship
import uuid
from typing import Optional


class StudyBase(SQLModel):
    ASAP_team_name: str = Field(unique=True, index=True)
    ASAP_lab_name: str = Field(unique=True, index=True)
    project_name: str = Field(index=True)
    team_dataset_id: str = Field(default=None)
    project_dataset: str = Field(default=None)
    project_description: str = Field(default=None)
    PI_full_name: str = Field(index=True)
    PI_email: str = Field(index=True)
    contributor_names: str = Field(default=None)
    submitter_name: str = Field(default=None)
    submitter_email: str = Field(default=None)
    ASAP_grant_id: str = Field(default=None)
    publication_DOI: str = Field(default=None)
    publication_PMID: str = Field(default=None)
    number_of_brain_samples: int = Field(default=None)
    brain_regions: str = Field(default=None)
    types_of_samples: str = Field(default=None)
    DUA_version: str = Field(default=None)

    ## Optional fields
    other_funding_source: Optional[str] = Field(default=None)
    PI_ORCHID: Optional[str] = Field(default=None)
    PI_google_scholar_id: Optional[str] = Field(default=None)
    preprocessing_references: Optional[str] = Field(default=None)
    metadata_version_date: Optional[str] = Field(default=None)

class Study(StudyBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)

class StudyCreate(StudyBase):
    pass

class StudyUpdate(SQLModel):
    ASAP_team_name: Optional[str] = Field(default=None)
    ASAP_lab_name: Optional[str] = Field(default=None)
    project_name: Optional[str] = Field(default=None)
    team_dataset_id: Optional[str] = Field(default=None)
    project_dataset: Optional[str] = Field(default=None)
    project_description: Optional[str] = Field(default=None)
    PI_full_name: Optional[str] = Field(default=None)
    PI_email: Optional[str] = Field(default=None)
    contributor_names: Optional[str] = Field(default=None)
    submitter_name: Optional[str] = Field(default=None)
    submitter_email: Optional[str] = Field(default=None)
    ASAP_grant_id: Optional[str] = Field(default=None)
    other_funding_source: Optional[str] = Field(default=None)
    publication_DOI: Optional[str] = Field(default=None)
    publication_PMID: Optional[str] = Field(default=None)
    number_of_brain_samples: Optional[int] = Field(default=None)
    brain_regions: Optional[str] = Field(default=None)
    types_of_samples: Optional[str] = Field(default=None)
    DUA_version: Optional[str] = Field(default=None)

    PI_ORCHID: Optional[str] = Field(default=None)
    PI_google_scholar_id: Optional[str] = Field(default=None)
    preprocessing_references: Optional[str] = Field(default=None)
    metadata_version_date: Optional[str] = Field(default=None)

class StudyPublic(StudyBase):
    id: uuid.UUID

class StudiesPublic(SQLModel):
    data: list[StudyPublic]
    count: int
