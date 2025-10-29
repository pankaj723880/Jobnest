const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const { UnauthenticatedError, BadRequestError } = require('../errors');
const path = require('path');
const fs = require('fs');

// [PUT] /api/v1/user/profile - Update user profile information
const updateProfile = async (req, res) => {
    const user = await User.findById(req.user.userId);
    if (!user) {
        throw new UnauthenticatedError('User not found');
    }

    let updateData = {};

    if (user.role === 'worker') {
        const { city, pincode, skills } = req.body;
        if (!city || !pincode || !skills) {
            throw new BadRequestError('Please provide city, pincode, and skills');
        }
        updateData = { city, pincode, skills };
    } else if (user.role === 'employer') {
        const { companyName, companyDescription, contactEmail, contactPhone, website, address, notifications } = req.body;
        updateData = {
            companyName: companyName || '',
            companyDescription: companyDescription || '',
            contactEmail: contactEmail || '',
            contactPhone: contactPhone || '',
            website: website || '',
            address: address || '',
            notifications: notifications || user.notifications
        };
    } else {
        throw new BadRequestError('Invalid user role');
    }

    const updatedUser = await User.findOneAndUpdate(
        { _id: req.user.userId },
        updateData,
        { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
        throw new UnauthenticatedError('User not found');
    }

    res.status(StatusCodes.OK).json({
        user: {
            id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            city: updatedUser.city,
            pincode: updatedUser.pincode,
            skills: updatedUser.skills,
            profilePhoto: updatedUser.profilePhoto,
            resume: updatedUser.resume,
            companyName: updatedUser.companyName,
            companyDescription: updatedUser.companyDescription,
            contactEmail: updatedUser.contactEmail,
            contactPhone: updatedUser.contactPhone,
            website: updatedUser.website,
            address: updatedUser.address,
            notifications: updatedUser.notifications
        },
        msg: 'Profile updated successfully'
    });
};

// [POST] /api/v1/user/upload-photo - Upload profile photo
const uploadPhoto = async (req, res) => {
    if (!req.file) {
        throw new BadRequestError('No photo file uploaded');
    }

    // Save relative path instead of absolute path
    const photoPath = req.file.path.replace(/\\/g, '/').replace(/^uploads\//, ''); // Remove 'uploads/' prefix to make it relative

    const user = await User.findOneAndUpdate(
        { _id: req.user.userId },
        { profilePhoto: photoPath },
        { new: true }
    ).select('-password');

    if (!user) {
        // Delete uploaded file if user not found
        fs.unlink(req.file.path, (err) => {
            if (err) console.error('Failed to delete orphan photo:', err);
        });
        throw new UnauthenticatedError('User not found');
    }

    res.status(StatusCodes.OK).json({
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profilePhoto: user.profilePhoto
        },
        msg: 'Profile photo uploaded successfully'
    });
};

// [POST] /api/v1/user/upload-resume - Upload resume
const uploadResume = async (req, res) => {
    if (!req.file) {
        throw new BadRequestError('No resume file uploaded');
    }

    // Save relative path instead of absolute path
    const resumePath = req.file.path.replace(/\\/g, '/').replace(/^uploads\//, ''); // Remove 'uploads/' prefix to make it relative

    const user = await User.findOneAndUpdate(
        { _id: req.user.userId },
        { resume: resumePath },
        { new: true }
    ).select('-password');

    if (!user) {
        // Delete uploaded file if user not found
        fs.unlink(req.file.path, (err) => {
            if (err) console.error('Failed to delete orphan resume:', err);
        });
        throw new UnauthenticatedError('User not found');
    }

    res.status(StatusCodes.OK).json({
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            resume: user.resume
        },
        msg: 'Resume uploaded successfully'
    });
};

module.exports = {
    updateProfile,
    uploadPhoto,
    uploadResume
};
