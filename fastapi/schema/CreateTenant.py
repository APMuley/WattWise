from pydantic import BaseModel

# schema for create tenant request
class CreateTenant(BaseModel):
    tenant_id: Optional[int]
    tenant_name: str

    class Config:
        orm_mode=True

        