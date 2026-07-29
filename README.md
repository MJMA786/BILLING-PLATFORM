# 🚀 Subscription Management & Automated Billing Platform

A full-stack web application for managing subscription-based services with automated billing, customer management, invoice generation, and payment tracking.

This project provides separate portals for **Administrators** and **Customers**, enabling secure authentication, role-based authorization, and efficient subscription management.

---

# 📌 Features

## 🔐 Authentication
- User Registration
- Secure Login
- JWT Authentication
- Password Hashing (bcrypt)
- Change Password
- Protected Routes
- Role-Based Access Control (Admin & Customer)

## 👥 Customer Management
- Add Customer
- View Customers
- Update Customer
- Delete Customer

## 📦 Subscription Plans
- Create Plans
- Update Plans
- Archive Plans
- Monthly & Annual Billing

## 🔄 Subscription Management
- Subscribe Customers
- Change Plans
- Cancel Subscriptions
- Trial Period Support

## 📄 Invoice Management
- Generate Invoices
- Invoice Status Tracking
- Due Date Management

## 💳 Payment Management
- Payment Records
- Payment Status
- Retry Support

## 👤 Customer Portal
- Customer Dashboard
- My Subscription
- My Invoices
- My Payments
- Profile

---

# 🛠 Tech Stack

## Backend
- Python
- FastAPI
- SQLAlchemy ORM
- PostgreSQL
- Alembic
- JWT Authentication
- Passlib (bcrypt)
- Pydantic

## Frontend
- React.js
- Vite
- Bootstrap 5
- Axios
- React Router DOM

## Database
- PostgreSQL

---

# 🏗 Project Architecture

```
React Frontend
       │
     Axios
       │
   FastAPI APIs
       │
   Router Layer
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
billing-platform/

│
├── app/
│   ├── config/
│   ├── core/
│   ├── database/
│   ├── models/
│   ├── repositories/
│   ├── routers/
│   ├── schemas/
│   ├── services/
│   └── main.py
│
├── alembic/
├── frontend/
├── requirements.txt
├── .env
└── README.md
```

---

# ⚙️ Installation Guide

## 1️⃣ Clone Repository

```bash
git clone <repository-url>
cd billing-platform
```

---

## 2️⃣ Create Virtual Environment

### Windows

```bash
python -m venv venv
venv\Scripts\activate
```

### Linux / macOS

```bash
python3 -m venv venv
source venv/bin/activate
```

---

## 3️⃣ Install Backend Dependencies

```bash
pip install -r requirements.txt
```

---

## 4️⃣ Install Frontend Dependencies

```bash
cd frontend
npm install
```

---

## 5️⃣ Configure PostgreSQL

Create a PostgreSQL database.

Example:

```sql
CREATE DATABASE billing_platform;
```

---

## 6️⃣ Configure Environment Variables

Create a `.env` file inside the backend project.

```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/billing_platform

SECRET_KEY=YOUR_SECRET_KEY

ALGORITHM=HS256

ACCESS_TOKEN_EXPIRE_MINUTES=60
```

Replace:

- `YOUR_PASSWORD`
- `YOUR_SECRET_KEY`

with your local configuration.

---

## 7️⃣ Run Database Migrations

```bash
alembic upgrade head
```

---

## 8️⃣ Start Backend

If `main.py` is inside the `app` folder:

```bash
uvicorn app.main:app --reload
```

If `main.py` is in the project root:

```bash
uvicorn main:app --reload
```

Backend:

```
http://127.0.0.1:8000
```

Swagger Documentation:

```
http://127.0.0.1:8000/docs
```

---

## 9️⃣ Start Frontend

```bash
cd frontend
npm run dev
```

Frontend:

```
http://localhost:5173
```

---

# 🔑 Admin Access

Newly registered users have the default role.

To make a user an administrator:

```sql
UPDATE users
SET role='admin'
WHERE email='your_email@example.com';
```

Log in again after updating the role.

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

# 👥 User Roles

## Admin

- Dashboard
- Customer Management
- Plan Management
- Subscription Management
- Invoice Management
- Payment Management

---

## Customer

- Customer Dashboard
- My Subscription
- My Invoices
- My Payments
- Profile

---

# 🔄 Git Workflow

Pull latest changes

```bash
git pull origin main
```

Create a new feature branch

```bash
git checkout -b feature/feature-name
```

Commit changes

```bash
git add .
git commit -m "Added new feature"
```

Push changes

```bash
git push origin feature/feature-name
```

Create a Pull Request before merging into `main`.

---

# 📌 Current Progress

### ✅ Completed

- JWT Authentication
- Role-Based Authorization
- Customer CRUD
- Customer Dashboard
- Admin Dashboard
- PostgreSQL Integration
- SQLAlchemy ORM
- Alembic Migrations
- Responsive React Frontend

### 🚧 In Progress

- Subscription Plans
- Subscription Lifecycle
- Automated Billing
- Invoice Generation
- Payment Processing
- Reports & Analytics

---

# 🛡 Security

- JWT Authentication
- Password Hashing using bcrypt
- Protected API Endpoints
- Role-Based Authorization
- Environment Variables for Secrets

---

# 🤝 Guidelines

- Follow the existing folder structure.
- Keep business logic inside the **Service Layer**.
- Database operations should only be performed through the **Repository Layer**.
- Do not write SQL directly inside routers.
- Use feature branches for new development.
- Create Pull Requests before merging.

---

# 📷 Screenshots

_Add screenshots of the application here._

---

# 👨‍💻 Contributors

- Mahammad Jaheer Meera Ahmad

---

⭐ If you like this project, consider giving it a star!
