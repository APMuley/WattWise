from database import Base
from sqlalchemy import Column, Integer, Float, Date

# meter reading table
class MeterReading(Base):
    __tablename__ = "meterreading"

    id = Column(Integer, primary_key=True, nullable=False, autoincrement=True)
    reading = Column(Float, nullable=False)
    tenant_id = Column(Integer, foreign_key=True, nullable=False)
    date = Column(Date, nullable=False)