# 📦 Parcel Delivery Management Backend

A backend API built with **Express.js**, **TypeScript**, and **Mongoose** to manage a parcel delivery system with **role-based access control** (Admin, Sender, Receiver) and **JWT authentication**.

---

## 📌 Project Overview

This backend service provides a secure and trackable parcel delivery management system with the following features:

- **JWT-based authentication** with role-based access control (Admin, Sender, Receiver)
- **Secure password hashing** using `bcryptjs`
- **Parcel creation, cancellation, confirmation, and delivery tracking**
- **User management and blocking/unblocking**
- **Delivery status logs for each parcel**
- **Protected routes based on user role**
- **MongoDB** as the database layer using Mongoose

---

## ⚙️ Setup & Environment Instructions

### 1️⃣ Prerequisites

Ensure the following are installed:

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/) (v9+ recommended)
- [MongoDB](https://www.mongodb.com/try/download/community) (local or cloud)

---

### 2️⃣ Clone the Repository

```bash
git clone https://github.com/wasim-akram-dev/parcel-delivery-system-backend.git
cd parcel-delivery-system-backend
```

### 3️⃣ Install Dependencies

```bash
npm install
```

### 4️⃣ Environment Variables

Create a `.env` file in the project root:

```env
PORT=5000
DATABASE_URL=mongodb://localhost:27017/parcel_delivery
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d
```

### 5️⃣ Run in Development Mode

```bash
npm run dev
```

---

## 📂 Folder Structure

```
src
 ├── config          # App & DB configuration
 ├── middlewares     # Authentication & error handling
 ├── modules
 │    ├── auth       # Login, registration, JWT
 │    ├── percel     # Parcel CRUD, status updates
 │    └── user       # User management
 ├── routes          # API route registration
 ├── utils           # Utility functions
 ├── app.ts          # Express app setup
 └── server.ts       # Server entry point
```

---

## 📡 API Endpoints

Base URL:

```
/api/v1
```

## 📦 Parcel API Endpoints

### Sender Endpoints

- **POST** `/` → Create a new parcel _(only sender)_
- **PATCH** `/cancel/:id` → Cancel a parcel _(only sender)_
- **GET** `/:id/status-log` → Get status log of a parcel _(only sender)_

### Receiver Endpoints

- **GET** `/incoming-parcels` → View all incoming parcels _(only receiver)_
- **PATCH** `/confirm-parcels/:id` → Confirm a parcel _(only receiver)_
- **GET** `/delivery-history` → View delivery history _(only receiver)_

### Admin Endpoints

- **GET** `/view-all-users` → View all users _(only admin)_
- **GET** `/view-all-parcels` → View all parcels _(only admin)_
- **PATCH** `/update-user-role/:id` → Update user role _(only admin)_
- **POST** `/update-user-active-status` → Update user active status _(only admin)_
- **POST** `/update-parcel-status` → Update parcel status _(only admin)_
