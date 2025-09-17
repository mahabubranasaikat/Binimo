const db = require('../config/database');

class Product {
    static create(productData, callback) {
        const { user_id, title, description, price, category, location, image_url } = productData;
        const sql = 'INSERT INTO products (user_id, title, description, price, category, location, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)';
        db.query(sql, [user_id, title, description, price, category, location, image_url], callback);
    }

    static findAll(callback) {
        const sql = 'SELECT * FROM products WHERE status = "approved"';
        db.query(sql, callback);
    }

    static findById(id, callback) {
        const sql = 'SELECT * FROM products WHERE id = ?';
        db.query(sql, [id], callback);
    }

    static updateStatus(id, status, callback) {
        const sql = 'UPDATE products SET status = ? WHERE id = ?';
        db.query(sql, [status, id], callback);
    }
}

module.exports = Product;