import React, { useState } from 'react';

const PostTestimonial = ({ onAddTestimonial }) => {
    // Define the purple color to match the index.html logic's 'bg-purple-600'
    const purpleColor = '#9333ea'; // Tailwind purple-600
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [rating, setRating] = useState(5);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Construct the testimonial data object
        const testimonialData = {
            name,
            role,
            rating,
            message,
            date: new Date().toISOString().slice(0, 10),
            location: '', // Add location if needed
            icon: 'bi-person-fill', // Default icon
        };

        console.log('Testimonial Submitted:', testimonialData);

        try {
            const response = await fetch('http://localhost:5000/api/v1/testimonials', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(testimonialData),
            });

            if (response.ok) {
                const savedTestimonial = await response.json();
                alert('Testimonial submitted successfully! Thank you.');
                // Call the callback to update the parent component
                if (onAddTestimonial) {
                    onAddTestimonial(savedTestimonial.testimonial);
                }
            } else {
                alert('Failed to submit testimonial. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting testimonial:', error);
            alert('Failed to submit testimonial. Please check your connection.');
        }

        // Reset form
        setName('');
        setRole('');
        setRating(5);
        setMessage('');
    };

    // --- Rating Component ---
    const StarRating = ({ currentRating, setRating }) => {
        const stars = [1, 2, 3, 4, 5];
        return (
            <div className="d-flex justify-content-center" style={{ fontSize: '1.8rem' }}>
                {stars.map((star) => (
                    <span
                        key={star}
                        onClick={() => setRating(star)}
                        className={`cursor-pointer me-1 transition-color ${star <= currentRating ? 'text-warning' : 'text-secondary'}`}
                        style={{ cursor: 'pointer', transition: 'color 0.2s ease-in-out' }}
                        aria-label={`${star} star rating`}
                    >
                        <i className={star <= currentRating ? "bi bi-star-fill" : "bi bi-star"}></i>
                    </span>
                ))}
            </div>
        );
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-7">
                    <div className="text-center mb-5">
                        <i className="bi bi-chat-heart-fill display-3 mb-2" style={{ color: purpleColor }}></i>
                        <h2 className="fw-bolder text-dark mb-2">Share Your Success Story!</h2>
                        <p className="lead text-muted">We love hearing how Jobnest helped you find your dream job or the perfect candidate.</p>
                    </div>

                    <div className="card p-5 shadow-xl border-0 rounded-5">
                        <form onSubmit={handleSubmit}>
                            {/* 1. Star Rating */}
                            <div className="mb-4 text-center">
                                <label className="form-label fw-semibold text-dark">Your Experience Rating:</label>
                                <StarRating currentRating={rating} setRating={setRating} />
                            </div>
                            
                            {/* 2. User Details */}
                            <div className="row mb-3">
                                <div className="col-md-6 mb-3 mb-md-0">
                                    <input 
                                        type="text" 
                                        className="form-control form-control-lg rounded-pill" 
                                        placeholder="Your Full Name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="col-md-6">
                                    <input 
                                        type="text" 
                                        className="form-control form-control-lg rounded-pill" 
                                        placeholder="Your Role/Title (e.g., Senior Developer)"
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            
                            {/* 3. Testimonial Message */}
                            <div className="mb-4">
                                <textarea 
                                    className="form-control" 
                                    rows="5" 
                                    placeholder="Tell us your story: What were you looking for, and how did Jobnest deliver? (Min. 50 characters)"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    minLength="50"
                                    required
                                ></textarea>
                                <div className="form-text text-end">
                                    {message.length} / 50 characters minimum
                                </div>
                            </div>
                            
                            {/* 4. Submission Button */}
                            <div className="text-center mt-4">
                                <button 
                                    className="btn btn-lg text-white rounded-pill w-75 fw-bold shadow-lg" 
                                    type="submit"
                                    style={{ backgroundColor: purpleColor, borderColor: purpleColor, transition: 'background-color 0.3s' }}
                                >
                                    <i className="bi bi-send-fill me-2"></i> Submit My Testimonial
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            {/* Custom CSS for a better shadow and hover effect */}
            <style jsx="true">{`
                .shadow-xl {
                    box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.175) !important;
                }
                .cursor-pointer {
                    cursor: pointer;
                }
                .btn:hover {
                    background-color: #a855f7 !important; /* Lighter purple on hover */
                    border-color: #a855f7 !important;
                }
            `}</style>
        </div>
    );
};

export default PostTestimonial;