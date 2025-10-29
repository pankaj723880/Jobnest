import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import EmployerSidebar from '../components/EmployerSidebar';

const EmployerSettings = () => {
    const { user, authFetch } = useAuth();
    const [settings, setSettings] = useState({
        companyName: '',
        companyDescription: '',
        contactEmail: '',
        contactPhone: '',
        website: '',
        address: '',
        notifications: {
            newApplications: true,
            applicationUpdates: true,
            weeklyReports: false,
        }
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const response = await authFetch('user/profile');
            const data = await response.json();

            if (response.ok) {
                setSettings({
                    companyName: data.user.companyName || '',
                    companyDescription: data.user.companyDescription || '',
                    contactEmail: data.user.contactEmail || data.user.email || '',
                    contactPhone: data.user.contactPhone || '',
                    website: data.user.website || '',
                    address: data.user.address || '',
                    notifications: data.user.notifications || settings.notifications
                });
            }
        } catch (err) {
            console.error('Failed to fetch settings:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSettingChange = (field, value) => {
        if (field.includes('.')) {
            const [parent, child] = field.split('.');
            setSettings(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setSettings(prev => ({
                ...prev,
                [field]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setSaving(true);

        try {
            const response = await authFetch('user/profile', {
                method: 'PUT',
                body: JSON.stringify(settings),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('Settings saved successfully!');
                setTimeout(() => setSuccess(''), 3000);
            } else {
                setError(data.msg || 'Failed to save settings');
            }
        } catch (err) {
            setError('Failed to save settings');
            console.error('Failed to save settings:', err);
        } finally {
            setSaving(false);
        }
    };

    const indigoColor = '#4f46e5';

    if (loading) {
        return (
            <div className="container-fluid d-flex p-0">
                <EmployerSidebar userId={user?._id || 'Loading...'} />
                <div className="flex-grow-1 p-5 bg-light d-flex align-items-center justify-content-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid d-flex p-0">
            <EmployerSidebar userId={user?._id || 'Loading...'} />

            <div className="flex-grow-1 p-5 bg-light">
                <h1 className="fw-bold text-dark mb-4">Settings</h1>

                {error && <div className="alert alert-danger" role="alert"><i className="bi bi-x-octagon-fill me-2"></i>{error}</div>}
                {success && <div className="alert alert-success" role="alert"><i className="bi bi-check-circle-fill me-2"></i>{success}</div>}

                <div className="row">
                    <div className="col-lg-8">
                        <form onSubmit={handleSubmit}>
                            {/* Employer Information */}
                            <div className="card mb-4 shadow-sm border-0 rounded-4">
                                <div className="card-header bg-white border-bottom-0 pt-4 px-4">
                                    <h5 className="fw-bold mb-0" style={{ color: indigoColor }}>
                                        <i className="bi bi-building me-2"></i>Employer Information
                                    </h5>
                                </div>
                                <div className="card-body p-4">
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <label htmlFor="companyName" className="form-label fw-semibold">Employer Name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="companyName"
                                                value={settings.companyName}
                                                onChange={(e) => handleSettingChange('companyName', e.target.value)}
                                                placeholder="Your company name"
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="contactEmail" className="form-label fw-semibold">Contact Email</label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                id="contactEmail"
                                                value={settings.contactEmail}
                                                onChange={(e) => handleSettingChange('contactEmail', e.target.value)}
                                                placeholder="contact@company.com"
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="contactPhone" className="form-label fw-semibold">Contact Phone</label>
                                            <input
                                                type="tel"
                                                className="form-control"
                                                id="contactPhone"
                                                value={settings.contactPhone}
                                                onChange={(e) => handleSettingChange('contactPhone', e.target.value)}
                                                placeholder="+91 9876543210"
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="website" className="form-label fw-semibold">Website</label>
                                            <input
                                                type="url"
                                                className="form-control"
                                                id="website"
                                                value={settings.website}
                                                onChange={(e) => handleSettingChange('website', e.target.value)}
                                                placeholder="https://www.company.com"
                                            />
                                        </div>
                                        <div className="col-12">
                                            <label htmlFor="address" className="form-label fw-semibold">Address</label>
                                            <textarea
                                                className="form-control"
                                                id="address"
                                                rows="3"
                                                value={settings.address}
                                                onChange={(e) => handleSettingChange('address', e.target.value)}
                                                placeholder="Company address"
                                            ></textarea>
                                        </div>
                                        <div className="col-12">
                                            <label htmlFor="companyDescription" className="form-label fw-semibold">Employer Description</label>
                                            <textarea
                                                className="form-control"
                                                id="companyDescription"
                                                rows="4"
                                                value={settings.companyDescription}
                                                onChange={(e) => handleSettingChange('companyDescription', e.target.value)}
                                                placeholder="Brief description about your company"
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Notification Preferences */}
                            <div className="card mb-4 shadow-sm border-0 rounded-4">
                                <div className="card-header bg-white border-bottom-0 pt-4 px-4">
                                    <h5 className="fw-bold mb-0" style={{ color: indigoColor }}>
                                        <i className="bi bi-bell me-2"></i>Notification Preferences
                                    </h5>
                                </div>
                                <div className="card-body p-4">
                                    <div className="row g-3">
                                        <div className="col-12">
                                            <div className="form-check form-switch">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id="newApplications"
                                                    checked={settings.notifications.newApplications}
                                                    onChange={(e) => handleSettingChange('notifications.newApplications', e.target.checked)}
                                                />
                                                <label className="form-check-label fw-semibold" htmlFor="newApplications">
                                                    New job applications
                                                </label>
                                                <small className="form-text text-muted d-block">
                                                    Get notified when someone applies to your jobs
                                                </small>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="form-check form-switch">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id="applicationUpdates"
                                                    checked={settings.notifications.applicationUpdates}
                                                    onChange={(e) => handleSettingChange('notifications.applicationUpdates', e.target.checked)}
                                                />
                                                <label className="form-check-label fw-semibold" htmlFor="applicationUpdates">
                                                    Application status updates
                                                </label>
                                                <small className="form-text text-muted d-block">
                                                    Get notified when you update application statuses
                                                </small>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="form-check form-switch">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id="weeklyReports"
                                                    checked={settings.notifications.weeklyReports}
                                                    onChange={(e) => handleSettingChange('notifications.weeklyReports', e.target.checked)}
                                                />
                                                <label className="form-check-label fw-semibold" htmlFor="weeklyReports">
                                                    Weekly analytics reports
                                                </label>
                                                <small className="form-text text-muted d-block">
                                                    Receive weekly summaries of your hiring performance
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Save Button */}
                            <div className="d-flex justify-content-end">
                                <button
                                    type="submit"
                                    className="btn text-white rounded-pill px-5 fw-bold shadow-sm"
                                    style={{ backgroundColor: indigoColor, borderColor: indigoColor }}
                                    disabled={saving}
                                >
                                    {saving ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-check-circle me-2"></i> Save Settings
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Sidebar Info */}
                    <div className="col-lg-4">
                        <div className="card shadow-sm border-0 rounded-4">
                            <div className="card-body p-4">
                                <h6 className="fw-bold mb-3" style={{ color: indigoColor }}>
                                    <i className="bi bi-info-circle me-2"></i>Help & Tips
                                </h6>
                                <ul className="list-unstyled small mb-0">
                                    <li className="mb-2">
                                        <i className="bi bi-check-circle text-success me-2"></i>
                                        Keep your company information up to date to attract better candidates
                                    </li>
                                    <li className="mb-2">
                                        <i className="bi bi-check-circle text-success me-2"></i>
                                        Enable notifications to stay on top of new applications
                                    </li>
                                    <li className="mb-2">
                                        <i className="bi bi-check-circle text-success me-2"></i>
                                        Your contact information will be visible to applicants
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployerSettings;
