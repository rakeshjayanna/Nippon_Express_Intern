import './styles/dashboard.css';
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authService } from './services/authService';
import { API_BASE_URL, ROUTES } from './utils/constants';
import ApplicationForm from './ApplicationForm';
import ViewApplication from './ViewApplication';
import LoadingSpinner from './components/LoadingSpinner';

function EmployeeDashboard() {
    const [userData, setUserData] = useState(null);
    const [showApplicationForm, setShowApplicationForm] = useState(false);
    const [showViewApplication, setShowViewApplication] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const [compactView, setCompactView] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [realTimeStats, setRealTimeStats] = useState({
        tasksCompleted: 0,
        pendingRequests: 0,
        upcomingEvents: 0,
        unreadMessages: 0
    });
    const [notifications, setNotifications] = useState([]);
    
    const navigate = useNavigate();

    useEffect(() => {
        const data = authService.getUserData();
        if (!data || (data.role !== 'EMPLOYEE' && data.role !== 'HR')) {
            navigate(ROUTES.LOGIN);
            return;
        }
        setUserData(data);
        setIsLoading(false);

        // Load preferences
        const savedDarkMode = localStorage.getItem('darkMode') === 'true';
        const savedCompactView = localStorage.getItem('compactView') === 'true';
        setDarkMode(savedDarkMode);
        setCompactView(savedCompactView);
        if (savedDarkMode) document.documentElement.classList.add('dark-mode');
    }, [navigate]);

    useEffect(() => {
        if (!userData?.email) return;

        const fetchStats = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/application-form/my-forms`, {
                    headers: { 'X-User-Email': userData.email }
                });
                const forms = res.ok ? await res.json() : [];

                const safeForms = Array.isArray(forms) ? forms : [];
                const pendingCount = safeForms.filter(f => String(f.status || '').toUpperCase() === 'PENDING').length;
                const approvedCount = safeForms.filter(f => String(f.status || '').toUpperCase() === 'APPROVED').length;
                const rejectedCount = safeForms.filter(f => String(f.status || '').toUpperCase() === 'REJECTED').length;

                setRealTimeStats({
                    tasksCompleted: approvedCount,
                    pendingRequests: pendingCount,
                    upcomingEvents: 0,
                    unreadMessages: 0
                });

                const derivedNotifications = [];
                if (pendingCount > 0) {
                    derivedNotifications.push({
                        id: 1,
                        type: 'info',
                        message: `${pendingCount} request(s) pending review`,
                        time: 'Updated just now',
                        unread: true
                    });
                }
                if (approvedCount > 0) {
                    derivedNotifications.push({
                        id: 2,
                        type: 'success',
                        message: `${approvedCount} request(s) approved`,
                        time: 'Updated just now',
                        unread: false
                    });
                }
                if (rejectedCount > 0) {
                    derivedNotifications.push({
                        id: 3,
                        type: 'warning',
                        message: `${rejectedCount} request(s) rejected`,
                        time: 'Updated just now',
                        unread: false
                    });
                }

                setNotifications(derivedNotifications);
            } catch {
                setRealTimeStats(prev => ({ ...prev }));
            }
        };

        fetchStats();
    }, [userData]);

    const toggleDarkMode = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        localStorage.setItem('darkMode', newMode);
        if (newMode) {
            document.documentElement.classList.add('dark-mode');
        } else {
            document.documentElement.classList.remove('dark-mode');
        }
        toast.success(newMode ? '🌙 Dark mode enabled' : '☀️ Light mode enabled');
    };

    const toggleCompactView = () => {
        const newCompact = !compactView;
        setCompactView(newCompact);
        localStorage.setItem('compactView', newCompact);
        toast.info(newCompact ? 'Compact view enabled' : 'Expanded view enabled');
    };

    const handleLogout = () => {
        authService.logout();
        toast.info("Logged out successfully");
        navigate(ROUTES.LOGIN);
    };

    const markAllNotificationsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
        toast.success('All notifications marked as read');
    };

    const unreadCount = useMemo(() => notifications.filter(n => n.unread).length, [notifications]);

    const quickActions = [
        { id: 1, icon: userData?.role === 'HR' ? '📝' : '👁️', label: userData?.role === 'HR' ? 'Application Intake' : 'View Application', 
          action: () => userData?.role === 'HR' ? setShowApplicationForm(true) : setShowViewApplication(true), category: 'applications' },
        { id: 2, icon: '📊', label: 'Performance Reports', action: () => toast.info('Performance Reports - Coming soon'), category: 'reports' },
        { id: 3, icon: '📅', label: 'Schedule Center', action: () => toast.info('Schedule Center - Coming soon'), category: 'schedule' },
        { id: 4, icon: '✉️', label: 'Messages', action: () => toast.info('Messages - Coming soon'), category: 'communication' },
        { id: 5, icon: '⚙️', label: 'Preferences', action: () => toast.info('Preferences - Coming soon'), category: 'settings' },
        { id: 6, icon: '📚', label: 'Training Center', action: () => toast.info('Training - Coming soon'), category: 'learning' },
        { id: 7, icon: '🎯', label: 'Goals & OKRs', action: () => toast.info('Goals - Coming soon'), category: 'performance' },
        { id: 8, icon: '💼', label: 'Benefits Portal', action: () => toast.info('Benefits - Coming soon'), category: 'hr' }
    ];

    const filteredActions = quickActions.filter(action => {
        const matchesSearch = action.label.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || action.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

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
        <div className={`dashboard-container ${compactView ? 'compact' : ''}`}>
            <nav className="dashboard-nav">
                <div className="nav-brand">
                    <h2>🏢 NX Workspace</h2>
                    <p>Employee Services</p>
                </div>
                <div className="nav-controls">
                    <div className="search-bar">
                        <input 
                            type="text" 
                            placeholder="🔍 Search services..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="toggle-group">
                        <button 
                            className={`toggle-btn ${compactView ? 'active' : ''}`} 
                            onClick={toggleCompactView}
                            title="Compact View"
                        >
                            <span className="toggle-icon">{compactView ? '📋' : '📰'}</span>
                        </button>
                        <button 
                            className={`toggle-btn ${darkMode ? 'active' : ''}`} 
                            onClick={toggleDarkMode}
                            title="Dark Mode"
                        >
                            <span className="toggle-icon">{darkMode ? '🌙' : '☀️'}</span>
                        </button>
                        <button 
                            className="toggle-btn notification-btn" 
                            onClick={() => setShowNotifications(!showNotifications)}
                            title="Notifications"
                        >
                            <span className="toggle-icon">🔔</span>
                            {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
                        </button>
                    </div>
                </div>
                <div className="nav-user">
                    <span className={`user-role-badge ${userData.role === 'HR' ? 'hr' : 'employee'}`}>
                        {userData.role === 'HR' ? 'HR' : 'EMPLOYEE'}
                    </span>
                    <button onClick={handleLogout} className="logout-btn">Logout</button>
                </div>
            </nav>

            {showNotifications && (
                <div className="notifications-panel">
                    <div className="notifications-header">
                        <h3>Notifications</h3>
                        <button onClick={markAllNotificationsRead} className="mark-read-btn">Mark all read</button>
                    </div>
                    <div className="notifications-list">
                        {notifications.length === 0 ? (
                            <div className="notification-item info">
                                <span className="notif-icon info">ℹ️</span>
                                <div className="notif-content">
                                    <p>No notifications right now.</p>
                                    <span className="notif-time">Up to date</span>
                                </div>
                            </div>
                        ) : notifications.map(notif => (
                            <div key={notif.id} className={`notification-item ${notif.type} ${notif.unread ? 'unread' : ''}`}>
                                <span className={`notif-icon ${notif.type}`}>
                                    {notif.type === 'warning' ? '⚠️' : notif.type === 'success' ? '✅' : notif.type === 'alert' ? '🚨' : 'ℹ️'}
                                </span>
                                <div className="notif-content">
                                    <p>{notif.message}</p>
                                    <span className="notif-time">{notif.time}</span>
                                </div>
                                {notif.unread && <span className="unread-dot"></span>}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="dashboard-content">
                <div className="dashboard-hero">
                    <div>
                        <h1 className="hero-title">Welcome, {userData.role === 'HR' ? 'HR Professional' : 'Team Member'}</h1>
                        <p className="hero-subtitle">{userData.role === 'HR' ? 'Manage workforce operations and employee lifecycle' : 'Access your workspace and self-service tools'}</p>
                    </div>
                    <div className="hero-chips">
                        <span className="hero-chip animate">✓ Active Session</span>
                        <span className="hero-chip animate">🌐 APAC Region</span>
                        <span className="hero-chip animate">🔒 Secured</span>
                    </div>
                </div>

                <div className="stats-grid">
                    <div className="stat-card success">
                        <div className="stat-header">
                            <span className="stat-icon">✅</span>
                            <span className="stat-trend">Approved</span>
                        </div>
                        <div className="stat-value">{realTimeStats.tasksCompleted}</div>
                        <div className="stat-label">Tasks Completed</div>
                        <div className="stat-progress">
                            <div className="progress-bar" style={{ width: '60%' }}></div>
                        </div>
                    </div>
                    <div className="stat-card warning">
                        <div className="stat-header">
                            <span className="stat-icon">⏱️</span>
                            <span className="stat-trend">Pending</span>
                        </div>
                        <div className="stat-value">{realTimeStats.pendingRequests}</div>
                        <div className="stat-label">Pending Requests</div>
                        <div className="stat-progress">
                            <div className="progress-bar" style={{ width: '30%' }}></div>
                        </div>
                    </div>
                    <div className="stat-card info">
                        <div className="stat-header">
                            <span className="stat-icon">📅</span>
                            <span className="stat-trend">Scheduled</span>
                        </div>
                        <div className="stat-value">{realTimeStats.upcomingEvents}</div>
                        <div className="stat-label">Upcoming Events</div>
                        <div className="stat-progress">
                            <div className="progress-bar" style={{ width: '45%' }}></div>
                        </div>
                    </div>
                    <div className="stat-card primary">
                        <div className="stat-header">
                            <span className="stat-icon">✉️</span>
                            <span className="stat-trend">Unread</span>
                        </div>
                        <div className="stat-value">{realTimeStats.unreadMessages}</div>
                        <div className="stat-label">Unread Messages</div>
                        <div className="stat-progress">
                            <div className="progress-bar" style={{ width: '55%' }}></div>
                        </div>
                    </div>
                </div>

                <div className="panel">
                    <div className="panel-header">
                        <h2 className="panel-title">Quick Actions</h2>
                        <div className="filter-tabs">
                            <button className={selectedCategory === 'all' ? 'active' : ''} onClick={() => setSelectedCategory('all')}>All</button>
                            <button className={selectedCategory === 'applications' ? 'active' : ''} onClick={() => setSelectedCategory('applications')}>Applications</button>
                            <button className={selectedCategory === 'reports' ? 'active' : ''} onClick={() => setSelectedCategory('reports')}>Reports</button>
                            <button className={selectedCategory === 'hr' ? 'active' : ''} onClick={() => setSelectedCategory('hr')}>HR</button>
                        </div>
                    </div>
                    <div className="actions-grid">
                        {filteredActions.map(action => (
                            <button key={action.id} className="action-btn primary" onClick={action.action}>
                                <span className="action-icon">{action.icon}</span>
                                <span>{action.label}</span>
                            </button>
                        ))}
                        {filteredActions.length === 0 && (
                            <p className="no-results">No actions found for "{searchQuery}"</p>
                        )}
                    </div>
                </div>

                <div className="panel">
                    <h2 className="panel-title">Recent Activity</h2>
                    <div className="activity-timeline">
                        <div className="activity-item">
                            <span className="activity-dot success" />
                            <div className="activity-content">
                                <strong>Identity Verified</strong>
                                <p className="subtitle">Multi-factor authentication completed</p>
                                <span className="activity-time">5 minutes ago</span>
                            </div>
                        </div>
                        <div className="activity-item">
                            <span className="activity-dot info" />
                            <div className="activity-content">
                                <strong>Policy Update Acknowledged</strong>
                                <p className="subtitle">Global access policy synced with directory</p>
                                <span className="activity-time">1 hour ago</span>
                            </div>
                        </div>
                        <div className="activity-item">
                            <span className="activity-dot success" />
                            <div className="activity-content">
                                <strong>Workspace Ready</strong>
                                <p className="subtitle">All modules available for use</p>
                                <span className="activity-time">Today, 9:00 AM</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="panel">
                    <h2 className="panel-title">Access Permissions</h2>
                    <div className="permissions-grid">
                        {[
                            { icon: '👤', title: 'Profile & Identity', desc: 'View and manage personal details', enabled: true },
                            { icon: '📋', title: 'Service Requests', desc: 'Submit onboarding and operational requests', enabled: true },
                            { icon: '📅', title: 'Scheduling', desc: 'Review schedules and assignments', enabled: true },
                            { icon: '⚙️', title: 'System Administration', desc: 'Admin-only feature', enabled: false }
                        ].map((perm, idx) => (
                            <div key={idx} className={`permission-card ${perm.enabled ? 'allowed' : 'denied'}`}>
                                <span className="permission-icon-large">{perm.icon}</span>
                                <div className="permission-details">
                                    <h4>{perm.title}</h4>
                                    <p>{perm.desc}</p>
                                </div>
                                <span className="permission-status">{perm.enabled ? '✓ Enabled' : '✗ Restricted'}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EmployeeDashboard;
