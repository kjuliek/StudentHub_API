# StudentHub API

![CI](https://github.com/kjuliek/StudentHub_API/actions/workflows/ci.yml/badge.svg)
![Node.js](https://img.shields.io/badge/node-%3E%3D18-brightgreen)
![Express](https://img.shields.io/badge/express-4.x-blue)
![Jest](https://img.shields.io/badge/tested%20with-jest-99424f)
![ESLint](https://img.shields.io/badge/linted%20with-eslint-4B32C3)
![License](https://img.shields.io/badge/license-ISC-yellow)
![GitHub last commit](https://img.shields.io/github/last-commit/kjuliek/StudentHub_API)
![GitHub issues](https://img.shields.io/github/issues/kjuliek/StudentHub_API)
![GitHub repo size](https://img.shields.io/github/repo-size/kjuliek/StudentHub_API)
![GitHub stars](https://img.shields.io/github/stars/kjuliek/StudentHub_API)
![GitHub forks](https://img.shields.io/github/forks/kjuliek/StudentHub_API)
![GitHub pull requests](https://img.shields.io/github/issues-pr/kjuliek/StudentHub_API)

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

## CI/CD Pipeline

The pipeline is configured in [.github/workflows/ci.yml](.github/workflows/ci.yml) and runs automatically on every **push** or **pull request** to `main`.

### Trigger

```yaml
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
```

### Matrix strategy

The pipeline runs in parallel on **Node.js 18 and 20** to ensure compatibility across versions.

### Steps

| Step | Command | Description |
|------|---------|-------------|
| Checkout | `actions/checkout@v5` | Clone the repository into the runner |
| Setup | `actions/setup-node@v5` | Install the Node.js version from the matrix |
| Install | `npm install` | Install all dependencies |
| Lint | `npm run lint` | Check code quality — any error fails the pipeline |
| Test | `npm test` | Run the test suite — any failure fails the pipeline |

### Result

- All steps pass on both Node versions → **pipeline green**
- Any lint error or failing test → **pipeline red**

### Red → Green cycle

To prove the pipeline detects bugs, we intentionally introduced and then fixed a bug:

1. **Green** — pipeline passing on all tests
2. **Bug introduced** — changed POST status code from `201` to `200` in `src/routes/students.js`, causing the test `should return 201 and the created student with an ID` to fail
   - Commit: `test: introduce intentional bug to demonstrate CI`
3. **Red** — pipeline failed (see screenshot)
4. **Fix applied** — restored correct `201` status code
   - Commit: `fix: restore correct 201 status code on POST /students`
5. **Green** — pipeline passing again (see screenshot)

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start the server on port 3000 |
| `npm test` | Run the test suite with Jest |
| `npm run lint` | Run ESLint on the codebase |

### Linter setup

ESLint is configured in `eslint.config.mjs` with the following rules:

| Rule | Level | Description |
|------|-------|-------------|
| `no-unused-vars` | error | No declared variables left unused (variables prefixed with `_` are ignored) |
| `no-console` | warn | No forgotten `console.log` statements |
| `eqeqeq` | error | Always use `===` instead of `==` |
| `no-unreachable` | error | No code after `return`/`throw` |

Run the linter:
```bash
npm run lint
```

## Testing

Tests are written with **Jest** and **Supertest**. Supertest allows sending HTTP requests directly to the Express app without starting the server on a port.

Each test file follows this structure:
- `beforeEach` resets the in-memory data so every test starts with the same 5 students, independent of the others
- `describe` groups tests by route
- `it` defines a single test case, checking both the HTTP status code and the response body

Run the tests:
```bash
npm test
```

### Test list

| # | Route | Description |
|---|-------|-------------|
| 1 | `GET /students` | Returns 200 and an array |
| 2 | `GET /students` | Returns all 5 initial students |
| 3 | `GET /students/:id` | Returns the correct student for a valid ID |
| 4 | `GET /students/:id` | Returns 404 for a non-existing ID |
| 5 | `GET /students/:id` | Returns 400 for an invalid ID (e.g. "abc") |
| 6 | `POST /students` | Returns 201 and the created student with an ID |
| 7 | `POST /students` | Returns 400 when a required field is missing |
| 8 | `POST /students` | Returns 400 for an invalid grade (e.g. 25) |
| 9 | `POST /students` | Returns 409 for a duplicate email |
| 10 | `PUT /students/:id` | Returns 200 and the updated student |
| 11 | `PUT /students/:id` | Returns 404 for a non-existing ID |
| 12 | `DELETE /students/:id` | Returns 200 for a valid ID |
| 13 | `DELETE /students/:id` | Returns 404 for a non-existing ID |
| 14 | `GET /students/stats` | Returns totalStudents, averageGrade, studentsByField, bestStudent |
| 15 | `GET /students/search` | Returns matching students by name |

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
| `GET` | `/students?page=1&limit=10` | List students with pagination | 200 | 400 |
| `GET` | `/students?sort=grade&order=desc` | List students with sort | 200 | 400 |
| `GET` | `/students/stats` | Get statistics | 200 | — |
| `GET` | `/students/search?q=` | Search students by name | 200 | 400 |
| `POST` | `/students` | Create a new student | 201 | 400, 409 |
| `GET` | `/students/:id` | Get a student by ID | 200 | 400, 404 |
| `PUT` | `/students/:id` | Update a student | 200 | 400, 404, 409 |
| `DELETE` | `/students/:id` | Delete a student | 200 | 400, 404 |

### Pagination

When `?page` or `?limit` are provided, the response format changes:

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 2,
    "total": 5,
    "totalPages": 3
  }
}
```

- `page` and `limit` must be positive integers → otherwise 400
- If the page is out of range, `data` is an empty array

### Sorting

The `?sort` and `?order` parameters are available on `GET /students` and `GET /students/search`.

| Parameter | Values | Default |
|-----------|--------|---------|
| `sort` | `id`, `firstName`, `lastName`, `email`, `grade`, `field` | none |
| `order` | `asc`, `desc` | `asc` |

- Invalid `sort` field → 400
- Invalid `order` value → 400
- Sort and pagination can be combined: `?sort=grade&order=desc&page=1&limit=2`

### Examples (Git Bash)

> Use Git Bash instead of PowerShell — `Invoke-RestMethod` does not display HTTP status codes on 4xx/5xx errors, making it impossible to verify error responses without extra workarounds.

GET /students — returns the full list
```bash
curl -s http://localhost:3000/students
```

GET /students with pagination — returns page 1 with 2 students per page
```bash
curl -s "http://localhost:3000/students?page=1&limit=2"
```

GET /students/1 — returns student with ID 1
```bash
curl -s http://localhost:3000/students/1
```

GET /students/999 — returns 404
```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/students/999
```

POST /students — valid data → 201
```bash
curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:3000/students -H "Content-Type: application/json" -d '{"firstName":"Lea","lastName":"Simon","email":"lea.simon@email.com","grade":14,"field":"physique"}'
```

POST /students — without email → 400
```bash
curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:3000/students -H "Content-Type: application/json" -d '{"firstName":"Lea","lastName":"Simon","grade":14,"field":"physique"}'
```

POST /students — existing email → 409
```bash
curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:3000/students -H "Content-Type: application/json" -d '{"firstName":"Lea","lastName":"Simon","email":"alice.martin@email.com","grade":14,"field":"physique"}'
```

PUT /students/1 — update a student
```bash
curl -s -o /dev/null -w "%{http_code}" -X PUT http://localhost:3000/students/1 -H "Content-Type: application/json" -d '{"firstName":"Alice","lastName":"Martin","email":"alice.martin@email.com","grade":19,"field":"informatique"}'
```

DELETE /students/1 — delete a student
```bash
curl -s -o /dev/null -w "%{http_code}" -X DELETE http://localhost:3000/students/1
```

GET /students/stats — returns statistics
```bash
curl -s http://localhost:3000/students/stats
```

GET /students/search?q=ahmed — returns matching results
```bash
curl -s "http://localhost:3000/students/search?q=ahmed"
```

### Verification Checklist

- [ ] `GET /students` returns the full list
- [ ] `GET /students/1` returns student with ID 1
- [ ] `GET /students/999` returns 404
- [ ] `POST /students` with valid data → 201
- [ ] `POST /students` without email → 400
- [ ] `POST /students` with existing email → 409
- [ ] `PUT /students/1` updates the student
- [ ] `DELETE /students/1` deletes the student
- [ ] `GET /students/stats` returns statistics
- [ ] `GET /students/search?q=ahmed` returns results

## Known Issues & Troubleshooting

### ESLint errors after configuration

After setting up ESLint, running `npm run lint` raised several errors:

**Jest globals not recognized (`no-undef`)**
ESLint didn't know about Jest's globals (`describe`, `it`, `expect`, `beforeEach`).
Fix: add `globals.jest` to the ESLint config for test files:
```js
{ files: ["tests/**/*.js"], languageOptions: { globals: { ...globals.jest } } }
```

**`eslint.config.mjs` parsing error**
Setting `sourceType: "commonjs"` on all files broke the config file itself (which uses ESM `import/export`).
Fix: apply `sourceType: "commonjs"` only to `**/*.js` files, not `**/*.{js,mjs,cjs}`.

**Unused destructured variable (`no-unused-vars`)**
Destructuring `const { email, ...rest }` to exclude a field flags `email` as unused.
Fix: prefix with `_` to signal it's intentionally ignored (`email: _email`), and configure ESLint to allow it:
```js
"no-unused-vars": ["error", { "varsIgnorePattern": "^_", "argsIgnorePattern": "^_" }]
```

**`console.log` in `index.js` (`no-console`)**
The server startup log triggered a warning.
Fix: disable the rule for that specific line:
```js
// eslint-disable-next-line no-console
console.log(`Server running on port ${PORT}`);
```

### PowerShell — HTTP error codes not visible

**Problem:** `Invoke-RestMethod` throws an exception on 4xx/5xx responses without displaying the HTTP status code, making it impossible to verify error handling directly.

**Fix:** Use **Git Bash** with `curl` instead. The `-s -o /dev/null -w "%{http_code}"` flags display only the status code, and removing `-o /dev/null` shows the response body.

### Pagination — `page=0` not rejected

**Problem:** Using `parseInt(page) || 1` to parse the page parameter caused `page=0` to silently default to `1` instead of returning a 400 error. Since `0` is falsy in JavaScript, the `||` operator replaces it with the default value before validation runs.

**Fix:** Use `??` (nullish coalescing) instead of `||` to preserve `0`, then validate after parsing:
```js
const p = parseInt(page ?? 1);
if (isNaN(p) || p < 1) return res.status(400).json({ error: '...' });
```

### GitHub Actions — Node.js 20 deprecation warning

**Warning:** `actions/checkout@v4` and `actions/setup-node@v4` use Node.js 20 internally, which GitHub will deprecate in June 2026.

**Fix:** Upgrade to `@v5` which uses Node.js 24:
```yaml
uses: actions/checkout@v5
uses: actions/setup-node@v5
```

> This is unrelated to the Express or Node.js version used by the API — it only affects GitHub's internal pipeline tooling.

### `resetStudents` not working in tests

**Problem:** The `resetStudents` function was reassigning the `students` variable with a new array (`students = [...]`). Since the service imports a reference to the original array at startup, it never sees the new array — making the reset ineffective between tests.

**Fix:** Mutate the array in place instead of reassigning it:
```js
students.splice(0, students.length, ...initialStudents.map(s => ({ ...s })));
```
This way all modules holding a reference to the same array see the updated data.

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
