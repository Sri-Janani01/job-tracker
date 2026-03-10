const API_BASE = 'http://localhost:5001/api';

const api = {
    async getJobs(status = 'all', search = '') {
        const params = new URLSearchParams({ status, search });
        const res = await fetch(`${API_BASE}/jobs?${params}`);
        if (!res.ok) throw new Error('Failed to fetch jobs');
        return res.json();
    },

    async createJob(data) {
        const res = await fetch(`${API_BASE}/jobs`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Failed to create job');
        return res.json();
    },

    async updateJob(id, data) {
        const res = await fetch(`${API_BASE}/jobs/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Failed to update job');
        return res.json();
    },

    async deleteJob(id) {
        const res = await fetch(`${API_BASE}/jobs/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete job');
        return res.json();
    },

    async getStats() {
        const res = await fetch(`${API_BASE}/stats`);
        if (!res.ok) throw new Error('Failed to fetch stats');
        return res.json();
    }
};