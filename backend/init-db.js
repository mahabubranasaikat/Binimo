const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    multipleStatements: true
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');

    // Read and execute schema
    const schemaPath = path.join(__dirname, '../database/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    db.query(schema, (err, results) => {
        if (err) {
            console.error('Error executing schema:', err);
            return;
        }
        console.log('Database schema initialized successfully');

        // Insert some sample data
        const sampleData = `
            INSERT INTO users (username, email, password_hash, role) VALUES
            ('admin', 'admin@binimoi.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin'),
            ('user1', 'user1@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user');

            INSERT INTO products (user_id, title, description, price, category, location, image_url, condition, status) VALUES
            (2, 'iPhone 13 Pro', 'Latest iPhone with excellent camera', 1099, 'Electronics', 'New York', 'https://via.placeholder.com/250x150?text=iPhone+13+Pro', 'new', 'approved'),
            (2, 'MacBook Air M2', 'Powerful laptop for professionals', 1299, 'Electronics', 'San Francisco', 'https://via.placeholder.com/250x150?text=MacBook+Air', 'new', 'approved'),
            (2, 'Honda Civic 2020', 'Well maintained sedan', 18000, 'Vehicles', 'Los Angeles', 'https://via.placeholder.com/250x150?text=Honda+Civic', 'used', 'approved');
        `;

        db.query(sampleData, (err, results) => {
            if (err) {
                console.error('Error inserting sample data:', err);
            } else {
                console.log('Sample data inserted successfully');
            }
            db.end();
        });
    });
});