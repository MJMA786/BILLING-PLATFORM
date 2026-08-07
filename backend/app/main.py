from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.payments import router as payments_router
from app.api.auth import router as auth_router
from app.api.customers import router as customer_router
from app.api.plans import router as plans_router
from app.api.dashboard import router as dashboard_router
from app.api.customer_dashboard import router as customer_dashboard_router
from app.api.subscriptions import router as subscription_router
from app.api.billing_cycles import router as billing_cycles_router
from app.api.billing import router as billing_router
from app.api.payment_retries import router as payment_retries_router
from app.api.audit_logs import router as audit_logs_router
from app.api.invoices import router as invoices_router
from app.api.settings import router as settings_router
from app.api.support import router as support_router


app = FastAPI(
    title="Subly - Subscription Management & Automated Billing Platform"
)

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
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
app.include_router(subscription_router)
app.include_router(payments_router)
app.include_router(billing_cycles_router)
app.include_router(billing_router)
app.include_router(payment_retries_router)
app.include_router(audit_logs_router)
app.include_router(invoices_router)
app.include_router(settings_router)
app.include_router(support_router)



@app.get("/")
def root():
    return {
        "name": "Subly",
        "tagline": "Subscription Management & Automated Billing Platform",
        "status": "online"
    }