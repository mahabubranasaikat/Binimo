const db = require('../config/database');

class Message {
    static create(messageData, callback) {
        const { sender_id, receiver_id, message } = messageData;
        const sql = 'INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)';
        db.query(sql, [sender_id, receiver_id, message], callback);
    }

    static findBetweenUsers(user1, user2, callback) {
        const sql = 'SELECT * FROM messages WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?) ORDER BY timestamp';
        db.query(sql, [user1, user2, user2, user1], callback);
    }

    static findByUser(userId, callback) {
        const sql = 'SELECT m.*, u.username as sender_name FROM messages m JOIN users u ON m.sender_id = u.id WHERE m.receiver_id = ? ORDER BY m.timestamp DESC';
        db.query(sql, [userId], callback);
    }
}

module.exports = Message;