# 🚀 How to Start - Sachin Parking System

## Step 1: Prerequisites

Make sure you have installed:
- **Node.js** (version 18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** - Either:
  - Local MongoDB installed, OR
  - MongoDB Atlas account (free cloud database)

Check Node.js:
```bash
node --version
npm --version
```

---

## Step 2: Setup Backend

### 2.1 Navigate to backend folder
```bash
cd backend
```

### 2.2 Install dependencies
```bash
npm install
```

### 2.3 Create environment file
Create a file named `.env` in the `backend` folder:

```bash
# On Linux/Mac:
touch .env

# On Windows (PowerShell):
New-Item .env
```

### 2.4 Add MongoDB connection to .env
Open `backend/.env` and add:

**For Local MongoDB:**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sachin-parking
NODE_ENV=development
```

**For MongoDB Atlas (Cloud):**
```
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sachin-parking
NODE_ENV=development
```
*(Replace username, password, and cluster with your Atlas credentials)*

### 2.5 Start MongoDB (if using local)
```bash
# On Linux/Mac:
sudo systemctl start mongod
# or
mongod

# On Windows:
# MongoDB should start automatically as a service
```

### 2.6 Start Backend Server
```bash
npm start
```

You should see:
```
✅ MongoDB Connected
🚀 Server running on port 5000
```

**Keep this terminal open!**

---

## Step 3: Setup Frontend

### 3.1 Open a NEW terminal window
*(Keep backend running in the first terminal)*

### 3.2 Navigate to frontend folder
```bash
cd frontend
```

### 3.3 Install dependencies
```bash
npm install
```

### 3.4 Create environment file
Create a file named `.env.local` in the `frontend` folder:

```bash
# On Linux/Mac:
touch .env.local

# On Windows (PowerShell):
New-Item .env.local
```

### 3.5 Add API URL to .env.local
Open `frontend/.env.local` and add:

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 3.6 Start Frontend Development Server
```bash
npm run dev
```

You should see:
```
- ready started server on 0.0.0.0:3000
- Local: http://localhost:3000
```

---

## Step 4: Open in Browser

Open your browser and go to:
```
http://localhost:3000
```

You should see the **Sachin Parking System** home page! 🎉

---

## Step 5: Test the System

### Test Check-In:
1. Click "Vehicle Check-In"
2. Enter vehicle details:
   - Vehicle Number: `MH12AB1234`
   - Owner Name: `John Doe`
   - Owner Mobile: `9876543210`
   - Vehicle Type: `Car`
   - Rate Per Day: `100`
3. Click "Check-In Vehicle"
4. You'll be redirected to print page with token

### Test Check-Out:
1. Go back to home
2. Click "Vehicle Check-Out"
3. Enter the vehicle number you just checked in
4. Select check-out date/time
5. See auto-calculated amount
6. Click "Check-Out Vehicle"
7. Print the bill

### Test Dashboard:
1. Click "Dashboard"
2. See real-time statistics

---

## 🛠️ Troubleshooting

### Backend won't start:
- **MongoDB not running**: Start MongoDB service
- **Port 5000 in use**: Change PORT in `.env`
- **Connection error**: Check MONGODB_URI in `.env`

### Frontend won't start:
- **Port 3000 in use**: Kill process or change port
- **API errors**: Make sure backend is running on port 5000
- **Module errors**: Delete `node_modules` and run `npm install` again

### Common Commands:
```bash
# Stop servers: Press Ctrl+C in terminal

# Reinstall dependencies:
cd backend && rm -rf node_modules && npm install
cd frontend && rm -rf node_modules && npm install

# Check if ports are in use:
# Linux/Mac:
lsof -i :5000
lsof -i :3000

# Windows:
netstat -ano | findstr :5000
netstat -ano | findstr :3000
```

---

## 📝 Quick Reference

**Backend Terminal:**
```bash
cd backend
npm install
# Create .env file
npm start
```

**Frontend Terminal:**
```bash
cd frontend
npm install
# Create .env.local file
npm run dev
```

**Access:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

---

## 🎯 Next Steps

1. ✅ Both servers running
2. ✅ Open http://localhost:3000
3. ✅ Start using the system!

**Happy Parking Management! 🚗**

