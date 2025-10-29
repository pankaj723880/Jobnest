import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import WorkerSidebar from '../components/WorkerSidebar';

// Define the custom colors for the application theme
const WORKER_GREEN = '#16a34a'; // Tailwind Green-600

// --- MOCK DATA DEFINITION ---
const mockWorkerData = {
    userId: 'worker-2d7c-e4f8-1b2a',
    jobsFound: 12,
    applicationsSent: 5,
    timesHired: 3,
    avgRating: 4.5,
    isVerified: true,
    lastActivity: '2 hours ago',
    availability: true
};


// --- 2. Stat Card Component ---
const StatCard = ({ title, value, link = '#', bgColor, textColor = 'text-white' }) => {
    return (
        <Link to={link} className="block no-underline text-reset">
            <div
                className="shadow-lg rounded-lg p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 border border-gray-200 animate-fade-in-up"
                style={{ backgroundColor: bgColor, color: textColor }}
            >
                <div className="text-center">
                    <p className="font-medium text-sm mb-2 uppercase tracking-wide opacity-80">{title}</p>
                    <h2 className="text-3xl font-bold">{value}</h2>
                </div>
            </div>
        </Link>
    );
};

// --- 4. Dashboard Overview Content Component (Extracted for clean switching) ---
const DashboardViewContent = ({ workerData, profileCompletion, handleAvailabilityToggle }) => (
    <div className="p-4 sm:p-6 bg-white shadow-2xl rounded-xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b pb-4 border-gray-100">
            <h3 className="text-gray-900 font-bold text-xl mb-3 sm:mb-0">Your Performance Overview</h3>
            
            {/* Availability Toggle - Now controlled by parent state (workerData) */}
            <div className="flex items-center space-x-3">
                <label className={`font-semibold transition-colors duration-200 ${workerData.availability ? 'text-green-600' : 'text-gray-500'}`} htmlFor="availabilitySwitch">
                    {workerData.availability ? 'Available for Hire' : 'Currently Inactive'}
                </label>
                <input 
                    className="form-switch appearance-none focus:ring-0" 
                    type="checkbox" 
                    id="availabilitySwitch" 
                    checked={workerData.availability}
                    onChange={handleAvailabilityToggle}
                />
            </div>
        </div>
        
        {/* --- STATS CARDS GRID --- */}
        <div className="flex flex-col md:flex-row justify-center gap-6 mb-8">
            <StatCard
                title="Applications Sent"
                value={workerData.applicationsSent}
                link="/worker/applications"
                bgColor="#4f46e5"
            />
            <StatCard
                title="Times Hired"
                value={workerData.timesHired}
                link="/worker/reviews"
                bgColor="#16a34a"
            />
            <StatCard
                title="Avg. Rating"
                value={`${workerData.avgRating} / 5`}
                link="/worker/reviews"
                bgColor="#ef4444"
            />
        </div>

        {/* --- Update Profile Button --- */}
        <div className="text-center">
            <Link to="/worker/profile" className="px-8 py-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors duration-300 inline-flex items-center justify-center">
                Update Profile
            </Link>
        </div>
    </div>
);


// --- 5. Main Worker Dashboard Component ---
const WorkerDashboard = () => {
    const { user, logout } = useAuth();
    const [workerData, setWorkerData] = useState(mockWorkerData);

    const profileCompletion = 75;

    const handleAvailabilityToggle = () => {
        setWorkerData(prev => ({ ...prev, availability: !prev.availability }));
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
                    <h1 className="display-4 fw-bold text-dark mb-4">Worker Dashboard</h1>

                    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-inter">
                        <script src="https://cdn.tailwindcss.com"></script>
                        <style>
                            {`
                                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap');
                                .font-inter { font-family: 'Inter', sans-serif; }
                                #availabilitySwitch:checked { background-color: ${WORKER_GREEN} !important; border-color: ${WORKER_GREEN} !important; }
                                /* Custom switch styling */
                                .form-switch .form-check-input {
                                    --tw-bg-opacity: 1;
                                    background-color: rgb(209 213 219 / var(--tw-bg-opacity));
                                    border-color: rgb(209 213 219 / var(--tw-bg-opacity));
                                    height: 1.5rem;
                                    width: 2.75rem;
                                    cursor: pointer;
                                    transition: all 0.2s ease;
                                    float: right;
                                }
                                .form-switch .form-check-input:focus {
                                    box-shadow: 0 0 0 0.25rem rgba(22, 163, 74, 0.25);
                                }
                                /* Fade in up animation */
                                @keyframes fadeInUp {
                                    from {
                                        opacity: 0;
                                        transform: translateY(30px);
                                    }
                                    to {
                                        opacity: 1;
                                        transform: translateY(0);
                                    }
                                }
                                .animate-fade-in-up {
                                    animation: fadeInUp 0.6s ease-out forwards;
                                }
                            `}
                        </style>

                        <DashboardViewContent
                            workerData={workerData}
                            profileCompletion={profileCompletion}
                            handleAvailabilityToggle={handleAvailabilityToggle}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

// Export the main component
export default WorkerDashboard;
