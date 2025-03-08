## Overview
This is a full-stack Job Portal application where users can sign up, log in, post job listings, and browse available jobs. The application includes authentication, job management, and filtering functionalities.

## Tech Stack
- **Frontend:** React.js
- **Backend:** Node.js, Express.js
- **Database:** SQLite
- **Authentication:** JWT (JSON Web Tokens)

## Database Setup
1. install SQLite
2. Run the command in SQLite to create the `users` and `jobs` tables:

```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    mobile TEXT NOT NULL,
    password TEXT NOT NULL
);

CREATE TABLE jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    location TEXT NOT NULL,
    jobType TEXT NOT NULL,
    salaryRange TEXT NOT NULL,
    userId INTEGER NOT NULL,
    FOREIGN KEY (userId) REFERENCES users(id)
);
```

## API Endpoints
### Authentication
- **POST `/signup`** - Register a new user
- **POST `/login`** - Authenticate and receive a JWT token

### Jobs Management
- **GET `/api/jobs`** - Get all job listings
- **POST `/api/jobs`** - Create a new job (Requires Authentication)
- **GET `/api/jobs/:id`** - Get details of a single job
- **PUT `/api/jobs/:id`** - Update job details (Requires Authentication)
- **DELETE `/api/jobs/:id`** - Delete a job (Requires Authentication)

## Setup Instructions
1. Clone the repository:
   ```sh
   git clone origin  https://github.com/Sravanikonapalli/job-listing-platform.git 
   cd job-listing-platform
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the backend server:
   ```sh
   cd backend
   node server.js
   ```
4. Start the frontend:
   ```sh
   cd frontend
   npm start
   ```
5. Access the backend application at `http://localhost:3000`

## Deployment
- **Backend:** Deployed on Render
- **Frontend:** Deployed on Vercel


