from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class CustomerCreate(BaseModel):
    name: str = Field(..., min_length=3, max_length=100)
    email: EmailStr
    billing_country: str = Field(..., min_length=2, max_length=100)


class CustomerUpdate(BaseModel):
    name: str = Field(..., min_length=3, max_length=100)
    email: EmailStr
    billing_country: str = Field(..., min_length=2, max_length=100)


class CustomerResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    billing_country: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)