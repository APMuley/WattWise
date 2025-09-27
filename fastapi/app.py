from fastapi import FastAPI, HTTPException, Depends, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from schemas import CreateReading, CreateTenant, GetReading, TenantSchema
import models

# ROUTES ONLY BUSINESS LOGIC ON OTHER FILE
app = FastAPI()


# get request for getting all tenants
# returns all tenants as a list
@app.get(
    '/get_tenants',
    response_model=List[TenantSchema]
)
async def get_tenants(db:Session = Depends(get_db)):

    tenants = db.query(models.Tenant).all()
    return tenants


# post request for creating a tenant
# returns the tenant json object as response
@app.post(
    '/create_tenant', 
    response_model=CreateTenant
)
async def create_tenant(tenant: CreateTenant, db:Session = Depends(get_db)):

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
    response_model=CreateReading
)
async def create_reading(reading: CreateReading, db:Session = Depends(get_db)):

    # create a new reading instance
    new_reading = models.MeterReading(**reading.dict())

    db.add(new_reading)
    db.commit()
    db.refresh(new_reading)

    return new_reading


# test the given image by supplying image to model and 
# retrieving result
@app.get(
    '/read_image',
    response_model=GetReading
)
async def get_reading(image: UploadFile = File(...)):
    # read contents of image and give them to model
    content = await image.read()

    # TO IMPLEMENT MODEL API

    # return reading of the image
    return GetReading(reading=1)

