const mysql = require('mysql2');

const pool = mysql.createPool({
  // Railway MySQL variables
  host: process.env.MYSQLHOST || process.env.DB_HOST || 'localhost',
  port: process.env.MYSQLPORT || process.env.DB_PORT || 3306,
  user: process.env.MYSQLUSER || process.env.DB_USER || 'root',
  password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || '',
  database: process.env.MYSQLDATABASE || process.env.DB_NAME || 'queue_system',

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const db = pool.promise();

db.getConnection()
  .then((connection) => {
    console.log('✅ MySQL connected successfully');
    connection.release();
  })
  .catch((err) => {
    console.error('❌ MySQL connection error:', err.message);
  });

module.exports = db;
