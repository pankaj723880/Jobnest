import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EmployerSidebar from '../components/EmployerSidebar';
import { useAuth } from '../context/AuthContext';
import './AdminDashboard.css';

const API_BASE_URL = "http://localhost:5000/api/v1";

const EmployerAnalytics = () => {
    const navigate = useNavigate();
    const { user, token, isLoggedIn } = useAuth();
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isLoggedIn || !user || user.role !== 'employer') {
            navigate('/login');
            return;
        }
        fetchAnalytics();
    }, [isLoggedIn, user, navigate]);

    const fetchAnalytics = async () => {
        if (!token || !isLoggedIn) {
            navigate('/login');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };

            const response = await fetch(`${API_BASE_URL}/analytics/employer`, { headers });
            const data = await response.json();

            if (response.ok) {
                setAnalytics(data.analytics);
            } else {
                setError(data.msg || 'Failed to fetch analytics');
            }
        } catch (err) {
            setError('Failed to fetch analytics');
            console.error('Failed to fetch analytics:', err);
        } finally {
            setLoading(false);
        }
    };

    const StatCard = ({ title, value, icon, color, subtitle }) => (
        <div className="col-lg-3 col-md-6 mb-4">
            <div className={`card ${color} text-white shadow-lg border-0 rounded-4 h-100`}>
                <div className="card-body d-flex align-items-center justify-content-between p-4">
                    <div>
                        <h3 className="card-title display-6 fw-bold mb-1">{value}</h3>
                        <p className="card-text text-uppercase fw-light small opacity-75 mb-1">{title}</p>
                        {subtitle && <small className="opacity-75">{subtitle}</small>}
                    </div>
                    <i className={`${icon} display-4 opacity-50`}></i>
                </div>
            </div>
        </div>
    );

    const ChartPlaceholder = ({ title, description }) => (
        <div className="card shadow-lg border-0 rounded-4 mb-4">
            <div className="card-body p-4">
                <h5 className="card-title fw-bold mb-3">{title}</h5>
                <div className="text-center py-5">
                    <i className="bi bi-bar-chart-line display-1 text-muted mb-3"></i>
                    <p className="text-muted">{description}</p>
                    <small className="text-muted">Chart visualization coming soon</small>
                </div>
            </div>
        </div>
    );

    return (
        <div className="admin-dashboard">
            <EmployerSidebar userId={user?._id} />
            <div className="admin-content">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1 className="h3 mb-0">
                        <i className="bi bi-graph-up me-2"></i>
                        Analytics Dashboard
                    </h1>
                    <button
                        className="btn btn-outline-primary"
                        onClick={fetchAnalytics}
                        disabled={loading}
                    >
                        <i className="bi bi-arrow-clockwise me-2"></i>
                        Refresh
                    </button>
                </div>

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

                {!loading && !error && analytics && (
                    <>
                        {/* Stats Cards */}
                        <div className="row mb-5">
                            <StatCard
                                title="Total Jobs"
                                value={analytics.totalJobs || 0}
                                icon="bi bi-briefcase-fill"
                                color="bg-primary"
                                subtitle="All time"
                            />
                            <StatCard
                                title="Active Jobs"
                                value={analytics.activeJobs || 0}
                                icon="bi bi-megaphone-fill"
                                color="bg-success"
                                subtitle="Currently open"
                            />
                            <StatCard
                                title="Total Applications"
                                value={analytics.totalApplications || 0}
                                icon="bi bi-people-fill"
                                color="bg-info"
                                subtitle="All applications"
                            />
                            <StatCard
                                title="New Applications"
                                value={analytics.newApplications || 0}
                                icon="bi bi-file-earmark-check-fill"
                                color="bg-warning text-dark"
                                subtitle="This month"
                            />
                        </div>

                        {/* Charts Section */}
                        <div className="row">
                            <div className="col-lg-6">
                                <ChartPlaceholder
                                    title="Applications Over Time"
                                    description="Track application trends and hiring patterns"
                                />
                            </div>
                            <div className="col-lg-6">
                                <ChartPlaceholder
                                    title="Job Performance"
                                    description="View which jobs attract the most applicants"
                                />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-lg-6">
                                <ChartPlaceholder
                                    title="Application Status Distribution"
                                    description="See the breakdown of accepted, rejected, and pending applications"
                                />
                            </div>
                            <div className="col-lg-6">
                                <ChartPlaceholder
                                    title="Top Performing Categories"
                                    description="Identify which job categories get the most interest"
                                />
                            </div>
                        </div>

                        {/* Recent Activity Summary */}
                        <div className="card shadow-lg border-0 rounded-4">
                            <div className="card-body p-4">
                                <h5 className="card-title fw-bold mb-3">Recent Activity Summary</h5>
                                <div className="row text-center">
                                    <div className="col-md-3">
                                        <div className="p-3">
                                            <h4 className="text-primary fw-bold">{analytics.jobsThisMonth || 0}</h4>
                                            <small className="text-muted">Jobs Posted This Month</small>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="p-3">
                                            <h4 className="text-success fw-bold">{analytics.applicationsThisMonth || 0}</h4>
                                            <small className="text-muted">Applications This Month</small>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="p-3">
                                            <h4 className="text-info fw-bold">{analytics.acceptedApplications || 0}</h4>
                                            <small className="text-muted">Applications Accepted</small>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="p-3">
                                            <h4 className="text-warning fw-bold">{analytics.responseRate || 0}%</h4>
                                            <small className="text-muted">Response Rate</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {!loading && !error && !analytics && (
                    <div className="text-center py-5">
                        <p className="text-muted">No analytics data available</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmployerAnalytics;
