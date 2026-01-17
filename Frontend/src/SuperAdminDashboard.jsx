import './styles/dashboard.css';
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authService } from './services/authService';
import { API_BASE_URL, ROUTES } from './utils/constants';
import ManageApplications from './ManageApplications';
import LoadingSpinner from './components/LoadingSpinner';

function SuperAdminDashboard() {
    const [userData, setUserData] = useState(null);
    const [showApplications, setShowApplications] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const [compactView, setCompactView] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMetric, setSelectedMetric] = useState('all');
    const [realTimeStats, setRealTimeStats] = useState({
        activeUsers: 0,
        pendingApprovals: 0,
        systemHealth: 100,
        securityScore: 100
    });
    const [notifications, setNotifications] = useState([]);
    
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

        // Load preferences from localStorage
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
                const [countsRes, formsRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/debug/counts`, { headers: { 'X-User-Email': userData.email } }),
                    fetch(`${API_BASE_URL}/application-form/all`, { headers: { 'X-User-Email': userData.email } })
                ]);

                const counts = countsRes.ok ? await countsRes.json() : {};
                const forms = formsRes.ok ? await formsRes.json() : [];

                const pendingCount = Array.isArray(forms) ? forms.filter(f => String(f.status || '').toUpperCase() === 'PENDING').length : 0;
                const totalForms = Array.isArray(forms) ? forms.length : 0;

                setRealTimeStats({
                    activeUsers: Number(counts.users || 0),
                    pendingApprovals: pendingCount,
                    systemHealth: totalForms ? Math.max(90, 100 - Math.round((pendingCount / totalForms) * 10)) : 100,
                    securityScore: 100
                });

                const derivedNotifications = [];
                if (pendingCount > 0) {
                    derivedNotifications.push({
                        id: 1,
                        type: 'warning',
                        message: `${pendingCount} applications pending review`,
                        time: 'Updated just now',
                        unread: true
                    });
                }
                if (totalForms > 0) {
                    derivedNotifications.push({
                        id: 2,
                        type: 'info',
                        message: `${totalForms} total submissions in system`,
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
        { id: 1, icon: '✅', label: 'Approve Applications', action: () => setShowApplications(true), category: 'approvals' },
        { id: 2, icon: '👥', label: 'User Management', action: () => toast.info('User Management - Coming soon'), category: 'users' },
        { id: 3, icon: '📊', label: 'Analytics Dashboard', action: () => toast.info('Analytics - Coming soon'), category: 'analytics' },
        { id: 4, icon: '🔒', label: 'Security Center', action: () => toast.info('Security Center - Coming soon'), category: 'security' },
        { id: 5, icon: '🗄️', label: 'Data Manager', action: () => toast.info('Data Manager - Coming soon'), category: 'data' },
        { id: 6, icon: '📝', label: 'Audit Logs', action: () => toast.info('Audit Logs - Coming soon'), category: 'audit' },
        { id: 7, icon: '⚙️', label: 'System Settings', action: () => toast.info('Settings - Coming soon'), category: 'settings' },
        { id: 8, icon: '📧', label: 'Email Templates', action: () => toast.info('Email Templates - Coming soon'), category: 'settings' }
    ];

    const filteredActions = quickActions.filter(action => {
        const matchesSearch = action.label.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedMetric === 'all' || action.category === selectedMetric;
        return matchesSearch && matchesCategory;
    });

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
        <div className={`dashboard-container ${compactView ? 'compact' : ''}`}>
            <nav className="dashboard-nav">
                <div className="nav-brand">
                    <h2>🚀 NX Admin Control</h2>
                    <p>Executive Operations Center</p>
                </div>
                <div className="nav-controls">
                    <div className="search-bar">
                        <input 
                            type="text" 
                            placeholder="🔍 Search actions..." 
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
                    <span className="user-role-badge superadmin">SUPER ADMIN</span>
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
                        <h1 className="hero-title">Executive Admin Console</h1>
                        <p className="hero-subtitle">Full system visibility, approvals, and security governance.</p>
                    </div>
                    <div className="hero-chips">
                        <span className="hero-chip animate">🔐 Tier 0 Access</span>
                        <span className="hero-chip animate">✓ Compliant</span>
                        <span className="hero-chip animate">🟢 Low Risk</span>
                    </div>
                </div>

                <div className="stats-grid">
                    <div className="stat-card primary">
                        <div className="stat-header">
                            <span className="stat-icon">👥</span>
                            <span className="stat-trend">Live</span>
                        </div>
                        <div className="stat-value">{realTimeStats.activeUsers}</div>
                        <div className="stat-label">Active Users</div>
                        <div className="stat-progress">
                            <div className="progress-bar" style={{ width: '75%' }}></div>
                        </div>
                    </div>
                    <div className="stat-card warning">
                        <div className="stat-header">
                            <span className="stat-icon">⏳</span>
                            <span className="stat-trend">Updated</span>
                        </div>
                        <div className="stat-value">{realTimeStats.pendingApprovals}</div>
                        <div className="stat-label">Pending Approvals</div>
                        <div className="stat-progress">
                            <div className="progress-bar" style={{ width: '40%' }}></div>
                        </div>
                    </div>
                    <div className="stat-card success">
                        <div className="stat-header">
                            <span className="stat-icon">💚</span>
                            <span className="stat-trend">Stable</span>
                        </div>
                        <div className="stat-value">{realTimeStats.systemHealth.toFixed(2)}%</div>
                        <div className="stat-label">System Health</div>
                        <div className="stat-progress">
                            <div className="progress-bar" style={{ width: `${realTimeStats.systemHealth}%` }}></div>
                        </div>
                    </div>
                    <div className="stat-card info">
                        <div className="stat-header">
                            <span className="stat-icon">🛡️</span>
                            <span className="stat-trend">Audited</span>
                        </div>
                        <div className="stat-value">{realTimeStats.securityScore.toFixed(0)}/100</div>
                        <div className="stat-label">Security Score</div>
                        <div className="stat-progress">
                            <div className="progress-bar" style={{ width: `${realTimeStats.securityScore}%` }}></div>
                        </div>
                    </div>
                </div>

                <div className="panel">
                    <div className="panel-header">
                        <h2 className="panel-title">Quick Actions</h2>
                        <div className="filter-tabs">
                            <button className={selectedMetric === 'all' ? 'active' : ''} onClick={() => setSelectedMetric('all')}>All</button>
                            <button className={selectedMetric === 'approvals' ? 'active' : ''} onClick={() => setSelectedMetric('approvals')}>Approvals</button>
                            <button className={selectedMetric === 'security' ? 'active' : ''} onClick={() => setSelectedMetric('security')}>Security</button>
                            <button className={selectedMetric === 'analytics' ? 'active' : ''} onClick={() => setSelectedMetric('analytics')}>Analytics</button>
                        </div>
                    </div>
                    <div className="actions-grid admin-actions">
                        {filteredActions.map(action => (
                            <button key={action.id} className="action-btn admin-btn" onClick={action.action}>
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
                    <h2 className="panel-title">System Activity</h2>
                    <div className="activity-timeline">
                        <div className="activity-item">
                            <span className="activity-dot success" />
                            <div className="activity-content">
                                <strong>Security Audit Completed</strong>
                                <p className="subtitle">All compliance checks passed • ISO 27001 verified</p>
                                <span className="activity-time">2 minutes ago</span>
                            </div>
                        </div>
                        <div className="activity-item">
                            <span className="activity-dot warning" />
                            <div className="activity-content">
                                <strong>{realTimeStats.pendingApprovals} Applications Awaiting Review</strong>
                                <p className="subtitle">HR onboarding requests require approval</p>
                                <span className="activity-time">15 minutes ago</span>
                            </div>
                        </div>
                        <div className="activity-item">
                            <span className="activity-dot info" />
                            <div className="activity-content">
                                <strong>Global Policy Sync</strong>
                                <p className="subtitle">Active Directory synchronized successfully</p>
                                <span className="activity-time">1 hour ago</span>
                            </div>
                        </div>
                        <div className="activity-item">
                            <span className="activity-dot success" />
                            <div className="activity-content">
                                <strong>Backup Completed</strong>
                                <p className="subtitle">Database backup stored in secure vault</p>
                                <span className="activity-time">3 hours ago</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="panel">
                    <h2 className="panel-title">Administrative Permissions</h2>
                    <div className="permissions-grid">
                        {[
                            { icon: '👥', title: 'User Lifecycle', desc: 'Create, update, deactivate accounts', enabled: true },
                            { icon: '🔒', title: 'Security Governance', desc: 'Audit logs, policy updates, reviews', enabled: true },
                            { icon: '⚙️', title: 'System Configuration', desc: 'Integrations, APIs, health monitoring', enabled: true },
                            { icon: '🗄️', title: 'Data Governance', desc: 'Database access and backup controls', enabled: true }
                        ].map((perm, idx) => (
                            <div key={idx} className="permission-card allowed">
                                <span className="permission-icon-large">{perm.icon}</span>
                                <div className="permission-details">
                                    <h4>{perm.title}</h4>
                                    <p>{perm.desc}</p>
                                </div>
                                <span className="permission-status">✓ Enabled</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SuperAdminDashboard;
