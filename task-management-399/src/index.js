// src/index.js

const express = require('express');
const app = express();
const port = 3000;

//  1. Import the router file
const taskRoutes = require('./routes/tasks');

//  2. Use the router for all routes
app.use('/', taskRoutes);

// 3. Add the /health route
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime() // shows how long the app has been running
  });
});

// 4. Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
