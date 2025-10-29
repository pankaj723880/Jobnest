require('dotenv').config();
require('express-async-errors'); // Handles async errors without try-catch blocks in controllers

const express = require('express');
const app = express();
const cors = require('cors');
const connectDB = require('./config/db');

// --- Routers ---
const authRouter = require('./routes/authRoutes');
const jobsRouter = require('./routes/jobRoutes'); // <-- NEW IMPORT: Job Routes
const userRouter = require('./routes/userRoutes');
const applicationRouter = require('./routes/applicationRoutes');
const analyticsRouter = require('./routes/analyticsRoutes'); // <-- NEW IMPORT: Analytics Routes
const adminRouter = require('./routes/adminRoutes'); // <-- NEW IMPORT: Admin Routes
const testimonialRouter = require('./routes/testimonialRoutes'); // <-- NEW IMPORT: Testimonial Routes
const notificationRouter = require('./routes/notificationRoutes'); // <-- NEW IMPORT: Notification Routes
const contactRouter = require('./routes/contactRoutes'); // <-- NEW IMPORT: Contact Routes

// --- Middleware ---
const authenticateUser = require('./middleware/auth'); // <-- NEW IMPORT: JWT Authentication Middleware

// Import HTTP status codes
const StatusCodes = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
};

// Get port from environment variable or use fallback
const PORT = process.env.PORT || 5000;
const FALLBACK_PORT = 5001;

// Connect to MongoDB
connectDB();

// Middleware for parsing JSON
app.use(express.json());

// CORS configuration
const corsOptions = {
    origin: true, // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
    credentials: true,
    maxAge: 86400 // 24 hours
};

// Apply CORS configuration
app.use(cors(corsOptions));

// Serve static files from uploads directory
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
// Health Check
app.get('/', (req, res) => {
    res.status(StatusCodes.OK).json({ msg: 'Jobnest API is running smoothly.' });
});

// Public Route (Authentication)
app.use('/api/v1/auth', authRouter);

// Protected Routes (Jobs and User Profiles)
// Remove authenticateUser middleware from /api/v1/jobs route to allow public GET access
app.use('/api/v1/jobs', jobsRouter); // <-- UPDATED ROUTE

// User profile routes (protected)
app.use('/api/v1/user', authenticateUser, userRouter);

// Admin routes (protected)
app.use('/api/v1/admin', authenticateUser, adminRouter);

// Job applications routes (protected)
app.use('/api/v1/applications', authenticateUser, applicationRouter);

// Analytics routes (protected)
app.use('/api/v1/analytics', authenticateUser, analyticsRouter);

// Notification routes (protected)
app.use('/api/v1/notifications', authenticateUser, notificationRouter);

// Testimonial routes (public)
app.use('/api/v1/testimonials', testimonialRouter);

// Contact routes (public for POST, admin for others)
app.use('/api/v1/contacts', contactRouter);

// Basic 404 Handler
app.use((req, res) => {
    res.status(StatusCodes.NOT_FOUND).json({ msg: 'Route not found' });
});

// Basic Error Handler (Centralized)
app.use((err, req, res, next) => {
    console.error(err); // Log the full error for debugging

    let customError = {
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        msg: err.message || 'Something went wrong, please try again later.',
    };

    // Handle Mongoose duplicate key error (e.g., for unique email)
    if (err.code && err.code === 11000) {
        customError.msg = `Duplicate value entered for ${Object.keys(err.keyValue)} field, please choose another value.`;
        customError.statusCode = StatusCodes.BAD_REQUEST;
    }

    const { statusCode, msg } = customError;
    res.status(statusCode).json({ msg });
});

const port = process.env.PORT || 5000;

const fs = require('fs');

const startServer = async () => {
    try {
        // Create upload directories if they don't exist
        const uploadDir = path.join(__dirname, 'uploads');
        const photosDir = path.join(uploadDir, 'photos');
        const resumesDir = path.join(uploadDir, 'resumes');
        const backupsDir = path.join(__dirname, 'backups');

        [uploadDir, photosDir, resumesDir, backupsDir].forEach(dir => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
                console.log(`Created directory: ${dir}`);
            }
        });

        // Try to start server on primary port first
        const server = app.listen(PORT, () => {
            console.log(`Server is listening on port ${PORT}...`);
            console.log(`API is available at http://localhost:${PORT}`);
        }).on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                console.log(`Port ${PORT} is busy, trying alternate port ${FALLBACK_PORT}...`);
                server.close();
                
                // Try fallback port
                app.listen(FALLBACK_PORT, () => {
                    console.log(`Server is listening on alternate port ${FALLBACK_PORT}...`);
                    console.log(`API is available at http://localhost:${FALLBACK_PORT}`);
                }).on('error', (err) => {
                    console.error('Failed to start server:', err);
                    process.exit(1);
                });
            } else {
                console.error('Failed to start server:', err);
                process.exit(1);
            }
        });
    } catch (error) {
        console.log('Failed to start server:', error);
    }
};

startServer();
