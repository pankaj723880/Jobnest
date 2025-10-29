import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Define the core color used across the components
const INDIGO_COLOR = '#4f46e5'; // Indigo 600

// --- 1. Utility Components ---

// Skeletal Loader Card
const SkeletonCard = () => (
    <div className="col-lg-4 col-md-6 mb-4">
      <div className="card h-100 shadow-sm border-0 rounded-4 animate-pulse">
        <div className="card-body p-4">
          <div className="d-flex align-items-start mb-3 border-bottom pb-3">
            <div className="bg-light-gray rounded-3 me-3 flex-shrink-0" style={{ width: '55px', height: '55px' }}></div>
            <div>
              <div className="bg-light-gray rounded mb-1" style={{ height: '24px', width: '150px' }}></div>
              <div className="bg-light-gray rounded" style={{ height: '14px', width: '100px' }}></div>
            </div>
          </div>
          <div className="bg-light-gray rounded mb-2" style={{ height: '16px' }}></div>
          <div className="bg-light-gray rounded mb-4" style={{ height: '16px', width: '80%' }}></div>
          <div className="d-flex gap-2 mb-3">
            <div className="bg-light-gray rounded-pill" style={{ height: '20px', width: '80px' }}></div>
            <div className="bg-light-gray rounded-pill" style={{ height: '20px', width: '100px' }}></div>
          </div>
          <div className="d-flex justify-content-between pt-3 border-top">
            <div className="bg-light-gray rounded" style={{ height: '18px', width: '100px' }}></div>
            <div className="bg-light-gray rounded-pill" style={{ height: '35px', width: '100px' }}></div>
          </div>
        </div>
      </div>
    </div>
);

const JobCard = ({ job, isExpanded, onToggleExpand, isApplied, onApply, onUndoApply, isLoggedIn }) => {
    // Ensure all required fields exist for display
    const { title, description, category, city, pincode, salary, _id, status, requirements = [], postedBy = 'Employer' } = job;
    
    // Formatting helpers
    const formatSalary = (s) => (s ? `₹${Number(s).toLocaleString()}` : 'Negotiable');
    const truncatedDescription = description ? `${description.substring(0, 100)}...` : 'No description provided.';
    const fullDescription = description || 'No description provided.';
    const jobStatus = status || 'open';
    
    let statusClass;
    let statusText;
    if (jobStatus.toLowerCase() === 'open') {
        statusClass = 'bg-success';
        statusText = 'Active';
    } else if (jobStatus.toLowerCase() === 'closed') {
        statusClass = 'bg-danger';
        statusText = 'Closed';
    } else {
        statusClass = 'bg-warning text-dark';
        statusText = 'Reviewing';
    }

    const handleApply = () => {
        if (!isLoggedIn) {
            alert('Please log in to apply.');
            return;
        }
        if (isApplied) {
            alert('You have already applied for this job.');
            return;
        }
        onApply(job._id, job);
    };

    return (
      <div className="col-md-6 col-lg-4 mb-4">
        <div className={`card h-auto shadow-lg border-0 rounded-4 overflow-hidden transform-on-hover ${isExpanded ? 'expanded-card' : ''}`}>
          <div className="card-body p-4 d-flex flex-column">
            
            <div className="d-flex justify-content-between align-items-start mb-3">
                {/* Title and Category */}
                <div>
                    <h5 className="card-title text-dark mb-1 fw-bold fs-5 text-truncate" style={{ color: INDIGO_COLOR }}>{title || 'Job Title Missing'}</h5>
                    <p className="card-subtitle text-muted small">{category || 'General Labour'}</p>
                </div>
                {/* Status Badge */}
                <span className={`badge ${statusClass} text-uppercase ms-3`}>
                    {statusText}
                </span>
            </div>
            
            {/* Description and Details */}
            <p className="card-text text-secondary mb-3 flex-grow-1">{isExpanded ? fullDescription : truncatedDescription}</p>
 
            {!isExpanded ? (
              <div className="d-flex flex-wrap gap-2 small mb-3">
                <span className="badge bg-light text-dark border border-secondary">
                  <i className="bi bi-cash-stack me-1"></i> {formatSalary(salary)}
                </span>
                <span className="badge bg-light text-dark border border-secondary">
                  <i className="bi bi-geo-alt-fill me-1 text-danger"></i> {city || 'Remote'}, {pincode}
                </span>
              </div>
            ) : (
              <>
                {/* Full Details when Expanded */}
                <div className="mb-4">
                  <h6 className="fw-bold mb-2" style={{ color: INDIGO_COLOR }}>Requirements</h6>
                  <ul className="list-unstyled small text-secondary">
                    {requirements.length > 0 ? (
                      requirements.map((req, idx) => (
                        <li key={idx} className="mb-1">
                          <i className="bi bi-check-circle-fill text-success me-2"></i>{req}
                        </li>
                      ))
                    ) : (
                      <li>No specific requirements listed.</li>
                    )}
                  </ul>
                </div>

                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <div className="bg-light p-3 rounded-3">
                      <small className="text-muted">Salary</small>
                      <p className="mb-0 fw-semibold text-success">{formatSalary(salary)} / month</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="bg-light p-3 rounded-3">
                      <small className="text-muted">Location</small>
                      <p className="mb-0">{city}, {pincode}</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="bg-light p-3 rounded-3">
                      <small className="text-muted">Posted By</small>
                      <p className="mb-0 fw-semibold">{postedBy}</p>
                    </div>
                  </div>
                </div>

                {/* Apply Button when Expanded */}
                <div className="text-center">
                  {isApplied ? (
                    <div className="d-flex gap-2 justify-content-center">
                      <button
                        className="btn btn-warning text-dark rounded-pill px-4 fw-bold"
                        disabled
                      >
                        <i className="bi bi-check-circle-fill me-2"></i> Applied
                      </button>
                      <button
                        onClick={() => onUndoApply(job._id)}
                        className="btn btn-outline-danger rounded-pill px-4 fw-bold"
                      >
                        <i className="bi bi-x-circle me-2"></i> Undo Apply
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleApply}
                      className="btn btn-primary text-white rounded-pill px-5 fw-bold"
                      disabled={jobStatus !== 'open'}
                    >
                      <i className="bi bi-briefcase-fill me-2"></i> Apply Now
                    </button>
                  )}
                  {!isLoggedIn && (
                    <p className="mt-3 small text-muted">
                      <Link to="/login">Log in</Link> to apply.
                    </p>
                  )}
                </div>
              </>
            )}
 
            {/* Action Button */}
            {!isExpanded && (
              <div className="mt-auto pt-3 border-top text-center">
                <button 
                  onClick={onToggleExpand}
                  className="btn btn-sm text-white rounded-pill px-4 fw-semibold w-100"
                  style={{ backgroundColor: INDIGO_COLOR, borderColor: INDIGO_COLOR }}
                >
                  View Details <i className="bi bi-arrow-down"></i>
                </button>
              </div>
            )}
            {isExpanded && (
              <div className="mt-3 pt-3 border-top text-center">
                <button 
                  onClick={onToggleExpand}
                  className="btn btn-sm btn-outline-secondary rounded-pill px-4 fw-semibold w-100"
                >
                  Hide Details <i className="bi bi-arrow-up"></i>
                </button>
              </div>
            )}
            
          </div>
        </div>
      </div>
    );
};

// --- 2. Main Jobs Component ---
const Jobs = () => {
    const { user, applyJob, undoApply, appliedJobs, isLoggedIn, getApplications } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({
        keyword: '', // New input for general search
        category: '',
        city: '',
        pincode: '',
        sort: 'newest', // Add sort option
    });
    const [expandedJobs, setExpandedJobs] = useState(new Set());

    const isJobApplied = (jobId) => appliedJobs.some(app => app.job === jobId);

    const toggleExpand = (jobId) => {
        setExpandedJobs(prev => {
            const newSet = new Set(prev);
            if (newSet.has(jobId)) {
                newSet.delete(jobId);
            } else {
                newSet.add(jobId);
            }
            return newSet;
        });
    };

    const handleApply = async (jobId, jobData) => {
        const success = await applyJob(jobId, jobData);
        if (success) {
            alert('Application submitted successfully!');
            // No need to reload, state is updated
        } else {
            alert('Failed to apply. Please log in or try again.');
        }
    };

    // Fetch applied jobs on component mount to ensure state is up to date
    useEffect(() => {
        if (isLoggedIn) {
            getApplications();
        }
    }, [isLoggedIn, getApplications]);

    const handleUndoApply = async (jobId) => {
        if (!window.confirm('Are you sure you want to withdraw your application?')) {
            return;
        }
        // Find the application ID from appliedJobs
        const application = appliedJobs.find(app => app.job === jobId);
        if (application) {
            const success = await undoApply(application._id);
            if (success) {
                alert('Application withdrawn successfully.');
            } else {
                alert('Failed to withdraw application. Please try again.');
            }
        } else {
            alert('Application not found.');
        }
    };

    // Real API fetch logic with backend filtering and sorting
    const fetchJobs = useCallback(async () => {
        setLoading(true);
        setError('');

        try {
            // Build query parameters
            const params = new URLSearchParams();
            if (filters.keyword) params.append('keyword', filters.keyword);
            if (filters.category) params.append('category', filters.category);
            if (filters.city) params.append('city', filters.city);
            if (filters.pincode) params.append('pincode', filters.pincode);

            // Map sort options to backend sort parameters
            let sortParam = '';
            if (filters.sort === 'newest') sortParam = '-createdAt';
            else if (filters.sort === 'oldest') sortParam = 'createdAt';
            else if (filters.sort === 'salary-high') sortParam = '-salary';
            else if (filters.sort === 'salary-low') sortParam = 'salary';

            if (sortParam) params.append('sort', sortParam);

            const response = await fetch(`http://localhost:5000/api/v1/jobs?${params.toString()}`);
            if (!response.ok) {
                throw new Error('Failed to fetch jobs');
            }
            const data = await response.json();
            setJobs(data.jobs || []);
        } catch (err) {
            setError('Failed to load jobs. Please try again later.');
            console.error('Jobs fetch error:', err);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    // Initialize filters from URL parameters on component mount
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const keyword = urlParams.get('keyword') || '';
        const category = urlParams.get('category') || '';
        const city = urlParams.get('city') || '';

        setFilters(prev => ({
            ...prev,
            keyword,
            category,
            city
        }));
    }, []);

    useEffect(() => {
        fetchJobs();
    }, [fetchJobs]);

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handleResetFilters = () => {
        setFilters({ keyword: '', category: '', city: '', pincode: '', sort: 'newest' });
    };

    // --- Render Logic ---

    if (error) {
        return (
            <div className="container py-5 text-center">
                <h1 className="fw-bold mb-4">Job Listings</h1>
                <div className="alert alert-danger mx-auto" style={{ maxWidth: '600px' }}>
                    <i className="bi bi-x-circle-fill me-2"></i> {error}
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <h1 className="fw-bolder mb-2 text-center" style={{ color: INDIGO_COLOR }}>
                <i className="bi bi -search me-2"></i> Search India's Blue-Collar Jobs
            </h1>
            <p className="lead text-muted text-center mb-5">
                {jobs.length} Active Listings {loading ? '...' : 'Available'}
            </p>

            {/* --- Advanced Filter Bar --- */}
            <div className="bg-white p-4 shadow-lg rounded-4 mb-5">
                <form className="row g-3 align-items-end">

                    {/* Keyword Search */}
                    <div className="col-lg-4 col-md-6">
                        <label className="form-label small fw-semibold text-muted">Job Title or Keyword</label>
                        <input
                            type="text"
                            className="form-control rounded-pill"
                            placeholder="Plumber, Driver, Cleaner, etc."
                            name="keyword"
                            value={filters.keyword}
                            onChange={handleFilterChange}
                        />
                    </div>

                    {/* Category Filter (can be a select in a real app) */}
                    <div className="col-lg-2 col-md-6">
                        <label className="form-label small fw-semibold text-muted">Category</label>
                        <input
                            type="text"
                            className="form-control rounded-pill"
                            placeholder="Construction, Logistics, Retail"
                            name="category"
                            value={filters.category}
                            onChange={handleFilterChange}
                        />
                    </div>

                    {/* Location Filter */}
                    <div className="col-lg-2 col-md-6">
                        <label className="form-label small fw-semibold text-muted">City / Pincode</label>
                        <input
                            type="text"
                            className="form-control rounded-pill"
                            placeholder="Mumbai, 400001"
                            name="city"
                            value={filters.city}
                            onChange={handleFilterChange}
                        />
                    </div>

                    {/* Sort Filter */}
                    <div className="col-lg-2 col-md-6">
                        <label className="form-label small fw-semibold text-muted">Sort By</label>
                        <select
                            className="form-select rounded-pill"
                            name="sort"
                            value={filters.sort}
                            onChange={handleFilterChange}
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="salary-high">Salary: High to Low</option>
                            <option value="salary-low">Salary: Low to High</option>
                        </select>
                    </div>

                    {/* Action Buttons */}
                    <div className="col-lg-2 col-md-6 d-flex justify-content-end">
                        <button
                            type="button"
                            className="btn btn-outline-danger w-100 rounded-pill"
                            onClick={handleResetFilters}
                            disabled={loading}
                        >
                           <i className="bi bi-x-circle me-1"></i> Reset
                        </button>
                    </div>
                </form>
            </div>


            {/* --- Jobs List --- */}
            <div className="row g-4">
                {loading ? (
                    // Show 6 skeleton cards while loading
                    Array(6).fill(0).map((_, index) => <SkeletonCard key={index} />)
                ) : jobs.length > 0 ? (
                    jobs.map((job) => (
                        <JobCard
                            key={job._id}
                            job={job}
                            isExpanded={expandedJobs.has(job._id)}
                            onToggleExpand={() => toggleExpand(job._id)}
                            isApplied={isJobApplied(job._id)}
                            onApply={handleApply}
                            onUndoApply={handleUndoApply}
                            isLoggedIn={isLoggedIn}
                        />
                    ))
                ) : (
                    <div className="col-12 text-center py-5">
                        <i className="bi bi-box-seam-fill text-secondary display-4 mb-3"></i>
                        <h4 className="fw-semibold">No jobs found matching your criteria.</h4>
                        <p className="text-muted">Try adjusting your keywords or resetting the filters.</p>
                        <button className="btn btn-outline-secondary rounded-pill mt-3" onClick={handleResetFilters}>
                            Clear Search
                        </button>
                    </div>
                )}
            </div>

            {/* Custom CSS for Animations and Styling */}
            <style jsx="true">{`
                .animate-pulse { animation: pulse 1.5s infinite ease-in-out; }
                @keyframes pulse {
                    0% { opacity: 0.5; }
                    50% { opacity: 0.9; }
                    100% { opacity: 0.5; }
                }
                .bg-light-gray { background-color: #f2f2f2; }
                .transform-on-hover:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 1rem 3rem rgba(0,0,0,.175)!important;
                    transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
                }
                .transform-on-hover { transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out; }
                .form-control.rounded-pill { padding-left: 1.5rem; padding-right: 1.5rem; }
            `}</style>
        </div>
    );
};

export default Jobs;
