# Polar Smart Energy Management System

SIH Problem Statement: 26061  
Title: AI-Driven Smart Energy Management System for Polar Research Stations

## Project Structure

polar-smart-energy/
├── backend/     # FastAPI + demo AI/optimization APIs
└── frontend/    # React + Vite dashboard

## 1. Backend Setup

Open a terminal inside `backend`:

```bash
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Backend: http://127.0.0.1:8000  
Swagger API: http://127.0.0.1:8000/docs

## 2. Frontend Setup

Open another terminal inside `frontend`:

```bash
npm install
npm run dev
```

Frontend: http://localhost:5173

The frontend calls the backend automatically through:
`http://127.0.0.1:8000/api`

## Features

- Real-time energy dashboard
- Load, solar and wind monitoring
- Battery status
- 24-hour load forecast
- Renewable energy status
- AI-based energy optimization recommendation
- Responsive dashboard
- Backend Swagger documentation
- Demo dataset for development

## Important

The forecasting endpoint currently contains a transparent demo prediction function.
For the final SIH implementation, replace it with a trained ML model using real/
synthetic polar-station data and validate it with appropriate metrics.
