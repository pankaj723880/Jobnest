import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Create the Context
const AuthContext = createContext();

// Custom Hook to use the auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// Utility function to get the working API base URL
const getApiBaseUrl = async () => {
    const ports = [5000, 5001];
    const baseUrls = ports.map(port => `http://localhost:${port}/api/v1`);
    
    // Also try the environment variable URL if it exists
    if (process.env.REACT_APP_API_URL) {
        baseUrls.unshift(process.env.REACT_APP_API_URL);
    }

    for (const url of baseUrls) {
        try {
            const response = await fetch(`${url.replace('/api/v1', '')}/`);
            if (response.ok) {
                console.log('Connected to backend at:', url);
                return url;
            }
        } catch (err) {
            console.log(`Could not connect to ${url}:`, err.message);
        }
    }
    throw new Error('Could not connect to the backend server on any port');
};

// Base URL for the backend API - will be set after checking connection
let API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api/v1";

// Utility function to check if the server is reachable
const checkServerConnection = async () => {
    try {
        API_BASE_URL = await getApiBaseUrl();
        return true;
    } catch (error) {
        console.error('Server connection check failed:', error);
        return false;
    }
};



// 3. Auth Provider Component
export const AuthProvider = ({ children }) => {
    // Initialize state from local storage or session storage
    const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
    const [user, setUser] = useState(storedUser ? JSON.parse(storedUser) : null);
    const storedToken = localStorage.getItem('token') || sessionStorage.getItem('token');
    const [token, setToken] = useState(storedToken || null);
    const [isLoading, setIsLoading] = useState(false);
    const [isAppLoading, setIsAppLoading] = useState(true); // New state for initial app loading
    const [authError, setAuthError] = useState(null);
    const [appliedJobs, setAppliedJobs] = useState(JSON.parse(localStorage.getItem('appliedJobs') || '[]'));
    const [profilePhoto, setProfilePhoto] = useState(localStorage.getItem('profilePhoto') || '');
    const [resume, setResume] = useState(localStorage.getItem('resume') || '');
    const [notifications, setNotifications] = useState([]);
    const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);

    const isLoggedIn = !!user;

    // --- Utility: Logout Function (Wrapped in useCallback) ---
    const logout = useCallback(() => {
        setUser(null);
        setToken(null);
        setAuthError(null);
        setAppliedJobs([]);
        setProfilePhoto('');
        setResume('');
        setNotifications([]);
        setUnreadNotificationsCount(0);
        // Clear both storages on explicit logout
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('appliedJobs');
        localStorage.removeItem('profilePhoto');
        localStorage.removeItem('resume');
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('token');
        console.log("Logged out successfully.");
        // Optionally redirect user after logout here
        // e.g., navigate('/login');
    }, []);

    // --- Utility: Persist user state ---
    const persistUser = (userData, userToken, rememberMe) => {
        const storage = rememberMe ? localStorage : sessionStorage;
        // Clear the other storage to avoid conflicts
        (rememberMe ? sessionStorage : localStorage).removeItem('user');
        (rememberMe ? sessionStorage : localStorage).removeItem('token');

        storage.setItem('user', JSON.stringify(userData));
        storage.setItem('token', userToken);
    };

    // --- Utility: Token-Aware Fetch Wrapper (authFetch) ---
    const authFetch = useCallback(async (endpoint, options = {}) => {
        const defaultHeaders = {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }), // Include token if present
        };

        const config = {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers,
            },
        };

        try {
            const response = await fetch(`${API_BASE_URL}/${endpoint}`, config);

            // Check for unauthorized status and trigger logout
            if (response.status === 401) {
                console.error("Token expired or unauthorized. Logging out...");
                logout();
                throw new Error("Unauthorized access. Please log in again.");
            }

            // For non-2xx status codes, parse error message
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.msg || 'API Request Failed');
            }

            // Return response object for further handling (e.g., parsing JSON)
            return response;
        } catch (error) {
            console.error("Authenticated Fetch Error:", error.message);
            // Do not throw error here to prevent logout loop; handle in calling function
            throw error; // Re-throw the error for the calling component to handle
        }
    }, [token, logout]);


    // --- Core Authentication Handlers ---

    const handleAuthResponse = async (response) => {
        const data = await response.json();

        if (response.ok) {
            setAuthError(null);
            setUser(data.user);
            setToken(data.token);
            // The 'rememberMe' flag will be passed from the login function
            return data;
        } else {
            setAuthError(data.msg || "Authentication failed. Please check credentials.");
            return Promise.reject(data.msg);
        }
    };

    const handleRegisterResponse = async (response) => {
        const data = await response.json();

        if (response.ok) {
            setAuthError(null);
            // We don't set user/token here. Registration is separate from login.
            return data; // Return success data
        } else {
            // Handle backend validation errors (e.g., email already exists)
            const errorMessage = data.msg || "Registration failed. Please try again.";
            setAuthError(errorMessage);
            return Promise.reject(errorMessage);
        }
    };

    const login = async (email, password, role, rememberMe = false) => {
        setIsLoading(true);
        setAuthError(null);
        
        try {
            // Check if server is reachable first
            const isServerReachable = await checkServerConnection();
            if (!isServerReachable) {
                throw new Error('Unable to reach the server. Please check your internet connection and try again.');
            }

            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ email, password, role }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.msg || 'Login failed');
            }

            setUser(data.user);
            setToken(data.token);
            persistUser(data.user, data.token, rememberMe);
            setAppliedJobs([]); // Reset on new login
            setProfilePhoto(data.user.profilePhoto || '');
            setResume(data.user.resume || '');
            setUser(prev => ({ ...prev, city: data.user.city, pincode: data.user.pincode, skills: data.user.skills }));
            return data;
        } catch (error) {
            console.error('Login error:', error);
            setAuthError(error.message || 'Network error or server unreachable.');
            return Promise.reject(error);
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (name, email, phone, password, role) => {
        setIsLoading(true);
        setAuthError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, phone, password, role }),
            });
            return await handleRegisterResponse(response); // Use the new handler
        } catch (error) {
            console.error("Register API Error:", error);
            setAuthError("Network error or server unreachable.");
        } finally {
            setIsLoading(false);
        }
    };

    const forgotPassword = async (email) => {
        setIsLoading(true);
        setAuthError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.msg || 'Server error');
            return data;
        } catch (error) {
            setAuthError(error.message);
            return Promise.reject(error);
        } finally {
            setIsLoading(false);
        }
    };

    const resetPassword = async (token, password) => {
        setIsLoading(true);
        setAuthError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/auth/reset-password/${token}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.msg || 'Server error');
            return data;
        } catch (error) {
            setAuthError(error.message);
            return Promise.reject(error);
        } finally {
            setIsLoading(false);
        }
    };
    
    // --- Effect: Initial Auth Check on Mount ---
    // Check server connection and set API_BASE_URL
    const checkAuthStatus = useCallback(async () => {
        await checkServerConnection();
        setIsAppLoading(false);
    }, []);

    // This useEffect should only run ONCE on initial app load.
    useEffect(() => {
        checkAuthStatus();
    }, [checkAuthStatus]);

    // Persist appliedJobs, profilePhoto, resume to localStorage when changed
    useEffect(() => {
        if (user) {
            localStorage.setItem('appliedJobs', JSON.stringify(appliedJobs));
            localStorage.setItem('profilePhoto', profilePhoto || '');
            localStorage.setItem('resume', resume || '');
        }
    }, [appliedJobs, profilePhoto, resume, user]);

    // Apply to job function (now uses API)
    const applyJob = async (jobId, jobData, coverLetter = '') => {
        if (!isLoggedIn || !user) {
            setAuthError('Please log in to apply for jobs.');
            return false;
        }

        try {
            const response = await authFetch('applications', {
                method: 'POST',
                body: JSON.stringify({ jobId, coverLetter }),
            });

            const data = await response.json();

            if (response.ok) {
                // Update local state with the new application
                setAppliedJobs(prev => [...prev, data.application]);
                setUser(prev => ({ ...prev, appliedJobs: [...(prev.appliedJobs || []), data.application] }));
                return true;
            } else {
                setAuthError(data.msg || 'Failed to apply for job.');
                return false;
            }
        } catch (error) {
            setAuthError(error.message);
            return false;
        }
    };

    // Undo apply function (now uses API)
    const undoApply = async (applicationId) => {
        if (!user || !token) {
            setAuthError('Please log in to withdraw application.');
            return false;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/applications/${applicationId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (response.ok) {
                setAppliedJobs(prev => prev.filter(app => app._id !== applicationId));
                setUser(prev => ({
                    ...prev,
                    appliedJobs: (prev.appliedJobs || []).filter(app => app._id !== applicationId)
                }));
                return true;
            }

            setAuthError(data.msg || 'Failed to withdraw application');
            return false;
        } catch (error) {
            console.error('Error withdrawing application:', error);
            setAuthError('Network error while withdrawing application');
            return false;
        }
    };

    // Get user's applications
    const getApplications = useCallback(async () => {
        if (!isLoggedIn || !user) {
            return [];
        }

        try {
            const response = await authFetch('applications');
            const data = await response.json();
            setAppliedJobs(data.applications);
            return data.applications;
        } catch (error) {
            setAuthError(error.message);
            return [];
        }
    }, [isLoggedIn, user, authFetch]);

    // Update profile information
    const updateProfile = async (profileData) => {
        if (!isLoggedIn || !user) {
            setAuthError('Please log in to update profile.');
            return false;
        }

        try {
            const response = await authFetch('user/profile', {
                method: 'PUT',
                body: JSON.stringify(profileData),
            });

            const data = await response.json();
            setUser(data.user);
            return true;
        } catch (error) {
            setAuthError(error.message);
            return false;
        }
    };

    // Update profile photo (now uses API)
    const updateProfilePhoto = async (photoFile) => {
        if (!isLoggedIn || !user) {
            setAuthError('Please log in to upload photo.');
            return false;
        }

        const formData = new FormData();
        formData.append('photo', photoFile);

        try {
            const response = await fetch(`${API_BASE_URL}/user/upload-photo`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.msg || 'Upload failed');
            }

            setProfilePhoto(data.user.profilePhoto);
            setUser(prev => ({ ...prev, profilePhoto: data.user.profilePhoto }));
            return true;
        } catch (error) {
            setAuthError(error.message);
            return false;
        }
    };

    // Update resume (now uses API)
    const updateResume = async (resumeFile) => {
        if (!isLoggedIn || !user) {
            setAuthError('Please log in to upload resume.');
            return false;
        }

        const formData = new FormData();
        formData.append('resume', resumeFile);

        try {
            const response = await fetch(`${API_BASE_URL}/user/upload-resume`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.msg || 'Upload failed');
            }

            setResume(data.user.resume);
            setUser(prev => ({ ...prev, resume: data.user.resume }));
            return true;
        } catch (error) {
            setAuthError(error.message);
            return false;
        }
    };

    // Get user's notifications
    const getNotifications = useCallback(async () => {
        if (!isLoggedIn || !user) {
            return [];
        }

        try {
            const response = await authFetch('notifications');
            const data = await response.json();
            setNotifications(data.notifications);
            setUnreadNotificationsCount(data.unreadCount);
            return data.notifications;
        } catch (error) {
            setAuthError(error.message);
            return [];
        }
    }, [isLoggedIn, user, authFetch]);

    // Mark notification as read
    const markNotificationRead = async (notificationId) => {
        if (!isLoggedIn || !user) {
            return false;
        }

        try {
            const response = await authFetch(`notifications/${notificationId}/read`, {
                method: 'PUT',
            });

            const data = await response.json();

            if (response.ok) {
                // Update local state
                setNotifications(prev =>
                    prev.map(notif =>
                        notif._id === notificationId ? { ...notif, isRead: true } : notif
                    )
                );
                setUnreadNotificationsCount(prev => Math.max(0, prev - 1));
                return true;
            } else {
                setAuthError(data.msg || 'Failed to mark notification as read.');
                return false;
            }
        } catch (error) {
            setAuthError(error.message);
            return false;
        }
    };

    // Mark all notifications as read
    const markAllNotificationsRead = async () => {
        if (!isLoggedIn || !user) {
            return false;
        }

        try {
            const response = await authFetch('notifications/mark-all-read', {
                method: 'PUT',
            });

            if (response.ok) {
                // Update local state
                setNotifications(prev =>
                    prev.map(notif => ({ ...notif, isRead: true }))
                );
                setUnreadNotificationsCount(0);
                return true;
            } else {
                const data = await response.json();
                setAuthError(data.msg || 'Failed to mark all notifications as read.');
                return false;
            }
        } catch (error) {
            setAuthError(error.message);
            return false;
        }
    };

    // Context Value
    // Create the context value object with all the functions and state
    const value = {
        user,
        token,
        isLoading,
        isAppLoading,
        authError,
        isLoggedIn: !!user,
        appliedJobs,
        profilePhoto,
        resume,
        notifications,
        unreadNotificationsCount,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
        authFetch,
        applyJob,
        undoApply,
        getApplications,
        updateProfile,
        updateProfilePhoto,
        updateResume,
        getNotifications,
        markNotificationRead,
        markAllNotificationsRead,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Export the AuthProvider and useAuth hook
