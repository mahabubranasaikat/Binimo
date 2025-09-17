const db = require('../config/database');

class User {
    static create(userData, callback) {
        const { username, email, password_hash, role } = userData;
        const sql = 'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)';
        db.query(sql, [username, email, password_hash, role], callback);
    }

    static findByEmail(email, callback) {
        const sql = 'SELECT * FROM users WHERE email = ?';
        db.query(sql, [email], callback);
    }

    static findById(id, callback) {
        const sql = 'SELECT id, username, email, role FROM users WHERE id = ?';
        db.query(sql, [id], callback);
    }
}

module.exports = User;