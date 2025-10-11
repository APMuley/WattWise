from fastapi import FastAPI, HTTPException, Depends, UploadFile, File, Form
from sqlalchemy.orm import Session
from sqlalchemy import desc
import requests
from typing import List
from database import get_db, Base, engine
from datetime import date, datetime
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
)
async def create_tenant(tenant: CreatedTenant, db:Session = Depends(get_db)):

    # create a new row of tenant with passed in attribute values
    new_tenant = Tenant(**tenant.dict())

    db.add(new_tenant)
    db.commit()
    db.refresh(new_tenant)


# post request for creating a new light meter reading
# returns the new light meter bill reading
@app.post(
    '/create_reading',
    response_model=CreatedReading
)
async def create_reading(reading: float = Form(...), reading_date: str = Form(...), tenant_id: int = Form(...), multiplier: int = Form(...), image: UploadFile = File(...), db:Session = Depends(get_db)):
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

    today = date.today()
    month = today.month
    year = today.year

    bill_form = CreateBill(
        multiplier=multiplier,
        tenant_id=tenant_id,
        month=month,
        year=year,
        reading=reading
    )

    await create_bill(bill_form, db)

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

async def create_bill(billForm: CreateBill, db:Session):
    # note down all variables
    month = billForm.month
    tenant_id = billForm.tenant_id
    multiplier = billForm.multiplier
    year = billForm.year
    curr_reading = billForm.reading

    # get start and end date for possible last reading
    start_date = date(year, month, 1)
    if month == 12:
        end_date = date(year + 1, 1, 1)
    else:
        end_date = date(year, month + 1, 1)

    all_reading = db.query(MeterReading).filter(
        MeterReading.tenant_id == tenant_id,
        MeterReading.date >= start_date,
        MeterReading.date < end_date
    ).all()

    
    # calculate units used
    if (len(all_reading) == 1):
        units_used = curr_reading 
    else:
        last_reading = all_reading[1]
        units_used = curr_reading - last_reading.reading
    
    # get cost
    bill = round(multiplier * units_used, 2)
    print(units_used)
    print(bill)
    print(multiplier)
    print(multiplier*units_used)

    # update database
    new_bill = Bill(
        month=month,
        tenant_id=tenant_id,
        year=year,
        bill=bill,
    )

    db.add(new_bill)
    db.commit()
    db.refresh(new_bill)

@app.get(
    '/get_bills',
    response_model=List[BillSchema]
)
async def get_bills(db:Session = Depends(get_db)):
    # get current month and year
    now = datetime.now()  
    month = now.month
    year = now.year


    # can get last month's bill if necessary
    # if (month == 1):
    #     month = 12
    #     year = year - 1
    # else:
    #     month = month-1

    return get_last_bills(month, year, db)


# function to get last bill of a specific month and year for all tenants
def get_last_bills(month: int, year: int, db:Session):
    # get all bills for the given month and year
    bills_in_month = db.query(Bill).filter(
        Bill.month == month,
        Bill.year == year
    ).order_by(Bill.tenant_id, desc(Bill.id)).all()  

    # get all tenant names at once
    tenants = {t.tenant_id: t.tenant_name for t in db.query(Tenant).all()}

    # keep latest bill only
    last_bills = {}
    for bill in bills_in_month:
        if bill.tenant_id not in last_bills:
            tenant_name = tenants.get(bill.tenant_id, "Unknown")
            bill_dict = {
                "id": bill.id,
                "tenant_id": bill.tenant_id,
                "month": bill.month,
                "year": bill.year,
                "bill": bill.bill,
                "tenant_name": tenant_name
            }
            last_bills[bill.tenant_id] = bill_dict

    return list(last_bills.values())

@app.get(
    '/get_number_tenants',
    response_model=TenantNumber
)
async def number_of_tenants(db:Session = Depends(get_db)):
    num = db.query(Tenant).count()

    nums = TenantNumber(num=num)

    return nums