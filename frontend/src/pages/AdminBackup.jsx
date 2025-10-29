 import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import { useAuth } from '../context/AuthContext';
import './AdminDashboard.css';

const AdminBackup = () => {
    const navigate = useNavigate();
    const { user, token, isLoggedIn } = useAuth();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!isLoggedIn || !user || user.role !== 'admin') {
            navigate('/login');
            return;
        }
    }, [isLoggedIn, user, navigate]);

    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
    
    const handleCreateBackup = async () => {
        if (!token) {
            setMessage('You must be logged in to create a backup');
            return;
        }
        
        setLoading(true);
        setMessage('');
        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/admin/backup`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                // Create a blob from the response and trigger download
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `backup-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
                setMessage('Backup downloaded successfully!');
            } else {
                const errorData = await response.json();
                setMessage(errorData.msg || 'Failed to create backup');
            }
        } catch (err) {
            console.error('Backup failed:', err);
            setMessage('Network error occurred while creating backup. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-dashboard">
            <AdminSidebar />
            <div className="admin-content">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1 className="h3 mb-0">
                        <i className="bi bi-database me-2"></i>
                        Database Management
                    </h1>
                </div>

                <div className="backup-management">
                    <h2>Database Backup</h2>

                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Create Database Backup</h5>
                            <p className="card-text">
                                Create a backup of the current database state. This will export all users, jobs, applications, and contacts to a JSON file.
                            </p>
                            <button
                                className="btn btn-primary"
                                onClick={handleCreateBackup}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Creating Backup...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-download me-1"></i>
                                        Create Backup
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {message && (
                        <div className={`alert mt-3 ${message.includes('successfully') ? 'alert-success' : 'alert-danger'}`} role="alert">
                            {message}
                        </div>
                    )}

                    <div className="card mt-4">
                        <div className="card-body">
                            <h5 className="card-title">Backup Information</h5>
                            <ul className="list-unstyled">
                                <li><strong>Format:</strong> JSON</li>
                                <li><strong>Includes:</strong> Users, Jobs, Applications, Contacts, Notifications</li>
                                <li><strong>Timestamp:</strong> Current date and time</li>
                                <li><strong>Download:</strong> File will be automatically downloaded to your device</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminBackup;
