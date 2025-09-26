from database import Base
from sqlalchemy import Column, Integer, String

# tenant table
class Tenant(Base):
    __tablename__ = "tenant"

    tenant_id = Column(Integer, primary_key=True, nullable=False, autoincrement=True)
    tenant_name = Column(String, nullable=False)
