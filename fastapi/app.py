from fastapi import FastAPI, HTTPException, Depends, UploadFile, File, Form
from sqlalchemy.orm import Session
import requests
from typing import List
from database import get_db, Base, engine
from datetime import date
from schemas import *
from models import *

from dotenv import load_dotenv
import os

load_dotenv()
Base.metadata.create_all(bind=engine)

# ROUTES ONLY BUSINESS LOGIC ON OTHER FILE
app = FastAPI()
OCR_SPACE_API_KEY = os.getenv("API_KEY")

# get request for one tenant only
@app.get(
    '/get_tenant/{tenant_id}',
    response_model=TenantSchema
)
async def get_tenant(tenant_id : int, db:Session = Depends(get_db)):
    tenant = db.query(Tenant).filter(Tenant.tenant_id == tenant_id).first()
    if not tenant:
        raise HTTPException(status_code=404, detail="Tenant not found")

    print(tenant)
    return tenant

# get request for getting all tenants
# returns all tenants as a list
@app.get(
    '/get_tenants',
    response_model=List[TenantSchema]
)
async def get_tenants(db:Session = Depends(get_db)):

    tenants = db.query(Tenant).all()
    return tenants


# post request for creating a tenant
# returns the tenant json object as response
@app.post(
    '/create_tenant', 
    response_model=CreatedTenant
)
async def create_tenant(tenant: CreatedTenant, db:Session = Depends(get_db)):

    # create a new row of tenant with passed in attribute values
    new_tenant = Tenant(**tenant.dict())

    db.add(new_tenant)
    db.commit()
    db.refresh(new_tenant)

    return new_tenant


# post request for creating a new light meter reading
# returns the new light meter bill reading
@app.post(
    '/create_reading',
    response_model=CreatedReading
)
async def create_reading(reading: float = Form(...), reading_date: str = Form(...), tenant_id: int = Form(...), image: UploadFile = File(...), db:Session = Depends(get_db)):
    # create date object to be stored
    date_obj = date.fromisoformat(reading_date)

    content = await image.read()

    # create a new reading instance
    new_reading = MeterReading(
        reading=reading,
        date=date_obj, 
        tenant_id=tenant_id,
        image=content
    )


    db.add(new_reading)
    db.commit()
    db.refresh(new_reading)

    return CreatedReading(result="created a reading")


# test the given image by supplying image to model and 
# retrieving result
@app.post(
    '/read_image',
    response_model=GetReading
)
async def get_reading(image: UploadFile = File(...)):
    # read contents of image and give them to model
    contents = await image.read()
    print("calling api....")
    # send image to api
    response = requests.post(
        "https://api.ocr.space/parse/image",
        files={"filename": contents},
        data={"apikey": OCR_SPACE_API_KEY, "language": "eng", "OCREngine": 2}
    )
    result = response.json()
    text = ""
    if result["IsErroredOnProcessing"] == False:
        parsed_results = result.get("ParsedResults")
        if parsed_results:
            text = parsed_results[0]["ParsedText"]

    # extract numbers only
    import re
    match = re.search(r'\d+(\.\d+)?', text)
    if match:
        number = float(match.group())
    else:
        number = 0.0  

    # return reading of the image
    return GetReading(reading=number) 

