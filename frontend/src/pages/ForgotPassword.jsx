import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const INDIGO_COLOR = '#4f46e5';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const { forgotPassword, isLoading } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            const data = await forgotPassword(email);
            setMessage(data.msg);
        } catch (err) {
            setError(err.message || 'Failed to send reset link. Please try again.');
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-5">
                    <div className="card shadow-lg border-0 rounded-4">
                        <div className="card-header text-white text-center rounded-top-4 py-3" style={{ backgroundColor: INDIGO_COLOR }}>
                            <h2 className="mb-0 fw-bold">Forgot Password</h2>
                            <p className="mb-0 small">We'll send a reset link to your email.</p>
                        </div>
                        <div className="card-body p-4">
                            {message && <div className="alert alert-success">{message}</div>}
                            {error && <div className="alert alert-danger">{error}</div>}
                            
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label htmlFor="email" className="form-label">Email address</label>
                                    <input
                                        type="email"
                                        className="form-control rounded-pill"
                                        id="email"
                                        placeholder="Enter your registered email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="btn w-100 py-2 fw-bold rounded-pill text-white"
                                    disabled={isLoading}
                                    style={{ backgroundColor: INDIGO_COLOR }}
                                >
                                    {isLoading ? 'Sending...' : 'Send Reset Link'}
                                </button>
                            </form>
                        </div>
                        <div className="card-footer text-center bg-light rounded-bottom-4 p-3">
                            <p className="mb-0 small">
                                Remember your password? <Link to="/login" className="fw-bold" style={{ color: INDIGO_COLOR }}>Login Here</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;