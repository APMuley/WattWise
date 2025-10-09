from database import Base
from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey, LargeBinary

# tenant table
class Tenant(Base):
    __tablename__ = "tenants"

    tenant_id = Column(Integer, primary_key=True, nullable=False, autoincrement=True)
    tenant_name = Column(String, nullable=False)

# meter reading table
class MeterReading(Base):
    __tablename__ = "meterreading"

    id = Column(Integer, primary_key=True, nullable=False, autoincrement=True)
    reading = Column(Float, nullable=False)
    tenant_id = Column(Integer, ForeignKey('tenants.tenant_id'), nullable=False)
    date = Column(Date, nullable=False)
    image = Column(LargeBinary)
