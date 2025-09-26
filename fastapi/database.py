from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# database URL
SQLALCHEMY_DATABASE_URL = ""

# connect to database using the engine and URL
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# make a session when connecting to database
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# a base model for all the classes in database
Base = declarative_base()

# function connects to database and yields to caller
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

