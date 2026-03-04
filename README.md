# 🚀 HRMS Backend (Enterprise Spring Boot Project)

A production-ready **Hotel Reservation and Management System (HRMS) backend** built using **Spring Boot**.
This project demonstrates enterprise backend architecture including **JWT authentication, role-based authorization, Flyway database migrations, Docker containerization, Swagger documentation, and monitoring with Spring Boot Actuator**.

---

# 📌 Project Overview

This backend provides secure REST APIs for managing HR operations such as employee management, authentication, and audit logging.

The system is designed following **clean architecture principles** and **enterprise backend best practices**.

Key design goals:

* Scalable architecture
* Secure authentication system
* Versioned database schema
* Containerized deployment
* Production-ready monitoring

---

# 🏗 Architecture

The project follows a **layered architecture**.

```
controller → service → repository → database
```

Project structure:

```
src/main/java/com/example/HRMS
│
├── config          # Security, JWT, CORS, OpenAPI configuration
├── controller      # REST API controllers
├── dto             # Request / Response models
├── entity          # Database entities
├── exception       # Global exception handling
├── repository      # Spring Data JPA repositories
├── service         # Business logic
│   ├── ai          # AI integration scaffold
│   └── impl
└── HRMSApplication
```

---

# 🔐 Security Features

* JWT based authentication
* Refresh token support
* BCrypt password hashing
* Role based access control
* Permission based authorization
* Method level security
* Custom authentication entry points
* Access denied handling

---

# 🗄 Database Management

The project uses **Flyway for database migrations**.

Benefits:

* Version controlled database schema
* Safe production deployments
* Automated migrations

Migration scripts are located in:

```
src/main/resources/db/migration
```

---

# 🐳 Docker Deployment

The backend can run fully inside Docker.

### Build and Run

```bash
docker-compose up --build
```

This starts:

* Spring Boot application
* MySQL database container

---

# 📑 API Documentation

Swagger UI is available at:

```
http://localhost:8080/swagger-ui/index.html
```

You can test secured APIs directly using the **JWT token**.

---

# 📊 Monitoring

Spring Boot Actuator provides monitoring endpoints.

Health check:

```
http://localhost:8080/actuator/health
```

Application info:

```
http://localhost:8080/actuator/info
```

---

# 🧠 AI Integration (Scaffold)

The project includes a placeholder service for future AI integrations.

Example endpoint:

```
GET /api/v1/ai/analyze
```

This module can later integrate:

* Machine Learning models
* Python microservices
* OpenAI APIs
* Predictive HR analytics

---

# 🛠 Tech Stack

Backend:

* Java 17
* Spring Boot
* Spring Security
* Spring Data JPA

Security:

* JWT Authentication
* BCrypt Encryption

Database:

* MySQL
* Flyway

Infrastructure:

* Docker
* Docker Compose

Documentation:

* Swagger / OpenAPI

Monitoring:

* Spring Boot Actuator

---

# ▶ Running the Project Locally

### 1️⃣ Clone repository

```bash
git clone https://github.com/YOUR_USERNAME/HRMS-Backend.git
```

### 2️⃣ Navigate to project

```bash
cd HRMS-Backend
```

### 3️⃣ Build project

```bash
mvn clean install
```

### 4️⃣ Run application

```bash
mvn spring-boot:run
```

---

# 🌐 Default Endpoints

Authentication:

```
POST /api/v1/auth/login
POST /api/v1/auth/refresh
```

Employee APIs:

```
GET /api/v1/employees
POST /api/v1/employees
```

AI Module:

```
GET /api/v1/ai/analyze
```

---

# 📂 Docker Structure

```
Dockerfile
docker-compose.yml
```

These allow the application to run in containers with MySQL.

---

# 📈 Future Improvements

Planned improvements:

* HR modules (leave, payroll, attendance)
* AI based HR analytics
* CI/CD pipeline
* Kubernetes deployment
* Distributed microservices architecture

---

# 👨‍💻 Author

Developed by **Pranav Chamoli**

---
