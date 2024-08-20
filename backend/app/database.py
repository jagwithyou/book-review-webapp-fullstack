from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from databases import Database
from core.config import DATABASE_URL


DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://")

engine = create_async_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine, class_=AsyncSession)
Base = declarative_base()

database = Database(DATABASE_URL)

async def get_db():
    """
    Asynchronous context manager to create a database session.

    Yields:
        SessionLocal: An asynchronous database session.

    Notes:
        - This function is an asynchronous context manager, which means it can be used with `async with` statements.
        - It creates a new database session using `SessionLocal` and yields it to the caller.
        - The session is automatically closed when the context manager is exited.
    """
    async with SessionLocal() as session:
        yield session
