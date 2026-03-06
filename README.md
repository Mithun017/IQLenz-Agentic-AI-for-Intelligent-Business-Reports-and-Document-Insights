# IQLenz: AI-Based Automated Report & Proposal Generation Platform

IQLenz is a full-stack, AI-driven business platform designed to ingest financial documents (like bills, invoices, and Excel sheets) and dynamically generate professional business reports, intuitive dashboards, and strategic, actionable AI proposals. It utilizes an **Agentic Architecture** via FastAPI, bridging multi-agent document analysis with the powerful **Gemini 2.5 Flash API**. The frontend uses React, Vite, Framer Motion, and a heavily stylized **Glass UI** layout.

---

## 🚀 Features

* **Multi-Agent Intelligence Backend**: Dedicated Python agents extract fields, analyze data, construct reports, and derive strategic proposals independently.
* **Auto-generated Intelligent Reports**: Translates structured numerical and categorical data into digestible narrative business reports.
* **Sleek Glassmorphism Dashboard**: A fully responsive frontend designed from the ground up using fundamental CSS and aesthetic glass-blur properties. Wait until you see it shine!
* **Framer Motion Elements**: Liquid-smooth page routing and hover transitions.
* **Robust Relational MySQL Storage**: Leverages SQLAlchemy ORM and Alembic migrations.

---

## 🛠️ Technology Stack

**Frontend**:
- React 18, Vite
- Pure `vanilla CSS` for Glass UI (No Tailwind)
- Framer Motion (Animations)
- Recharts (Interactive SVG Charts)
- React Router DOM
- Lucide React (Icons)

**Backend**:
- Python 3.12
- FastAPI Framework
- SQLAlchemy ORM & Alembic (Database Setup & Migrations)
- Google GenAI SDK (`gemini-2.5-flash`)
- MySQL (PyMySQL)

---

## ⚙️ How To Run Locally (Without Docker)

### Prerequisites
- Node.js & npm installed
- Python 3.12+ installed
- MySQL Server installed and running locally on port 3306

### Quickstart Batch Script (Windows)
For easiest execution on windows:
1. Double click the included `run.bat` script located at the project root. This will activate the Python VENV, spin up the backend Uvicorn server, and start the frontend Vite server concurrently in two command prompt terminals.

### Manual Setup
If `run.bat` fails, execute these commands from the project root:

**Step 1: Start the Backend Layer**
```bash
cd backend
python -m venv venv
# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
# Ensure your MySQL is running with root / password, or adjust the .env file credentials
uvicorn main:app --reload
```
The FastAPI documentation loads at `http://127.0.0.1:8000/docs`

**Step 2: Start the Frontend App**
Open a *new* terminal:
```bash
cd frontend
npm install
npm run dev
```
The React App loads at `http://localhost:5173`

---

## 🐳 How to Run with Docker

For a consistent configuration using containers:

1. Create a `.env` file at the root, or define `GEMINI_API_KEY` in your host environment.
2. Build and run the docker ensemble:

```shell
docker-compose up --build
```
This single command spins up:
- `db`: a dedicated MySQL container initialized for the `iqlenz` namespace.
- `backend`: The API server orchestrating the AI logic on port `8000`.
- `frontend`: The React Vite bundle hot-reloading on port `5173`.

---

## 🔑 Crucial Notes Before Use

1. **API Keys**: Ensure you populate `backend/.env` with your active `GEMINI_API_KEY`. Without it, the Document extraction Agent defaults to mock fallback data.
2. **Database Credentials**: Ensure the MySQL configuration matches your systems or alter the `DATABASE_URL` appropriately inside the `.env` file!

Enjoy automated, strategic business intelligence delivered effortlessly via IQLenz! 🥂
