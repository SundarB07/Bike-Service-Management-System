# BikeServ — Bike Service Management System

Full-stack application: **React (Vite)** frontend + **Spring Boot** backend + **MySQL** database.

---

##  Project Structure

```
Bike Service/
├── backend/          ← Spring Boot (Java 17, Maven)
├── frontend/         ← React 18 (Vite)
└── schema.sql        ← Optional manual DB init script
```

---

##  Quick Start

### 1. MySQL — Create the Database

Make sure MySQL is running, then either:
- **Auto**: Spring Boot creates tables automatically on first run (`ddl-auto=update`)
- **Manual**: Run `schema.sql` in MySQL Workbench or CLI:
  ```sql
  source /path/to/schema.sql
  ```

### 2. Start the Backend

```bash
cd backend
mvn spring-boot:run
```
Runs on **http://localhost:8080**

> **Prerequisites**: JDK 17+, Maven 3.6+

### 3. Start the Frontend

```bash
cd frontend
npm install        # only first time
npm run dev
```
Runs on **http://localhost:5173**

---

##  API Endpoints

| Module    | Base URL              |
|-----------|-----------------------|
| Customers | `/api/customers`      |
| Bikes     | `/api/bikes`          |
| Mechanics | `/api/mechanics`      |
| Services  | `/api/services`       |
| Payments  | `/api/payments`       |

All endpoints support: `GET`, `POST /{id}`, `PUT /{id}`, `DELETE /{id}`

---

##  Database Config

File: `backend/src/main/resources/application.properties`

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/bike_service_db?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=
```

Change `username`/`password` if your MySQL has a password.

---

##  Pages

| Page         | Route            | Description                          |
|--------------|------------------|--------------------------------------|
| Dashboard    | `/`              | Live stats + quick action cards      |
| Add Customer | `/add-customer`  | Form + customer table                |
| Add Bike     | `/add-bike`      | Form with customer dropdown          |
| Add Mechanic | `/add-mechanic`  | Form with specialisation dropdown    |
| Add Service  | `/add-service`   | **Core** — bike + mechanic dropdowns |
| Add Payment  | `/add-payment`   | Service dropdown + payment details   |
| View Records | `/view-records`  | Tabbed view of all 5 tables          |

---

## 🛠️ Tech Stack

| Layer    | Technology                      |
|----------|---------------------------------|
| Frontend | React 18, Vite, React Router 6, Axios |
| Backend  | Spring Boot 3.2, Spring Data JPA, Lombok |
| Database | MySQL 8.x                       |
| Styling  | Custom CSS (dark mode)          |
