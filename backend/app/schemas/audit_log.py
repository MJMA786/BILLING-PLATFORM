from datetime import datetime
from typing import Optional

from pydantic import BaseModel


# --------------------------
# User Summary
# --------------------------

class UserSummary(BaseModel):

    id: int

    name: str

    email: str

    class Config:
        from_attributes = True


# --------------------------
# Create Audit Log
# --------------------------

class AuditLogCreate(BaseModel):

    entity_type: str

    entity_id: int

    event: str

    performed_by: Optional[int] = None


# --------------------------
# Response
# --------------------------

class AuditLogRead(BaseModel):

    id: int

    entity_type: str

    entity_id: int

    event: str

    performed_by: Optional[UserSummary] = None

    created_at: datetime

    class Config:
        from_attributes = True