# StudentHub API

A RESTful API built with Node.js and Express.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express
- **Testing**: Jest + Supertest
- **Linter**: ESLint

## Prerequisites

- Node.js (v18+)
- npm

## Installation

Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd StudentHub_API
npm install
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start the server on port 3000 |
| `npm test` | Run the test suite with Jest |
| `npm run lint` | Run ESLint on the codebase |

## Project Setup (how this project was initialized)

### 1. Initialize npm

```bash
npm init -y
```

### 2. Install dependencies

```bash
# Framework (Express 4 — v5 is experimental and incompatible)
npm install express@4

# Dev dependencies
npm install --save-dev jest supertest eslint
```

### 3. Configure ESLint

```bash
npx eslint --init
```

Options selected:
- Lint: **JavaScript**
- Purpose: **Check syntax and find problems**
- Module type: **CommonJS (require/exports)**
- Framework: **None**
- TypeScript: **No**
- Environment: **Node**
- Package manager: **npm**

### 4. Configure scripts in `package.json`

```json
"scripts": {
  "start": "node src/index.js",
  "test": "jest",
  "lint": "eslint ."
}
```

### 5. Create the entry point

Create `src/index.js` with a basic Express server.

## Project Structure

```
StudentHub_API/
├── .github/workflows/
│   └── ci.yml              ← CI pipeline
├── src/
│   ├── data/
│   │   └── students.js     ← In-memory data + reset function
│   ├── routes/
│   │   └── students.js     ← HTTP routing only
│   ├── services/
│   │   └── students.js     ← Business logic & validation
│   ├── app.js              ← Express config (no server start)
│   └── index.js            ← Server entry point (app.listen)
├── tests/                  ← Test files
├── .gitignore
├── eslint.config.mjs
└── package.json
```

> `app.js` and `index.js` are intentionally separated so that tests can import the app without starting the server on a port.

## Data Model

Data is stored **in memory** (no database). Data resets on every server restart.

### Student

| Property | Type | Required | Constraints |
|----------|------|----------|-------------|
| `id` | Integer | Auto-generated | Unique, auto-incremented |
| `firstName` | String | Yes | Min 2 characters |
| `lastName` | String | Yes | Min 2 characters |
| `email` | String | Yes | Valid email format, unique |
| `grade` | Number | Yes | Between 0 and 20 |
| `field` | String | Yes | `informatique`, `mathématiques`, `physique`, or `chimie` |

The data file (`src/data/students.js`) is pre-filled with 5 test students and exposes a `resetStudents()` function used to restore the initial state between tests.

## API Reference

Base URL: `http://localhost:3000`

### Students

| Method | Endpoint | Description | Success | Errors |
|--------|----------|-------------|---------|--------|
| `GET` | `/students` | List all students | 200 | — |
| `GET` | `/students/stats` | Get statistics | 200 | — |
| `GET` | `/students/search?q=` | Search students by name | 200 | 400 |
| `POST` | `/students` | Create a new student | 201 | 400, 409 |
| `GET` | `/students/:id` | Get a student by ID | 200 | 400, 404 |
| `PUT` | `/students/:id` | Update a student | 200 | 400, 404, 409 |
| `DELETE` | `/students/:id` | Delete a student | 200 | 400, 404 |

### Examples (PowerShell)

```powershell
# GET all students
Invoke-RestMethod -Uri http://localhost:3000/students

# GET one student
Invoke-RestMethod -Uri http://localhost:3000/students/1

# POST — create a student
Invoke-RestMethod -Method POST -Uri http://localhost:3000/students -ContentType "application/json" -Body '{"firstName":"Lea","lastName":"Simon","email":"lea.simon@email.com","grade":14,"field":"physique"}'

# PUT — update a student
Invoke-RestMethod -Method PUT -Uri http://localhost:3000/students/1 -ContentType "application/json" -Body '{"firstName":"Alice","lastName":"Martin","email":"alice.martin@email.com","grade":19,"field":"informatique"}'

# DELETE — delete a student
Invoke-RestMethod -Method DELETE -Uri http://localhost:3000/students/2

# GET stats
Invoke-RestMethod -Uri http://localhost:3000/students/stats

# GET search
Invoke-RestMethod -Uri "http://localhost:3000/students/search?q=ali"
```

## Known Issues & Troubleshooting

### Express 5 incompatibility

**Symptom:**
```
TypeError: argument handler must be a function
at Function.use (express/lib/application.js)
```

**Cause:** `npm install express` installs Express 5 by default (`^5.x`), which is still experimental and incompatible with standard router usage (`express.Router()`).

**Fix:** Downgrade to Express 4:
```bash
npm install express@4
```
