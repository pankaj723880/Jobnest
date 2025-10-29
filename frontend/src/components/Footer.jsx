import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    // Define the colors to match Tailwind CSS (Bootstrap context)
    const darkBg = { backgroundColor: '#1f2937' }; // Gray 800
    const indigoColor = { color: '#818cf8' }; // Indigo 400
    const grayText = { color: '#9ca3af' }; // Gray 400
    const lightGrayHover = { transition: 'color 0.3s ease', cursor: 'pointer' };

    return (
        <footer className="text-white pt-5 pb-3" style={darkBg} aria-labelledby="footer-heading">
            <h2 id="footer-heading" className="visually-hidden">Site Footer Navigation and Information</h2>
            <div className="container">
                <div className="row g-5 border-bottom border-secondary-subtle pb-4 mb-4">
                    
                    {/* Column 1: Logo, Mission, and Socials */}
                    <div className="col-lg-4 col-md-6">
                        <h4 className="fs-3 fw-bolder mb-3 d-flex align-items-center" style={indigoColor}>
                            <i className="bi bi-briefcase-fill me-2"></i> Jobnest
                        </h4>
                        <p className="small pe-lg-5" style={grayText}>
                            Connecting India's workforce to local jobs. Your next opportunity awaits!
                            We are committed to simplifying your job search and hiring process.
                        </p>
                        
                        <h6 className="text-uppercase small mt-4 mb-3" style={indigoColor}>Connect With Us</h6>
                        <div className="d-flex gap-4 fs-5">
                            {/* Adding hover effect class for better UX */}
                            <a href="https://www.facebook.com" aria-label="Jobnest on Facebook" className="text-white hover-light" style={{...grayText, ...lightGrayHover}}><i className="bi bi-facebook"></i></a>
                            <a href="https://www.twitter.com" aria-label="Jobnest on Twitter" className="text-white hover-light" style={{...grayText, ...lightGrayHover}}><i className="bi bi-twitter"></i></a>
                            <a href="https://www.linkedin.com" aria-label="Jobnest on LinkedIn" className="text-white hover-light" style={{...grayText, ...lightGrayHover}}><i className="bi bi-linkedin"></i></a>
                            <a href="https://www.instagram.com" aria-label="Jobnest on Instagram" className="text-white hover-light" style={{...grayText, ...lightGrayHover}}><i className="bi bi-instagram"></i></a>
                        </div>
                    </div>

                    {/* Column 2: Quick Links (Reorganized for better flow) */}
                    <div className="col-lg-2 col-md-3 col-6">
                        <h5 className="fs-6 fw-bold mb-3 text-uppercase" style={indigoColor}>Job Seekers</h5>
                        <ul className="list-unstyled small mb-0 d-flex flex-column gap-2">
                            <li><Link to="/jobs" className="text-decoration-none hover-light" style={{...grayText, ...lightGrayHover}}>Search Jobs</Link></li>
                            <li><Link to="/profile" className="text-decoration-none hover-light" style={{...grayText, ...lightGrayHover}}>Create Resume</Link></li>
                            <li><Link to="/salaries" className="text-decoration-none hover-light" style={{...grayText, ...lightGrayHover}}>Salary Tools</Link></li>
                            <li><Link to="/articles" className="text-decoration-none hover-light" style={{...grayText, ...lightGrayHover}}>Career Advice</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Job Providers */}
                    <div className="col-lg-2 col-md-3 col-6">
                        <h5 className="fs-6 fw-bold mb-3 text-uppercase" style={indigoColor}>Employers</h5>
                        <ul className="list-unstyled small mb-0 d-flex flex-column gap-2">
                            <li><Link to="/employer/post-job" className="text-decoration-none hover-light" style={{...grayText, ...lightGrayHover}}>Post a Job Now</Link></li>
                            <li><Link to="/employer/dashboard" className="text-decoration-none hover-light" style={{...grayText, ...lightGrayHover}}>Employer Dashboard</Link></li>
                            <li><a href="/pricing" className="text-decoration-none hover-light" style={{...grayText, ...lightGrayHover}}>Pricing Plans</a></li>
                            <li><a href="/faq" className="text-decoration-none hover-light" style={{...grayText, ...lightGrayHover}}>Hiring FAQ</a></li>
                        </ul>
                    </div>

                    {/* Column 4: Company & Contact */}
                    <div className="col-lg-4 col-md-6">
                        <h5 className="fs-6 fw-bold mb-3 text-uppercase" style={indigoColor}>Company & Support</h5>
                        <ul className="list-unstyled small mb-3 d-flex flex-column gap-2">
                            <li><Link to="/about" className="text-decoration-none hover-light" style={{...grayText, ...lightGrayHover}}><i className="bi bi-info-circle-fill me-2"></i> About Us</Link></li>
                            <li><Link to="/contact" className="text-decoration-none hover-light" style={{...grayText, ...lightGrayHover}}><i className="bi bi-headset me-2"></i> Contact Support</Link></li>
                            <li><Link to="/privacy" className="text-decoration-none hover-light" style={{...grayText, ...lightGrayHover}}><i className="bi bi-shield-fill me-2"></i> Privacy Policy</Link></li>
                            <li><Link to="/terms" className="text-decoration-none hover-light" style={{...grayText, ...lightGrayHover}}><i className="bi bi-file-earmark-text-fill me-2"></i> Terms of Service</Link></li>
                        </ul>
                        
                        {/* New: Contact Info Block */}
                        <div className="small mt-4">
                            <p className="mb-1 fw-semibold text-white">Call Us:</p>
                            <a href="tel:+911234567890" className="d-block text-decoration-none" style={{...indigoColor, fontSize: '1.1rem'}}>(+91) 123-456-7890</a>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="text-center pt-3 border-top-0">
                    <p className="mb-0 small" style={{ color: '#6b7280' }}>
                        &copy; {new Date().getFullYear()} Jobnest. All rights reserved. | Made with <i className="bi bi-heart-fill text-danger mx-1"></i> in India.
                    </p>
                </div>
            </div>
            
            {/* Custom Style for Hover Effect */}
            <style jsx="true">{`
                .hover-light:hover {
                    color: white !important; /* Change text to white on hover */
                }
                .border-secondary-subtle {
                    border-color: rgba(255, 255, 255, 0.1) !important; /* A subtle white line for dark mode */
                }
            `}</style>
        </footer>
    );
};

export default Footer;