from flask import Flask, request, jsonify
from flask_cors import CORS
from database import init_db, get_db
import sqlite3
from datetime import datetime

app = Flask(__name__)
CORS(app)

init_db()

# ── Jobs ──────────────────────────────────────────────────────────────────────

@app.route('/api/jobs', methods=['GET'])
def get_jobs():
    db = get_db()
    status = request.args.get('status')
    search = request.args.get('search', '')

    query = 'SELECT * FROM jobs WHERE 1=1'
    params = []

    if status and status != 'all':
        query += ' AND status = ?'
        params.append(status)
    if search:
        query += ' AND (company LIKE ? OR role LIKE ?)'
        params.extend([f'%{search}%', f'%{search}%'])

    query += ' ORDER BY created_at DESC'
    jobs = db.execute(query, params).fetchall()
    db.close()
    return jsonify([dict(j) for j in jobs])


@app.route('/api/jobs', methods=['POST'])
def create_job():
    data = request.get_json()
    required = ['company', 'role', 'status']
    if not all(k in data for k in required):
        return jsonify({'error': 'Missing required fields'}), 400

    db = get_db()
    cursor = db.execute(
        '''INSERT INTO jobs (company, role, status, location, salary, url, notes, deadline, applied_date)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)''',
        (
            data['company'], data['role'], data['status'],
            data.get('location', ''), data.get('salary', ''),
            data.get('url', ''), data.get('notes', ''),
            data.get('deadline', ''), data.get('applied_date', datetime.now().strftime('%Y-%m-%d'))
        )
    )
    db.commit()
    job_id = cursor.lastrowid
    job = db.execute('SELECT * FROM jobs WHERE id = ?', (job_id,)).fetchone()
    db.close()
    return jsonify(dict(job)), 201


@app.route('/api/jobs/<int:job_id>', methods=['GET'])
def get_job(job_id):
    db = get_db()
    job = db.execute('SELECT * FROM jobs WHERE id = ?', (job_id,)).fetchone()
    db.close()
    if not job:
        return jsonify({'error': 'Job not found'}), 404
    return jsonify(dict(job))


@app.route('/api/jobs/<int:job_id>', methods=['PUT'])
def update_job(job_id):
    data = request.get_json()
    db = get_db()
    job = db.execute('SELECT * FROM jobs WHERE id = ?', (job_id,)).fetchone()
    if not job:
        db.close()
        return jsonify({'error': 'Job not found'}), 404

    db.execute(
        '''UPDATE jobs SET company=?, role=?, status=?, location=?, salary=?,
           url=?, notes=?, deadline=?, applied_date=?, updated_at=CURRENT_TIMESTAMP
           WHERE id=?''',
        (
            data.get('company', job['company']),
            data.get('role', job['role']),
            data.get('status', job['status']),
            data.get('location', job['location']),
            data.get('salary', job['salary']),
            data.get('url', job['url']),
            data.get('notes', job['notes']),
            data.get('deadline', job['deadline']),
            data.get('applied_date', job['applied_date']),
            job_id
        )
    )
    db.commit()
    job = db.execute('SELECT * FROM jobs WHERE id = ?', (job_id,)).fetchone()
    db.close()
    return jsonify(dict(job))


@app.route('/api/jobs/<int:job_id>', methods=['DELETE'])
def delete_job(job_id):
    db = get_db()
    job = db.execute('SELECT * FROM jobs WHERE id = ?', (job_id,)).fetchone()
    if not job:
        db.close()
        return jsonify({'error': 'Job not found'}), 404
    db.execute('DELETE FROM jobs WHERE id = ?', (job_id,))
    db.commit()
    db.close()
    return jsonify({'message': 'Job deleted'})


# ── Stats ─────────────────────────────────────────────────────────────────────

@app.route('/api/stats', methods=['GET'])
def get_stats():
    db = get_db()
    total = db.execute('SELECT COUNT(*) FROM jobs').fetchone()[0]
    by_status = db.execute(
        'SELECT status, COUNT(*) as count FROM jobs GROUP BY status'
    ).fetchall()
    recent = db.execute(
        'SELECT * FROM jobs ORDER BY created_at DESC LIMIT 5'
    ).fetchall()
    db.close()

    status_counts = {row['status']: row['count'] for row in by_status}
    return jsonify({
        'total': total,
        'by_status': status_counts,
        'recent': [dict(j) for j in recent],
        'response_rate': round(
            (status_counts.get('interview', 0) + status_counts.get('offer', 0)) /
            max(total, 1) * 100, 1
        )
    })


if __name__ == '__main__':
    app.run(debug=True, port=5001)
