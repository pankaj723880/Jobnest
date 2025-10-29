import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import UserModal from '../components/UserModal';
import { useAuth } from '../context/AuthContext';
import './AdminDashboard.css';

const API_BASE_URL = "http://localhost:5000/api/v1";

const AdminUsers = () => {
    const navigate = useNavigate();
    const { user, token, isLoggedIn } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showUserModal, setShowUserModal] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const itemsPerPage = 10;

    useEffect(() => {
        if (!isLoggedIn || !user || user.role !== 'admin') {
            navigate('/login');
            return;
        }
    }, [isLoggedIn, user, navigate]);
    const fetchUsers = useCallback(async () => {
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
            
            let url = `${API_BASE_URL}/admin/users?page=${currentPage}&limit=${itemsPerPage}`;
            if (searchTerm) {
                url += `&search=${searchTerm}`;
            }
            const response = await fetch(url, { headers });
            const data = await response.json();
            if (response.ok) {
                setUsers(data.users || []);
                setTotalPages(data.pagination?.totalPages || 1);
            } else {
                setError(data.msg || 'Failed to fetch users');
            }
        } catch (err) {
            setError('Failed to fetch users');
            console.error('Failed to fetch users:', err);
        } finally {
            setLoading(false);
        }
    }, [currentPage, searchTerm, token, isLoggedIn, navigate]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleUserAction = async (action, userId, userData = null) => {
        try {
            setModalLoading(true);
            setError(null);
            
            if (!token || !isLoggedIn) {
                navigate('/login');
                throw new Error('You must be logged in to perform this action');
            }

            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };
            
            let response;
            let successMessage = '';

            switch (action) {
                case 'create':
                    response = await fetch(`${API_BASE_URL}/admin/users`, {
                        method: 'POST',
                        headers,
                        body: JSON.stringify(userData)
                    });
                    successMessage = 'User created successfully';
                    break;
                case 'update':
                    response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
                        method: 'PUT',
                        headers,
                        body: JSON.stringify(userData)
                    });
                    successMessage = 'User updated successfully';
                    break;
                case 'delete':
                    response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
                        method: 'DELETE',
                        headers
                    });
                    successMessage = 'User deleted successfully';
                    break;
                case 'block':
                case 'unblock':
                    response = await fetch(`${API_BASE_URL}/admin/users/${userId}/block`, {
                        method: 'PUT',
                        headers
                    });
                    successMessage = `User ${action === 'block' ? 'blocked' : 'unblocked'} successfully`;
                    break;
                default:
                    throw new Error(`Unknown action: ${action}`);
            }

            const data = await response.json();

            if (response.ok) {
                fetchUsers();
                setShowUserModal(false);
                setSelectedUser(null);
                setShowDeleteConfirm(false);
                setUserToDelete(null);
                alert(successMessage);
            } else {
                setError(data.msg || 'Action failed');
                alert(data.msg || 'Action failed');
            }
        } catch (err) {
            console.error('User action failed:', err);
            setError(err.message || 'Action failed');
            alert(err.message || 'Action failed. Please try again.');
        } finally {
            setModalLoading(false);
        }
    };

    const handleSaveUser = (userData) => {
        if (selectedUser) {
            handleUserAction('update', selectedUser._id, userData);
        } else {
            handleUserAction('create', null, userData);
        }
    };

    const handleDeleteClick = (user) => {
        setUserToDelete(user);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = () => {
        if (userToDelete) {
            handleUserAction('delete', userToDelete._id);
        }
    };

    // Remove client-side filtering since we're using server-side search
    // const filteredUsers = users.filter(user =>
    //     user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //     user.email.toLowerCase().includes(searchTerm.toLowerCase())
    // );

    // const paginateData = (data) => {
    //     const startIndex = (currentPage - 1) * itemsPerPage;
    //     return data.slice(startIndex, startIndex + itemsPerPage);
    // };

    return (
        <div className="admin-dashboard">
            <AdminSidebar />
            <div className="admin-content">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1 className="h3 mb-0">
                        <i className="bi bi-people me-2"></i>
                        User Management
                    </h1>
                    <div className="d-flex gap-2">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: '250px' }}
                        />
                        <button
                            className="btn btn-primary"
                            onClick={() => {
                                setSelectedUser(null);
                                setShowUserModal(true);
                            }}
                        >
                            <i className="bi bi-plus-lg me-1"></i>
                            Add User
                        </button>
                    </div>
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

                {!loading && !error && (
                    <div className="users-management">
                        <h2>User Management</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user._id}>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <div className="avatar-circle bg-primary text-white me-3">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="fw-semibold">{user.name}</div>
                                                    <small className="text-muted">ID: {user._id.slice(-6)}</small>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{user.email}</td>
                                        <td>
                                            <span className={`badge ${user.role === 'admin' ? 'bg-danger' : user.role === 'employer' ? 'bg-success' : 'bg-info'}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`badge ${user.isBlocked ? 'bg-danger' : 'bg-success'}`}>
                                                {user.isBlocked ? 'Blocked' : 'Active'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="btn-group" role="group">
                                                <button
                                                    className="btn btn-sm btn-outline-primary"
                                                    onClick={() => {
                                                        setSelectedUser(user);
                                                        setShowUserModal(true);
                                                    }}
                                                >
                                                    <i className="bi bi-pencil"></i>
                                                </button>
                                                <button
                                                    className={`btn btn-sm ${user.isBlocked ? 'btn-outline-success' : 'btn-outline-warning'}`}
                                                    onClick={() => handleUserAction(user.isBlocked ? 'unblock' : 'block', user._id)}
                                                >
                                                    <i className={`bi bi-${user.isBlocked ? 'unlock' : 'lock'}`}></i>
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => handleDeleteClick(user)}
                                                >
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="d-flex justify-content-end mt-3">
                            <nav>
                                <ul className="pagination">
                                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                        <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>
                                            Previous
                                        </button>
                                    </li>
                                    <li className="page-item disabled">
                                        <span className="page-link">Page {currentPage} of {totalPages}</span>
                                    </li>
                                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                        <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>
                                            Next
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                )}

                {/* User Modal */}
                <UserModal
                    isOpen={showUserModal}
                    onClose={() => {
                        setShowUserModal(false);
                        setSelectedUser(null);
                    }}
                    user={selectedUser}
                    onSave={handleSaveUser}
                    loading={modalLoading}
                />

                {/* Delete Confirmation Modal */}
                {showDeleteConfirm && (
                    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Confirm Delete</h5>
                                    <button type="button" className="btn-close" onClick={() => setShowDeleteConfirm(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <p>Are you sure you want to delete user <strong>{userToDelete?.name}</strong>?</p>
                                    <p className="text-danger">This action cannot be undone.</p>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteConfirm(false)}>
                                        Cancel
                                    </button>
                                    <button type="button" className="btn btn-danger" onClick={confirmDelete} disabled={modalLoading}>
                                        {modalLoading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                Deleting...
                                            </>
                                        ) : (
                                            'Delete User'
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminUsers;
