from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.auth import router as auth_router
from app.api.customers import router as customer_router
from app.api.plans import router as plans_router
from app.api.dashboard import router as dashboard_router
from app.api.customer_dashboard import router as customer_dashboard_router

app = FastAPI(
    title="Subscription Management and Automated Billing Platform"
)

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(customer_router)
app.include_router(plans_router)
app.include_router(dashboard_router)
app.include_router(customer_dashboard_router)
@app.get("/")
def root():
    return {
        "message": "Subscription Management and Automated Billing Platform"
    }