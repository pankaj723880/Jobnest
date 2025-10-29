import React, { useState, useEffect } from 'react';
import WorkerSidebar from '../components/WorkerSidebar';
import { useAuth } from '../context/AuthContext';

// --- Main Worker Profile Component ---
const WorkerProfile = () => {
    const { user, profilePhoto, resume, updateProfilePhoto, updateResume, updateProfile, authError, isLoading, logout } = useAuth();

    const [photoFile, setPhotoFile] = useState(null);
    const [resumeFile, setResumeFile] = useState(null);
    const [selectedPhotoName, setSelectedPhotoName] = useState('');
    const [selectedResumeName, setSelectedResumeName] = useState('');
    const [photoPreview, setPhotoPreview] = useState(() => {
        if (profilePhoto && !profilePhoto.startsWith('http') && !profilePhoto.startsWith('data:')) {
            return `http://localhost:5000/uploads/${profilePhoto}`;
        }
        return profilePhoto;
    });
    const [resumeName, setResumeName] = useState(resume ? resume.split('/').pop() : 'No resume uploaded');
    const [resumePath, setResumePath] = useState(() => resume && !resume.startsWith('http') ? `http://localhost:5000/${resume}` : resume);

    // Personal info state
    const [city, setCity] = useState(user?.city || '');
    const [pincode, setPincode] = useState(user?.pincode || '');
    const [skills, setSkills] = useState(user?.skills ? user.skills.join(', ') : '');

    useEffect(() => {
        const preview = profilePhoto && !profilePhoto.startsWith('http') && !profilePhoto.startsWith('data:') ? `http://localhost:5000/uploads/${profilePhoto}` : profilePhoto;
        setPhotoPreview(preview);
        setResumeName(resume ? resume.split('/').pop() : 'No resume uploaded');
        const rPath = resume && !resume.startsWith('http') ? `http://localhost:5000/uploads/${resume}` : resume;
        setResumePath(rPath);
        setCity(user?.city || '');
        setPincode(user?.pincode || '');
        setSkills(user?.skills ? user.skills.join(', ') : '');
    }, [user, profilePhoto, resume]);

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPhotoFile(file);
            setSelectedPhotoName(file.name);
            const reader = new FileReader();
            reader.onload = () => {
                setPhotoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleResumeChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setResumeFile(file);
            setSelectedResumeName(file.name);
            setResumeName(file.name);
        }
    };

    const handlePhotoUpload = async () => {
        if (photoFile) {
            const success = await updateProfilePhoto(photoFile);
            if (success) {
                alert('Profile photo updated successfully!');
                setPhotoFile(null);
                setSelectedPhotoName('');
                // Update preview with backend path after upload
                setPhotoPreview(`http://localhost:5000/uploads/${user.profilePhoto}`);
            } else {
                alert('Failed to upload photo. Please try again.');
            }
        }
    };

    const handleResumeUpload = async () => {
        if (resumeFile) {
            const success = await updateResume(resumeFile);
            if (success) {
                alert('Resume updated successfully!');
                setResumeFile(null);
                setSelectedResumeName('');
                // Update resume path after upload
                setResumePath(`http://localhost:5000/uploads/${user.resume}`);
            } else {
                alert('Failed to upload resume. Please try again.');
            }
        }
    };

    const handleProfileSave = async () => {
        const skillsArray = skills.split(',').map(s => s.trim()).filter(s => s);
        const profileData = { city, pincode, skills: skillsArray };

        const success = await updateProfile(profileData);
        if (success) {
            alert('Profile updated successfully!');
        } else {
            alert('Failed to update profile. Please try again.');
        }
    };

    if (isLoading) {
        return <div className="text-center py-5">Loading...</div>;
    }

    return (
        <div className="container-fluid py-5">
            <div className="row">
                {/* Sidebar Column */}
                <div className="col-lg-3 d-none d-lg-block">
                    <WorkerSidebar userId={user?.id} logout={logout} />
                </div>

                {/* Main Content Column */}
                <div className="col-lg-9">
                    <h1 className="display-4 fw-bold text-dark mb-4">My Profile</h1>

                    {authError && <div className="alert alert-danger mb-4">{authError}</div>}

                    <div className="card shadow-lg border-0 rounded-4">
                        <div className="card-body p-4">
                            <h3 className="card-title fw-bold text-primary mb-4">Update Your Profile</h3>

                            {/* Profile Photo Section */}
                            <div className="mb-4">
                                <h4 className="fw-semibold mb-3">Profile Photo</h4>
                                <div className="d-flex align-items-center">
                                    <div className="me-3">
                                        <div className="bg-light rounded-circle d-flex align-items-center justify-content-center overflow-hidden" style={{ width: '80px', height: '80px' }}>
                                            {photoPreview ? (
                                                <img src={photoPreview} alt="Profile" className="w-100 h-100 object-fit-cover" />
                                            ) : (
                                                <span className="text-muted">No Photo</span>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handlePhotoChange}
                                            className="form-control mb-2"
                                            style={{ maxWidth: '300px' }}
                                            disabled={isLoading}
                                        />
                                        {selectedPhotoName && (
                                            <p className="text-muted small mb-2">Selected: {selectedPhotoName}</p>
                                        )}
                                        <button
                                            onClick={handlePhotoUpload}
                                            className="btn btn-primary rounded-pill px-4"
                                            disabled={isLoading || !photoFile}
                                        >
                                            {isLoading ? 'Uploading...' : 'Upload Photo'}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Resume Section */}
                            <div className="mb-4">
                                <h4 className="fw-semibold mb-3">Resume</h4>
                                <div>
                                    <p className="text-muted mb-2">Current Resume: {resumeName}</p>
                                    {resumePath && (
                                        <a href={resumePath} download className="btn btn-outline-secondary btn-sm me-2 mb-2">
                                            <i className="bi bi-download me-1"></i>Download Resume
                                        </a>
                                    )}
                                    <input
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        onChange={handleResumeChange}
                                        className="form-control mb-2"
                                        style={{ maxWidth: '300px' }}
                                        disabled={isLoading}
                                    />
                                    {selectedResumeName && (
                                        <p className="text-muted small mb-2">Selected: {selectedResumeName}</p>
                                    )}
                                    <button
                                        onClick={handleResumeUpload}
                                        className="btn btn-success rounded-pill px-4"
                                        disabled={isLoading || !resumeFile}
                                    >
                                        {isLoading ? 'Uploading...' : 'Upload Resume'}
                                    </button>
                                </div>
                            </div>

                            {/* Personal Information Section */}
                            <div className="mb-4">
                                <h4 className="fw-semibold mb-3">Personal Information</h4>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label">City</label>
                                        <input
                                            type="text"
                                            className="form-control rounded-pill"
                                            value={city}
                                            onChange={(e) => setCity(e.target.value)}
                                            placeholder="Enter your city"
                                            disabled={isLoading}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Pincode</label>
                                        <input
                                            type="text"
                                            className="form-control rounded-pill"
                                            value={pincode}
                                            onChange={(e) => setPincode(e.target.value)}
                                            placeholder="Enter your pincode"
                                            disabled={isLoading}
                                        />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label">Skills (comma-separated)</label>
                                        <input
                                            type="text"
                                            className="form-control rounded-pill"
                                            value={skills}
                                            onChange={(e) => setSkills(e.target.value)}
                                            placeholder="e.g., Plumbing, Electrical, Carpentry"
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>
                                <button 
                                    onClick={handleProfileSave}
                                    className="btn btn-primary rounded-pill px-5 py-2 mt-3"
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorkerProfile;
