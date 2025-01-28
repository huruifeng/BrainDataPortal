import uuid
from sqlmodel import SQLModel, Field, Relationship
from typing import Optional


class SampleBase(SQLModel):
    sample_id: str = Field(index=True, unique=True)
    subject_id: str = Field(index=True)
    source_sample_id: str = Field(index=True)
    replicate: str = Field(index=True)
    replicate_count: int = Field(default=None)
    repeated_sample: int = Field(default=None)
    batch: str = Field(default=None)
    tissue: str = Field(default=None)
    brain_region: str = Field(default=None)
    hemisphere: str = Field(default=None)
    region_level_1: str = Field(default=None)
    region_level_2: str = Field(default=None)
    region_level_3: str = Field(default=None)
    RIN: float = Field(default=None)
    source_RIN: float = Field(default=None)
    molecular_source: str = Field(default=None)
    input_cell_count: int = Field(default=None)
    assay: str = Field(default=None)
    sequencing_end: str = Field(default=None)
    sequencing_length: str = Field(default=None)
    sequencing_instrument: str = Field(default=None)
    organism_ontology_term_id: str = Field(default=None)
    development_stage_ontology_term_id: str = Field(default=None)
    sex_ontology_term_id: str = Field(default=None)
    self_reported_ethnicity_ontology_term_id: str = Field(default=None)
    disease_ontology_term_id: str = Field(default=None)
    tissue_ontology_term_id: str = Field(default=None)
    cell_type_ontology_term_id: str = Field(default=None)
    assay_ontology_term_id: str = Field(default=None)
    suspension_type: str = Field(default=None)
    DV200: Optional[float] = Field(default=None)
    pm_PH: Optional[float] = Field(default=None)
    donor_id: Optional[str] = Field(default=None)

    sample_data_type: str = Field(default=None)
    sample_data_location: str = Field(default=None)

class Sample(SampleBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)

class SampleCreate(SampleBase):
    pass

class SampleUpdate(SQLModel):
    sample_id: Optional[str] = Field(default=None)
    subject_id: Optional[str] = Field(default=None)
    source_sample_id: Optional[str] = Field(default=None)
    replicate: Optional[str] = Field(default=None)
    replicate_count: Optional[int] = Field(default=None)
    repeated_sample: Optional[int] = Field(default=None)
    batch: Optional[str] = Field(default=None)
    tissue: Optional[str] = Field(default=None)
    brain_region: Optional[str] = Field(default=None)
    hemisphere: Optional[str] = Field(default=None)
    region_level_1: Optional[str] = Field(default=None)
    region_level_2: Optional[str] = Field(default=None)
    region_level_3: Optional[str] = Field(default=None)
    RIN: Optional[float] = Field(default=None)
    source_RIN: Optional[float] = Field(default=None)
    molecular_source: Optional[str] = Field(default=None)
    input_cell_count: Optional[int] = Field(default=None)
    assay: Optional[str] = Field(default=None)
    sequencing_end: Optional[str] = Field(default=None)
    sequencing_length: Optional[str] = Field(default=None)
    sequencing_instrument: Optional[str] = Field(default=None)
    organism_ontology_term_id: Optional[str] = Field(default=None)
    development_stage_ontology_term_id: Optional[str] = Field(default=None)
    sex_ontology_term_id: Optional[str] = Field(default=None)
    self_reported_ethnicity_ontology_term_id: Optional[str] = Field(default=None)
    disease_ontology_term_id: Optional[str] = Field(default=None)
    tissue_ontology_term_id: Optional[str] = Field(default=None)
    cell_type_ontology_term_id: Optional[str] = Field(default=None)
    assay_ontology_term_id: Optional[str] = Field(default=None)
    suspension_type: Optional[str] = Field(default=None)
    DV200: Optional[float] = Field(default=None)
    pm_PH: Optional[float] = Field(default=None)
    donor_id: Optional[str] = Field(default=None)


class SamplePublic(SampleBase):
    id: uuid.UUID

class SamplesPublic(SQLModel):
    data: list[SamplePublic]
    count: int

