const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access denied' });

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        return res.status(500).json({ message: 'Server configuration error' });
    }
    jwt.verify(token, jwtSecret, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = user;
        next();
    });
};

const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin access required' });
    next();
};

module.exports = { authenticateToken, isAdmin };