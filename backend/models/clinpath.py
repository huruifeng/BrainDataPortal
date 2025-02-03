import uuid
from sqlmodel import SQLModel, Field, Relationship
from typing import Optional

class ClinpathBase(SQLModel):
    subject_id: str = Field(index=True)
    source_subject_id: str = Field(index=True)
    duration_pmi:float = Field()
    path_autopsy_dx_main: str = Field()
    path_autopsy_second_dx: Optional[str] = Field()
    path_autopsy_third_dx: Optional[str] = Field()
    path_autopsy_fourth_dx: Optional[str] = Field()
    path_autopsy_fifth_dx: Optional[str] = Field()
    path_autopsy_sixth_dx: Optional[str] = Field()
    path_autopsy_seventh_dx: Optional[str] = Field()
    path_autopsy_eight_dx: Optional[str] = Field()
    path_year_death: int = Field(ge=1920, le=2050)
    age_at_death: int = Field()
    cause_death: str = Field()
    other_cause_death_1: Optional[str] = Field()
    other_cause_death_2: Optional[str] = Field()
    brain_weight: float = Field()
    path_braak_nft: str = Field()
    path_braak_asyn: str = Field()
    path_cerad: str = Field()
    path_thal: str = Field()
    known_pathogenic_mutation: Optional[str] = Field()
    PD_pathogenic_mutation: Optional[str] = Field()
    path_mckeith: Optional[str] = Field()
    sn_neuronal_loss: Optional[str] = Field()
    path_infarcs: Optional[str] = Field()
    path_nia_ri: Optional[str] = Field()
    path_nia_aa_a: Optional[str] = Field()
    path_nia_aa_b: Optional[str] = Field()
    path_nia_aa_c: Optional[str] = Field()
    TDP43: Optional[str] = Field()
    arteriolosclerosis_severity_scale: Optional[str] = Field()
    amyloid_angiopathy_severity_scale: Optional[str] = Field()
    path_ad_level: Optional[str] = Field()
    dig_slide_avail: Optional[str] = Field()
    quant_path_avail: Optional[str] = Field()


class Clinpath(ClinpathBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)

class ClinpathCreate(ClinpathBase):
    pass

class ClinpathUpdate(SQLModel):
    path_autopsy_second_dx: Optional[str] = Field()
    path_autopsy_third_dx: Optional[str] = Field()
    path_autopsy_fourth_dx: Optional[str] = Field()
    path_autopsy_fifth_dx: Optional[str] = Field()
    path_autopsy_sixth_dx: Optional[str] = Field()
    path_autopsy_seventh_dx: Optional[str] = Field()
    path_autopsy_eight_dx: Optional[str] = Field()
    path_year_death: int = Field(ge=1920, le=2050)
    age_at_death: int = Field()
    cause_death: str = Field()
    other_cause_death_1: Optional[str] = Field()
    other_cause_death_2: Optional[str] = Field()
    brain_weight: str = Field()
    path_braak_nft: str = Field()
    path_braak_asyn: str = Field()
    path_cerad: str = Field()
    path_thal: str = Field()
    known_pathogenic_mutation: Optional[str] = Field()
    PD_pathogenic_mutation: Optional[str] = Field()
    path_mckeith: Optional[str] = Field()
    sn_neuronal_loss: Optional[str] = Field()
    path_infarcs: Optional[str] = Field()
    path_nia_ri: Optional[str] = Field()
    path_nia_aa_a: Optional[str] = Field()
    path_nia_aa_b: Optional[str] = Field()
    path_nia_aa_c: Optional[str] = Field()
    TDP43: Optional[str] = Field()
    arteriolosclerosis_severity_scale: Optional[str] = Field()
    amyloid_angiopathy_severity_scale: Optional[str] = Field()
    path_ad_level: Optional[str] = Field()
    dig_slide_avail: Optional[str] = Field()
    quant_path_avail: Optional[str] = Field()

class ClinpathPublic(ClinpathBase):
    id: uuid.UUID

class ClinpathsPublic(SQLModel):
    data: list[ClinpathPublic]
    count: int