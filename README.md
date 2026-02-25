# SoulSync - Mental Health Self-Assessment with Music

## Folder Structure

```
soulsync/
├── backend/
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── middleware/
│   │   └── auth.js             # JWT authentication middleware
│   ├── models/
│   │   ├── User.js             # User schema
│   │   ├── Assessment.js       # Assessment schema
│   │   ├── Music.js            # Music schema
│   │   └── Recommendation.js  # Recommendation schema
│   ├── routes/
│   │   ├── auth.js             # Register/Login routes
│   │   ├── assessment.js       # Assessment routes
│   │   ├── music.js            # Music routes
│   │   └── dashboard.js        # Dashboard/analytics routes
│   ├── seed.js                 # Database seeder
│   ├── server.js               # Express server entry point
│   ├── package.json
│   └── .env                    # Environment variables
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── MusicPlayer.jsx
│   │   │   └── ProgressChart.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Assessment.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── Music.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)

### Backend Setup
```bash
cd backend
npm install
# Edit .env with your MongoDB URI
npm run seed     # Seeds music data
npm start        # Starts server on port 5000
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev      # Starts on port 5173
```

## Environment Variables (backend/.env)
```
MONGO_URI=mongodb://localhost:27017/soulsync
JWT_SECRET=soulsync_secret_key_2025
PORT=5000
```