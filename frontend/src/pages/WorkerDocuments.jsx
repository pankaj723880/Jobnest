import React, { useState } from 'react';
import WorkerSidebar from '../components/WorkerSidebar';
import { useAuth } from '../context/AuthContext';

const WorkerDocuments = () => {
    const { user, logout, isLoading } = useAuth();

    const [idFile, setIdFile] = useState(null);
    const [proofFile, setProofFile] = useState(null);

    const handleIdUpload = async () => {
        if (idFile) {
            // Implement upload logic here, e.g., call API
            alert('ID uploaded successfully!');
            setIdFile(null);
        }
    };

    const handleProofUpload = async () => {
        if (proofFile) {
            // Implement upload logic here
            alert('Proof of work uploaded successfully!');
            setProofFile(null);
        }
    };

    return (
        <div className="container-fluid py-5">
            <div className="row">
                {/* Sidebar Column */}
                <div className="col-lg-3 d-none d-lg-block">
                    <WorkerSidebar userId={user?.id} logout={logout} />
                </div>

                {/* Main Content Column */}
                <div className="col-lg-9">
                    <h1 className="display-4 fw-bold text-dark mb-4">Verification Documents</h1>

                    <div className="card shadow-lg border-0 rounded-4">
                        <div className="card-body p-4">
                            <h3 className="card-title fw-bold text-primary mb-4">Upload Your Documents</h3>

                            {/* ID Upload Section */}
                            <div className="mb-4">
                                <h4 className="fw-semibold mb-3">Government ID</h4>
                                <input
                                    type="file"
                                    accept="image/*,.pdf"
                                    onChange={(e) => setIdFile(e.target.files[0])}
                                    className="form-control mb-2"
                                    disabled={isLoading}
                                />
                                <button
                                    onClick={handleIdUpload}
                                    className="btn btn-primary rounded-pill px-4"
                                    disabled={isLoading || !idFile}
                                >
                                    Upload ID
                                </button>
                            </div>

                            {/* Proof of Work Upload Section */}
                            <div className="mb-4">
                                <h4 className="fw-semibold mb-3">Proof of Work</h4>
                                <input
                                    type="file"
                                    accept="image/*,.pdf"
                                    onChange={(e) => setProofFile(e.target.files[0])}
                                    className="form-control mb-2"
                                    disabled={isLoading}
                                />
                                <button
                                    onClick={handleProofUpload}
                                    className="btn btn-success rounded-pill px-4"
                                    disabled={isLoading || !proofFile}
                                >
                                    Upload Proof
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorkerDocuments;
