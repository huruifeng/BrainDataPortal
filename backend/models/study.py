from enum import Enum
from pydantic import BaseModel
from typing_extensions import Optional

class Study(BaseModel):
    ASAP_team_name: str
    ASAP_lab_name: str
    project_name: str
    team_dataset_id: str
    project_dataset: str
    project_description: str
    PI_full_name: str
    PI_email: str
    contributor_names: str
    submitter_name: str
    submitter_email: str
    ASAP_grant_id: str
    other_funding_source: str
    publication_DOI: str = "NA"
    publication_PMID: str = "NA"
    number_of_brain_samples: int
    brain_regions: str
    types_of_samples: str
    DUA_version: str

    ## Optional fields
    PI_ORCHID: Optional[str] = None
    PI_google_scholar_id: Optional[str] = None
    preprocessing_references: Optional[str] = None
    metadata_version_date: Optional[str] = None