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
