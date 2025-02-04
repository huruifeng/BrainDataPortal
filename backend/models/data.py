import uuid
from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List


class DataBasic(SQLModel):
    sample_id: str = Field(index=True,foreign_key="sample.sample_id")
    source_sample_id: str = Field(default="NA")
    replicate: str = Field(default="NA")
    replicate_count: int = Field(default=-1)
    repeated_sample: int = Field(default=-1)
    batch: str = Field(default="NA")
    file_type: str = Field(default="NA")
    file_name_source: str = Field(default="NA")
    file_name: str = Field(default="NA")
    file_description: str = Field(default="NA")
    local_path: str = Field(default="NA")
    file_MD5: str = Field(default="NA")
    technology: str = Field(default="NA")
    omic: str = Field(default="NA")
    adjustment: str = Field(default="NA")
    content: str = Field(default="NA")
    time: float = Field(default=-1)
    header: str = Field(default="NA")
    annotation: str = Field(default="NA")
    configuration_file: str = Field(default="NA")

    data_type: str = Field(default="NA")

class Data(DataBasic, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)

    # Relationship to Sample (many-to-one)
    sample: Optional["Sample"] = Relationship(back_populates="sample_data")  # Use string reference


class DataCreate(DataBasic):
    pass


class DataUpdate(SQLModel):
    sample_id: Optional[str] = Field(default="NA")
    subject_id: Optional[str] = Field(default="NA")
    source_sample_id: Optional[str] = Field(default="NA")
    replicate: Optional[str] = Field(default="NA")
    replicate_count: Optional[int] = Field(default=-1)
    repeated_sample: Optional[int] = Field(default=-1)
    batch: Optional[str] = Field(default="NA")
    file_type: Optional[str] = Field(default="NA")
    file_name: Optional[str] = Field(default="NA")
    file_description: Optional[str] = Field(default="NA")
    file_MD5: Optional[str] = Field(default="NA")
    technology: Optional[str] = Field(default="NA")
    omic: Optional[str] = Field(default="NA")
    adjustment: Optional[str] = Field(default="NA")
    content: Optional[str] = Field(default="NA")
    time: Optional[float] = Field(default=-1)
    header: Optional[str] = Field(default="NA")
    annotation: Optional[str] = Field(default="NA")
    configuration_file: Optional[str] = Field(default="NA")



class DataPublic(DataBasic):
    id: uuid.UUID

class DatasPublic(SQLModel):
    data: list[DataPublic]
    count: int