import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/v1/admin/dashboard', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch stats');
            }
            const data = await response.json();
            setStats(data.stats);
        } catch (err) {
            setError('Failed to load dashboard statistics');
            console.error('Dashboard error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-dashboard">
            <div className="admin-content" style={{ marginLeft: '250px' }}>
                {loading && (
                    <div className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                )}
                {error && (
                    <div className="alert alert-danger" role="alert">
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        {error}
                    </div>
                )}

                {!loading && !error && (
                    <div className="welcome-container">
                        {/* Animated Background Particles */}
                        <div className="particles-container">
                            <div className="particle animate-floating"></div>
                            <div className="particle animate-orbit"></div>
                            <div className="particle animate-shimmer"></div>
                            <div className="particle animate-ripple"></div>
                            <div className="particle animate-heartbeat"></div>
                        </div>

                        <div className="welcome-header">
                            <h1 className="welcome-title animate-typewriter">
                                <i className="bi bi-shield-check animate-glow"></i>
                                Welcome, Admin!
                            </h1>
                            <p className="welcome-subtitle animate-shake">
                                Manage your platform with ease and efficiency.
                            </p>
                        </div>

                        <div className="hero-section animate-parallax">
                            <div className="hero-content">
                                <div className="hero-text animate-elastic">
                                    <h2>Admin Control Center</h2>
                                    <p>Oversee all operations with powerful tools and insights.</p>
                                </div>
                                <div className="hero-stats">
                                    <div className="stat-item animate-bounce-in">
                                        <span className="stat-number">{stats?.totalUsers || 0}</span>
                                        <span className="stat-label">Users</span>
                                    </div>
                                    <div className="stat-item animate-zoom">
                                        <span className="stat-number">{stats?.totalJobs || 0}</span>
                                        <span className="stat-label">Jobs</span>
                                    </div>
                                    <div className="stat-item animate-flip">
                                        <span className="stat-number">{stats?.totalApplications || 0}</span>
                                        <span className="stat-label">Applications</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="animation-grid">
                            <div className="animation-item animate-rotate">
                                <i className="bi bi-gear-fill"></i>
                                <span>Settings</span>
                            </div>
                            <div className="animation-item animate-scale">
                                <i className="bi bi-people-fill"></i>
                                <span>Users</span>
                            </div>
                            <div className="animation-item animate-pulse">
                                <i className="bi bi-briefcase-fill"></i>
                                <span>Jobs</span>
                            </div>
                            <div className="animation-item animate-wiggle">
                                <i className="bi bi-file-earmark-text-fill"></i>
                                <span>Applications</span>
                            </div>
                            <div className="animation-item animate-flip">
                                <i className="bi bi-chat-dots-fill"></i>
                                <span>Contacts</span>
                            </div>
                            <div className="animation-item animate-zoom">
                                <i className="bi bi-bar-chart-fill"></i>
                                <span>Analytics</span>
                            </div>
                            <div className="animation-item animate-spin">
                                <i className="bi bi-bell-fill"></i>
                                <span>Notifications</span>
                            </div>
                            <div className="animation-item animate-bounce-in">
                                <i className="bi bi-star-fill"></i>
                                <span>Testimonials</span>
                            </div>
                            <div className="animation-item animate-slide-up">
                                <i className="bi bi-shield-fill"></i>
                                <span>Security</span>
                            </div>
                            <div className="animation-item animate-fade-in-up">
                                <i className="bi bi-cloud-fill"></i>
                                <span>Backups</span>
                            </div>
                        </div>

                        <div className="quick-actions animate-slide-in-delay">
                            <h3>Get Started</h3>
                            <div className="actions-grid">
                                <a href="/admin/users" className="action-btn animate-hover-lift">
                                    <i className="bi bi-people"></i>
                                    Manage Users
                                </a>
                                <a href="/admin/jobs" className="action-btn animate-hover-lift">
                                    <i className="bi bi-briefcase"></i>
                                    Manage Jobs
                                </a>
                                <a href="/admin/applications" className="action-btn animate-hover-lift">
                                    <i className="bi bi-file-earmark-text"></i>
                                    View Applications
                                </a>
                                <a href="/admin/contacts" className="action-btn animate-hover-lift">
                                    <i className="bi bi-chat-dots"></i>
                                    Handle Contacts
                                </a>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
