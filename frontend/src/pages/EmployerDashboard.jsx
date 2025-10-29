import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import EmployerSidebar from '../components/EmployerSidebar';

// --- 2. Stat Card Component ---
const StatCard = ({ title, count, iconClass, colorClass }) => (
    <div className="col-lg-4 col-md-6">
        <div className={`card ${colorClass} text-white shadow-lg border-0 rounded-4 h-100 transform-scale-on-hover`}>
            <div className="card-body d-flex align-items-center justify-content-between p-4">
                <div>
                    <h2 className="card-title display-4 fw-bold mb-0">{count}</h2>
                    <p className="card-text text-uppercase fw-light small opacity-75">{title}</p>
                </div>
                <i className={`${iconClass} display-4 opacity-50`}></i>
            </div>
        </div>
    </div>
);

// --- 3. Job Post Form Component (Extracted and enhanced) ---
const JobPostForm = ({ updateRecentJobs, updateStats, authFetch, navigate }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        city: '',
        pincode: '',
        salary: '',
        isFeatured: false,
    });
    const [formError, setFormError] = useState('');
    const [formSuccess, setFormSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');
        setFormSuccess('');
        setIsSubmitting(true);

        // Basic validation
        if (!formData.title || !formData.description || !formData.category || !formData.city || !formData.pincode) {
            setFormError('Please fill in all required fields.');
            setIsSubmitting(false);
            return;
        }

        // Validate salary if provided
        const salaryNumber = formData.salary ? Number(formData.salary) : null;
        if (formData.salary && isNaN(salaryNumber)) {
            setFormError('Salary must be a valid number.');
            setIsSubmitting(false);
            return;
        }

        try {
            // Use the authFetch wrapper (MOCK: this call simulates success)
            const response = await authFetch('jobs', {
                method: 'POST',
                body: JSON.stringify({ ...formData, salary: salaryNumber }),
            });

            const data = await response.json();

            if (response.ok) {
                setFormSuccess('Job posted successfully! Redirecting you to the job list.');
                
                // Update parent component state
                updateRecentJobs((prev) => [{ id: data.job._id, title: data.job.title, status: 'Open', applications: 0, date: 'Just now' }, ...prev]);
                updateStats((prev) => ({ ...prev, jobsPosted: prev.jobsPosted + 1, activeJobs: prev.activeJobs + 1 }));
                
                // Reset form after a short delay and navigate
                setTimeout(() => {
                    setFormData({ title: '', description: '', category: '', city: '', pincode: '', salary: '', isFeatured: false });
                    setFormSuccess('');
                    navigate('/employer/jobs');
                }, 1500);

            } else {
                setFormError(data.msg || 'Failed to post job due to server error.');
            }
        } catch (error) {
            // Error handling from authFetch (e.g., Network, 401 Unauthorized)
            setFormError(error.message || 'An unexpected error occurred during job posting.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const indigoColor = '#4f46e5';

    return (
        <div className="card p-5 shadow-lg border-0 rounded-4">
            <h3 className="mb-4 fw-bold d-flex align-items-center" style={{ color: indigoColor }}>
                <i className="bi bi-bullhorn me-2"></i> Post a New Job
            </h3>
            <p className="text-muted mb-4">Fill out the details below to publish your vacancy instantly to thousands of job seekers.</p>
            
            {formError && <div className="alert alert-danger" role="alert"><i className="bi bi-x-octagon-fill me-2"></i> {formError}</div>}
            {formSuccess && <div className="alert alert-success" role="alert"><i className="bi bi-check-circle-fill me-2"></i> {formSuccess}</div>}
            
            <form onSubmit={handleSubmit}>
                <div className="row g-3">
                    <div className="col-md-8">
                        <label htmlFor="title" className="form-label fw-semibold">Job Title *</label>
                        <input type="text" className="form-control" id="title" name="title" value={formData.title} onChange={handleChange} placeholder="e.g., Experienced Plumber, Delivery Driver" required disabled={isSubmitting} />
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="category" className="form-label fw-semibold">Category *</label>
                        <input type="text" className="form-control" id="category" name="category" value={formData.category} onChange={handleChange} placeholder="e.g., Construction, Logistics" required disabled={isSubmitting} />
                    </div>
                </div>

                <div className="mb-3 mt-3">
                    <label htmlFor="description" className="form-label fw-semibold">Job Description *</label>
                    <textarea className="form-control" id="description" name="description" rows="5" value={formData.description} onChange={handleChange} placeholder="Describe the responsibilities, work hours, and requirements clearly..." required disabled={isSubmitting}></textarea>
                </div>
                
                <div className="row g-3 mb-4">
                    <div className="col-md-4">
                        <label htmlFor="city" className="form-label fw-semibold">City *</label>
                        <input type="text" className="form-control" id="city" name="city" value={formData.city} onChange={handleChange} required placeholder="e.g., Mumbai, Chennai" disabled={isSubmitting} />
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="pincode" className="form-label fw-semibold">Pincode *</label>
                        <input type="text" className="form-control" id="pincode" name="pincode" value={formData.pincode} onChange={handleChange} required placeholder="e.g., 400001" disabled={isSubmitting} />
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="salary" className="form-label fw-semibold">Monthly Salary (₹)</label>
                        <input type="number" className="form-control" id="salary" name="salary" value={formData.salary} onChange={handleChange} placeholder="e.g., 25000" disabled={isSubmitting} />
                    </div>
                </div>

                <div className="form-check mb-4">
                    <input className="form-check-input" type="checkbox" id="isFeatured" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} disabled={isSubmitting} />
                    <label className="form-check-label fw-semibold" htmlFor="isFeatured">
                        Feature this job for high visibility (Requires credit/plan)
                    </label>
                </div>

                <button type="submit" className="btn btn-lg text-white rounded-pill px-5 fw-bold shadow-sm" 
                        style={{ backgroundColor: indigoColor, borderColor: indigoColor }} disabled={isSubmitting}>
                    {isSubmitting ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Posting...
                        </>
                    ) : (
                        <><i className="bi bi-arrow-up-circle-fill me-2"></i> Publish Job Now</>
                    )}
                </button>
            </form>
        </div>
    );
};


// --- 4. Main Employer Dashboard Component ---
const EmployerDashboard = () => {
    const { user, isLoggedIn, authFetch } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        jobsPosted: 0,
        activeJobs: 0,
        applicationsReceived: 0,
        newApplications: 0,
    });

    const [recentJobs, setRecentJobs] = useState([]);
    const [loadingRecentJobs, setLoadingRecentJobs] = useState(true);
    const [errorRecentJobs, setErrorRecentJobs] = useState('');
    const [loadingStats, setLoadingStats] = useState(true);
    const [errorStats, setErrorStats] = useState('');

    // Function to fetch stats from backend
    const fetchStats = async () => {
        try {
            setLoadingStats(true);
            setErrorStats('');
            const response = await authFetch('analytics/employer');
            const data = await response.json();
            if (response.ok) {
                const analytics = data.analytics;
                setStats({
                    jobsPosted: analytics.totalJobs,
                    activeJobs: analytics.activeJobs,
                    applicationsReceived: analytics.totalApplications,
                    newApplications: analytics.newApplications,
                });
            } else {
                setErrorStats(data.msg || 'Failed to fetch stats');
            }
        } catch (err) {
            setErrorStats('Failed to fetch stats');
            console.error('Failed to fetch stats:', err);
        } finally {
            setLoadingStats(false);
        }
    };

    // Function to fetch recent jobs
    const fetchRecentJobs = async () => {
        try {
            setLoadingRecentJobs(true);
            setErrorRecentJobs('');
            const response = await authFetch('jobs/employer?page=1&limit=5');
            const data = await response.json();
            if (response.ok) {
                setRecentJobs(data.jobs || []);
            } else {
                setErrorRecentJobs(data.msg || 'Failed to fetch recent jobs');
            }
        } catch (err) {
            setErrorRecentJobs('Failed to fetch recent jobs');
            console.error('Failed to fetch recent jobs:', err);
        } finally {
            setLoadingRecentJobs(false);
        }
    };

    // Fetch stats and recent jobs on mount
    useEffect(() => {
        if (user) {
            fetchStats();
            fetchRecentJobs();
        }
    }, [user, authFetch]);

    // Set up polling for real-time updates every 30 seconds
    useEffect(() => {
        if (!user) return;

        const interval = setInterval(() => {
            fetchStats();
            fetchRecentJobs();
        }, 30000); // 30 seconds

        return () => clearInterval(interval);
    }, [user, authFetch]);
    
    const indigoColor = '#4f46e5';

    return (
        <div className="container-fluid d-flex p-0">
            <EmployerSidebar userId={user?._id || 'Loading...'} />

            {/* Main Content Area */}
            <div className="flex-grow-1 p-5 bg-light">
                <h1 className="mb-2 fw-bolder text-dark">
                    Hello, <span style={{ color: indigoColor }}>{user.name || 'Employer'}</span>!
                </h1>
                <p className="lead text-muted mb-5">Your hiring dashboard at a glance.</p>

                {/* --- Stats Cards --- */}
                <div className="row g-4 mb-5">
                    <StatCard 
                        title="Jobs Posted" 
                        count={stats.jobsPosted} 
                        iconClass="bi bi-briefcase-fill" 
                        colorClass="bg-primary" 
                    />
                    <StatCard 
                        title="Active Listings" 
                        count={stats.activeJobs} 
                        iconClass="bi bi-megaphone-fill" 
                        colorClass="bg-success" 
                    />
                    <StatCard 
                        title="New Applications" 
                        count={stats.newApplications} 
                        iconClass="bi bi-file-earmark-check-fill" 
                        colorClass="bg-warning text-dark" 
                    />
                </div>

                <div className="row g-5">
                    {/* Column 1: Job Posting Form */}
                    <div className="col-lg-7">
                        <JobPostForm
                            updateRecentJobs={setRecentJobs}
                            updateStats={setStats}
                            authFetch={authFetch}
                            navigate={navigate}
                        />
                    </div>
                    
                    {/* Column 2: Recent Activity */}
                    <div className="col-lg-5">
                        <div className="card p-4 shadow-lg border-0 rounded-4 h-100">
                            <h3 className="mb-4 fw-bold">Recent Activity</h3>
                            <ul className="list-group list-group-flush">
                                {loadingRecentJobs ? (
                                    <li className="list-group-item text-center py-3">
                                        <div className="spinner-border spinner-border-sm text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </li>
                                ) : errorRecentJobs ? (
                                    <li className="list-group-item text-center py-3 text-danger">
                                        <i className="bi bi-exclamation-triangle me-2"></i>
                                        {errorRecentJobs}
                                    </li>
                                ) : recentJobs.length === 0 ? (
                                    <li className="list-group-item text-center py-3 text-muted">
                                        No jobs posted yet.
                                    </li>
                                ) : (
                                    recentJobs.map((job) => (
                                        <li key={job._id} className="list-group-item d-flex justify-content-between align-items-center py-3">
                                            <div className="flex-grow-1">
                                                <div className="fw-semibold text-truncate">{job.title}</div>
                                                <small className="text-muted">Posted {new Date(job.createdAt).toLocaleDateString()}</small>
                                            </div>
                                            <div className="text-end">
                                                {job.status === 'open' ? (
                                                    <span className="badge bg-success rounded-pill me-2">
                                                        {job.applicationCount || 0} Apps
                                                    </span>
                                                ) : (
                                                    <span className="badge bg-secondary rounded-pill me-2">
                                                        Closed
                                                    </span>
                                                )}
                                                <Link to={`/employer/jobs/${job._id}`} className="text-decoration-none" style={{ color: indigoColor }}>
                                                    View <i className="bi bi-arrow-right"></i>
                                                </Link>
                                            </div>
                                        </li>
                                    ))
                                )}
                            </ul>
                            <div className="mt-4 text-center">
                                <Link to="/employer/jobs" className="btn btn-outline-secondary btn-sm rounded-pill">
                                    See All Posted Jobs
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Custom CSS */}
            <style jsx="true">{`
                .transform-scale-on-hover:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.15) !important;
                    transition: all 0.3s ease-in-out;
                }
                .transform-scale-on-hover {
                    transition: all 0.3s ease-in-out;
                }
                .bg-primary { background-color: ${indigoColor} !important; }
            `}</style>
        </div>
    );
};

export default EmployerDashboard;
