# ⟡ JobTrack — Job Application Tracker

> A full-stack web app to manage and track your entire job search — from first application to final offer.

[![Status](https://img.shields.io/badge/status-active-brightgreen)](https://github.com/Sri-Janani01/job-tracker)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?logo=python&logoColor=white)](https://python.org)
[![Flask](https://img.shields.io/badge/Flask-3.0-000000?logo=flask&logoColor=white)](https://flask.palletsprojects.com)
[![License](https://img.shields.io/badge/license-MIT-green)](./LICENSE)

**🔗 Live Demo:** [sri-janani01.github.io/job-tracker][(https://sri-janani01.github.io/job-tracker/frontend/index.html) ][(http://127.0.0.1:5500/job-tracker/frontend/index.html) ](http://127.0.0.1:5500/job-tracker/frontend/index.html)

**📁 Repository:** [github.com/Sri-Janani01/job-tracker](https://github.com/Sri-Janani01/job-tracker)

---

## 📸 Preview

> Dashboard with pipeline analytics, response rate stats, and recent activity. 
> Applications grid with status badges, search, and filtering.



---

## ✨ Features

- **Full CRUD** — Add, view, edit, and delete job applications
- **Status Pipeline** — Track each application through `Applied → Interview → Offer → Rejected`
- **Dashboard Analytics** — Response rate, pipeline breakdown, and recent activity at a glance
- **Search & Filter** — Filter by status, search by company or role in real time
- **REST API** — Clean JSON API built with Flask and Flask-CORS
- **Persistent Storage** — SQLite database, zero configuration needed

---

## 🛠 Tech Stack

| Layer    | Technology                    |
|----------|-------------------------------|
| Backend  | Python 3, Flask, SQLite       |
| Frontend | HTML5, CSS3, Vanilla JS       |
| API      | RESTful JSON (Flask-CORS)     |

---

## 🚀 Getting Started

### Prerequisites

- Python 3.10+
- pip
- VS Code with [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/Sri-Janani01/job-tracker.git
cd job-tracker

# 2. Install backend dependencies
cd backend
pip install -r requirements.txt

# 3. Start the Flask server
python app.py
# → Running on http://localhost:5000
```

Then open `frontend/index.html` with **Live Server** in VS Code.

---

## 📡 API Endpoints

| Method   | Endpoint          | Description                                        |
|----------|-------------------|----------------------------------------------------|
| `GET`    | `/api/jobs`       | List all jobs — supports `?status=` and `?search=` |
| `POST`   | `/api/jobs`       | Create a new job application                       |
| `GET`    | `/api/jobs/:id`   | Get a single job by ID                             |
| `PUT`    | `/api/jobs/:id`   | Update a job application                           |
| `DELETE` | `/api/jobs/:id`   | Delete a job application                           |
| `GET`    | `/api/stats`      | Get dashboard stats (totals, pipeline, rate)       |

### Example Request

```bash
curl -X POST http://localhost:5000/api/jobs \
  -H "Content-Type: application/json" \
  -d '{
    "company": "Google",
    "role": "Software Engineer",
    "status": "applied",
    "location": "London",
    "salary": "£90k–£120k"
  }'
```

---

## 📁 Project Structure

```
job-tracker/
├── backend/
│   ├── app.py           # Flask REST API — all endpoints
│   ├── database.py      # SQLite initialisation & helpers
│   └── requirements.txt
├── frontend/
│   ├── index.html       # Single-page app shell
│   ├── css/
│   │   └── style.css    # Dark editorial UI with CSS variables
│   └── js/
│       ├── api.js       # API client (fetch wrapper)
│       └── app.js       # UI logic, routing, event handling
└── README.md
```

---

## 🗺 Roadmap

- [ ] User authentication (JWT)
- [ ] Email reminders for upcoming deadlines
- [ ] Export applications to CSV
- [ ] Kanban board view
- [ ] Dark / light theme toggle

---

## 👩‍💻 Author

**Sri Janani** — [github.com/Sri-Janani01](https://github.com/Sri-Janani01)

---

