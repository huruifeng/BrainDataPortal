from sqlmodel import SQLModel, Field, Relationship
from typing import Optional
import uuid

class ProtocolBase(SQLModel):
    sample_collection_summary: str = Field(index=True)
    cell_extraction_summary: str = Field(index=True)
    lib_prep_summary: str = Field(index=True)
    data_processing_summary: str = Field(index=True)
    github_url: str = Field(index=True)
    protocols_io_DOI: str = Field(index=True)
    other_reference: Optional[str] = Field(index=True)

class Protocol(ProtocolBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)

class ProtocolCreate(ProtocolBase):
    pass

class ProtocolUpdate(ProtocolBase):
    pass

class ProtocolPublic(ProtocolBase):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)

class ProtocolsPublic(SQLModel):
    data: list[ProtocolPublic]
    count: int

