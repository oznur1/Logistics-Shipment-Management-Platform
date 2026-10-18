# Logistics & Shipment Management Platform

A logistics shipment management application built with **ASP.NET Core Web API, Angular, Entity Framework Core, and Microsoft SQL Server**. The project focuses on shipment lifecycle management, structured API design, relational data modeling, and JWT-based authentication.

The platform provides a foundation for managing shipment records through a web interface backed by a RESTful API, with an emphasis on maintainability, data integrity, and clear separation of responsibilities.

## Overview

Logistics operations require reliable shipment tracking, consistent data, and efficient access to operational information. This project addresses these needs through a web-based shipment management workflow.

The application separates its frontend presentation layer from its backend business and data access layers. Angular communicates with the ASP.NET Core API over HTTP, while Entity Framework Core manages persistence in SQL Server.

## Key Features

- **Shipment Management:** Create and update shipment records, including origin, destination, customer, and estimated delivery date.
- **Shipment Dashboard:** View shipment records and summary statistics by shipment status.
- **Search and Filtering:** Search shipments by tracking number or address and filter records by status.
- **Pagination:** Navigate shipment records in manageable pages.
- **Authentication:** JWT-based authentication endpoints and protected application routes.
- **Input Validation:** Validate required fields, address lengths, and customer identifiers.
- **Relational Data Modeling:** Model customers, shipments, and shipment status history with defined entity relationships.
- **Database Migrations:** Manage database schema changes through Entity Framework Core migrations.
- **API Integration:** Connect the Angular frontend to the backend through a dedicated HTTP service.

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | Angular, TypeScript, HTML, CSS |
| Forms | Angular Reactive Forms |
| Backend | C#, ASP.NET Core Web API |
| Data Access | Entity Framework Core |
| Database | Microsoft SQL Server |
| Authentication | JSON Web Tokens (JWT) |
| API Design | RESTful HTTP endpoints |
| Development Tools | Visual Studio Code, .NET CLI, Angular CLI |

## Architecture

The application follows a layered web application structure, separating user interaction, API handling, business operations, and data persistence.

```text
Angular Frontend
       |
       | HTTP / JSON
       v
ASP.NET Core Web API
       |
       +-- Controllers
       |
       +-- Services
       |
       +-- DTOs and Validation
       |
       v
Entity Framework Core
       |
       v
Microsoft SQL Server
```

### Architectural Responsibilities

**Angular Frontend**
- Renders the shipment dashboard and data-entry forms.
- Manages form validation, search, filtering, and pagination.
- Uses a dedicated API service for HTTP communication.
- Integrates authentication services, route protection, and HTTP interception.

**ASP.NET Core Web API**
- Exposes HTTP endpoints for shipment and authentication workflows.
- Uses controllers to handle incoming requests.
- Separates service-level operations from controller logic.
- Uses Data Transfer Objects (DTOs) to define request and response contracts.

**Data Access Layer**
- Uses Entity Framework Core to query and persist relational data.
- Defines relationships between customers, shipments, and shipment status history.
- Uses migrations to track database schema changes.

## Data Model

The core domain consists of three primary entities:

- **Customer:** Represents the customer associated with shipments.
- **Shipment:** Stores shipment information, including its tracking number, origin, destination, status, and delivery dates.
- **ShipmentStatusHistory:** Records shipment status changes over time.

The model uses relational constraints to preserve data integrity. Customer references restrict the deletion of customers with associated shipments, while shipment-related status history follows the configured cascade behavior.

## Authentication and Security

The application incorporates a JWT-based authentication flow intended to protect shipment-related API operations and frontend routes.

The authentication design includes:

- Registration and login request models.
- Authentication service and controller components.
- JWT configuration and token handling.
- An Angular authentication service.
- An HTTP interceptor for authenticated requests.
- A route guard for protected dashboard navigation.

Authentication and authorization are enforced at the appropriate application boundaries. Protected resources should not be considered accessible merely because a frontend route is hidden or guarded.

**Security considerations**
- Keep signing keys, database credentials, and other secrets outside source control.
- Use configuration appropriate to the deployment environment.
- Validate incoming requests on the server.
- Use HTTPS in deployed environments.
- Apply appropriate password hashing and token validation practices.

## Getting Started

### Prerequisites

Install the following tools:

- .NET SDK 10
- Node.js and npm
- Angular CLI compatible with the project
- Microsoft SQL Server
- Git

### 1. Clone the repository

```bash
git clone https://github.com/oznur1/Logistics-Shipment-Management-Platform.git
cd Logistics-Shipment-Management-Platform
```

### 2. Configure the backend

Navigate to the backend project:

```bash
cd backend/ShipmentService
```

Configure the SQL Server connection string and JWT settings using local development configuration or a secure secrets provider. Do not commit production credentials or signing keys.

Restore dependencies:

```bash
dotnet restore
```

Apply the existing Entity Framework Core migrations:

```bash
dotnet ef database update
```

If the EF CLI is not installed, install the compatible tool version before running the migration command.

Start the API:

```bash
dotnet run
```

The development configuration used during implementation exposes the API at:

```text
http://localhost:5068
```

If Swagger is enabled in the current environment, the API documentation can be accessed at:

```text
http://localhost:5068/swagger
```

### 3. Configure the frontend

Open a second terminal:

```bash
cd frontend/logistics-ui
npm install
```

Start the Angular development server:

```bash
ng serve
```

Open the application at:

```text
http://localhost:4200
```

The frontend requires the backend to be running and its API URL to match the local backend configuration.

### 4. Authentication setup

Create a user through the registration endpoint or the application's supported registration flow before attempting to sign in. A sample account displayed in the interface should not be assumed to exist in the database unless it has been created.

Ensure the JWT settings are configured consistently between token generation and token validation.

## Development Status

The project is being developed incrementally.

| Area | Current scope |
|---|---|
| Shipment API | CRUD workflow and API integration |
| Shipment dashboard | Summary cards, search, status filtering, pagination |
| Database | SQL Server, EF Core entities and migrations |
| Authentication | JWT-related backend and Angular components |
| Frontend routing | Login route and protected dashboard route |
| Automated testing | Test coverage and end-to-end verification remain to be validated |

A successful frontend build confirms compilation, but does not by itself verify the full login flow, token validation, database connectivity, or authenticated shipment operations.

## Engineering Focus

The implementation emphasizes several practical engineering principles:

- Separation of concerns between UI, API controllers, services, and persistence.
- Explicit request contracts through DTOs.
- Relational integrity through entity relationships and database constraints.
- Centralized frontend API communication.
- Authentication-aware routing and HTTP requests.
- Incremental development with build verification and database migrations.

## Planned Improvements

Potential next steps include:

- Expand automated backend unit and integration tests.
- Add comprehensive authentication and authorization tests.
- Complete end-to-end verification of registration, login, and protected API requests.
- Introduce structured logging and centralized exception handling.
- Improve API documentation and error response consistency.
- Add configurable pagination and more advanced shipment queries.
- Establish a CI pipeline for automated builds and tests.
- Prepare secure deployment configuration and production hosting.

## Project Purpose

This project demonstrates the design and implementation of a full-stack logistics application using the .NET and Angular ecosystems. It provides a practical foundation for exploring API development, relational persistence, frontend integration, and application security within a shipment management domain.
