from sqlmodel import SQLModel, Field, Relationship
import uuid
from typing import Optional


class ProjectBase(SQLModel):
    project_id: str = Field(unique=True, index=True, primary_key=True)
    name: str = Field(index=True)
    description: str = Field(default="NA")
    PI_full_name: str = Field(index=True)
    PI_email: str = Field(index=True)
    first_contributor: str = Field(index=True)
    other_contributors: str = Field(default="NA")
    support_grants: str = Field(default="NA")
    other_funding_source: Optional[str] | None = Field(default="NA")
    publication_DOI: str|None = Field(default="NA")
    publication_PMID: str|None = Field(default="NA")
    n_samples: int = Field(default="NA")
    sample_type: str = Field(default="NA")
    assay: str = Field(default="NA")
    DUA_version: str|None = Field(default="NA")

    study_id: str = Field(foreign_key="study.study_id")

class Project(ProjectBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    study: "Study" = Relationship(back_populates="project")
    samples: list["Sample"] = Relationship(back_populates="project")


class ProjectCreate(ProjectBase):
    pass