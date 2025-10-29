import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationDropdown from './NotificationDropdown';
import ContactForm from './ContactForm';

const Header = () => {
    // Top Marquee text
    const [liveUpdateText] = useState("🔥 New jobs posted hourly! 10,000+ opportunities for job seekers and fast hiring for employers. Your next opportunity starts here.");

    // Contact form modal state
    const [showContactForm, setShowContactForm] = useState(false);

    // Use real authentication state
    const { user, isLoggedIn, logout, profilePhoto, appliedJobs } = useAuth();
    const isAuthenticated = isLoggedIn;
    const isJobSeeker = user?.role === 'worker';
    const isJobProvider = user?.role === 'employer';
    const isAdmin = user?.role === 'admin';

    // Custom Tailwind-to-Bootstrap styles
    const indigo600 = { color: '#4f46e5' };
    const amber500Bg = { backgroundColor: '#f59e0b', color: '#fff' };

    // Determine the main Call-to-Action button based on the user's state
    const PrimaryCta = () => {
        const location = useLocation();

        if (isAuthenticated) {
            // Logged in: Show Profile/Dashboard link or Logout button
            let profilePath = isJobSeeker ? '/worker/profile' : isAdmin ? '/admin/dashboard' : '/profile';
            let profileLabel = isJobSeeker ? 'My Profile' : isAdmin ? 'Admin Dashboard' : 'Profile';

            const profileImgSrc = profilePhoto && !profilePhoto.startsWith('http') ? `http://localhost:5000/uploads/${profilePhoto}` : profilePhoto;

            return (
                <>
                    {!isAdmin && !isJobProvider && (
                        <li className="nav-item d-lg-none">
                            <NavLink className="nav-link mx-2 text-primary fw-bold" to={profilePath}>{profileLabel}</NavLink>
                        </li>
                    )}
                    {!isAdmin && !isJobProvider && (
                        <li className="nav-item ms-lg-3">
                            <Link to={profilePath} className="btn btn-outline-primary d-none d-lg-block rounded-pill me-2 px-4 fw-bold d-flex align-items-center">
                                {profilePhoto ? (
                                    <img
                                        src={profileImgSrc}
                                        alt="Profile"
                                        className="rounded-circle me-2"
                                        style={{ width: '30px', height: '30px', objectFit: 'cover' }}
                                        onError={(e) => {
                                            console.error('Profile image failed to load:', profileImgSrc);
                                            e.target.style.display = 'none';
                                        }}
                                    />
                                ) : (
                                    <i className="bi bi-person-circle me-2"></i>
                                )}
                                {profileLabel}
                            </Link>
                        </li>
                    )}
                    <li className="nav-item">
                        <button
                            onClick={logout}
                            className="btn btn-danger btn-sm rounded-pill px-4"
                        >
                            <i className="bi bi-box-arrow-right"></i> Logout
                        </button>
                    </li>
                </>
            );
        }

        // Not logged in: Show dual CTAs (Login and Post Job)
        return (
            <>
                {/* Secondary CTA (Post Job for Employers) - Prominent only on desktop, hidden on login page and home page */}
                {location.pathname !== '/login' && location.pathname !== '/' && (
                    <li className="nav-item me-2 d-none d-lg-block">
                        <Link to="/employer/post-job" className="btn btn-outline-dark rounded-pill px-3 fw-semibold">
                             <i className="bi bi-building me-2"></i> For Employers
                        </Link>
                    </li>
                )}
                {/* Primary CTA (Login/Sign Up) */}
                <li className="nav-item ms-lg-2">
                    <Link to="/login" className="btn btn-primary rounded-pill px-4 fw-semibold" style={{ backgroundColor: indigo600.color, borderColor: indigo600.color }}>
                        <i className="bi bi-person-fill me-1"></i> Login / Sign Up
                    </Link>
                </li>
            </>
        );
    };

    return (
        <>
            {/* --- Top Live Updates Banner --- */}
            <div 
                className="position-fixed top-0 start-0 w-100 py-2 small fw-semibold" 
                style={{ zIndex: 1050, ...amber500Bg }}
            >
                <div className="d-flex align-items-center container-fluid container-lg">
                    <span className="badge bg-dark rounded-pill me-2 py-1 px-2">
                        <i className="bi bi-bullhorn"></i> Live
                    </span>
                    {/* Replaced <marquee> with a CSS-based animation for smoother performance and modern compatibility */}
                    <div className="text-scroll-container">
                        <p className="text-scroll-content mb-0">{liveUpdateText}</p>
                    </div>
                </div>
            </div>
            
            {/* --- Main Navigation Bar --- */}
            {/* The main navbar is fixed-top and has margin-top to clear the banner */}
            <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top" 
                style={{ zIndex: 1040, marginTop: '38px', paddingBlock: '0.9rem' }}>
                <div className="container-fluid container-lg">
                    <Link className="navbar-brand fw-bolder fs-4" to="/" style={indigo600}>
                        <i className="bi bi-briefcase-fill me-2"></i><span className="text-dark">Job</span>nest
                    </Link>
                    
                    <button className="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <i className="bi bi-list fs-3" style={indigo600}></i>
                    </button>
                    
                    <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                        <ul className="navbar-nav align-items-center me-lg-4">
                            {/* General Nav Links */}
                            {!isAdmin && (
                                <>
                                    <li className="nav-item">
                                        <NavLink className="nav-link mx-2 fw-semibold nav-link-custom" to="/">Home</NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink className="nav-link mx-2 fw-semibold nav-link-custom" to="/jobs">Find Jobs</NavLink>
                                    </li>
                                </>
                            )}
                            {isJobSeeker && (
                                <li className="nav-item dropdown">
                                    <button className="nav-link mx-2 fw-semibold nav-link-custom dropdown-toggle border-0 bg-transparent" id="applicationsDropdown" data-bs-toggle="dropdown" aria-expanded="false" type="button">
                                        My Applications
                                        {appliedJobs.length > 0 && (
                                            <span className="badge bg-danger ms-1" style={{ fontSize: '0.7em' }}>
                                                {appliedJobs.length}
                                            </span>
                                        )}
                                    </button>
                                    <ul className="dropdown-menu" aria-labelledby="applicationsDropdown">
                                        {appliedJobs.length > 0 ? (
                                            <>
                                                {appliedJobs.slice(0, 5).map((app, index) => (
                                                    <li key={index}>
                                                        <Link className="dropdown-item" to="/worker/applications">
                                                            <strong>{app.job.title}</strong> - {app.job.city}
                                                        </Link>
                                                    </li>
                                                ))}
                                                {appliedJobs.length > 5 && (
                                                    <li><hr className="dropdown-divider" /></li>
                                                )}
                                                <li>
                                                    <Link className="dropdown-item fw-bold" to="/worker/applications">
                                                        View All Applications ({appliedJobs.length})
                                                    </Link>
                                                </li>
                                            </>
                                        ) : (
                                            <li>
                                                <span className="dropdown-item text-muted">No applications yet</span>
                                            </li>
                                        )}
                                    </ul>
                                </li>
                            )}
                            {isJobProvider && (
                                <li className="nav-item">
                                    <NavLink className="nav-link mx-2 fw-semibold nav-link-custom" to="/employer/dashboard">Employer Center</NavLink>
                                </li>
                            )}
                            {isAdmin && (
                                <>
                                    <li className="nav-item">
                                        <NavLink className="nav-link mx-2 fw-semibold nav-link-custom" to="/admin">Welcome</NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink className="nav-link mx-2 fw-semibold nav-link-custom" to="/admin/users">Dashboard</NavLink>
                                    </li>
                                </>
                            )}
                            <li className="nav-item">
                                <NavLink className="nav-link mx-2 fw-semibold nav-link-custom" to="/about">About Us</NavLink>
                            </li>
                            <li className="nav-item">
                                <button
                                    className="btn btn-link nav-link mx-2 fw-semibold nav-link-custom"
                                    onClick={() => setShowContactForm(true)}
                                    style={{ textDecoration: 'none', color: '#333' }}
                                >
                                    <i className="bi bi-envelope me-1"></i>Contact Us
                                </button>
                            </li>

                            {/* Authentication and CTA Buttons */}
                            {isAuthenticated && <NotificationDropdown />}
                            <PrimaryCta />
                        </ul>
                    </div>
                </div>
            </nav>

            {/* --- Custom CSS for Animation and Styling --- */}
            <style jsx="true">{`
                .nav-link-custom {
                    color: #333 !important; /* Dark text for better contrast */
                    padding: 0.5rem 1rem;
                    position: relative;
                }
                .nav-link-custom:hover {
                    color: ${indigo600.color} !important;
                }
                .nav-link.active.nav-link-custom {
                    color: ${indigo600.color} !important;
                    border-bottom: 3px solid ${indigo600.color}; /* Highlight active link with underline */
                    padding-bottom: 0.35rem; /* Adjust padding to make room for the border */
                }
                
                /* Custom CSS for Marquee replacement */
                .text-scroll-container {
                    overflow: hidden;
                    white-space: nowrap;
                    flex: 1;
                    min-width: 0;
                    margin-left: 0.5rem;
                }
                .text-scroll-content {
                    display: inline-block;
                    animation: marquee 15s linear infinite;
                }
                @keyframes marquee {
                    0% { transform: translate(100%, 0); }
                    100% { transform: translate(-100%, 0); }
                }

                @media (max-width: 991.98px) {
                    .nav-link.active.nav-link-custom {
                        border-left: 4px solid ${indigo600.color};
                        border-bottom: none;
                        padding-left: 0.8rem;
                        background-color: #f8f9fa; /* Light background for mobile active state */
                    }
                }
            `}</style>

            {/* Contact Form Modal */}
            <ContactForm show={showContactForm} handleClose={() => setShowContactForm(false)} />
        </>
    );
};

export default Header;
