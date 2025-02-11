import numpy as np
from sqlmodel import SQLModel, Field, Relationship
import uuid
from typing import Optional


class DatasetBase(SQLModel):
    dataset_id: str = Field(unique=True, index=True, primary_key=True)
    name: str = Field(index=True)
    description: str = Field(default="NA")
    dataset_name: str = Field(default="NA")
    PI_full_name: str = Field(index=True)
    PI_email: str = Field(index=True)
    first_contributor: str = Field(index=True)
    first_contributor_email: str = Field(index=True)
    other_contributors: str = Field(default="NA")
    support_grants: str = Field(default="NA")
    other_funding_source: Optional[str] | None = Field(default="NA")
    publication_DOI: str|None = Field(default="NA")
    publication_PMID: str|None = Field(default="NA")
    n_samples: int = Field(default=np.nan)
    brain_regions: str = Field(default="NA")
    sample_type: str = Field(default="NA")
    assay: str = Field(default="NA")

    study_id: str = Field(foreign_key="study.study_id")

class Dataset(DatasetBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    study: "Study" = Relationship(back_populates="dataset")
    dataset_samples: list["Sample"] = Relationship(back_populates="dataset")


class DatasetCreate(DatasetBase):
    pass