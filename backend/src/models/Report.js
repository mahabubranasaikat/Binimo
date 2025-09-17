const db = require('../config/database');

class Report {
    static create(reportData, callback) {
        const { product_id, user_id, reason } = reportData;
        const sql = 'INSERT INTO reports (product_id, user_id, reason) VALUES (?, ?, ?)';
        db.query(sql, [product_id, user_id, reason], callback);
    }

    static findAll(callback) {
        const sql = 'SELECT * FROM reports';
        db.query(sql, callback);
    }

    static updateStatus(id, status, callback) {
        const sql = 'UPDATE reports SET status = ? WHERE id = ?';
        db.query(sql, [status, id], callback);
    }
}

module.exports = Report;