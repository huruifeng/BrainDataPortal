import uuid
from sqlmodel import SQLModel, Field, Relationship
from typing import Optional


class SubjectBase(SQLModel):
    subject_id: str = Field(unique=True, index=True)
    source_subject_id: str = Field(index=True)
    AMPPD_id: str = Field(index=True)
    GP2_id: str = Field(index=True)
    biobank_name: str = Field(index=True)
    organism: str = Field(index=True)
    sex: str = Field(index=True)
    age_at_collection: float = Field(index=True)
    race: str = Field(index=True)
    ethnicity: str = Field(index=True)
    family_history: str = Field(index=True)
    last_diagnosis: str = Field(index=True)
    age_at_onset: int = Field(ge=0, le=120)
    age_at_diagnosis: int = Field(ge=0, le=120)
    first_motor_symptom: int = Field(ge=0, le=120)   ## Age in years at which first motor symptoms manifest. Between 0 and 120
    hx_dementia_mci: str = Field(index=True)
    hx_melanoma: str = Field(index=True)
    education_level: str = Field(index=True)
    smoking_status: str = Field(index=True)
    smoking_years: Optional[int] = Field(default=None)
    APOE_e4_status: str = Field(index=True)
    cognitive_status: str = Field(index=True)
    time_from_baseline: int = Field(default=None)
    primary_diagnosis: str = Field(default=None)
    primary_diagnosis_text: Optional[str] = Field(default=None)

class Subject(SubjectBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)

class SubjectCreate(SubjectBase):
    pass

class SubjectUpdate(SubjectBase):
    pass

class SubjectPublic(SubjectBase):
    id: uuid.UUID

class SubjectsPublic(SQLModel):
    data: list[SubjectPublic]
    count: int