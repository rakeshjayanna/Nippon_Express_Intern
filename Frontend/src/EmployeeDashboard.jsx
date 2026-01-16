import './styles/dashboard.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authService } from './services/authService';
import { ROUTES } from './utils/constants';
import ApplicationForm from './ApplicationForm';
import ViewApplication from './ViewApplication';
import LoadingSpinner from './components/LoadingSpinner';

function EmployeeDashboard() {
    const [userData, setUserData] = useState(null);
    const [showApplicationForm, setShowApplicationForm] = useState(false);
    const [showViewApplication, setShowViewApplication] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const data = authService.getUserData();
        if (!data || (data.role !== 'EMPLOYEE' && data.role !== 'HR')) {
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
                <LoadingSpinner message="Loading your workspace" />
            </div>
        );
    }

    // If HR user is viewing the form, show it
    if (showApplicationForm && userData.role === 'HR') {
        return (
            <ApplicationForm 
                userEmail={userData.email} 
                userRole={userData.role}
                onClose={() => setShowApplicationForm(false)}
            />
        );
    }

    // Employee view-only application screen
    if (showViewApplication && userData.role === 'EMPLOYEE') {
        return (
            <ViewApplication
                userEmail={userData.email}
                onClose={() => setShowViewApplication(false)}
            />
        );
    }

    return (
        <div className="dashboard-container">
            <nav className="dashboard-nav">
                <div className="nav-brand">
                    <h2>NX Workspace</h2>
                    <p>Employee Services</p>
                </div>
                <div className="nav-user">
                    <span className={`user-role-badge ${userData.role === 'HR' ? 'hr' : 'employee'}`}>
                        {userData.role === 'HR' ? 'HR' : 'Employee'}
                    </span>
                    <button onClick={handleLogout} className="logout-btn">Logout</button>
                </div>
            </nav>

            <div className="dashboard-content">
                <div className="dashboard-hero">
                    <div>
                        <h1 className="hero-title">Welcome, {userData.role === 'HR' ? 'HR' : 'Employee'}</h1>
                        <p className="hero-subtitle">{userData.role === 'HR' ? 'HR operations workspace with elevated access.' : 'Employee workspace with guided self-service tools.'}</p>
                    </div>
                    <div className="hero-chips">
                        <span className="hero-chip">Session Active</span>
                        <span className="hero-chip">Policy: Standard</span>
                        <span className="hero-chip">Region: APAC</span>
                    </div>
                </div>

                <div className="kpi-grid">
                    <div className="kpi-card">
                        <span className="kpi-label">Employee ID</span>
                        <span className="kpi-value">{userData.employeeId}</span>
                        <span className="kpi-trend">Verified identity</span>
                    </div>
                    <div className="kpi-card">
                        <span className="kpi-label">Role</span>
                        <span className="kpi-value">{userData.role}</span>
                        <span className="kpi-trend">Access tier: Standard</span>
                    </div>
                    <div className="kpi-card">
                        <span className="kpi-label">Email</span>
                        <span className="kpi-value">{userData.email}</span>
                        <span className="kpi-trend">SSO verified</span>
                    </div>
                    <div className="kpi-card">
                        <span className="kpi-label">Last Login</span>
                        <span className="kpi-value">{new Date().toLocaleDateString()}</span>
                        <span className="kpi-trend">Device trusted</span>
                    </div>
                </div>

                <div className="panel">
                    <h2 className="panel-title">Access permissions</h2>
                    <div className="permissions-grid">
                        <div className="permission-card allowed">
                            <span className="permission-icon">✓</span>
                            <div className="permission-details">
                                <h4>Profile & Identity</h4>
                                <p>View and manage personal details</p>
                            </div>
                        </div>

                        <div className="permission-card allowed">
                            <span className="permission-icon">✓</span>
                            <div className="permission-details">
                                <h4>Operational Requests</h4>
                                <p>Submit onboarding and service requests</p>
                            </div>
                        </div>

                        <div className="permission-card allowed">
                            <span className="permission-icon">✓</span>
                            <div className="permission-details">
                                <h4>Scheduling</h4>
                                <p>Review schedules and assignments</p>
                            </div>
                        </div>

                        <div className="permission-card denied">
                            <span className="permission-icon">✗</span>
                            <div className="permission-details">
                                <h4>System Administration</h4>
                                <p>Admin-only feature</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="panel">
                    <h2 className="panel-title">Quick actions</h2>
                    <div className="actions-grid">
                        {userData.role === 'HR' && (
                            <button className="action-btn primary" onClick={() => setShowApplicationForm(true)}>
                                <span className="action-icon">📝</span>
                                <span>Application Intake</span>
                            </button>
                        )}

                        {userData.role === 'EMPLOYEE' && (
                            <button className="action-btn primary" onClick={() => setShowViewApplication(true)}>
                                <span className="action-icon">👁️</span>
                                <span>View Application</span>
                            </button>
                        )}

                        <button className="action-btn">
                            <span className="action-icon">📊</span>
                            <span>Performance Reports</span>
                        </button>
                        <button className="action-btn">
                            <span className="action-icon">📅</span>
                            <span>Schedule Center</span>
                        </button>
                        <button className="action-btn">
                            <span className="action-icon">✉️</span>
                            <span>Messages</span>
                        </button>
                        <button className="action-btn">
                            <span className="action-icon">⚙️</span>
                            <span>Preferences</span>
                        </button>
                    </div>
                </div>

                <div className="panel">
                    <h2 className="panel-title">Recent activity</h2>
                    <div className="activity-feed">
                        <div className="activity-item">
                            <span className="activity-dot" />
                            <div>
                                <strong>Identity verified</strong>
                                <p className="subtitle">Multi-factor validation completed.</p>
                            </div>
                        </div>
                        <div className="activity-item">
                            <span className="activity-dot" />
                            <div>
                                <strong>Policy update</strong>
                                <p className="subtitle">Access policy synced with global directory.</p>
                            </div>
                        </div>
                        <div className="activity-item">
                            <span className="activity-dot" />
                            <div>
                                <strong>Workspace ready</strong>
                                <p className="subtitle">All modules are available for use.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EmployeeDashboard;
