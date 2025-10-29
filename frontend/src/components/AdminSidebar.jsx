import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAdmin } from '../context/AdminContext';

const AdminSidebar = () => {
    const location = useLocation();
    const { logout } = useAuth();
    const { sidebarVisible, setSidebarVisible } = useAdmin();
    const [isOpen, setIsOpen] = useState(false);

    const menuItems = [
        {
            path: '/admin',
            icon: 'bi-house-door',
            label: 'Welcome'
        },
        {
            path: '/admin/users',
            icon: 'bi-people',
            label: 'User Management'
        },
        {
            path: '/admin/jobs',
            icon: 'bi-briefcase',
            label: 'Content Management'
        },
        {
            path: '/admin/reports',
            icon: 'bi-graph-up',
            label: 'Reports & Analytics'
        },
        {
            path: '/admin/settings',
            icon: 'bi-gear',
            label: 'Site Settings'
        },
        {
            path: '/admin/backup',
            icon: 'bi-database',
            label: 'Database Management'
        }
    ];

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            {/* Hamburger Menu Button */}
            <button
                className="btn btn-dark d-md-none position-fixed"
                style={{ top: '10px', left: '10px', zIndex: 1050 }}
                onClick={toggleSidebar}
            >
                <i className="bi bi-list"></i>
            </button>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="position-fixed w-100 h-100 bg-dark bg-opacity-50 d-md-none"
                    style={{ top: 0, left: 0, zIndex: 1040 }}
                    onClick={toggleSidebar}
                ></div>
            )}

            {/* Sidebar */}
            <div
                className={`bg-dark text-white vh-100 d-flex flex-column ${isOpen ? 'd-block' : 'd-none d-md-flex'}`}
                style={{
                    width: '250px',
                    position: 'fixed',
                    left: isOpen ? 0 : '-250px',
                    top: 0,
                    bottom: 0,
                    transition: 'left 0.3s ease',
                    zIndex: 1045
                }}
            >
                <div className="p-3 border-bottom border-secondary d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">
                        <i className="bi bi-shield-check me-2"></i>
                        Admin Panel
                    </h5>
                    <button
                        className="btn btn-sm btn-outline-light d-md-none"
                        onClick={toggleSidebar}
                    >
                        <i className="bi bi-x"></i>
                    </button>
                </div>

                <nav className="nav flex-column py-3 flex-grow-1">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`nav-link text-white px-3 py-2 mx-2 rounded ${
                                location.pathname === item.path ? 'bg-primary' : 'hover-bg-secondary'
                            }`}
                            style={{
                                transition: 'background-color 0.2s',
                                textDecoration: 'none'
                            }}
                            onMouseEnter={(e) => {
                                if (location.pathname !== item.path) {
                                    e.target.style.backgroundColor = '#495057';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (location.pathname !== item.path) {
                                    e.target.style.backgroundColor = 'transparent';
                                }
                            }}
                            onClick={() => {
                                setIsOpen(false);
                                setSidebarVisible(false);
                            }} // Close sidebar on mobile after clicking a link and hide it
                        >
                            <i className={`bi ${item.icon} me-2`}></i>
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </div>
        </>
    );
};

export default AdminSidebar;
