import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AdminProvider } from './context/AdminContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Jobs from './pages/Jobs';
import Login from './pages/Login';
import Register from './pages/Register';
import WorkerDashboard from './pages/WorkerDashboard'; // <-- Correct Import
import EmployerDashboard from './pages/EmployerDashboard'; // Added import
import AdminDashboard from './pages/AdminDashboard'; // Added import
import AdminWelcome from './pages/AdminWelcome'; // Added import
import AdminUsers from './pages/AdminUsers';
import AdminJobs from './pages/AdminJobs';
import AdminReports from './pages/AdminReports';
import AdminSettings from './pages/AdminSettings';
import AdminBackup from './pages/AdminBackup';
import ProtectedRoute from './components/ProtectedRoute'; // Import the new component
import WorkerProfile from './pages/WorkerProfile';
import WorkerDocuments from './pages/WorkerDocuments';
import MyApplications from './pages/MyApplications';
import EmployerSubmissions from './pages/EmployerSubmissions';
import EmployerAnalytics from './pages/EmployerAnalytics';
import EmployerPostJob from './pages/EmployerPostJob';
import EmployerJobs from './pages/EmployerJobs';
import EmployerSettings from './pages/EmployerSettings';
import ForgotPassword from './pages/ForgotPassword'; // Import ForgotPassword
import ResetPassword from './pages/ResetPassword'; // Import ResetPassword

// About component with detailed content
const About = () => (
  <div className="container py-5">
    <div className="text-center mb-5">
      <h1 className="display-4 fw-bold text-primary">About Jobnest</h1>
      <p className="lead text-muted">Connecting Talent with Opportunity</p>
    </div>

    <div className="row mb-5">
      <div className="col-lg-8 mx-auto">
        <h2 className="h3 fw-bold mb-3">Our Mission</h2>
        <p className="text-muted">
          At Jobnest, our mission is to revolutionize the job market by creating a seamless, efficient, and fair platform where job seekers can discover their dream careers and employers can find the perfect talent. We believe in empowering individuals and businesses to achieve their full potential through meaningful connections.
        </p>
      </div>
    </div>

    <div className="row mb-5">
      <div className="col-lg-10 mx-auto">
        <h2 className="h3 fw-bold mb-4 text-center">Key Features</h2>
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body text-center">
                <i className="bi bi-search fs-1 text-primary mb-3"></i>
                <h5 className="card-title fw-bold">Smart Job Matching</h5>
                <p className="card-text text-muted">Our advanced algorithms match job seekers with opportunities that align with their skills, experience, and career goals.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body text-center">
                <i className="bi bi-shield-check fs-1 text-success mb-3"></i>
                <h5 className="card-title fw-bold">Verified Profiles</h5>
                <p className="card-text text-muted">We ensure the authenticity of all profiles through our verification process, building trust between employers and job seekers.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body text-center">
                <i className="bi bi-chat-dots fs-1 text-info mb-3"></i>
                <h5 className="card-title fw-bold">Direct Communication</h5>
                <p className="card-text text-muted">Connect directly with potential employers or candidates through our integrated messaging system.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="row mb-5">
      <div className="col-lg-8 mx-auto">
        <h2 className="h3 fw-bold mb-3">Our Story</h2>
        <p className="text-muted">
          Founded in 2023, Jobnest was born out of frustration with traditional job boards that lacked personalization and efficiency. Our founders, a team of tech enthusiasts and HR professionals, saw an opportunity to create a platform that puts people first. Today, we're proud to serve thousands of users across various industries, helping them build successful careers and businesses.
        </p>
      </div>
    </div>

    <div className="row mb-5">
      <div className="col-lg-10 mx-auto">
        <h2 className="h3 fw-bold mb-4 text-center">Meet Our Team</h2>
        <div className="row g-4">
          <div className="col-md-4">
            <div className="text-center">
              <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '80px', height: '80px'}}>
                <span className="text-white fw-bold fs-4">S</span>
              </div>
              <h5 className="fw-bold">Saurabh</h5>
              <p className="text-muted small">CTO & Co-Founder</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="text-center">
              <div className="bg-success rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '80px', height: '80px'}}>
                <span className="text-white fw-bold fs-4">PKS</span>
              </div>
              <h5 className="fw-bold">Pankaj Kumar Singh</h5>
              <p className="text-muted small">CEO & Co-Founder</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="text-center">
              <div className="bg-info rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '80px', height: '80px'}}>
                <span className="text-white fw-bold fs-4">P</span>
              </div>
              <h5 className="fw-bold">Piyush</h5>
              <p className="text-muted small">Director & Co-Founder</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="text-center">
      <h2 className="h3 fw-bold mb-3">Join the Jobnest Community</h2>
      <p className="text-muted mb-4">Whether you're looking for your next opportunity or seeking top talent, Jobnest is here to help you succeed.</p>
      <a href="/register" className="btn btn-primary btn-lg rounded-pill px-5">Get Started Today</a>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <AdminProvider>
          <div className="d-flex flex-column min-vh-100">
            <Header />
            <main className="flex-grow-1" style={{ paddingTop: '100px' }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              
              {/* Protected Routes */}
              <Route 
                path="/worker/dashboard" 
                element={<ProtectedRoute allowedRole="worker"><WorkerDashboard /></ProtectedRoute>} 
              />
              <Route
                path="/worker/profile"
                element={<ProtectedRoute allowedRole="worker"><WorkerProfile /></ProtectedRoute>}
              />
              <Route
                path="/worker/applications"
                element={<ProtectedRoute allowedRole="worker"><MyApplications /></ProtectedRoute>}
              />
              <Route
                path="/worker/documents"
                element={<ProtectedRoute allowedRole="worker"><WorkerDocuments /></ProtectedRoute>}
              />
              <Route
                path="/employer/dashboard"
                element={<ProtectedRoute allowedRole="employer"><EmployerDashboard /></ProtectedRoute>}
              />
              <Route
                path="/employer/submissions"
                element={<ProtectedRoute allowedRole="employer"><EmployerSubmissions /></ProtectedRoute>}
              />
              <Route
                path="/employer/analytics"
                element={<ProtectedRoute allowedRole="employer"><EmployerAnalytics /></ProtectedRoute>}
              />
              <Route
                path="/employer/post-job"
                element={<ProtectedRoute allowedRole="employer"><EmployerPostJob /></ProtectedRoute>}
              />
              <Route
                path="/employer/jobs"
                element={<ProtectedRoute allowedRole="employer"><EmployerJobs /></ProtectedRoute>}
              />
              <Route
                path="/employer/settings"
                element={<ProtectedRoute allowedRole="employer"><EmployerSettings /></ProtectedRoute>}
              />
              <Route
                path="/admin"
                element={<ProtectedRoute allowedRole="admin"><AdminWelcome /></ProtectedRoute>}
              />
              <Route
                path="/admin/dashboard"
                element={<ProtectedRoute allowedRole="admin"><AdminDashboard /></ProtectedRoute>}
              />
              <Route
                path="/admin/users"
                element={<ProtectedRoute allowedRole="admin"><AdminUsers /></ProtectedRoute>}
              />
              <Route
                path="/admin/jobs"
                element={<ProtectedRoute allowedRole="admin"><AdminJobs /></ProtectedRoute>}
              />
              <Route
                path="/admin/reports"
                element={<ProtectedRoute allowedRole="admin"><AdminReports /></ProtectedRoute>}
              />
              <Route
                path="/admin/settings"
                element={<ProtectedRoute allowedRole="admin"><AdminSettings /></ProtectedRoute>}
              />
              <Route
                path="/admin/backup"
                element={<ProtectedRoute allowedRole="admin"><AdminBackup /></ProtectedRoute>}
              />

            </Routes>
            </main>
            <Footer />
          </div>
        </AdminProvider>
      </AuthProvider>
    </Router>
  );
}
export default App; // <-- THE CRITICAL LINE THAT FIXES ERROR 2
