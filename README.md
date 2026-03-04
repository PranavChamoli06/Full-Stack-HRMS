# HRMS Backend

Enterprise-grade Human Resource Management System backend built using Spring Boot.

## Project Structure
HRMS/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   ├── com/
│   │   │       ├── example/
│   │   │           ├── HRMS/
│   │   │               ├── config/
│   │   │               │   ├── CorsConfig.java
│   │   │               │   ├── CustomAccessDeniedHandler.java
│   │   │               │   ├── CustomAuthenticationEntryPoint.java
│   │   │               │   ├── DataInitializer.java
│   │   │               │   ├── DatabaseHealthIndicator.java
│   │   │               │   ├── JwtAuthenticationFilter.java
│   │   │               │   ├── JwtService.java
│   │   │               │   ├── OpenApiConfig.java
│   │   │               │   └── SecurityConfig.java
│   │   │               ├── controller/
│   │   │               │   ├── AIController.java
│   │   │               │   ├── AuthController.java
│   │   │               │   └── EmployeeController.java
│   │   │               ├── dto/
│   │   │               │   ├── ApiResponse.java
│   │   │               │   ├── AuthRequest.java
│   │   │               │   ├── AuthResponse.java
│   │   │               │   ├── EmployeeRequest.java
│   │   │               │   ├── EmployeeResponse.java
│   │   │               │   ├── ErrorResponse.java
│   │   │               │   └── RefreshRequest.java
│   │   │               ├── entity/
│   │   │               │   ├── AuditLog.java
│   │   │               │   ├── BaseEntity.java
│   │   │               │   ├── Employee.java
│   │   │               │   ├── Permission.java
│   │   │               │   ├── Role.java
│   │   │               │   └── User.java
│   │   │               ├── exception/
│   │   │               │   ├── ErrorCode.java
│   │   │               │   ├── GlobalExceptionHandler.java
│   │   │               │   └── ResourceNotFoundException.java
│   │   │               ├── repository/
│   │   │               │   ├── AuditLogRepository.java
│   │   │               │   ├── EmployeeRepository.java
│   │   │               │   └── UserRepository.java
│   │   │               ├── service/
│   │   │               │   ├── ai/
│   │   │               │   │   └── AIService.java
│   │   │               │   ├── impl/
│   │   │               │   │   └── EmployeeServiceImpl.java
│   │   │               │   ├── CustomUserDetailsService.java
│   │   │               │   └── EmployeeService.java
│   │   │               └── HrmsApplication.java
│   │   ├── resources/
│   │       ├── db/
│   │       │   ├── migration/
│   │       │       └── V1__initial_schema.sql
│   │       ├── static/
│   │       ├── templates/
│   │       ├── application-dev.properties
│   │       ├── application-prod.properties
│   │       └── application.properties
│   ├── test/
│       ├── java/
│           ├── com/
│               ├── example/
│                   ├── HRMS/
│                       └── HrmsApplicationTests.java
├── Dockerfile
├── HELP.md
├── directory-tree.txt
├── docker-compose.yml
├── mvnw
├── mvnw.cmd
└── pom.xml


## Features

- JWT Authentication
- Role & Permission based Authorization
- Refresh Tokens
- Global Exception Handling
- DTO Architecture
- Flyway Database Migrations
- Swagger API Documentation
- Docker Containerization
- Spring Boot Actuator Monitoring
- Audit Logging

## Tech Stack

- Java 17
- Spring Boot
- Spring Security
- MySQL
- Flyway
- Docker
- Swagger
- JWT

## Run Locally

```bash
mvn clean install
mvn spring-boot:run
