// ── State ────────────────────────────────────────────────────────────────────
let currentStatus = 'all';
let searchQuery = '';
let editingId = null;

// ── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    setupNav();
    setupFilters();
    setupSearch();
    loadDashboard();
    loadJobs();
});

// ── Navigation ────────────────────────────────────────────────────────────────
function setupNav() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', e => {
            e.preventDefault();
            showView(item.dataset.view);
        });
    });
}

function showView(view) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

    document.getElementById(`view-${view}`).classList.add('active');
    document.querySelector(`[data-view="${view}"]`).classList.add('active');

    if (view === 'dashboard') loadDashboard();
    if (view === 'applications') loadJobs();
    if (view === 'add' && !editingId) resetForm();
}

// ── Filters ───────────────────────────────────────────────────────────────────
function setupFilters() {
    document.querySelectorAll('.pill').forEach(pill => {
        pill.addEventListener('click', () => {
            document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            currentStatus = pill.dataset.status;
            loadJobs();
            showView('applications');
        });
    });
}

// ── Search ────────────────────────────────────────────────────────────────────
function setupSearch() {
    const input = document.getElementById('search-input');
    let timer;
    input.addEventListener('input', () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            searchQuery = input.value.trim();
            loadJobs();
        }, 300);
    });
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
async function loadDashboard() {
    try {
        const stats = await api.getStats();

        document.getElementById('stat-total').textContent = stats.total;
        document.getElementById('stat-interview').textContent = stats.by_status.interview || 0;
        document.getElementById('stat-offer').textContent = stats.by_status.offer || 0;
        document.getElementById('stat-rate').textContent = stats.response_rate + '%';

        renderPipeline(stats);
        renderRecent(stats.recent);
    } catch (err) {
        console.error('Dashboard error:', err);
    }
}

function renderPipeline(stats) {
    const total = stats.total || 1;
    const statuses = [
        { key: 'applied', label: 'Applied' },
        { key: 'interview', label: 'Interview' },
        { key: 'offer', label: 'Offer' },
        { key: 'rejected', label: 'Rejected' },
    ];

    document.getElementById('pipeline-bars').innerHTML = statuses.map(s => {
        const count = stats.by_status[s.key] || 0;
        const pct = Math.round(count / total * 100);
        return `
      <div class="pipeline-bar-item">
        <div class="pipeline-label">
          <span>${s.label}</span>
          <span>${count} (${pct}%)</span>
        </div>
        <div class="pipeline-track">
          <div class="pipeline-fill fill-${s.key}" style="width:${pct}%"></div>
        </div>
      </div>`;
    }).join('');
}

function renderRecent(jobs) {
    if (!jobs.length) {
        document.getElementById('recent-list').innerHTML =
            '<p style="color:var(--text-muted);font-size:13px">No recent activity</p>';
        return;
    }

    document.getElementById('recent-list').innerHTML = jobs.map(j => `
    <div class="recent-item">
      <div class="recent-dot" style="background:var(--${j.status === 'applied' ? 'applied' : j.status === 'interview' ? 'interview' : j.status === 'offer' ? 'offer' : 'rejected'})"></div>
      <div class="recent-info">
        <div class="recent-company">${esc(j.company)}</div>
        <div class="recent-role">${esc(j.role)}</div>
      </div>
      <span class="recent-badge badge badge-${j.status}">${j.status}</span>
    </div>
  `).join('');
}

// ── Jobs List ─────────────────────────────────────────────────────────────────
async function loadJobs() {
    try {
        const jobs = await api.getJobs(currentStatus, searchQuery);
        const grid = document.getElementById('jobs-grid');
        const empty = document.getElementById('empty-state');

        if (!jobs.length) {
            grid.innerHTML = '';
            empty.classList.remove('hidden');
            return;
        }

        empty.classList.add('hidden');
        grid.innerHTML = jobs.map(renderJobCard).join('');
    } catch (err) {
        showToast('Could not load jobs — is the server running?');
    }
}

function renderJobCard(j) {
    const meta = [
        j.location && `📍 ${esc(j.location)}`,
        j.salary && `💰 ${esc(j.salary)}`,
        j.applied_date && `📅 ${j.applied_date}`,
    ].filter(Boolean).join('');

    return `
    <div class="job-card" data-status="${j.status}" data-id="${j.id}">
      <div class="job-card-top">
        <div>
          <div class="job-company">${esc(j.company)}</div>
          <div class="job-role">${esc(j.role)}</div>
        </div>
        <span class="badge badge-${j.status}">${j.status}</span>
      </div>
      ${meta ? `<div class="job-meta"><span>${meta}</span></div>` : ''}
      <div class="job-card-actions">
        <button class="btn-icon" onclick="openModal(${j.id}, event)">View</button>
        <button class="btn-icon" onclick="editJob(${j.id}, event)">Edit</button>
        <button class="btn-icon danger" onclick="deleteJob(${j.id}, event)">Delete</button>
        ${j.url ? `<button class="btn-icon" onclick="window.open('${esc(j.url)}','_blank');event.stopPropagation()">Link ↗</button>` : ''}
      </div>
    </div>`;
}

// ── Modal ─────────────────────────────────────────────────────────────────────
async function openModal(id, e) {
    e && e.stopPropagation();
    try {
        const j = await api.getJobs();
        const job = j.find(x => x.id === id) || (await (await fetch(`http://localhost:5000/api/jobs/${id}`)).json());

        document.getElementById('modal-content').innerHTML = `
      <div class="modal-company">${esc(job.company)}</div>
      <div class="modal-role">${esc(job.role)}</div>
      <span class="badge badge-${job.status}">${job.status}</span>
      <div class="modal-fields" style="margin-top:20px">
        ${field('Location', job.location || '—')}
        ${field('Salary', job.salary || '—')}
        ${field('Applied', job.applied_date || '—')}
        ${field('Deadline', job.deadline || '—')}
      </div>
      ${job.notes ? `<div class="modal-notes"><label>Notes</label><p>${esc(job.notes)}</p></div>` : ''}
      <div class="modal-actions">
        <button class="btn-primary" onclick="editJob(${job.id});closeModal()">Edit</button>
        <button class="btn-secondary" onclick="closeModal()">Close</button>
      </div>`;

        document.getElementById('modal').classList.remove('hidden');
    } catch (err) {
        showToast('Failed to load job details');
    }
}

function field(label, val) {
    return `<div class="modal-field"><label>${label}</label><span>${esc(String(val))}</span></div>`;
}

function closeModal() {
    document.getElementById('modal').classList.add('hidden');
}

document.getElementById('modal').addEventListener('click', e => {
    if (e.target.id === 'modal') closeModal();
});

// ── Form ──────────────────────────────────────────────────────────────────────
async function editJob(id, e) {
    e && e.stopPropagation();
    try {
        const res = await fetch(`http://localhost:5000/api/jobs/${id}`);
        const j = await res.json();

        editingId = id;
        document.getElementById('form-title').textContent = 'Edit Application';
        document.getElementById('edit-id').value = id;
        document.getElementById('f-company').value = j.company;
        document.getElementById('f-role').value = j.role;
        document.getElementById('f-status').value = j.status;
        document.getElementById('f-location').value = j.location;
        document.getElementById('f-salary').value = j.salary;
        document.getElementById('f-applied').value = j.applied_date;
        document.getElementById('f-deadline').value = j.deadline;
        document.getElementById('f-url').value = j.url;
        document.getElementById('f-notes').value = j.notes;

        showView('add');
    } catch (err) {
        showToast('Failed to load job for editing');
    }
}

async function submitForm() {
    const company = document.getElementById('f-company').value.trim();
    const role = document.getElementById('f-role').value.trim();
    const status = document.getElementById('f-status').value;

    if (!company || !role) {
        showToast('Company and Role are required');
        return;
    }

    const data = {
        company, role, status,
        location: document.getElementById('f-location').value.trim(),
        salary: document.getElementById('f-salary').value.trim(),
        applied_date: document.getElementById('f-applied').value,
        deadline: document.getElementById('f-deadline').value,
        url: document.getElementById('f-url').value.trim(),
        notes: document.getElementById('f-notes').value.trim(),
    };

    try {
        if (editingId) {
            await api.updateJob(editingId, data);
            showToast('Application updated ✓');
        } else {
            await api.createJob(data);
            showToast('Application added ✓');
        }
        resetForm();
        showView('applications');
    } catch (err) {
        showToast('Save failed — is the server running?');
    }
}

function resetForm() {
    editingId = null;
    document.getElementById('form-title').textContent = 'Add Application';
    document.getElementById('edit-id').value = '';
    ['f-company', 'f-role', 'f-location', 'f-salary', 'f-applied', 'f-deadline', 'f-url', 'f-notes'].forEach(id => {
        document.getElementById(id).value = '';
    });
    document.getElementById('f-status').value = 'applied';
}

async function deleteJob(id, e) {
    e && e.stopPropagation();
    if (!confirm('Delete this application?')) return;
    try {
        await api.deleteJob(id);
        showToast('Application deleted');
        loadJobs();
        loadDashboard();
    } catch (err) {
        showToast('Delete failed');
    }
}

// ── Toast ─────────────────────────────────────────────────────────────────────
function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.remove('hidden');
    setTimeout(() => t.classList.add('hidden'), 3000);
}

// ── Utils ─────────────────────────────────────────────────────────────────────
function esc(str) {
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
}