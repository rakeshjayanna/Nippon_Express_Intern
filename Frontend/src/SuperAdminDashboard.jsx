import './styles/dashboard.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authService } from './services/authService';
import { ROUTES } from './utils/constants';
import ManageApplications from './ManageApplications';
import LoadingSpinner from './components/LoadingSpinner';

function SuperAdminDashboard() {
    const [userData, setUserData] = useState(null);
    const [showApplications, setShowApplications] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const data = authService.getUserData();
        const normalizedRole = (data?.role || '').toString().replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
        if (!data || (normalizedRole !== 'SUPERADMIN' && normalizedRole !== 'ADMIN')) {
            navigate(ROUTES.LOGIN);
            return;
        }
        setUserData(data);
        setIsLoading(false);
    }, [navigate]);

    const handleLogout = () => {
        authService.logout();
        toast.info("Logged out successfully");
        navigate(ROUTES.LOGIN);
    };

    if (isLoading || !userData) {
        return (
            <div className="dashboard-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <LoadingSpinner message="Loading admin console" />
            </div>
        );
    }

    if (showApplications) {
        return (
            <ManageApplications
                userEmail={userData.email}
                onClose={() => setShowApplications(false)}
            />
        );
    }

    return (
        <div className="dashboard-container">
            <nav className="dashboard-nav">
                <div className="nav-brand">
                    <h2>NX Admin Control</h2>
                    <p>Executive Operations</p>
                </div>
                <div className="nav-user">
                    <span className="user-role-badge superadmin">Super Admin</span>
                    <button onClick={handleLogout} className="logout-btn">Logout</button>
                </div>
            </nav>

            <div className="dashboard-content">
                <div className="dashboard-hero">
                    <div>
                        <h1 className="hero-title">Executive Admin Console</h1>
                        <p className="hero-subtitle">Full system visibility, approvals, and security governance.</p>
                    </div>
                    <div className="hero-chips">
                        <span className="hero-chip">Privilege: Tier 0</span>
                        <span className="hero-chip">Compliance: Active</span>
                        <span className="hero-chip">Risk: Low</span>
                    </div>
                </div>

                <div className="kpi-grid">
                    <div className="kpi-card">
                        <span className="kpi-label">Admin ID</span>
                        <span className="kpi-value">{userData.employeeId}</span>
                        <span className="kpi-trend">Root access verified</span>
                    </div>
                    <div className="kpi-card">
                        <span className="kpi-label">Email</span>
                        <span className="kpi-value">{userData.email}</span>
                        <span className="kpi-trend">MFA enabled</span>
                    </div>
                    <div className="kpi-card">
                        <span className="kpi-label">Role</span>
                        <span className="kpi-value">{userData.role}</span>
                        <span className="kpi-trend">System owner</span>
                    </div>
                    <div className="kpi-card">
                        <span className="kpi-label">Security Score</span>
                        <span className="kpi-value">A+</span>
                        <span className="kpi-trend">All controls passing</span>
                    </div>
                </div>

                <div className="panel">
                    <h2 className="panel-title">Administrative permissions</h2>
                    <div className="permissions-grid">
                        <div className="permission-card allowed">
                            <span className="permission-icon">✓</span>
                            <div className="permission-details">
                                <h4>User Lifecycle Management</h4>
                                <p>Create, update, and deactivate user accounts.</p>
                            </div>
                        </div>

                        <div className="permission-card allowed">
                            <span className="permission-icon">✓</span>
                            <div className="permission-details">
                                <h4>Security Governance</h4>
                                <p>Audit logs, policy updates, and access reviews.</p>
                            </div>
                        </div>

                        <div className="permission-card allowed">
                            <span className="permission-icon">✓</span>
                            <div className="permission-details">
                                <h4>System Configuration</h4>
                                <p>Manage integrations, APIs, and system health.</p>
                            </div>
                        </div>

                        <div className="permission-card allowed">
                            <span className="permission-icon">✓</span>
                            <div className="permission-details">
                                <h4>Data Governance</h4>
                                <p>Database access and backup controls.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="panel">
                    <h2 className="panel-title">Executive actions</h2>
                    <div className="actions-grid admin-actions">
                        <button className="action-btn admin-btn" onClick={() => setShowApplications(true)}>
                            <span className="action-icon">✅</span>
                            <span>Approve / Reject Applications</span>
                        </button>
                        <button className="action-btn admin-btn">
                            <span className="action-icon">👥</span>
                            <span>User Governance</span>
                        </button>
                        <button className="action-btn admin-btn">
                            <span className="action-icon">📊</span>
                            <span>System Analytics</span>
                        </button>
                        <button className="action-btn admin-btn">
                            <span className="action-icon">🔒</span>
                            <span>Security Center</span>
                        </button>
                        <button className="action-btn admin-btn">
                            <span className="action-icon">🗄️</span>
                            <span>Data Manager</span>
                        </button>
                        <button className="action-btn admin-btn">
                            <span className="action-icon">📝</span>
                            <span>Audit Logs</span>
                        </button>
                    </div>
                </div>

                <div className="panel">
                    <h2 className="panel-title">Executive activity</h2>
                    <div className="activity-feed">
                        <div className="activity-item">
                            <span className="activity-dot" />
                            <div>
                                <strong>Compliance snapshot generated</strong>
                                <p className="subtitle">Monthly audit reports ready for export.</p>
                            </div>
                        </div>
                        <div className="activity-item">
                            <span className="activity-dot" />
                            <div>
                                <strong>New approvals pending</strong>
                                <p className="subtitle">3 requests awaiting review.</p>
                            </div>
                        </div>
                        <div className="activity-item">
                            <span className="activity-dot" />
                            <div>
                                <strong>Policy sync completed</strong>
                                <p className="subtitle">Global directory updated successfully.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SuperAdminDashboard;
