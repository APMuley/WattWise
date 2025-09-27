from pydantic import BaseModel
from typing import Optional 
from datetime import date

# schema for a tenant
class TenantSchema(BaseModel):
    tenant_id: Optional[int]
    tenant_name: str

    class Config:
        orm_mode=True

# schema for create tenant request
class CreateTenant(BaseModel):
    tenant_name: str

    class Config:
        orm_mode=True


# schema for the create reading request
class CreateReading(BaseModel):
    reading: float
    tenant_id: int
    date: date

    class Config:
        orm_mode=True
        

# schema for the create reading request
class GetReading(BaseModel):
    reading: float

    class Config:
        orm_mode=True
