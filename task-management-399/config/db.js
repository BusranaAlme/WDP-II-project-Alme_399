const mysql = require('mysql2');

// Create connection pool for better performance
const connection = mysql.createPool({
  host: 'localhost',        // MySQL server location (on this computer)
  user: 'taskuser',         // Username we created in Step 2
  password: 'taskpass123',  // Password we set in Step 2
  database: 'taskdb',       // Database we created in Step 2
  waitForConnections: true, // Wait if all connections are busy
  connectionLimit: 10,      // Maximum 10 simultaneous connections
  queueLimit: 0            // No limit on waiting requests
});

// Convert to promise-based API for async/await
const promiseConnection = connection.promise();

// Export for use in other files
module.exports = promiseConnection;