# ⟡ JobTrack — Job Application Tracker

A full-stack web application to track job applications throughout your entire hiring journey. Built with a Python/Flask REST API and a clean vanilla JS frontend.

![Status](https://img.shields.io/badge/status-active-brightgreen)
![Python](https://img.shields.io/badge/Python-3.10+-blue)
![Flask](https://img.shields.io/badge/Flask-3.0-lightgrey)
![License](https://img.shields.io/badge/license-MIT-green)

---

## Screenshots

> Dashboard with pipeline analytics and recent activity.  
> Applications grid with status filtering and search.

---

## Features

- **Full CRUD** — Add, view, edit, and delete job applications
- **Status Pipeline** — Track each application: `Applied → Interview → Offer → Rejected`
- **Dashboard Analytics** — Response rate, pipeline breakdown, recent activity
- **Search & Filter** — Filter by status, search by company or role
- **REST API** — Clean, documented JSON API using Flask
- **Persistent Storage** — SQLite database, zero setup required

---

## Tech Stack

| Layer    | Technology        |
|----------|-------------------|
| Backend  | Python 3, Flask, SQLite |
| Frontend | HTML5, CSS3, Vanilla JS |
| API      | RESTful JSON API (Flask-CORS) |

---

## Getting Started

### Prerequisites

- Python 3.10+
- pip

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/job-tracker.git
cd job-tracker

# 2. Install backend dependencies
cd backend
pip install -r requirements.txt

# 3. Start the Flask server
python app.py
# → Running on http://localhost:5000

# 4. Open the frontend
# Open frontend/index.html in your browser
# (use Live Server in VS Code for best experience)
```

---

## API Endpoints

| Method | Endpoint          | Description              |
|--------|-------------------|--------------------------|
| GET    | `/api/jobs`       | List all jobs (supports `?status=` and `?search=`) |
| POST   | `/api/jobs`       | Create a new job         |
| GET    | `/api/jobs/:id`   | Get a single job         |
| PUT    | `/api/jobs/:id`   | Update a job             |
| DELETE | `/api/jobs/:id`   | Delete a job             |
| GET    | `/api/stats`      | Dashboard stats          |

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

## Project Structure

```
job-tracker/
├── backend/
│   ├── app.py          # Flask REST API
│   ├── database.py     # SQLite setup & helpers
│   └── requirements.txt
├── frontend/
│   ├── index.html      # Main HTML
│   ├── css/
│   │   └── style.css   # Dark editorial UI
│   └── js/
│       ├── api.js      # API client module
│       └── app.js      # UI logic & event handling
└── README.md
```

---

## Roadmap

- [ ] User authentication (JWT)
- [ ] Email reminders for deadlines
- [ ] Export to CSV
- [ ] Kanban board view
- [ ] Dark/light theme toggle

---

## License

MIT — feel free to use and modify.