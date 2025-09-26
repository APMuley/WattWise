from pydantic import BaseModel

# schema for the create reading request
class CreateReading(BaseModel):
    id: Optional[int]
    reading: float
    tenant_id: int
    date: date

    class Config:
        orm_mode=True

