const db = require('../config/database');

class Product {
    static create(productData, callback) {
        const { user_id, title, description, price, category, location, image_url, condition } = productData;
        const sql = 'INSERT INTO products (user_id, title, description, price, category, location, image_url, condition) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        db.query(sql, [user_id, title, description, price, category, location, image_url, condition || 'used'], callback);
    }

    static findAll(callback) {
        const sql = 'SELECT *, JSON_UNQUOTE(image_url) as images FROM products WHERE status = "approved"';
        db.query(sql, (err, results) => {
            if (err) return callback(err);
            // Parse JSON images
            results.forEach(product => {
                try {
                    product.images = product.image_url ? JSON.parse(product.image_url) : [];
                } catch (e) {
                    product.images = [];
                }
            });
            callback(null, results);
        });
    }

    static findById(id, callback) {
        const sql = 'SELECT *, JSON_UNQUOTE(image_url) as images FROM products WHERE id = ?';
        db.query(sql, [id], (err, results) => {
            if (err) return callback(err);
            if (results.length > 0) {
                try {
                    results[0].images = results[0].image_url ? JSON.parse(results[0].image_url) : [];
                } catch (e) {
                    results[0].images = [];
                }
            }
            callback(null, results);
        });
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