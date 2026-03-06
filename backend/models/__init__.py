from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List, Any
from datetime import datetime
from enum import Enum
from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v, handler=None):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(cls, core_schema, handler):
        return {"type": "string"}

class DocumentStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"

class UserBase(BaseModel):
    email: EmailStr

class UserDB(UserBase):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class DocumentDB(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    filename: str
    file_path: str
    file_type: str
    status: DocumentStatus = DocumentStatus.PENDING
    structured_data: Optional[Any] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    owner_id: Optional[str] = None

class ReportDB(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    title: str
    summary: Optional[str] = None
    financial_analysis: Optional[Any] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    document_id: Optional[str] = None
    owner_id: Optional[str] = None

class RecommendationDB(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    category: str
    suggestion: str
    impact: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    report_id: Optional[str] = None
    approved: Optional[bool] = False
    strategy_details: Optional[str] = None
