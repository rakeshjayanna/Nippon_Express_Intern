import React, { useEffect, useState } from 'react';
import './styles/dashboard.css';

function formatDateTime(value) {
    if (!value) return '';
    try {
        // Backend sends ISO like "2026-01-14T10:12:33.123".
        const d = new Date(value);
        if (Number.isNaN(d.getTime())) return String(value);
        return d.toLocaleString();
    } catch {
        return String(value);
    }
}

const REQUEST_LABELS = [
    { key: 'requestEmailId', label: 'Email ID' },
    { key: 'requestDomainAccount', label: 'Domain Account' },
    { key: 'requestBluetoothAccessCard', label: 'Biometric / Access Card' },
    { key: 'requestSharedFolder', label: 'Shared Folder' },
    { key: 'requestInternetAccess', label: 'Internet Access / FTP Access' },
    { key: 'requestNewins', label: 'NEWINS' },
    { key: 'requestNexas', label: 'NExAS' },
    { key: 'requestGsnet', label: 'GS-NET' },
    { key: 'requestInternalApplication', label: 'Internal Application' },
    { key: 'requestUsbAccess', label: 'USB Access' },
    { key: 'requestVpnAccess', label: 'VPN Access' },
    { key: 'requestHardDiskPenDrive', label: 'HardDisk / PenDrive' },
    { key: 'requestNewGlow', label: 'NEx-GLOW' },
    { key: 'requestAnyOtherAsset', label: 'Any Other Asset' }
];

function ViewApplication({ userEmail, onClose }) {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [form, setForm] = useState(null);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            setIsLoading(true);
            setError('');
            setForm(null);

            try {
                const res = await fetch('http://localhost:8080/api/application-form/my-latest', {
                    headers: { 'X-User-Email': userEmail }
                });

                if (!res.ok) {
                    const data = await res.json().catch(() => null);
                    const msg = data?.error || data?.message || 'Failed to load application.';
                    if (!cancelled) setError(msg);
                    return;
                }

                const data = await res.json();
                if (!cancelled) setForm(data);
            } catch {
                if (!cancelled) setError('Network error. Please try again.');
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, [userEmail]);

    const selectedRequests = form
        ? REQUEST_LABELS.filter(r => !!form[r.key]).map(r => r.label)
        : [];

    return (
        <div className="dashboard-container">
            <nav className="dashboard-nav">
                <div className="nav-brand">
                    <h2>Nippon Express</h2>
                </div>
                <div className="nav-user">
                    <button onClick={onClose} className="logout-btn">Back</button>
                </div>
            </nav>

            <div className="dashboard-content">
                <div className="welcome-section">
                    <h1>Your Application (View Only)</h1>
                    <p className="subtitle">This is the latest submitted application.</p>
                </div>

                {isLoading ? (
                    <div>Loading...</div>
                ) : error ? (
                    <div className="permission-card denied">
                        <span className="permission-icon">✗</span>
                        <div className="permission-details">
                            <h4>No Application Found</h4>
                            <p>{error}</p>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="info-cards">
                            <div className="info-card">
                                <div className="card-icon">🆔</div>
                                <div className="card-content">
                                    <h3>Employee Code</h3>
                                    <p className="card-value">{form.employeeCode || '-'}</p>
                                </div>
                            </div>

                            <div className="info-card">
                                <div className="card-icon">📌</div>
                                <div className="card-content">
                                    <h3>Status</h3>
                                    <p className="card-value">{form.status || '-'}</p>
                                </div>
                            </div>

                            <div className="info-card">
                                <div className="card-icon">🕒</div>
                                <div className="card-content">
                                    <h3>Submitted At</h3>
                                    <p className="card-value">{formatDateTime(form.submittedAt) || '-'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="permissions-section">
                            <h2>📄 Details</h2>
                            <div className="permissions-grid">
                                <div className="permission-card allowed">
                                    <span className="permission-icon">✓</span>
                                    <div className="permission-details">
                                        <h4>Full Name</h4>
                                        <p>{form.fullName || '-'}</p>
                                    </div>
                                </div>

                                <div className="permission-card allowed">
                                    <span className="permission-icon">✓</span>
                                    <div className="permission-details">
                                        <h4>Designation</h4>
                                        <p>{form.designation || '-'}</p>
                                    </div>
                                </div>

                                <div className="permission-card allowed">
                                    <span className="permission-icon">✓</span>
                                    <div className="permission-details">
                                        <h4>Employee Type</h4>
                                        <p>{form.employeeType || '-'}</p>
                                    </div>
                                </div>

                                <div className="permission-card allowed">
                                    <span className="permission-icon">✓</span>
                                    <div className="permission-details">
                                        <h4>Request Action</h4>
                                        <p>{form.requestAction || '-'}</p>
                                    </div>
                                </div>

                                <div className="permission-card allowed">
                                    <span className="permission-icon">✓</span>
                                    <div className="permission-details">
                                        <h4>Contact No</h4>
                                        <p>{form.contactNo || '-'}</p>
                                    </div>
                                </div>

                                <div className="permission-card allowed">
                                    <span className="permission-icon">✓</span>
                                    <div className="permission-details">
                                        <h4>Requested By</h4>
                                        <p>{form.requestedBy || '-'}</p>
                                    </div>
                                </div>

                                <div className="permission-card allowed">
                                    <span className="permission-icon">✓</span>
                                    <div className="permission-details">
                                        <h4>Scope Of Work</h4>
                                        <p>{form.scopeOfWork || '-'}</p>
                                    </div>
                                </div>

                                <div className="permission-card allowed">
                                    <span className="permission-icon">✓</span>
                                    <div className="permission-details">
                                        <h4>Remarks / Reason</h4>
                                        <p>{form.remarksReason || '-'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="permissions-section">
                            <h2>✅ Request For</h2>
                            {selectedRequests.length === 0 ? (
                                <div className="permission-card denied">
                                    <span className="permission-icon">✗</span>
                                    <div className="permission-details">
                                        <h4>No Requests Selected</h4>
                                        <p>There were no request items selected in this application.</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="permissions-grid">
                                    {selectedRequests.map(label => (
                                        <div key={label} className="permission-card allowed">
                                            <span className="permission-icon">✓</span>
                                            <div className="permission-details">
                                                <h4>{label}</h4>
                                                <p>Requested</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default ViewApplication;
