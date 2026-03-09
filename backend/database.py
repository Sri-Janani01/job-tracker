import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), 'jobs.db')


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    db = get_db()
    db.execute('''
        CREATE TABLE IF NOT EXISTS jobs (
            id           INTEGER PRIMARY KEY AUTOINCREMENT,
            company      TEXT    NOT NULL,
            role         TEXT    NOT NULL,
            status       TEXT    NOT NULL DEFAULT 'applied',
            location     TEXT    DEFAULT '',
            salary       TEXT    DEFAULT '',
            url          TEXT    DEFAULT '',
            notes        TEXT    DEFAULT '',
            deadline     TEXT    DEFAULT '',
            applied_date TEXT    DEFAULT '',
            created_at   TEXT    DEFAULT CURRENT_TIMESTAMP,
            updated_at   TEXT    DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    db.commit()
    db.close()
    print("Database initialised.")
