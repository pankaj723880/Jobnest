const jwt = require('jsonwebtoken');
const User = require('../models/User');

const StatusCodes = {
    UNAUTHORIZED: 401,
};

const authenticateUser = async (req, res, next) => {
    // Check header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer')) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ msg: 'Authentication invalid' });
    }
    const token = authHeader.split(' ')[1];

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        // Attach the user to the job routes
        req.user = { userId: payload.userId, name: payload.name, role: payload.role };
        next();
    } catch (error) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ msg: 'Authentication invalid' });
    }
};

module.exports = authenticateUser;
