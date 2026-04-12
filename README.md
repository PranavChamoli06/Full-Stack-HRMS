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
* Analytics dashboards

The system is designed with:

* Scalable architecture
* Secure authentication system
* Role-based access control
* Clean layered backend design
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

# 📂 Project Structure

## 🔙 Backend (Spring Boot)

```
src/main/java/com/example/HRMS
│
├── config          # Security, JWT, CORS, Swagger configuration
├── controller      # REST API controllers
├── dto             # Request & response models
├── entity          # Database entities
├── exception       # Global exception handling
├── repository      # JPA repositories
├── service         # Business logic
│   ├── impl
│   └── ai
└── HRMSApplication
```

Resources:

```
src/main/resources
│
├── application.properties
├── db/migration
└── static
```

---

## 🎨 Frontend (React)

```
hrms-frontend/src
│
├── api
├── components
├── layouts
├── pages
│   ├── LoginPage
│   ├── DashboardPage
│   ├── ReservationsPage
│   └── AdminPage
├── services
├── utils
├── App.js
└── index.js
```

---

## 🔗 Architecture Flow

```
UI (React Pages)
   ↓
Service Layer
   ↓
Axios Client (JWT Interceptor)
   ↓
Spring Boot Controllers
   ↓
Service Layer
   ↓
Repository Layer
   ↓
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
* Receive booking confirmation (email + UI)
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
* No manual intervention required

### Additional Logic

* Works across both public and admin booking flows
* Ensures consistent state transitions

### Business Impact

* Accurate reservation tracking
* Real-world hotel workflow simulation
* Enables correct revenue calculation

---

# 👥 Admin Panel

Admin capabilities:

* View all users
* Create new users
* Update user roles
* Role-based UI restriction

---

## ⚙️ Pricing Management (Admin Feature)

Admin can:

* Add special pricing (festival / peak days)
* Update pricing multiplier
* Delete pricing rules

### Key Advantage

* No code changes required
* Fully dynamic pricing system

---

# 📊 Dashboard & Analytics

* KPI cards (Total reservations, Active bookings)
* Reservation trends (monthly)
* Revenue analytics
* Occupancy analytics

Built using:

* Recharts

---

## 📅 Calendar-Based Booking View

* Displays bookings per day
* Disables already booked dates
* Supports room-wise filtering

👉 Combines backend data with UI intelligence

---

## 💸 Price Preview (User Feature)

Before booking, users can:

* Preview total price
* See pricing impact based on selected dates
* Understand difference between base and final price
* Displays price per night, total cost, and duration
* Powered by backend `/price-preview` API

### Benefits

* Transparent pricing
* Better user experience
* Reduces booking confusion

---

# ⚙ Backend Features

* REST API architecture
* JWT authentication & authorization
* Global exception handling
* Analytics endpoints
* Flyway database migrations
* Swagger API documentation
* Spring Boot Actuator monitoring

---

## 💰 Dynamic Pricing Engine

Pricing is calculated **per day**, not static.

### Pricing Rules

* Weekdays → Base price
* Weekends → +20% surge
* Special/Festival pricing → Custom multiplier
* Festival pricing overrides weekend pricing

### Architecture

ReservationService → PricingService → SpecialPricingRepository

### Key Highlights

* Per-day pricing calculation across booking duration
* Aggregated total price based on date-wise logic
* Null-safe pricing (no crashes if data missing)
* Extendable for demand-based pricing
* Admin-controlled pricing via UI

---

# 🗄 Database

* MySQL
* Flyway migrations
* Relational schema (Users, Reservations, Rooms, SpecialPricing)

---

## 📈 Revenue Calculation Logic

Revenue includes only:

* CONFIRMED reservations
* COMPLETED reservations

Excluded:

* PENDING
* CANCELLED

### Why This Matters

* Ensures financial accuracy
* Matches real-world hotel revenue tracking

---

# 🐳 DevOps & Tools

* Docker & Docker Compose
* Swagger / OpenAPI
* Spring Boot Actuator

---

## 🔁 Booking Flow

1. User creates reservation → PENDING
2. (Future: payment integration) → CONFIRMED
3. After checkout → automatically COMPLETED
4. User/Admin can cancel → CANCELLED

---

# 📅 API Highlights

### Authentication

```
POST /api/v1/auth/login
POST /api/v1/auth/refresh
```

---

### Reservations

```
GET /api/v1/reservations
POST /api/v1/reservations
PUT /api/v1/reservations/{id}
DELETE /api/v1/reservations/{id}
```

---

### Users (Admin)

```
GET /api/v1/users
POST /api/v1/users
PUT /api/v1/users/{id}/role
```

---

### Analytics

```
GET /api/v1/analytics/revenue
GET /api/v1/analytics/occupancy
GET /api/v1/analytics/monthly-revenue
GET /api/v1/analytics/cancellation-rate
```

---

### Pricing (Admin)

```
GET /api/v1/admin/pricing  
POST /api/v1/admin/pricing  
PUT /api/v1/admin/pricing/{id}  
DELETE /api/v1/admin/pricing/{id}
```

---

# ▶ Running the Project

## Backend

```bash
cd HRMS-Backend
mvn clean install
mvn spring-boot:run
```

---

## Frontend

```bash
cd hrms-frontend
npm install
npm start
```

---

# 🌐 Application URLs

Frontend:

```
http://localhost:3000
```

Backend:

```
http://localhost:8080
```

Swagger:

```
http://localhost:8080/swagger-ui/index.html
```

---

# 📊 Monitoring

Health check:

```
http://localhost:8080/actuator/health
```

---

# 🧠 AI Integration (Future Scope)

* Demand prediction
* Dynamic pricing
* Recommendation engine
* Predictive analytics

---

# 📈 Future Enhancements

* AI-based booking prediction
* Payment integration
* Email notifications
* Cloud deployment (AWS / Docker / Kubernetes)
* Microservices architecture

---

# 🗄 Database Design

## ER Diagram

![ER Diagram](assets/screenshots/er-diagram.png)

---

## Key Relationships

* One user can have multiple reservations
* One room can have multiple reservations
* Each reservation belongs to one user and one room

---

# 📸 Screenshots

## 🔐 Login Page

![Login Page](assets/screenshots/login.png)

---

## 📊 Dashboard

![Dashboard Overview](assets/screenshots/dashboard.png)

---

## 🛎 Reservations Module

### Reservation Table

![Reservations Table](assets/screenshots/reservation-table.png)

### Create / Edit Reservation

![Reservation Form](assets/screenshots/reservation-form.png)

---

## 👥 Admin Panel

### User Management

![Admin Panel](assets/screenshots/admin-panel.png)

### Role Management

![Role Update](assets/screenshots/admin-roles.png)

---

## 📈 Analytics Charts

### Reservation Trends

![Reservation Trends](assets/screenshots/chart-reservations.png)

### Revenue Chart

![Revenue Chart](assets/screenshots/chart-revenue.png)

### Occupancy Chart

![Occupancy Chart](assets/screenshots/chart-occupancy.png)

---

## 🎯 System Capabilities

* Full-stack application
* Secure authentication system
* Role-based access control
* Reservation management (CRUD + Pagination)
* Analytics dashboard
* Admin management system
* Production-ready UI
* Booking lifecycle automation
* Dynamic pricing engine
* Admin-controlled pricing rules
* Price preview before booking
* Revenue-safe calculation
* Public booking flow (no login)
* Admin booking management
* Calendar-based booking visualization
* Email confirmation system
* Availability validation (anti double-booking)

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
