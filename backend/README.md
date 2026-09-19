# MedAccess Backend - Architecture & Scaffolding (Phase 1)

Welcome to the backend of **MedAccess**, a production-level, AI-powered healthcare platform. This repository is built on Node.js using Express.js and MongoDB, structured with an Enterprise-grade Clean Architecture.

This phase establishes a robust, highly modular directory structure optimized for testability, scalability, and ease of expansion as we roll out advanced AI and IoT features.

---

## 🚀 Technology Stack

- **Runtime**: Node.js (ES Modules style using `"type": "module"`)
- **Framework**: Express.js (High performance, minimalist web framework)
- **Database**: MongoDB Atlas via Mongoose ODM (Non-relational document database)
- **Security**: Helmet (HTTP security headers) & CORS (Cross-Origin Resource Sharing)
- **Development & Logging**: Nodemon (Auto-restart) & Morgan (HTTP request logger)
- **Environment**: Dotenv (Twelve-Factor app config)

---

## 📂 Directory Layout & Responsibilities

The scaffolding is divided into logical folders under `src/` to separate concerns:

```text
backend/
├── src/
│   ├── config/         # Application configurations (database, APIs, environments)
│   ├── database/       # MongoDB connection management and DB seeds
│   ├── controllers/    # Express controllers (extract input, delegate to services, send response)
│   ├── services/       # Core business logic layer (independent of framework/protocol)
│   ├── routes/         # Express Router setup (points HTTP verbs/paths to controllers)
│   ├── middleware/     # Custom Express middlewares (authentication, error logging, body parsers)
│   ├── models/         # Mongoose schema definitions and models
│   ├── validators/     # Request payload validators (Zod schemas)
│   ├── helpers/        # Isolated reusable helper modules (e.g., date calculations, string formatters)
│   ├── utils/          # Common cross-cutting utility modules (e.g., logger, ApiError class)
│   ├── constants/      # Shared constant values (HTTP codes, error messages, user roles)
│   ├── jobs/           # Background workers, cron scheduling (BullMQ / node-cron)
│   ├── sockets/        # Real-time WebSocket handlers (Socket.io event namespaces)
│   ├── docs/           # API specification documents (Swagger/OpenAPI docs)
│   ├── uploads/        # Local disk storage directory for Multer temporary uploads
│   ├── logs/           # Application log files output by logger utilities (Winston / Bunyan)
│   ├── tests/          # Integration and unit test files (Jest / Supertest)
│   ├── app.js          # Express app instance initialization and global configuration
│   └── server.js       # Bootstrap entry point (starts server, loads env, handles exceptions)
├── .env                # Private local environment configurations (git-ignored)
├── .env.example        # Environment template file
├── .gitignore          # Version control file patterns to ignore
└── package.json        # Node.js project manifest and dependency lists
```

---

## 🔍 Detailed Folder Purpose & Future Integrations

Here is why each folder exists and how it will support future phases of the MedAccess ecosystem:

### 1. `config/`
* **Purpose**: Houses configuration modules that parse environment variables and expose type-safe properties.
* **Future Use**: Configures API keys for **Google Maps Integration**, **Cloudinary**, and external LLM tokens for prescription OCR parsing.

### 2. `database/`
* **Purpose**: Coordinates connection logic to MongoDB Atlas and handles database initialization scripts.
* **Future Use**: Configures connection retries, keeps replica sets alive, and runs seeding scripts for initial pharmacy and medicine listings.

### 3. `controllers/`
* **Purpose**: Orchestrates standard HTTP requests. They parse headers, queries, and bodies, delegate computations to the service layer, and respond.
* **Future Use**: Directs requests for **Voice Inventory Updates** and **AI Prescription OCR uploads** to corresponding services.

### 4. `services/`
* **Purpose**: The engine room of the application. Contains domain business logic. It has zero awareness of HTTP or Express.
* **Future Use**: Implements algorithms for **Smart Pharmacy Ranking** (comparing stock levels, proximity, and price) and orchestrates calls to AI models.

### 5. `routes/`
* **Purpose**: Configures route definitions, binding paths to controllers and inserting route-specific middlewares.
* **Future Use**: Defines routes for user checkouts, admin panels, OCR ingestion, and maps queries.

### 6. `middleware/`
* **Purpose**: intercepts HTTP requests before they reach controllers. Handles cross-cutting concerns like Authentication verification, global error formats, rate limiting, and request logging.
* **Future Use**: Implements role-based access checks for the **Admin Dashboard** and verifies JWT tokens.

### 7. `models/`
* **Purpose**: Defines Mongoose Schemas representing structures stored in MongoDB.
* **Future Use**: Declares schemas for `User`, `Pharmacy`, `Medicine` (with stock levels for inventory management), and `Order`.

### 8. `validators/`
* **Purpose**: Ensures all inputs (body, query, param) conform to expected schemas using validation tools like Zod before invoking services.
* **Future Use**: Rejects requests missing necessary voice data or incorrectly structured image files before they waste server resources.

### 9. `helpers/`
* **Purpose**: Simple, stateless helpers that assist with basic coding tasks (e.g., date formats).
* **Future Use**: Formats text transcripts extracted from audio files during inventory modifications.

### 10. `utils/`
* **Purpose**: Shared application utilities (e.g., a standard `ApiError` class, custom loggers).
* **Future Use**: Integrates Winston or Bunyan loggers to track critical medical events or AI inference latency.

### 11. `constants/`
* **Purpose**: Central location for immutable static files (e.g., status codes, response strings, user roles).
* **Future Use**: Manages transaction statuses (e.g., `ORDER_PENDING`, `ORDER_DISPATCHED`) and user privileges.

### 12. `jobs/`
* **Purpose**: Configures worker engines or cron schedules for execution outside the main request-response cycle.
* **Future Use**: Triggers nightly stock reconciliations, crawls supplier portals, or runs cleanups on local uploads.

### 13. `sockets/`
* **Purpose**: Manages real-time bidirectional communication.
* **Future Use**: Broadcasts **real-time notifications** to patients when an order is updated or tells admins when stock runs low.

### 14. `docs/`
* **Purpose**: Serves as the repository for API documentations and configurations.
* **Future Use**: Exposes interactive Swagger/OpenAPI documentation at `/api/docs` so frontend and mobile developers can view request structures easily.

### 15. `uploads/`
* **Purpose**: Acts as a temporary local buffer for file processing.
* **Future Use**: Serves as the landing folder where Multer temporarily writes raw prescription images before uploading them to Cloudinary.

### 16. `logs/`
* **Purpose**: Centralized storage folder for application log files.
* **Future Use**: Holds error and information logs for debugging production environments.

### 17. `tests/`
* **Purpose**: Root directory for automated tests.
* **Future Use**: Verifies core business operations (e.g. smart pharmacy selection algorithms) are immune to regressions.

---

## 🛠️ Development Flow

### Prerequisite
Ensure [Node.js](https://nodejs.org/) (v18+) is installed.

### Installation
Move into the `backend` directory and install the specified packages:
```bash
cd backend
npm install
```

### Starting the Server (Development)
To start the dev environment with nodemon reloading on code changes:
```bash
npm run dev
```

### Starting the Server (Production)
To run the server in production mode:
```bash
npm run start
```
