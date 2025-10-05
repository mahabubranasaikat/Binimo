const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'binimoi'
});

db.connect((err) => {
    if (err) throw err;
    // Database connected successfully
});

module.exports = db;