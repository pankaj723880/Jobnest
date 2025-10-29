const express = require('express');
const router = express.Router();
const { updateProfile, uploadPhoto, uploadResume } = require('../controllers/userController');
const { uploadSingle } = require('../middleware/upload');
const authenticateUser = require('../middleware/auth');

// [PUT] /api/v1/user/profile - Update profile info (protected)
router.put('/profile', authenticateUser, updateProfile);

// [POST] /api/v1/user/upload-photo - Upload profile photo (protected)
router.post('/upload-photo', authenticateUser, uploadSingle('photo'), uploadPhoto);

// [POST] /api/v1/user/upload-resume - Upload resume (protected)
router.post('/upload-resume', authenticateUser, uploadSingle('resume'), uploadResume);

module.exports = router;
