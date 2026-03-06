```batch
@echo off
echo Starting IQLenz Platform...

echo Starting Frontend Server...
cd frontend
start "IQLenz Frontend UI - React Vite" cmd /c "npm run dev"
cd ..

echo Starting Backend Server...
cd backend
start "IQLenz Backend API - FastAPI" cmd /c "call venv\Scripts\activate && uvicorn main:app --reload --port 8000"
cd ..

echo Waiting for servers to initialize...
timeout /t 5 /nobreak > nul

echo Opening browser...
start http://localhost:5173

echo servers are starting in new command prompt windows.
echo Frontend: http://localhost:5173
pause
```
