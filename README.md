
# BSafe

BSafe is a personal safety platform that connects users in distress with nearby verified volunteers. When a user raises an SOS alert, only volunteers within a defined radius are notified — keeping response times fast and relevant.

**Live app:** https://bsafe-phi.vercel.app
**Live API:** https://bsafe-backend-09rq.onrender.com

## Features

- **SOS Alerts** — Users can raise an emergency alert with their live location, which is instantly visible to nearby volunteers.
- **Nearby-volunteer matching** — Alerts are only shown to volunteers within a configurable radius (default 10km) of the user, calculated using the Haversine distance formula.
- **Volunteer verification** — Volunteers must be verified by an admin before they can view or respond to alerts.
- **Emergency contacts** — Users can maintain a list of emergency contacts on their profile.
- **Safety profile** — Users can store medical info (blood group, medical notes, etc.) for responders.
- **Safe zones** — Predefined safe locations users can navigate to during an emergency.
- **Admin dashboard** — Admins can verify volunteers, view all users, and monitor all alerts with live stats.
- **Alert lifecycle** — Alerts move through `active → assigned → resolved` as a volunteer accepts and resolves them.

## Tech Stack

**Frontend:** React, React Router, Axios
**Backend:** Node.js, Express
**Database:** MongoDB (Mongoose)
**Auth:** JWT-based authentication
**Deployment:** Vercel (frontend), Render (backend), MongoDB Atlas (database)

## Project Structure

```
bsafe/
├── client/                 # React frontend
│   └── src/
│       ├── api/            # Axios instance with auth interceptor
│       ├── components/     # Reusable UI components
│       ├── context/        # React context providers
│       └── pages/          # Route-level pages (Dashboard, Login, etc.)
└── server/                 # Express backend
    ├── config/             # Database and app config
    ├── controllers/        # Route handler logic
    ├── middleware/         # Auth middleware (protect, adminOnly)
    ├── models/             # Mongoose schemas (User, Alert, SafeZone)
    ├── routes/              # Express route definitions
    └── utils/               # Helper functions (e.g. distance calculation)
```

## Getting Started (Local Development)

### Prerequisites
- Node.js and npm
- A MongoDB Atlas cluster (or local MongoDB instance)

### 1. Clone the repo
```bash
git clone https://github.com/GaruguSanjana/bsafe.git
cd bsafe
```

### 2. Set up the backend
```bash
cd server
npm install
```

Create a `.env` file in `server/` with:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

Start the server:
```bash
npm start
```

### 3. Set up the frontend
```bash
cd client
npm install
```

In `client/src/api/axios.js`, point `baseURL` to `http://localhost:5000/api` for local development (switch back to the production URL before deploying).

Start the client:
```bash
npm start
```

The app will run at `http://localhost:3000`, and the API at `http://localhost:5000`.

## Key API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user or volunteer |
| POST | `/api/auth/login` | Log in and receive a JWT |
| GET | `/api/users/profile` | Get logged-in user's profile |
| PATCH | `/api/users/location` | Update the logged-in volunteer's current location |
| POST | `/api/alerts/sos` | Create a new SOS alert |
| GET | `/api/alerts/active` | Get active alerts near the logged-in volunteer |
| PUT | `/api/alerts/:id/accept` | Volunteer accepts an alert |
| PUT | `/api/alerts/:id/resolve` | Mark an alert as resolved |
| GET | `/api/users/pending-volunteers` | (Admin) List unverified volunteers |
| PUT | `/api/users/verify/:id` | (Admin) Verify a volunteer |

## Deployment

- **Backend:** Auto-deploys to Render on every push to the `main` branch. Environment variables (`MONGO_URI`, `JWT_SECRET`) are set directly in Render's dashboard under Settings → Environment.
- **Frontend:** Auto-deploys to Vercel on every push to `main`.

## License

This project currently has no license specified.