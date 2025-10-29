import React, { useState } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';

const ContactForm = ({ show, handleClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await axios.post('http://localhost:5000/api/v1/contacts', formData);
            setSuccess('Your message has been sent successfully! We will get back to you soon.');
            setFormData({
                name: '',
                email: '',
                subject: '',
                message: ''
            });
            // Close modal after 2 seconds
            setTimeout(() => {
                handleClose();
                setSuccess('');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.msg || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Contact Us</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Name *</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Enter your full name"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Email *</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="Enter your email address"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Subject *</Form.Label>
                        <Form.Control
                            type="text"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                            placeholder="What's this about?"
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Message *</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={4}
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                            placeholder="Tell us how we can help you..."
                        />
                    </Form.Group>

                    <div className="d-flex justify-content-end gap-2">
                        <Button variant="secondary" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit" disabled={loading}>
                            {loading ? (
                                <>
                                    <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                        className="me-2"
                                    />
                                    Sending...
                                </>
                            ) : (
                                'Send Message'
                            )}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default ContactForm;
