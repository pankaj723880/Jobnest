const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const fs = require('fs');

// [POST] /api/v1/auth/register
const register = async (req, res) => {
    const { name, email, password, role } = req.body;
    // let resumePath = '';

    if (!name || !email || !password || !role) {
        return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Please provide name, email, password, and role' });
    }

    // If role is worker and resume file is uploaded, get the file path
    // if (role === 'worker' && req.file) {
    //     resumePath = req.file.path; // relative path to uploaded resume file
    // }

    // Check if user with the same email and role already exists
    const existingUser = await User.findOne({ email, role });
    if (existingUser) {
        // Delete uploaded resume file if user exists to avoid orphan files
        // if (resumePath) {
        //     fs.unlink(resumePath, (err) => {
        //         if (err) console.error('Failed to delete orphan resume file:', err);
        //     });
        // }
        return res.status(StatusCodes.BAD_REQUEST).json({ msg: `An account with this email already exists for the '${role}' role.` });
    }

    const userData = { name, email, password, role };
    // if (resumePath) {
    //     userData.resume = resumePath;
    // }

    const user = await User.create(userData);
    const token = user.createJWT();

    // Send back necessary user info and token
    res.status(StatusCodes.CREATED).json({
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profilePhoto: user.profilePhoto,
            resume: user.resume,
            city: user.city || '',
            pincode: user.pincode || '',
            skills: user.skills || [],
            companyName: user.companyName || '',
            companyDescription: user.companyDescription || '',
            contactEmail: user.contactEmail || '',
            contactPhone: user.contactPhone || '',
            website: user.website || '',
            address: user.address || '',
            notifications: user.notifications || {
                newApplications: true,
                applicationUpdates: true,
                weeklyReports: false,
            },
        },
        token,
    });
};

// [POST] /api/v1/auth/login
const login = async (req, res) => {
    const { email, password, role } = req.body; // Added role

    if (!email || !password || !role) {
        return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'Please provide email, password, and role' });
    }

    // Log the incoming login attempt (without logging the password)
    console.log(`Login attempt: email=${email}, role=${role}`);

    // 1. Find user by email AND role, select password explicitly
    const user = await User.findOne({ email, role }).select('+password');
    if (!user) {
        // If no user with that email+role, check if user exists with that email under another role
        const userByEmail = await User.findOne({ email }).select('+password');
        if (userByEmail) {
            console.warn(`Login failed - role mismatch for email=${email}. Stored role=${userByEmail.role}, attempted role=${role}`);
            // In production we avoid revealing account existence/role. Only give a helpful hint in development.
            if (process.env.NODE_ENV !== 'production') {
                return res.status(StatusCodes.UNAUTHORIZED).json({ msg: `Account exists with role '${userByEmail.role}'. Please select that role to login.` });
            } else {
                return res.status(StatusCodes.UNAUTHORIZED).json({ msg: 'Invalid Credentials' });
            }
        }
        console.warn(`Login failed - user not found for email=${email} role=${role}`);
        return res.status(StatusCodes.UNAUTHORIZED).json({ msg: 'Invalid Credentials' });
    }

    // 2. Compare password
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
        console.warn(`Login failed - wrong password for userId=${user._id} email=${email}`);
        return res.status(StatusCodes.UNAUTHORIZED).json({ msg: 'Invalid Credentials' });
    }

    // 3. Create and return JWT
    const token = user.createJWT();

    res.status(StatusCodes.OK).json({
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profilePhoto: user.profilePhoto,
            resume: user.resume,
            city: user.city || '',
            pincode: user.pincode || '',
            skills: user.skills || [],
            companyName: user.companyName || '',
            companyDescription: user.companyDescription || '',
            contactEmail: user.contactEmail || '',
            contactPhone: user.contactPhone || '',
            website: user.website || '',
            address: user.address || '',
            notifications: user.notifications || {
                newApplications: true,
                applicationUpdates: true,
                weeklyReports: false,
            },
        },
        token,
    });
};

module.exports = {
    register,
    login,
};