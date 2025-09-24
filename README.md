# Chatbot

This repository contains the **Chatbot** project, consisting of:

- **Backend** (`server`) – Built with **FastAPI**, running on **Uvicorn**, and integrated with the **GROQ API**. Powers an AI-driven chatbot for **project requirement gathering**.  
- **Frontend** (`client`) – Built with **Angular 20**, providing a responsive UI to interact with the chatbot backend.

---

## 📂 Project Structure

```

root/
│── client/    # Angular frontend application
│── server/    # FastAPI backend service
│── README.md  # This file

````

---

## 🚀 Getting Started

### Backend (Server)

Navigate to the `server` folder and follow these steps:

#### 1. Create a virtual environment
```bash
python -m venv venv
````

#### 2. Activate the virtual environment

* **Windows (PowerShell / CMD):**

```bash
.\venv\Scripts\activate
```

* **Linux / MacOS:**

```bash
source venv/bin/activate
```

#### 3. Navigate to the server directory

```bash
cd server
```

#### 4. Install dependencies

```bash
pip install -r requirements.txt
```

#### 5. Set up environment variables

Create a `.env` file in the `server` folder with your GROQ API key:

```env
GROQ_API_KEY=your_api_key_here
```

#### 6. Start the server

```bash
uvicorn server:app --reload
```

The backend server will be available at:
👉 [http://127.0.0.1:8000](http://127.0.0.1:8000)

---

### Frontend (Client)

Navigate to the `client` folder and follow these steps:

#### 1. Install dependencies

```bash
cd client
npm install
```

#### 2. Run the development server

```bash
ng serve
```

The frontend application will be available at:
👉 [http://localhost:4200](http://localhost:4200)

---

## ⚡ Notes

### Backend

* The server uses **GROQ API** for **natural language → SQL conversion** and other **LLM-powered tasks**.
* It is part of an **AI chatbot for project requirement gathering**.
* Use `--reload` for auto-reloading during development.
* Ensure **Python 3.12+** is installed.
* To deactivate the virtual environment:

```bash
deactivate
```

### Frontend

* Update `.env` or environment files with your **backend API URL** before running in production.
* Node.js v20+ and Angular CLI v20 are recommended.

---

## 📌 Tech Stack

* **Backend:** FastAPI, Uvicorn, Python 3.12+, GROQ API
* **Frontend:** Angular 20, Node.js 20+

---

## 🛠️ Useful Commands

### Backend

```bash
uvicorn server:app --reload
```

### Frontend

```bash
ng serve
ng build
```