import React, { useEffect, useMemo, useState } from 'react';
import './styles/dashboard.css';

function formatDateTime(value) {
    if (!value) return '';
    try {
        const d = new Date(value);
        if (Number.isNaN(d.getTime())) return String(value);
        return d.toLocaleString();
    } catch {
        return String(value);
    }
}

function ManageApplications({ userEmail, onClose }) {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [forms, setForms] = useState([]);
    const [busyId, setBusyId] = useState(null);

    const pendingCount = useMemo(
        () => forms.filter(f => String(f.status || '').toUpperCase() === 'PENDING').length,
        [forms]
    );

    async function load() {
        setIsLoading(true);
        setError('');
        try {
            const res = await fetch('http://localhost:8080/api/application-form/all', {
                headers: { 'X-User-Email': userEmail }
            });

            if (!res.ok) {
                const data = await res.json().catch(() => null);
                const msg = data?.error || data?.message || res.statusText || 'Failed to load applications';
                throw new Error(`${res.status}: ${msg}`);
            }

            const data = await res.json();
            setForms(Array.isArray(data) ? data : []);
        } catch (e) {
            setError(e?.message || 'Failed to load applications');
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userEmail]);

    async function updateStatus(id, status) {
        setBusyId(id);
        try {
            const res = await fetch(`http://localhost:8080/api/application-form/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-User-Email': userEmail
                },
                body: JSON.stringify({ status })
            });

            if (!res.ok) {
                const data = await res.json().catch(() => null);
                const msg = data?.error || data?.message || res.statusText || 'Failed to update status';
                throw new Error(`${res.status}: ${msg}`);
            }

            await load();
        } catch (e) {
            setError(e?.message || 'Failed to update status');
        } finally {
            setBusyId(null);
        }
    }

    return (
        <div className="dashboard-container">
            <nav className="dashboard-nav">
                <div className="nav-brand">
                    <h2>Nippon Express - Applications</h2>
                </div>
                <div className="nav-user">
                    <button onClick={onClose} className="logout-btn">Back</button>
                </div>
            </nav>

            <div className="dashboard-content">
                <div className="welcome-section">
                    <h1>Application Approvals</h1>
                    <p className="subtitle">Pending: {pendingCount}</p>
                    <div style={{ marginTop: 12 }}>
                        <button className="action-btn admin-btn" onClick={load} disabled={isLoading}>
                            {isLoading ? 'Loading…' : 'Refresh'}
                        </button>
                    </div>
                </div>

                {error ? (
                    <div className="permission-card denied">
                        <span className="permission-icon">✗</span>
                        <div className="permission-details">
                            <h4>Error</h4>
                            <p>{error}</p>
                        </div>
                    </div>
                ) : null}

                {isLoading ? (
                    <div>Loading...</div>
                ) : error ? null : forms.length === 0 ? (
                    <div className="permission-card denied">
                        <span className="permission-icon">✗</span>
                        <div className="permission-details">
                            <h4>No Applications</h4>
                            <p>No submitted application forms found yet.</p>
                        </div>
                    </div>
                ) : (
                    <div className="permissions-grid">
                        {forms.map(f => {
                            const status = String(f.status || '').toUpperCase();
                            const isPending = status === 'PENDING';
                            const disabled = busyId === f.id;

                            return (
                                <div key={f.id} className={`permission-card ${isPending ? 'allowed' : 'denied'}`}>
                                    <span className="permission-icon">{isPending ? '⏳' : status === 'APPROVED' ? '✓' : '✗'}</span>
                                    <div className="permission-details">
                                        <h4>Form #{f.id} — {status || '-'}</h4>
                                        <p>Employee: {f.employeeCode || '-'} | {f.fullName || '-'}</p>
                                        <p>Submitted: {formatDateTime(f.submittedAt) || '-'}</p>

                                        {isPending ? (
                                            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                                                <button
                                                    className="action-btn admin-btn"
                                                    onClick={() => updateStatus(f.id, 'APPROVED')}
                                                    disabled={disabled}
                                                >
                                                    {disabled ? 'Working…' : 'Approve'}
                                                </button>
                                                <button
                                                    className="action-btn"
                                                    onClick={() => updateStatus(f.id, 'REJECTED')}
                                                    disabled={disabled}
                                                >
                                                    {disabled ? 'Working…' : 'Reject'}
                                                </button>
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ManageApplications;
