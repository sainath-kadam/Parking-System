# 🚀 Deployment Guide

## Quick Start Commands

### Backend
```bash
cd backend
npm install
# Create .env file with MongoDB URI
npm start
```

### Frontend
```bash
cd frontend
npm install
# Create .env.local with API URL
npm run dev
```

## Production Build

### Frontend
```bash
cd frontend
npm run build
npm start
```

### Backend
```bash
cd backend
NODE_ENV=production npm start
```

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sachin-parking
NODE_ENV=production
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## MongoDB Setup

### Local MongoDB
1. Install MongoDB
2. Start MongoDB service
3. Update MONGODB_URI in backend/.env

### MongoDB Atlas (Cloud)
1. Create account at mongodb.com/atlas
2. Create cluster
3. Get connection string
4. Update MONGODB_URI in backend/.env

## Deployment Platforms

### Frontend (Vercel/Netlify)
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set environment variable: `NEXT_PUBLIC_API_URL`
4. Deploy

### Backend (Railway/Heroku/DigitalOcean)
1. Connect repository
2. Set environment variables
3. Ensure MongoDB connection
4. Deploy

## Notes
- Frontend and backend can be deployed separately
- Update API URL in frontend after backend deployment
- Ensure CORS is configured for production domain

