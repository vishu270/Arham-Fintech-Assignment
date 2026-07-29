# Arham Fintech - Architecture Document

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React + Vite)                   │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │  ClientsPage │  │  TradesPage  │  │  IncentivesPage      │   │
│  │  EmployeesPage  MyClientsPage  │  (Calculated in React)  │   │
│  └──────────────┘  └──────────────┘  └──────────────────────┘   │
│        │                   │                      │              │
│        └───────────────────┼──────────────────────┘              │
│                            │                                     │
│                    ┌───────▼────────┐                            │
│                    │ Axios Service  │                            │
│                    │   (api.js)     │                            │
│                    └───────┬────────┘                            │
└────────────────────────────┼───────────────────────────────────┘
                             │
                      HTTP (Port 5173)
                             │
┌────────────────────────────▼───────────────────────────────────┐
│                   BACKEND (Express + Node.js)                   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    PUBLIC ROUTES                          │  │
│  │                                                            │  │
│  │  ┌──────────────────────────────────────────────────┐   │  │
│  │  │  GET /clients  ──▶ [bseMiddleware] ──▶ Controller│   │  │
│  │  │  GET /trades   ──▶ [bseMiddleware] ──▶ Controller│   │  │
│  │  └──────────────────────────────────────────────────┘   │  │
│  │         ▲                                    │            │  │
│  │         │ 5000ms delay + 20% failures      │            │  │
│  │         │ (simulates slow BSE API)         ▼            │  │
│  │         └─ bseMiddleware.js                             │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              INTERNAL ROUTES (No Delay)                  │  │
│  │                                                            │  │
│  │  GET /internal/employees  ──▶ Controller ──▶ Query      │  │
│  │  GET /internal/mappings   ──▶ Controller ──▶ Query      │  │
│  │                                                            │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                │                                │
│                                ▼                                │
│  ┌────────────────────────────────────────────────────────┐   │
│  │         MongoDB Atlas (Cloud Database)                  │   │
│  │                                                          │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │   │
│  │  │ Clients  │ │ Trades   │ │Employees │ │Mappings  │  │   │
│  │  │  (250)   │ │ (3121)   │ │  (20)    │ │  (250)   │  │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │   │
│  │                                                          │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## Data Flow: From Mapping to Incentives

```
Step 1: Fetch Raw Data (Parallel)
┌─────────────────────────────────────────┐
│ Promise.all([                           │
│   /internal/employees  → 20 employees   │
│   /internal/mappings   → 250 mappings   │
│   /clients            → 250 clients     │
│   /trades             → 3121 trades     │
│ ])                                      │
└─────────────────────────────────────────┘
                    │
                    ▼
Step 2: For Each Employee
┌─────────────────────────────────────────┐
│ Filter mappings where employee._id      │
│         matches current employee        │
└─────────────────────────────────────────┘
                    │
                    ▼
Step 3: Extract Assigned Clients
┌─────────────────────────────────────────┐
│ Get client._id from filtered mappings   │
│         → [clientID1, clientID2, ...]   │
└─────────────────────────────────────────┘
                    │
                    ▼
Step 4: Match Trades to Clients
┌─────────────────────────────────────────┐
│ Filter trades where trade.client._id    │
│     is in the assigned clients list     │
└─────────────────────────────────────────┘
                    │
                    ▼
Step 5: Calculate Incentive
┌─────────────────────────────────────────┐
│ totalBrokerage = Σ(trade.price)         │
│ incentive = totalBrokerage × 0.10 (10%) │
└─────────────────────────────────────────┘
                    │
                    ▼
Step 6: Display Results
┌─────────────────────────────────────────┐
│ Show table with incentive per employee  │
└─────────────────────────────────────────┘
```

---

## BSE Mock API Behavior

**What is the BSE?**
BSE (Bombay Stock Exchange) = Stock exchange API that provides client and trade data. In real scenarios, this API is often slow or unreliable.

**How We Simulate It:**

1. **Middleware Interceptor**
   ```
   Request → bseMiddleware.js → [delay] → [random failure?] → Controller
   ```

2. **Delay (5000ms = 5 seconds)**
   - Configured via `BSE_DELAY` env variable
   - Applied to `/clients` and `/trades` only
   - Internal routes (`/internal/*`) skip this

3. **Random Failures (20%)**
   - Configured via `BSE_FAILURE_RATE` (0.2 = 20%)
   - Randomly returns `503 Service Unavailable`
   - Simulates transient failures (temporary network issues)

4. **Code:**
   ```javascript
   // Pseudo-code from bseMiddleware.js
   if (BSE_DELAY > 0) {
     await sleep(BSE_DELAY);
   }
   if (Math.random() < BSE_FAILURE_RATE) {
     return res.status(503).json({ error: "BSE request failed" });
   }
   next(); // Continue to controller
   ```

---

## Why UI Loads Faster with Parallel Requests

**Problem:** BSE endpoints are slow (5 second delay). Without optimization, pages would wait for each request one after another.

**Solution: Parallel Loading**
```
Traditional (sequential):
/clients (5s) → /trades (5s) → Total: 10s ❌

Parallel requests:
Promise.all([
  /clients    (5s)
  /trades     (5s)
  /employees  (0s)
  /mappings   (0s)
]) → Total: ~5s (longest request)
```

**Key point:** Promise.all only performs parallel requests. It reduces the total waiting time compared to sequential requests, but it does not eliminate backend delay.

**Benefits:**
- Multiple requests happen at once
- The page waits only for the slowest request
- The UI can render sooner than sequential fetches
- Real-time updates are provided by Socket.IO, not by Promise.all

In production, caching or background synchronization would allow the UI to stay responsive even when the BSE service is slow or unavailable.

---

## Real-Time Updates with Socket.IO

**Current State:** Implemented. The backend attaches Socket.IO to the existing HTTP server and the frontend subscribes on active pages.

**Current Flow:**
```
1. Frontend connects: io('http://localhost:5000')
2. Backend accepts the socket connection
3. Backend emits `init` once on connect
4. Backend periodically emits update events every 30 seconds
5. Frontend listens and refreshes the current page data
```

Event names:
- `init`
- `clients:updated`
- `trades:updated`
- `employees:updated`
- `mappings:updated`

The implementation is in `backend/server.js`, `backend/src/sockets/socketHandlers.js`, and `frontend/src/services/socket.js`.

---

## Error Handling & Retry Strategy

```
Request fails (Network error or 503)
            │
            ▼
┌─────────────────────────────┐
│ Catch block triggers        │
│ setError(message)           │
└─────────────────────────────┘
            │
            ▼
┌─────────────────────────────┐
│ Show error alert to user    │
│ Loading spinner disappears  │
└─────────────────────────────┘
            │
            ▼
┌─────────────────────────────┐
│ User can:                   │
│ - Refresh page manually     │
│ - Try again                 │
│ - Contact support          │
└─────────────────────────────┘
```

**Why no automatic retry?**
- Assignment doesn't require it
- Simple and interview-friendly
- User has control
- Shows good error UX design

---

## Frontend Application Flow

```
App.jsx (Routes)
    │
    ├─▶ ClientsPage
    │     └─ GET /clients → Display table
    │
    ├─▶ TradesPage
    │     └─ GET /trades → Display table
    │
    ├─▶ EmployeesPage
    │     └─ GET /internal/employees → Display table
    │
    ├─▶ MyClientsPage
    │     └─ GET /internal/mappings → Filter by EMP001 → Display
    │
    └─▶ IncentivesPage
          └─ GET [employees, mappings, clients, trades] → Calculate → Display

Each page follows same pattern:
1. useEffect fetches data on mount
2. Show loading spinner
3. On error: show alert
4. On success: show table
5. If empty: show empty state
```

---

## Key Design Principles

| Principle | Implementation |
|-----------|-----------------|
| **Performance** | Parallel API calls, no blocking operations |
| **Reliability** | Error boundaries, graceful failure handling |
| **Simplicity** | No unnecessary libraries, interview-friendly code |
| **Responsiveness** | Bootstrap grid, mobile-first design |
| **Maintainability** | Clear component structure, reusable patterns |
| **Scalability** | Ready for Socket.IO, authentication, advanced features |

---

## Deployment Architecture (Future)

```
Frontend (Vercel/Netlify)
    │
    ├─ React build → CDN
    └─ API calls → Backend
           │
Backend (Heroku/Railway/EC2)
    │
    ├─ Express server
    ├─ MongoDB Atlas connection
    └─ Socket.IO server
           │
Database (MongoDB Atlas Cloud)
    └─ Persistent data storage
```

---

**Document Version:** 1.0  
**Last Updated:** 2026-07-29  
**Status:** Complete for Part A & Part B
