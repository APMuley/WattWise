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
class CreatedTenant(BaseModel):
    tenant_name: str

# schema for the create reading request
class CreatedReading(BaseModel):
    result: str
        

# schema for the create reading request
class GetReading(BaseModel):
    reading: float

    class Config:
        orm_mode=True

# schema for posting a bill
class CreateBill(BaseModel):
    multiplier : int
    tenant_id: int
    month: int
    year: int
    reading: float

    class Config:
        orm_mode=True

# schema for bills
class BillSchema(BaseModel):
    id: int
    tenant_id: int
    month:int
    year: int
    bill: float
    tenant_name: str

    class Config:
        orm_mode = True

class TenantNumber(BaseModel):
    num: int
