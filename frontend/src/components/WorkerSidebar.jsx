import React from 'react';
import { Link } from 'react-router-dom';

const WorkerSidebar = ({ userId, logout }) => {
  // Define the custom colors for the application theme
  const WORKER_GREEN = '#16a34a'; // Tailwind Green-600

  const navItems = [
    { name: 'Dashboard', path: '/worker/dashboard', icon: 'Dashboard', description: 'Quick stats and latest alerts' },
    { name: 'Browse Jobs', path: '/jobs', icon: 'Jobs', description: 'Explore new opportunities' },
    { name: 'My Applications', path: '/worker/applications', icon: 'Applications', description: 'Track status of your applications' },
    { name: 'My Profile', path: '/worker/profile', icon: 'Profile', description: 'Update skills and personal details' },
    { name: 'Verification Docs', path: '/worker/documents', icon: 'Documents', description: 'Upload ID and proof of work' },
  ];
  
  // --- Icon Components (using Lucide-React equivalent SVGs) ---

  const Icon = ({ name, className = "w-4 h-4", color = "currentColor" }) => {
    const icons = {
      Dashboard: <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/></svg>,
      Jobs: <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/></svg>,
      Applications: <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>,
      Profile: <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
      Documents: <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>,
    };
    return icons[name] || icons.Dashboard;
  };

  return (
    <div className="card h-100 border-0 shadow-sm rounded-4">
      <div className="card-body p-4">
        <div className="text-center mb-4 pb-3 border-bottom">
          <h5 className="fw-bold mb-2" style={{ color: WORKER_GREEN }}>Jobnest Portal 💼</h5>
          <small className="text-muted">Worker ID: <span className="fw-semibold text-dark">{userId || 'N/A'}</span></small>
        </div>

        <ul className="list-unstyled mb-4">
          {navItems.map((item) => (
            <li key={item.name} className="mb-3">
              <Link
                to={item.path}
                className="d-flex align-items-center p-3 rounded-3 text-decoration-none text-dark bg-light hover:bg-success-subtle"
                style={{ transition: 'all 0.2s' }}
              >
                <Icon name={item.icon} className="me-3" style={{ width: '20px', height: '20px', color: WORKER_GREEN }} />
                <div>
                  <div className="fw-semibold">{item.name}</div>
                  <small className="text-muted d-block">{item.description}</small>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        <div className="border-top pt-3">
          <button onClick={logout} className="btn btn-outline-danger w-100 rounded-pill py-2 fw-semibold">
            <svg xmlns="http://www.w3.org/2000/svg" className="me-2" style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkerSidebar;
