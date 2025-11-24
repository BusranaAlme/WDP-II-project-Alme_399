const express = require('express');
// index.js
const taskRoutes = require('./routes/tasks'); // instead of './tasks'
 // Import task routes

const app = express();

// ==========================================
// MIDDLEWARE
// ==========================================
// Parse JSON request bodies (MUST be before routes)
app.use(express.json());

// ==========================================
// ROUTES
// ==========================================

// Root route - API welcome message
app.get('/', (req, res) => {
  res.json({ 
    message: 'Task Manager API',
    version: '1.0.0',
    endpoints: {
      tasks: '/tasks',
      health: '/health'
    }
  });
});

// Health check route
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Mount task routes at /tasks
app.use('/tasks', taskRoutes);

// ==========================================
// START SERVER
// ==========================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`📝 Tasks API: http://localhost:${PORT}/tasks`);
});