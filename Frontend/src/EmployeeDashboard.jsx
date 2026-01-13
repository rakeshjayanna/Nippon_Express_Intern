import './styles/dashboard.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApplicationForm from './ApplicationForm';

function EmployeeDashboard() {
    const [userData, setUserData] = useState(null);
    const [showApplicationForm, setShowApplicationForm] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const storedData = localStorage.getItem('userData');
        if (!storedData) {
            navigate('/login');
            return;
        }
        const data = JSON.parse(storedData);
        if (data.role !== 'EMPLOYEE' && data.role !== 'HR') {
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

    return (
        <div className="dashboard-container">
            <nav className="dashboard-nav">
                <div className="nav-brand">
                    <h2>Nippon Express</h2>
                </div>
                <div className="nav-user">
                    <span className={`user-role-badge ${userData.role === 'HR' ? 'hr' : 'employee'}`}>
                        {userData.role === 'HR' ? 'HR' : 'Employee'}
                    </span>
                    <button onClick={handleLogout} className="logout-btn">Logout</button>
                </div>
            </nav>

            <div className="dashboard-content">
                <div className="welcome-section">
                    <h1>Welcome, {userData.role === 'HR' ? 'HR' : 'Employee'}!</h1>
                    <p className="subtitle">{userData.role === 'HR' ? 'HR Management Portal' : 'Employee Portal Dashboard'}</p>
                </div>

                <div className="info-cards">
                    <div className="info-card">
                        <div className="card-icon">👤</div>
                        <div className="card-content">
                            <h3>Employee ID</h3>
                            <p className="card-value">{userData.employeeId}</p>
                        </div>
                    </div>

                    <div className="info-card">
                        <div className="card-icon">📧</div>
                        <div className="card-content">
                            <h3>Email</h3>
                            <p className="card-value email-value">{userData.email}</p>
                        </div>
                    </div>

                    <div className="info-card">
                        <div className="card-icon">🎭</div>
                        <div className="card-content">
                            <h3>Role</h3>
                            <p className="card-value employee-text">{userData.role}</p>
                        </div>
                    </div>
                </div>

                <div className="permissions-section">
                    <h2>📋 Your Access Permissions</h2>
                    <div className="permissions-grid">
                        <div className="permission-card allowed">
                            <span className="permission-icon">✓</span>
                            <div className="permission-details">
                                <h4>View Personal Information</h4>
                                <p>Access your profile and personal details</p>
                            </div>
                        </div>

                        <div className="permission-card allowed">
                            <span className="permission-icon">✓</span>
                            <div className="permission-details">
                                <h4>Submit Reports</h4>
                                <p>Create and submit work reports</p>
                            </div>
                        </div>

                        <div className="permission-card allowed">
                            <span className="permission-icon">✓</span>
                            <div className="permission-details">
                                <h4>View Schedules</h4>
                                <p>Check your work schedule and assignments</p>
                            </div>
                        </div>

                        <div className="permission-card allowed">
                            <span className="permission-icon">✓</span>
                            <div className="permission-details">
                                <h4>Request Leave</h4>
                                <p>Submit leave and vacation requests</p>
                            </div>
                        </div>

                        <div className="permission-card denied">
                            <span className="permission-icon">✗</span>
                            <div className="permission-details">
                                <h4>Manage Users</h4>
                                <p>Admin-only feature</p>
                            </div>
                        </div>

                        <div className="permission-card denied">
                            <span className="permission-icon">✗</span>
                            <div className="permission-details">
                                <h4>System Configuration</h4>
                                <p>Admin-only feature</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="quick-actions">
                    <h2>⚡ Quick Actions</h2>
                    <div className="actions-grid">
                        {userData.role === 'HR' && (
                            <button className="action-btn primary" onClick={() => setShowApplicationForm(true)}>
                                <span className="action-icon">📝</span>
                                <span>Application Form</span>
                            </button>
                        )}
                        <button className="action-btn">
                            <span className="action-icon">📊</span>
                            <span>View Reports</span>
                        </button>
                        <button className="action-btn">
                            <span className="action-icon">📅</span>
                            <span>Check Schedule</span>
                        </button>
                        <button className="action-btn">
                            <span className="action-icon">✉️</span>
                            <span>Messages</span>
                        </button>
                        <button className="action-btn">
                            <span className="action-icon">⚙️</span>
                            <span>Settings</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EmployeeDashboard;
