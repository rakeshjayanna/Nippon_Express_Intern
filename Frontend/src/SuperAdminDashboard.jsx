import './styles/dashboard.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function SuperAdminDashboard() {
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedData = localStorage.getItem('userData');
        if (!storedData) {
            navigate('/login');
            return;
        }
        const data = JSON.parse(storedData);
        if (data.role !== 'SUPERADMIN') {
            navigate('/login');
            return;
        }
        setUserData(data);
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('userData');
        navigate('/login');
    };

    if (!userData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="dashboard-container">
            <nav className="dashboard-nav">
                <div className="nav-brand">
                    <h2>Nippon Express - Admin Portal</h2>
                </div>
                <div className="nav-user">
                    <span className="user-role-badge superadmin">Super Admin</span>
                    <button onClick={handleLogout} className="logout-btn">Logout</button>
                </div>
            </nav>

            <div className="dashboard-content">
                <div className="welcome-section">
                    <h1>Welcome, Super Administrator!</h1>
                    <p className="subtitle">Full System Access & Control</p>
                </div>

                <div className="info-cards">
                    <div className="info-card admin-card">
                        <div className="card-icon">👤</div>
                        <div className="card-content">
                            <h3>Admin ID</h3>
                            <p className="card-value">{userData.employeeId}</p>
                        </div>
                    </div>

                    <div className="info-card admin-card">
                        <div className="card-icon">📧</div>
                        <div className="card-content">
                            <h3>Email</h3>
                            <p className="card-value email-value">{userData.email}</p>
                        </div>
                    </div>

                    <div className="info-card admin-card">
                        <div className="card-icon">🛡️</div>
                        <div className="card-content">
                            <h3>Role</h3>
                            <p className="card-value superadmin-text">{userData.role}</p>
                        </div>
                    </div>
                </div>

                <div className="permissions-section">
                    <h2>🔐 Master Administrative Permissions</h2>
                    <div className="permissions-grid">
                        <div className="permission-card allowed admin-permission">
                            <span className="permission-icon">✓</span>
                            <div className="permission-details">
                                <h4>User Management</h4>
                                <p>Create, update, delete user accounts</p>
                            </div>
                        </div>

                        <div className="permission-card allowed admin-permission">
                            <span className="permission-icon">✓</span>
                            <div className="permission-details">
                                <h4>Role Assignment</h4>
                                <p>Assign and modify user roles and permissions</p>
                            </div>
                        </div>

                        <div className="permission-card allowed admin-permission">
                            <span className="permission-icon">✓</span>
                            <div className="permission-details">
                                <h4>System Configuration</h4>
                                <p>Modify system settings and configurations</p>
                            </div>
                        </div>

                        <div className="permission-card allowed admin-permission">
                            <span className="permission-icon">✓</span>
                            <div className="permission-details">
                                <h4>Database Access</h4>
                                <p>Full database read and write permissions</p>
                            </div>
                        </div>

                        <div className="permission-card allowed admin-permission">
                            <span className="permission-icon">✓</span>
                            <div className="permission-details">
                                <h4>Security Logs</h4>
                                <p>View and manage security audit logs</p>
                            </div>
                        </div>

                        <div className="permission-card allowed admin-permission">
                            <span className="permission-icon">✓</span>
                            <div className="permission-details">
                                <h4>Report Generation</h4>
                                <p>Generate and export all system reports</p>
                            </div>
                        </div>

                        <div className="permission-card allowed admin-permission">
                            <span className="permission-icon">✓</span>
                            <div className="permission-details">
                                <h4>Backup & Restore</h4>
                                <p>Manage system backups and restoration</p>
                            </div>
                        </div>

                        <div className="permission-card allowed admin-permission">
                            <span className="permission-icon">✓</span>
                            <div className="permission-details">
                                <h4>API Management</h4>
                                <p>Configure API endpoints and access controls</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="quick-actions">
                    <h2>⚡ Administrative Actions</h2>
                    <div className="actions-grid admin-actions">
                        <button className="action-btn admin-btn">
                            <span className="action-icon">👥</span>
                            <span>Manage Users</span>
                        </button>
                        <button className="action-btn admin-btn">
                            <span className="action-icon">📊</span>
                            <span>System Analytics</span>
                        </button>
                        <button className="action-btn admin-btn">
                            <span className="action-icon">🔒</span>
                            <span>Security Settings</span>
                        </button>
                        <button className="action-btn admin-btn">
                            <span className="action-icon">🗄️</span>
                            <span>Database Manager</span>
                        </button>
                        <button className="action-btn admin-btn">
                            <span className="action-icon">📝</span>
                            <span>Audit Logs</span>
                        </button>
                        <button className="action-btn admin-btn">
                            <span className="action-icon">⚙️</span>
                            <span>System Config</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SuperAdminDashboard;
