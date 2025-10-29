import React, { useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import './AdminDashboard.css';

const AdminSettings = () => {
    const [settings, setSettings] = useState({
        siteName: 'Jobnest',
        siteDescription: 'Connecting Talent with Opportunity',
        contactEmail: 'admin@jobnest.com',
        maintenanceMode: false,
        allowRegistration: true,
        emailNotifications: true
    });

    const handleSettingChange = (key, value) => {
        setSettings(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleSaveSettings = async () => {
        try {
            const token = localStorage.getItem('token');
            // This would typically save to backend
            console.log('Saving settings:', settings);
            alert('Settings saved successfully!');
        } catch (err) {
            console.error('Failed to save settings:', err);
            alert('Failed to save settings');
        }
    };

    return (
        <div className="admin-dashboard">
            <AdminSidebar />
            <div className="admin-content">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1 className="h3 mb-0">
                        <i className="bi bi-gear me-2"></i>
                        Site Settings
                    </h1>
                    <button className="btn btn-primary" onClick={handleSaveSettings}>
                        <i className="bi bi-save me-1"></i>
                        Save Changes
                    </button>
                </div>

                <div className="settings-management">
                    <h2>General Settings</h2>

                    <div className="mb-4">
                        <label className="form-label">Site Name</label>
                        <input
                            type="text"
                            className="form-control"
                            value={settings.siteName}
                            onChange={(e) => handleSettingChange('siteName', e.target.value)}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="form-label">Site Description</label>
                        <textarea
                            className="form-control"
                            rows="3"
                            value={settings.siteDescription}
                            onChange={(e) => handleSettingChange('siteDescription', e.target.value)}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="form-label">Contact Email</label>
                        <input
                            type="email"
                            className="form-control"
                            value={settings.contactEmail}
                            onChange={(e) => handleSettingChange('contactEmail', e.target.value)}
                        />
                    </div>

                    <h2 className="mt-5">System Settings</h2>

                    <div className="form-check mb-3">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="maintenanceMode"
                            checked={settings.maintenanceMode}
                            onChange={(e) => handleSettingChange('maintenanceMode', e.target.checked)}
                        />
                        <label className="form-check-label" htmlFor="maintenanceMode">
                            Maintenance Mode
                        </label>
                    </div>

                    <div className="form-check mb-3">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="allowRegistration"
                            checked={settings.allowRegistration}
                            onChange={(e) => handleSettingChange('allowRegistration', e.target.checked)}
                        />
                        <label className="form-check-label" htmlFor="allowRegistration">
                            Allow New User Registration
                        </label>
                    </div>

                    <div className="form-check mb-3">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="emailNotifications"
                            checked={settings.emailNotifications}
                            onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                        />
                        <label className="form-check-label" htmlFor="emailNotifications">
                            Enable Email Notifications
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
