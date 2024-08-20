import os
from databases import Database
from dotenv import load_dotenv

load_dotenv()

# Defining the global constants
DATABASE_URL: str = os.getenv('DATABASE_URL')
SECRET_KEY: str = os.getenv("SECRET_KEY", "your_secret_key")
ALGORITHM: str = "HS256"
ACCESS_TOKEN_EXPIRE_SECONDS: int = 3600

