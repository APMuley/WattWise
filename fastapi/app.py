from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session
from database import get_db
import schema
import models
# ROUTES ONLY BUSINESS LOGIC ON OTHER FILE
app = FastAPI()

# post request for creating a tenant
# returns the tenant json object as response
@app.post(
    '/create_tenant', 
    response_model=schema.CreateTenant
)
async def create_tenant(tenant: schema.CreateTenant, db:Session = Depends(get_db)):

    # create a new row of tenant with passed in attribute values
    new_tenant = models.Tenant(**tenant.dict())

    db.add(new_tenant)
    db.commit()
    db.refresh(new_tenant)

    return new_tenant

# post request for creating a new light meter reading
# returns the new light meter bill reading
@app.post(
    '/create_reading',
    response_model=schema.CreateReading
)
async def create_reading(reading: schema.CreateReading, db:Session = Depends(get_db)):

    # create a new reading instance
    new_reading = models.MeterReading(**reading.dict())

    
