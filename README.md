# 🚀 HRMS – Hotel Reservation Management System (Full-Stack)

A **production-ready full-stack Hotel Reservation Management System (HRMS)** built using:

* **Frontend:** React
* **Backend:** Spring Boot
* **Database:** MySQL
* **Security:** JWT Authentication

This project demonstrates **enterprise-level architecture**, combining secure backend APIs with a modern, responsive frontend dashboard.

---

# 📌 Project Overview

HRMS is a complete system for managing:

* Hotel reservations (**public + admin booking flows**)
* Users and roles
* Dynamic pricing strategies
* Booking lifecycle automation
* **Asynchronous notification system (Email + SMS)**
* Analytics dashboards

The system is designed with:

* Scalable architecture
* Secure authentication system
* Role-based access control
* Clean layered backend design
* Event-driven + async processing
* Interactive analytics dashboard

---

# 🏗 Full-Stack Architecture

```
React Frontend (UI + Routing + Charts)
        │
        │ Axios (REST API Calls)
        ▼
Spring Boot Backend (Business Logic + Security)
        │
        ▼
MySQL Database
```

---

# 🔐 Authentication & Security

* JWT-based authentication
* Secure login system
* Protected routes (frontend)
* Role-Based Access Control (ADMIN / MANAGER / STAFF)
* Session handling with auto logout
* BCrypt password encryption
* Method-level security
* Secures admin booking operations

---

# 🛎 Reservation Management

Full reservation lifecycle management:

* Create reservation
* View reservations
* Update reservation
* Delete reservation
* Pagination support

### Booking Modes

**🔹 Public Booking (Customer Flow)**

* Search rooms by date
* View dynamic pricing
* Book without login
* Receive booking confirmation (email + SMS)
* View booking via reference
* Cancel booking

**🔹 Admin Booking (On-Prem Flow)**

* Create reservation manually
* Edit reservation
* Cancel reservation
* Calendar-based booking visibility
* Pagination & dashboard management

### Business Rules

* Check-in date must be before check-out date
* Prevent overlapping room bookings
* Reservation status transitions enforced

---

## 🛑 Availability Validation

* Prevents double booking
* Checks overlapping date ranges
* Returns conflict errors

Integrated in:

* Backend validation
* Frontend booking flow

👉 Critical production logic

---

# 🔄 Booking Lifecycle (Enterprise Feature)

Reservation states:

PENDING → CONFIRMED → COMPLETED
↘ CANCELLED

### Automation

* Reservations automatically move to **COMPLETED** after checkout date
* Implemented using scheduled backend jobs

---

# 📧 Notification System (Phase 2 – Advanced)

A **fault-tolerant, asynchronous notification system** ensures reliable communication.

### 🔁 Notification Flow

```
Booking Created
     ↓
Async Notification Trigger
     ↓
Log Created (PENDING)
     ↓
Send Email / SMS
     ↓
SUCCESS / FAILED
     ↓
Retry Scheduler (FAILED → SUCCESS)
```

### 🔹 Features

* Email integration (SMTP – Gmail)
* SMS integration (Twilio)
* Async processing using `@Async`
* Multi-channel delivery

### 🔹 Logging System

* `NotificationLog` entity tracks:

  * type (EMAIL / SMS)
  * recipient
  * message
  * status
  * error_message
  * timestamp

Lifecycle:

```
PENDING → SUCCESS / FAILED
```

### 🔹 Failure Handling

* Failures are logged
* Error messages captured
* System remains stable

### 🔹 Retry Mechanism

* Scheduler retries failed notifications
* Automatic recovery

### 🔹 Impact

* Reliable communication
* Scalable system
* Production-grade fault tolerance

---

# 👥 Admin Panel

Admin capabilities:

* View all users
* Create new users
* Update user roles

---

## ⚙️ Pricing Management (Admin Feature)

* Add special pricing
* Update multiplier
* Delete pricing rules

---

# 📊 Dashboard & Analytics

* KPI cards
* Reservation trends
* Revenue analytics
* Occupancy analytics

---

## 📅 Calendar-Based Booking View

* Displays bookings per day
* Disables booked dates
* Room-based filtering

---

## 💸 Price Preview (User Feature)

* Preview total price
* Price per night + total
* Powered by `/price-preview` API

---

# ⚙ Backend Features

* REST API architecture
* JWT authentication
* Global exception handling
* Flyway migrations
* Swagger docs
* **Async processing (`@Async`)**
* **Scheduler jobs (retry + lifecycle)**

---

## 💰 Dynamic Pricing Engine

* Weekday → Base
* Weekend → +20%
* Festival → Override

---

# 🗄 Database

* MySQL
* Tables:

  * Users
  * Reservations
  * Rooms
  * SpecialPricing
  * **NotificationLog**

---

## 📈 Revenue Calculation Logic

Includes:

* CONFIRMED
* COMPLETED

Excludes:

* PENDING
* CANCELLED

---

# 🐳 DevOps & Tools

* Docker
* Swagger
* Actuator

---

## 🔁 Booking Flow

1. Create → PENDING
2. Confirm → CONFIRMED
3. Auto → COMPLETED
4. Cancel → CANCELLED

---

# 📅 API Highlights

### Authentication

```
POST /api/v1/auth/login
POST /api/v1/auth/refresh
```

### Reservations

```
GET /api/v1/reservations
POST /api/v1/reservations
```

### Pricing

```
GET /api/v1/admin/pricing
```

---

# ▶ Running the Project

```bash
mvn spring-boot:run
npm start
```

---

# 📸 Screenshots

## 🔐 Login Page

![Login Page](assets/screenshots/login.png)

## 📊 Dashboard

![Dashboard Overview](assets/screenshots/dashboard.png)

## 🛎 Reservations Module

![Reservations Table](assets/screenshots/reservation-table.png)
![Reservation Form](assets/screenshots/reservation-form.png)

## 👥 Admin Panel

![Admin Panel](assets/screenshots/admin-panel.png)
![Role Update](assets/screenshots/admin-roles.png)

## 📈 Analytics Charts

![Reservation Trends](assets/screenshots/chart-reservations.png)
![Revenue Chart](assets/screenshots/chart-revenue.png)
![Occupancy Chart](assets/screenshots/chart-occupancy.png)

---

## 🎯 System Capabilities

* Full-stack application
* Secure authentication
* Role-based access
* Reservation lifecycle
* Dynamic pricing engine
* Async notification system
* Retry + logging mechanism
* Calendar visualization
* Email + SMS integration
* Availability validation

---

## 🔐 Environment Variables

Before running the project, set:

DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password

### Windows:

```bash
setx DB_USERNAME "root"
setx DB_PASSWORD "yourpassword"
```

### Mac/Linux:

```bash
export DB_USERNAME=root
export DB_PASSWORD=yourpassword
```

---

# 👨‍💻 Author

Developed by **Pranav Chamoli**
