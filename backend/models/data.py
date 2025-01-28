import uuid
from sqlmodel import SQLModel, Field, Relationship
from typing import Optional


class DataBasic(SQLModel, table=True):
    sample_id: str = Field(index=True)
    subject_id: str = Field(index=True)
    source_sample_id: str = Field(index=True)
    replicate: str = Field(index=True)
    replicate_count: int = Field(default=None)
    repeated_sample: int = Field(default=None)
    batch: str = Field(default=None)
    file_type: str = Field(default=None)
    file_name: str = Field(default=None)
    file_description: str = Field(default=None)
    file_MD5: str = Field(default=None)
    technology: str = Field(default=None)
    omic: str = Field(default=None)
    adjustment: str = Field(default=None)
    content: str = Field(default=None)
    time: float = Field(default=None)
    header: str = Field(default=None)
    annotation: str = Field(default=None)
    configuration_file: str = Field(default=None)

class Data(DataBasic, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)

class DataCreate(DataBasic):
    pass


class DataUpdate(SQLModel):
    sample_id: Optional[str] = Field(default=None)
    subject_id: Optional[str] = Field(default=None)
    source_sample_id: Optional[str] = Field(default=None)
    replicate: Optional[str] = Field(default=None)
    replicate_count: Optional[int] = Field(default=None)
    repeated_sample: Optional[int] = Field(default=None)
    batch: Optional[str] = Field(default=None)
    file_type: Optional[str] = Field(default=None)
    file_name: Optional[str] = Field(default=None)
    file_description: Optional[str] = Field(default=None)
    file_MD5: Optional[str] = Field(default=None)
    technology: Optional[str] = Field(default=None)
    omic: Optional[str] = Field(default=None)
    adjustment: Optional[str] = Field(default=None)
    content: Optional[str] = Field(default=None)
    time: Optional[float] = Field(default=None)
    header: Optional[str] = Field(default=None)
    annotation: Optional[str] = Field(default=None)
    configuration_file: Optional[str] = Field(default=None)



class DataPublic(DataBasic):
    id: uuid.UUID

class DatasPublic(SQLModel):
    data: list[DataPublic]
    count: int