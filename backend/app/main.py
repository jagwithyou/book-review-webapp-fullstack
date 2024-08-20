from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base, database
from user.routes import router as user_router
from book.routes import router as book_router
from book_review.routes import router as book_review_router
from psutil import cpu_percent, virtual_memory, disk_usage
from contextlib import asynccontextmanager
from fastapi.responses import JSONResponse


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context manager for the FastAPI application.

    This context manager is responsible for setting up and tearing down the database connection
    and creating the database tables during application startup and shutdown.

    Args:
        app (FastAPI): The FastAPI application instance.

    Yields:
        None

    Raises:
        Exception: If an error occurs during startup or shutdown.
    """
    try:
        await database.connect()
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
    except Exception as e:
        print(f"Error during startup: {e}")
    yield
    try:
        await database.disconnect()
    except Exception as e:
        print(f"Error during shutdown: {e}")


#Initialise the app
app = FastAPI(lifespan=lifespan)
#Add route to the app
app.include_router(user_router, prefix="/users", tags=["users"])
app.include_router(book_router, prefix="/books", tags=["books"])
app.include_router(book_review_router, prefix="/reviews", tags=["reviews"])

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    """
    Returns a JSON response with a welcome message and the current system resource usage.
    Returns:
        JSONResponse: A JSON object containing the welcome message and system resource usage.
    Response Structure:
        {
            "message": str,
            "resource_usage": {
                "cpu": str,
                "memory": str,
                "disk": str
            }
        }
    Notes:
        - The `cpu`, `memory`, and `disk` values are percentages.
    """
    # Get system resource usage
    cpu_usage = cpu_percent()
    memory_usage = virtual_memory().percent
    disk_usage_p = disk_usage('/').percent

    # Get server response
    response = {"message": "Welcome to the Book Review System"}

    # Add resource usage to the response
    response["resource_usage"] = {
        "cpu": f"{cpu_usage:.2f}%",
        "memory": f"{memory_usage:.2f}%",
        "disk": f"{disk_usage_p:.2f}%"
    }
    return JSONResponse(content=response, media_type="application/json")
