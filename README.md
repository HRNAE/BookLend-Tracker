# BookLend-Tracker

A simple classroom book-lending tracker: keep track of which books are in the classroom library, which students exist, and (eventually) who currently has which book. Built as a lightweight full-stack project — vanilla HTML/CSS/JS frontend talking to an Express + MySQL backend.

## Features

- **Add books** — title, author, and book number, stored as "available."
- **Add students** — name and student ID.
- **Live dropdowns** — student and available-book selectors refresh automatically after adds.
- **Aggregated data view** — a `/getAll` endpoint that pulls from all three underlying MySQL tables at once.

> **Note:** The UI also includes **Lend**, **Return**, and **Export CSV** buttons that call `/lend`, `/return`, and a CSV export endpoint. These routes aren't implemented on the server yet (see [Roadmap](#roadmap) below) — clicking them will currently fail.

## Tech Stack

**Frontend:** HTML, CSS, vanilla JavaScript (no framework/build step — just static files)
**Backend:** Node.js, Express 5
**Database:** MySQL (via the `mysql` package), using three connection pools
**Dev tooling:** nodemon, dotenv

## Project Structure

```
BookLend-Tracker/
├── client/
│   ├── index.html        # Main UI: add book / add student / lend-return panels
│   ├── index.js           # Fetch calls to the API, dropdown population
│   └── stylesheet.css
├── server/
│   ├── app.js              # Express app & routes
│   ├── dbService.js       # MySQL pool setup + query logic
│   ├── .env               # DB credentials (not committed — see below)
│   ├── .env.example       # Template for required environment variables
│   └── package.json
├── .vscode/
│   └── launch.json         # VS Code debug config for running the server
└── .gitignore
```

## Database Setup

The backend connects to **three separate MySQL databases/pools**, referred to as `db1`, `db2`, and `db3`:

| Pool | Purpose |
|------|---------|
| `db1` | Books (`title`, `author`, `book_id`, `date_added`, `available`) |
| `db2` | Students (`student_name`, `student_id`, `date_added`) |
| `db3` | Reserved / not yet used by any route |

All three currently query a table named `names`, so each pool is expected to point at a database that has a `names` table matching the relevant schema above.

Copy `server/.env.example` to `server/.env` and fill in your own values:

```bash
cp server/.env.example server/.env
```

```
PORT=5000

DB1_HOST=
DB1_USER=
DB1_PASSWORD=
DB1_DATABASE=
DB1_PORT=

DB2_HOST=
DB2_USER=
DB2_PASSWORD=
DB2_DATABASE=
DB2_PORT=

DB3_HOST=
DB3_USER=
DB3_PASSWORD=
DB3_DATABASE=
DB3_PORT=
```

`.env` is gitignored — never commit real credentials.

## Getting Started

### Prerequisites
- Node.js (with npm)
- Access to MySQL database(s) matching the schema above

### 1. Install server dependencies
```bash
cd server
npm install
```

### 2. Configure environment variables
Copy `server/.env.example` to `server/.env` and fill in your DB credentials (see above).

### 3. Run the server
```bash
npx nodemon app.js
# or
node app.js
```
The API will be available at `http://localhost:5000` (or whatever `PORT` you set).

### 4. Open the client
Open `client/index.html` directly in a browser, or serve the `client/` folder with any static file server. The frontend calls the API at `http://localhost:5000` — update the URLs in `index.js` if you change the port or deploy the backend elsewhere.

## API Reference

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/insert` | Insert a new book (`bookName`, `author`, `bookNumber`) or student (`studentName`, `studentId`), depending on which fields are present in the body |
| `GET`  | `/getAll` | Returns all rows from all three DB pools (`db1`, `db2`, `db3`) |
| `GET`  | `/students` | Returns all students (from `db2`) |
| `GET`  | `/books` | Returns books currently marked `available` (from `db1`) |

## Roadmap

A few pieces are stubbed out on the frontend but still need backend work:
- [ ] `POST /lend` — mark a book unavailable and associate it with a student
- [ ] `POST /return` — mark a book available again
- [ ] CSV export endpoint for the "Return CSV" button
- [ ] Decide on / implement a purpose for `db3`
- [ ] Input validation on the client (currently empty fields can be submitted)

