const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.signup = (req, res) => {
    const { username, email, password } = req.body;

    // Basic validation
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    // Check if user already exists
    User.findByEmail(email, (err, results) => {
        if (err) return res.status(500).json({ message: 'Error checking user' });
        if (results.length > 0) return res.status(400).json({ message: 'Email already exists' });

        User.findByUsername(username, (err, results) => {
            if (err) return res.status(500).json({ message: 'Error checking user' });
            if (results.length > 0) return res.status(400).json({ message: 'Username already exists' });

            const hashedPassword = bcrypt.hashSync(password, 10);

            User.create({ username, email, password_hash: hashedPassword, role: 'user' }, (err, result) => {
                if (err) return res.status(500).json({ message: 'Error creating user' });
                res.status(201).json({ message: 'User created successfully' });
            });
        });
    });
};

exports.login = (req, res) => {
    const { email, password } = req.body;

    User.findByEmail(email, (err, results) => {
        if (err || results.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

        const user = results[0];
        if (!bcrypt.compareSync(password, user.password_hash)) return res.status(401).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'your_secret_key');
        res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
    });
};

exports.getMe = (req, res) => {
    res.json({ id: req.user.id, username: req.user.username, role: req.user.role });
};