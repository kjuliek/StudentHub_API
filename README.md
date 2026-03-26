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
# Framework
npm install express

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
│   ├── data/               ← In-memory data
│   ├── routes/             ← API endpoints
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
