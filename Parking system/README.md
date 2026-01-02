# 🚗 Sachin Parking System

A professional, modern Parking Management System built with Next.js, Node.js, Express, and MongoDB.

## 📁 Project Structure

```
Parking system/
├── frontend/          # Next.js App Router application
│   ├── app/          # Pages and routes
│   ├── services/     # API services
│   └── styles/       # SCSS modules
│
└── backend/           # Node.js + Express API
    ├── controllers/  # Business logic
    ├── models/       # MongoDB schemas
    └── routes/       # API routes
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB (local or cloud)

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI
npm start
# or for development: npm run dev
```

Backend runs on `http://localhost:5000`

### Frontend Setup

```bash
cd frontend
npm install
cp .env.local.example .env.local
# Edit .env.local with API URL (default: http://localhost:5000/api)
npm run dev
```

Frontend runs on `http://localhost:3000`

## ✨ Features

- ✅ **Vehicle Check-In** - Auto-fill existing vehicle details
- ✅ **Vehicle Check-Out** - Auto-calculate parking days & amount
- ✅ **Dashboard** - Real-time stats (Today, Active, Earnings)
- ✅ **Print Bill** - Professional printable parking bills
- ✅ **Mobile-First** - Responsive design with smooth animations
- ✅ **Data Retention** - Automatic 6-month cleanup

## 🎨 Tech Stack

**Frontend:**
- Next.js 14 (App Router)
- TypeScript
- SCSS Modules
- Axios

**Backend:**
- Node.js
- Express.js
- MongoDB (Mongoose)
- RESTful APIs

## 📡 API Endpoints

### Parking
- `POST /api/parking/check-in` - Register vehicle entry
- `POST /api/parking/check-out` - Process vehicle exit
- `GET /api/parking/active` - Get currently parked vehicles
- `GET /api/parking/history` - Get parking history
- `GET /api/parking/stats` - Get dashboard statistics
- `GET /api/parking/token/:tokenId` - Get parking by token
- `DELETE /api/parking/cleanup` - Clean old data (6 months)

### Vehicle
- `GET /api/vehicle/:vehicleNumber` - Get vehicle details
- `GET /api/vehicle` - Get all vehicles

## 🎯 Usage

1. **Check-In**: Enter vehicle details → Auto-fills if exists → Generate token
2. **Check-Out**: Enter vehicle/token → Auto-calculates days & amount → Print bill
3. **Dashboard**: View real-time statistics and active parkings

## 📝 Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sachin-parking
NODE_ENV=development
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 🚢 Deployment

### Frontend (Vercel/Netlify)
1. Build: `npm run build`
2. Deploy with environment variables

### Backend (Railway/Heroku/DigitalOcean)
1. Set environment variables
2. Deploy Node.js app
3. Ensure MongoDB connection

## 📄 License

MIT

---

Built with ❤️ for Sachin Parking System

