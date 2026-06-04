# Task Manager App

A full-stack task management application built with **Angular** (frontend) and **NestJS** (backend).

---

## Prerequisites

Ensure the following versions are installed before getting started:

| Tool        | Version   |
|-------------|-----------|
| Node.js     | v16.20.2  |
| Angular CLI | v11.2.10  |
| npm         | v8.19.4   |

---

## Getting Started

Clone the repository:

```bash
git clone <repo-url>
cd Task-Manager-App
```

---

## Frontend Setup — Angular (port 4200)

```bash
cd Frontend
npm install
# If you encounter peer dependency errors, use:
# npm install --legacy-peer-deps
ng serve
```

Open [http://localhost:4200] in your browser.

---

## Backend Setup — NestJS (port 9090)

```bash
cd Backend-Service
npm install --legacy-peer-deps
```

> **⚠️ Environment Configuration Required**
> Download the environment zip file shared via email, extract it, and place the contents at the **root** of the `Backend-Service` folder before starting the server.

```bash
npm run start:dev
```

The backend API will be available at **http://localhost:9090**.

---

## Demo User Credentials

Pre-created accounts with assigned tasks are available so you can explore the app without registering.

Credentials are listed in **`users-creds.txt`** at the project root.

---

## Project Structure

```
Task-Manager-App/
├── Frontend/           # Angular application  →  http://localhost:4200
├── Backend-Service/    # NestJS API server    →  http://localhost:9090
└── users-creds.txt     # Demo user credentials
```

---

## Tech Stack

| Layer    | Technology |
|----------|------------|
| Frontend | Angular 11 |
| Backend  | NestJS     |
| Runtime  | Node.js    |
