# 🚀 Subly - Subscription Management & Automated Billing Platform

<div align="center">

A modern full-stack Subscription Management & Automated Billing Platform built with **FastAPI**, **React**, **PostgreSQL**, **Google OAuth 2.0**, and **ReportLab PDF Engine**.

![Python](https://img.shields.io/badge/Python-3.12-blue?logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-0.139-green?logo=fastapi)
![React](https://img.shields.io/badge/React-19-blue?logo=react)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?logo=postgresql)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-purple?logo=bootstrap)
![Google OAuth](https://img.shields.io/badge/Google_OAuth-2.0-red?logo=google)
![License](https://img.shields.io/badge/License-MIT-green)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Project Structure](#-project-structure)
- [Installation & Setup](#-installation--setup)
- [User Roles & Features](#-user-roles--features)
- [Database Schema](#-database-schema)
- [API Documentation](#-api-documentation)
- [Security & Authentication](#-security--authentication)
- [Author](#-author)

---

## 🌟 Overview

**Subly** is a enterprise-grade **Subscription Management & Automated Billing Platform** designed to streamline recurring billing, customer subscription lifecycles, automated GST/tax invoice generation, payment ledgers, and priority support desks.

It features a decoupled architecture using a **FastAPI (Repository-Service Layer)** backend and a **React + Vite** SPA frontend with high-contrast categorised sidebars and frosted glassmorphic footers.

---

## ✨ Key Features

### 🔐 Authentication & Google OAuth 2.0
- **Dual Authentication**: Standard Email/Password Auth & Google OAuth 2.0 Single Sign-On (SSO).
- **Auto-Provisioning**: Automatic creation of linked `User` and `Customer` billing profiles upon first Google Sign-In.
- **JWT Token Flow**: Secure Access & Refresh Tokens, role-based route guards, and password reset code verification via HTML email.

### 👨‍💼 Admin Portal
- **Analytics Dashboard**: Real-time revenue metrics, active vs cancelled subscriptions, pending billing cycles, and payment ledgers.
- **Customer Management**: Full customer CRUD, tax ID / GSTIN tracking, billing addresses, and account status toggles.
- **Plan Management**: Flexible tier creation, monthly/yearly billing intervals, price configuration, and feature entitlements.
- **Subscription Operations**: Manual activation, plan upgrades/downgrades, auto-renewal controls, and cancellation handling.
- **Invoice & GST Billing**: PDF invoice generation, tax calculation, voiding, and manual settlement.
- **Payment & Refund Ledger**: Transaction tracking, payment retry logs, audit logs, and refund processing.
- **System Settings**: Global currency configuration, default tax percentages, company contact details, and platform rules.

### 👤 Customer Portal
- **Customer Dashboard**: Overview stat cards (`Active Plan`, `Billing Cycle`, `Paid Amount`, `Open Invoices`), recent receipts, and quick actions.
- **Available Plans**: Plan pricing grid, billing interval toggles, feature checklists, and 1-click modal checkout.
- **My Subscription**: Subscription progress tracking (`Days Elapsed` / `Days Remaining`), entitlement cards, auto-renew toggles, and cancellation/resumption controls.
- **My Invoices**: Multi-field smart search, clear search button, status dropdown filter, PDF statement download, and client-side CSV exports.
- **My Payments**: Transaction history ledger, payment method filters, clear/reset buttons, slide-over payment drawer, and CSV exports.
- **My Profile**: Dual support for Google SSO (linked Google avatar photo, SSO badge) and Email/Password credentials, plus full GSTIN and billing address management.
- **Help & Customer Support Desk**: 24/7 Priority Ticket submission desk, category selection, priority level dropdown, ticket reference generator (`TICKET-#...`), collapsible FAQ accordion, and automated HTML email ticket acknowledgments.

### 📧 Automated HTML Email Engine & PDF Generator
- **Email Service (`smtplib`)**: HTML email dispatch for welcome messages, subscription confirmations, PDF invoice receipts, password reset verification codes, and support ticket confirmations.
- **ReportLab PDF Engine**: Dynamic PDF generation for GST tax invoices with itemized pricing, tax breakdown, billing addresses, and company branding.

---

## 🛠 Tech Stack

| Layer | Technologies |
|---|---|
| **Backend** | Python 3.12, FastAPI, SQLAlchemy 2.0 (ORM), Alembic, Pydantic v2, ReportLab, Smtplib, PyJWT |
| **Frontend** | React 19, Vite, Bootstrap 5.3, Lucide React, Axios, React Router v7 |
| **Database** | PostgreSQL 16 / SQLite (Local Dev) |
| **Security & Auth** | Google OAuth 2.0, Passlib (Argon2 / Bcrypt), OAuth2 Password Bearer |

---

## 🏛 System Architecture

```
                                  ┌────────────────────────┐
                                  │   React + Vite SPA     │
                                  └───────────┬────────────┘
                                              │ REST API / JSON
                                  ┌───────────▼────────────┐
                                  │   FastAPI Middleware   │
                                  └───────────┬────────────┘
                                              │
                    ┌─────────────────────────┼─────────────────────────┐
                    │                         │                         │
         ┌──────────▼──────────┐   ┌──────────▼──────────┐   ┌──────────▼──────────┐
         │ Auth & OAuth Router │   │ Subscriptions/Plans │   │ Billing & Invoices  │
         └──────────┬──────────┘   └──────────┬──────────┘   └──────────┬──────────┘
                    │                         │                         │
                    └─────────────────────────┼─────────────────────────┘
                                              │
                                  ┌───────────▼────────────┐
                                  │     Service Layer      │
                                  └───────────┬────────────┘
                                              │
                                  ┌───────────▼────────────┐
                                  │   Repository Layer     │
                                  └───────────┬────────────┘
                                              │
                                  ┌───────────▼────────────┐
                                  │    SQLAlchemy ORM      │
                                  └───────────┬────────────┘
                                              │
                                  ┌───────────▼────────────┐
                                  │    PostgreSQL DB       │
                                  └────────────────────────┘
```

---

## 📂 Project Structure

```
billing-platform/
├── backend/
│   ├── alembic/                    # Database migrations
│   ├── app/
│   │   ├── api/                    # FastAPI endpoints (Auth, Customer, Plans, Invoices, Support)
│   │   ├── core/                   # Security, dependencies, JWT handlers
│   │   ├── database/               # DB connection & session factory
│   │   ├── models/                 # SQLAlchemy models (User, Customer, Plan, Subscription, Invoice, Payment)
│   │   ├── repositories/           # Data access repository layer
│   │   ├── schemas/                # Pydantic validation schemas
│   │   ├── services/               # Business logic & Email/PDF services
│   │   └── main.py                 # FastAPI application entry point
│   ├── .env                        # Environment configurations
│   ├── alembic.ini                 # Alembic configuration
│   └── requirements.txt            # Pinned Python dependencies
│
├── frontend/
│   ├── src/
│   │   ├── assets/                 # Brand assets & images
│   │   ├── components/             # Reusable UI components & Sidebars
│   │   ├── context/                # AuthContext & ToastContext
│   │   ├── pages/                  # Admin & Customer Portal pages
│   │   ├── services/               # Axios API client services
│   │   └── styles/                 # Glassmorphic & layout CSS
│   ├── .env                        # Frontend environment variables
│   ├── package.json                # React dependencies
│   └── vite.config.js              # Vite build runner
└── README.md
```

---

## ⚙ Installation & Setup

### 1. Prerequisites
- **Python 3.12+**
- **Node.js 18+** & `npm`
- **PostgreSQL 16** (or SQLite)

### 2. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment (Windows)
.\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run database migrations
alembic upgrade head

# Start Uvicorn backend server
uvicorn app.main:app --reload
```
Backend API will run at `http://127.0.0.1:8000`. Interactive Swagger docs available at `http://127.0.0.1:8000/docs`.

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```
Frontend application will run at `http://localhost:5173`.

---

## 👥 User Roles & Features

| Role | Accessible Sections & Capabilities |
|---|---|
| **Admin** | Dashboard Analytics, Customer Directory, Plan Tier Manager, Subscriptions, Invoices & Tax Voiding, Payments & Refunds, Audit Logs, System Settings |
| **Customer** | Dashboard Summary, Available Plans & Checkout, My Subscription & Auto-Renew, My Invoices & PDF Receipts, My Payments Ledger, My Profile & GSTIN, Help & Support Ticket Desk |

---

## 🗄 Database Schema

The system models the following core entities:
- **`users`**: Platform user credentials, roles (`admin`, `customer`), Google OAuth IDs, profile pictures.
- **`customers`**: Customer billing profile, company name, phone, tax ID / GSTIN, country, street address.
- **`plans`**: Subscription tier name, price, billing interval (`monthly`, `yearly`), feature JSON, active state.
- **`subscriptions`**: Active customer subscription, current period start/end, status (`active`, `cancelled`, `past_due`).
- **`billing_cycles`**: Recurring billing interval records tracking cycle dates and invoice linkage.
- **`invoices`**: Tax invoices, invoice numbers, subtotal, tax amount, total, payment status, PDF file path.
- **`payments`**: Payment transaction ledger, payment method (`credit_card`, `upi`, `net_banking`), transaction reference, status.
- **`payment_retries`**: Automated retry attempts for failed invoice payments.
- **`audit_logs`**: System audit trail for administrative actions.
- **`system_settings`**: Global platform settings (default currency, tax percentage, support email).

---

## 🔐 Security & Best Practices

- **JWT Token Authentication**: Stateful access & refresh token rotation with HTTP authorization headers.
- **Password Security**: Argon2 / Bcrypt password hashing.
- **Role-Based Guarding**: Both backend dependency injection (`get_current_admin_user`) and React frontend route protection (`ProtectedRoute`).
- **CORS Handling**: Configured origins for local development servers (`http://localhost:5173`, `http://127.0.0.1:5173`).

---

## 👨‍💻 Author

**Mahammad Jaheer Meera Ahmad**

---

⭐ *If you found Subly useful, consider starring the repository!*