from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routes import auth, provinces, transactions, bulk_upload
from app.middleware.auth_middleware import auth_middleware
from app.middleware.audit_middleware import audit_middleware

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Church Finance Management System",
    description="A comprehensive financial management system for church organizations",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add custom middleware
app.middleware("http")(auth_middleware)
app.middleware("http")(audit_middleware)

# Include routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(provinces.router, prefix="/api/v1/provinces", tags=["Provinces"])
app.include_router(transactions.router, prefix="/api/v1/transactions", tags=["Transactions"])
app.include_router(bulk_upload.router, prefix="/api/v1/bulk-upload", tags=["Bulk Upload"])

@app.get("/")
async def root():
    return {"message": "Church Finance Management System API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}