import React from 'react';
import './AdminDashboard.css';
import AdminSidebar from '../components/AdminSidebar';
import { useAdmin } from '../context/AdminContext';

const AdminWelcome = () => {
    const { sidebarVisible } = useAdmin();

    return (
        <div className="admin-dashboard">
            <AdminSidebar />
            <div className="admin-content" style={{ marginLeft: sidebarVisible ? '250px' : '0px' }}>
                <div className="welcome-container">
                    {/* Animated Background Particles */}
                    <div className="particles-container">
                        <div className="particle animate-floating"></div>
                        <div className="particle animate-orbit"></div>
                        <div className="particle animate-shimmer"></div>
                    </div>

                    <div className="welcome-header">
                        <h1 className="welcome-title animate-typewriter">
                            <i className="bi bi-shield-check animate-glow"></i>
                            Welcome to Admin Panel
                        </h1>
                        <p className="welcome-subtitle animate-shake">
                            Your central hub for managing the Jobnest platform.
                        </p>
                        <div className="welcome-decorations">
                            <div className="decoration animate-morph"></div>
                            <div className="decoration animate-gradient-shift"></div>
                            <div className="decoration animate-flash"></div>
                        </div>
                    </div>

                    <div className="hero-section animate-parallax">
                        <div className="hero-content">
                            <div className="hero-text animate-elastic">
                                <h2>Admin Control Center</h2>
                                <p>Oversee all operations with powerful tools and insights.</p>
                            </div>
                            <div className="hero-stats">
                                <div className="stat-item animate-bounce-in">
                                    <span className="stat-number">∞</span>
                                    <span className="stat-label">Users</span>
                                </div>
                                <div className="stat-item animate-zoom">
                                    <span className="stat-number">∞</span>
                                    <span className="stat-label">Jobs</span>
                                </div>
                                <div className="stat-item animate-flip">
                                    <span className="stat-number">∞</span>
                                    <span className="stat-label">Applications</span>
                                </div>
                                <div className="stat-item animate-swing">
                                    <span className="stat-number">∞</span>
                                    <span className="stat-label">Reports</span>
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
                        <div className="animation-item animate-tada">
                            <i className="bi bi-trophy-fill"></i>
                            <span>Achievements</span>
                        </div>
                        <div className="animation-item animate-rubber-band">
                            <i className="bi bi-lightning-fill"></i>
                            <span>Performance</span>
                        </div>
                        <div className="animation-item animate-bounce">
                            <i className="bi bi-graph-up"></i>
                            <span>Growth</span>
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
                            <a href="/admin/reports" className="action-btn animate-hover-lift">
                                <i className="bi bi-bar-chart"></i>
                                View Reports
                            </a>
                            <a href="/admin/backup" className="action-btn animate-hover-lift">
                                <i className="bi bi-database"></i>
                                Database Management
                            </a>
                            <a href="/admin/settings" className="action-btn animate-hover-lift">
                                <i className="bi bi-gear"></i>
                                Site Settings
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminWelcome;
