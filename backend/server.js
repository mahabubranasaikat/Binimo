require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'binimoi'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        process.exit(1);
    }
    console.log('Connected to MySQL database');
});

// Routes
try {
    app.use('/api/auth', require('./src/routes/auth'));
    app.use('/api/products', require('./src/routes/products'));
    app.use('/api/admin', require('./src/routes/admin'));
    app.use('/api/messages', require('./src/routes/messages'));
} catch (error) {
    console.error('Error loading routes:', error);
    process.exit(1);
}

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
