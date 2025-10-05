const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.signup = async (req, res) => {
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

    try {
        // Check if user already exists
        const [emailResults] = await new Promise((resolve, reject) => {
            User.findByEmail(email, (err, results) => err ? reject(err) : resolve([results]));
        });
        if (emailResults.length > 0) return res.status(400).json({ message: 'Email already exists' });

        const [usernameResults] = await new Promise((resolve, reject) => {
            User.findByUsername(username, (err, results) => err ? reject(err) : resolve([results]));
        });
        if (usernameResults.length > 0) return res.status(400).json({ message: 'Username already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);

        await new Promise((resolve, reject) => {
            User.create({ username, email, password_hash: hashedPassword, role: 'user' }, (err, result) => err ? reject(err) : resolve(result));
        });

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const [results] = await new Promise((resolve, reject) => {
            User.findByEmail(email, (err, results) => err ? reject(err) : resolve([results]));
        });

        if (results.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

        const user = results[0];
        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        if (!isValidPassword) return res.status(401).json({ message: 'Invalid credentials' });

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            return res.status(500).json({ message: 'Server configuration error' });
        }
        const token = jwt.sign({ id: user.id, role: user.role }, jwtSecret);
        res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in' });
    }
};

exports.getMe = (req, res) => {
    res.json({ id: req.user.id, username: req.user.username, role: req.user.role });
};