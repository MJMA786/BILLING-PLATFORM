# 🚀 Subscription Management & Automated Billing Platform

<div align="center">

A modern full-stack Subscription Management Platform built with **FastAPI**, **React**, and **PostgreSQL** for managing subscription-based businesses.

![Python](https://img.shields.io/badge/Python-3.12-blue?logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-green?logo=fastapi)
![React](https://img.shields.io/badge/React-19-blue?logo=react)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?logo=postgresql)
![License](https://img.shields.io/badge/License-MIT-green)

</div>

---

# 📖 Table of Contents

- Overview
- Features
- Screenshots
- Tech Stack
- Architecture
- Project Structure
- Installation
- User Roles
- Database Schema
- API Documentation
- Current Progress
- Security
- Future Improvements
- Contributing

---

# 🌟 Overview

The **Subscription Management & Automated Billing Platform** is a full-stack SaaS application designed to manage customers, subscription plans, automated billing, invoices, and payments through dedicated Admin and Customer portals.

It follows a layered backend architecture using **FastAPI**, **SQLAlchemy**, and **Repository-Service Pattern**, while the frontend is built with **React + Vite**.

---

# ✨ Features

## 🔐 Authentication

- JWT Authentication
- Role-Based Authorization
- Secure Password Hashing
- Change Password
- Protected Routes

---

## 👨‍💼 Admin Portal

- Modern Analytics Dashboard
- Customer Management
- Plan Management
- Subscription Management
- Invoice Management
- Payment Tracking
- Reports
- Settings

---

## 👤 Customer Portal

- Customer Dashboard
- Browse Available Plans
- My Subscription
- Invoice History
- Payment History
- Profile Management
- Support

---

## 💳 Billing

- Billing Cycles
- Invoice Generation
- Payment Tracking
- Retry Handling
- Audit Logs

---

# 🛠 Tech Stack

| Backend | Frontend | Database |
|---------|----------|-----------|
| FastAPI | React | PostgreSQL |
| SQLAlchemy | Bootstrap 5 | Alembic |
| Pydantic | Axios | |
| JWT | React Router | |

---

# 🏛 Architecture

```
React (Vite)
      │
Axios API Client
      │
FastAPI Routers
      │
Service Layer
      │
Repository Layer
      │
SQLAlchemy ORM
      │
PostgreSQL
```

---

# 📂 Project Structure

```
billing-platform
│
├── app
│   ├── api
│   ├── config
│   ├── database
│   ├── models
│   ├── repositories
│   ├── schemas
│   ├── services
│   ├── utils
│   └── main.py
│
├── frontend
│   ├── src
│   ├── public
│   └── package.json
│
├── alembic
├── requirements.txt
├── .env.example
└── README.md
```

---

# ⚙ Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/billing-platform.git

cd billing-platform
```

---

## Backend

```bash
python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt
```

---

## Frontend

```bash
cd frontend

npm install
```

---

## Configure Environment

```env
DATABASE_URL="your database url here"

SECRET_KEY="your security key here"

ALGORITHM=HS256

ACCESS_TOKEN_EXPIRE_MINUTES=60 # you can change the expiration time
```

---

## Run Migrations

```bash
alembic upgrade head
```

---

## Start Backend

```bash
uvicorn app.main:app --reload
```

Swagger

```
http://127.0.0.1:8000/docs
```

---

## Start Frontend

```bash
npm run dev
```

```
http://localhost:5173
```

---

# 👥 User Roles

## Admin

- Dashboard
- Customers
- Plans
- Subscriptions
- Invoices
- Payments
- Reports
- Settings

---

## Customer

- Dashboard
- Available Plans
- Subscription
- Invoices
- Payments
- Profile
- Support

---

# 🗄 Database Tables

- Users
- Customers
- Plans
- Subscriptions
- Billing Cycles
- Invoices
- Payments
- Payment Retries
- Audit Logs

---

# 🔐 Security

- JWT Authentication
- Password Hashing (bcrypt)
- Role-Based Authorization
- Environment Variables
- Protected API Routes

---

# 🚀 Current Progress

## ✅ Completed

- Authentication System
- Admin Portal
- Customer Portal
- Customer CRUD
- Plan Management
- Dashboard Analytics
- Modern Responsive UI
- PostgreSQL Integration
- Alembic Migrations

## 🚧 In Progress

- Subscription Lifecycle
- Automated Billing
- Invoice PDF Generation
- Payment Workflow
- Reports & Analytics

---

# 🛣 Roadmap

- Email Notifications
- Payment Gateway Integration
- Reports Export
- Multi-Tenant Support
- Docker Deployment
- CI/CD Pipeline

---

# 👨‍💻 Author

**Mahammad Jaheer Meera Ahmad**

---

⭐ If you found this project useful, consider giving it a star!