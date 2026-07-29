# Arham Fintech - Full Stack Application

A modern fintech dashboard for managing clients, trades, employees, and incentives with real-time BSE API simulation and responsive UI design.

## Project Overview

This is a full-stack Node.js + React application demonstrating:
- **Backend (Part A):** RESTful APIs with MongoDB, BSE mock behavior (delay + failures)
- **Frontend (Part B):** Interactive dashboard with 5 pages, Bootstrap responsive design, real-time data

**Key Features:**
- 250+ clients with complete trade history
- 20 employees managing 250 client mappings
- 3000+ simulated trades with configurable BSE delays
- 10% incentive calculation per employee
- Responsive UI (mobile, tablet, desktop)
- Loading states, error handling, empty states

---

## Backend Setup

### Prerequisites
- Node.js v16+ (v22.14.0 tested)
- MongoDB Atlas account (free tier ok)
- npm or yarn

### Installation

```bash
cd backend
npm install
```

### Environment Configuration

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/arham_fintech
BSE_DELAY=5000
BSE_FAILURE_RATE=0.2
```

**Variables Explanation:**
- `PORT` - Backend server port
- `MONGO_URI` - MongoDB connection string (Atlas recommended)
- `BSE_DELAY` - Artificial delay in milliseconds (simulates slow BSE API)
- `BSE_FAILURE_RATE` - Probability of failure (0.2 = 20% chance)

On simulated BSE failure, the backend logs a warning and still returns MongoDB fallback data so the frontend remains functional.

### Database Seeding

Automatically seeds on first run:
- 20 Employees
- 250 Clients
- 250 Employee-Client Mappings
- 3121 Trades

```bash
node src/seed/seed.js
```

### Run Backend

```bash
node server.js
```

**Output:**
```
✅ MongoDB Connected
Server running on http://localhost:5000
```

---

## Frontend Setup

### Prerequisites
- Node.js v16+
- npm or yarn
- Backend running on http://localhost:5000

### Installation

```bash
cd frontend
npm install
```

### Environment Configuration

Frontend uses hardcoded API endpoint (no `.env` needed):
- API Base URL: `http://localhost:5000`
- Dev Server: `http://localhost:5173` or `http://localhost:3000`

### Run Frontend (Development)

```bash
npm run dev
```

**Output:**
```
  VITE v5.4.21  ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

### Build Frontend (Production)

```bash
npm run build
npm run preview
```

---

## API Endpoints

### Public Endpoints (with BSE mock behavior)

**GET /clients**
- Returns all 250 clients
- Response: `{ success: true, count: 250, data: [...] }`
- Applied: BSE delay + configurable failures

**GET /trades**
- Returns all trades (3121+)
- Query params: `?client=ID`, `?startDate=ISO`, `?endDate=ISO`
- Response: `{ success: true, count: N, data: [...] }`
- Applied: BSE delay + configurable failures

### Internal Endpoints (no delay/failures)

**GET /internal/employees**
- Returns all 20 employees
- Response: `{ success: true, count: 20, data: [...] }`

**GET /internal/mappings**
- Returns all 250 employee-client mappings
- Includes populated employee and client data
- Response: `{ success: true, count: 250, data: [...] }`

---

## Folder Structure

```
arham-fintech-assignment/
├── backend/
│   ├── src/
│   │   ├── app.js                 # Express app setup
│   │   ├── config/
│   │   │   └── db.js              # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── clientController.js
│   │   │   ├── tradeController.js
│   │   │   └── internalController.js
│   │   ├── middleware/
│   │   │   └── bseMiddleware.js   # Delay + failure simulation
│   │   ├── models/
│   │   │   ├── Client.js
│   │   │   ├── Trade.js
│   │   │   ├── Employee.js
│   │   │   └── Mapping.js
│   │   ├── routes/
│   │   │   ├── clientRoutes.js
│   │   │   ├── tradeRoutes.js
│   │   │   └── internalRoutes.js
│   │   └── seed/
│   │       └── seed.js            # Database initialization
│   ├── server.js
│   ├── package.json
│   ├── .env
│   └── nodemon.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx
│   │   ├── layouts/
│   │   │   ├── MainLayout.jsx
│   │   │   └── MainLayout.css
│   │   ├── pages/
│   │   │   ├── ClientsPage.jsx
│   │   │   ├── TradesPage.jsx
│   │   │   ├── EmployeesPage.jsx
│   │   │   ├── MyClientsPage.jsx
│   │   │   └── IncentivesPage.jsx
│   │   ├── services/
│   │   │   └── api.js             # Axios configuration
│   │   ├── App.jsx                # Routes
│   │   ├── main.jsx
│   │   └── index.css
│   ├── vite.config.js
│   ├── package.json
│   └── index.html
│
└── README.md (this file)
```

---

## Pages & Features

### 1. Clients Page
- Displays all 250 clients
- Columns: Code, Name, PAN, Email
- Loading spinner, error alert, empty state
- Responsive Bootstrap table

### 2. Trades Page
- Displays 3000+ trades
- Columns: Symbol, Quantity, Price (₹), Date
- Filter-ready (backend supports `?client=ID`, `?startDate=`, `?endDate=`)
- Responsive table

### 3. Employees Page
- Displays 20 employees
- Columns: Code, Name, Email
- Connected to `/internal/employees`

### 4. My Clients Page
- Shows clients assigned to EMP001 (hardcoded for demo)
- Data source: `/internal/mappings`
- Filters by employee code
- Same table design as Clients page

### 5. Incentives Page
- Calculates incentives for all employees
- Flow: Employee → Mappings → Clients → Trades → Calculate Brokerage → Incentive (10%)
- Columns: Code, Name, Clients, Trades, Brokerage (₹), Incentive (₹)
- All calculations done in frontend

---

## Technology Stack

### Backend
- **Runtime:** Node.js (CommonJS)
- **Framework:** Express 5.2.1
- **Database:** MongoDB with Mongoose 9.8.1
- **Utilities:** dotenv 17.4.2, CORS 2.8.6, faker @9.0.0

### Frontend
- **Framework:** React 18.3.1 with Vite 5.4.10
- **UI:** Bootstrap 5.3.3 (responsive grid, utilities)
- **Routing:** React Router DOM 6.21.0
- **HTTP:** Axios 1.7.3

---

## Running the Application

### Terminal 1: Start Backend
```bash
cd backend
node server.js
```

### Terminal 2: Start Frontend
```bash
cd frontend
npm run dev
```

### Open in Browser
```
http://localhost:5173
```

---

## How to Test Socket.IO Locally
1. Start backend:
```bash
cd backend
npm start
```
2. Start frontend:
```bash
cd frontend
npm run dev
```
3. Open the app at `http://localhost:5173`
4. Keep a page open and wait for Socket.IO updates or change backend data.

Socket.IO events are emitted from the existing Express server at `http://localhost:5000`.

---

## Key Design Decisions

1. **Responsive Design:** Bootstrap utilities only (no Tailwind) - simpler bundle, familiar to teams
2. **Frontend Calculations:** Incentives calculated in React, not backend - reduces server load
3. **Error Handling:** User-friendly alerts on all pages, no silent failures
4. **Loading States:** Spinners prevent UI jarring, data shown only when ready
5. **Temporary Employee:** EMP001 hardcoded for demo (ready to swap with auth)

---

## Assignment Compliance

✅ Part A: Backend APIs with mock BSE behavior  
✅ Part B: Responsive React frontend with 5 pages  
✅ Seed data: 250 clients, 3121 trades, 20 employees, 250 mappings  
✅ Middleware: BSE delay + failure simulation  
✅ UI: Loads quickly, handles slow BSE gracefully  
✅ Error handling: Loading, error, empty states on all pages  

---

## Future Enhancements

- Socket.IO integration for real-time updates
- User authentication and employee-specific sessions
- Advanced filtering and search
- Export to CSV/PDF
- Charts and analytics dashboard

---

## License

This project is for educational purposes as part of the Arham Fintech assignment.
