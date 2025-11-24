const express = require('express');
const router = express.Router();
const db = require('../../config/db'); // Import database connection

// ==========================================
// GET ALL TASKS
// ==========================================
router.get('/', async (req, res) => {
  try {
    // Execute SQL query to get all tasks, newest first
    const [rows] = await db.query('SELECT * FROM tasks ORDER BY created_at DESC');
    
    // Return tasks as JSON
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// ==========================================
// GET SINGLE TASK BY ID
// ==========================================
router.get('/:id', async (req, res) => {
  const { id } = req.params; // Extract ID from URL parameter
  
  try {
    // Query for specific task
    // The ? is a placeholder (prevents SQL injection)
    const [rows] = await db.query('SELECT * FROM tasks WHERE id = ?', [id]);
    
    // Check if task exists
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    // Return the first (and only) result
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// ==========================================
// CREATE NEW TASK (POST)
// ==========================================
router.post('/', async (req, res) => {
  const { title, description, status } = req.body;
  
  // Validation: title is required
  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required' });
  }
  
  try {
    // Insert new task into database
    const sql = 'INSERT INTO tasks (title, description, status) VALUES (?, ?, ?)';
    const [result] = await db.query(sql, [
      title.trim(),           // Remove whitespace
      description || null,    // Use null if description not provided
      status || 'pending'     // Default to pending if status not provided
    ]);
    
    // Fetch the newly created task using its auto-generated ID
    const [newTask] = await db.query('SELECT * FROM tasks WHERE id = ?', [result.insertId]);
    
    // Return the new task with 201 Created status
    res.status(201).json(newTask[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// ==========================================
// UPDATE TASK (PUT)
// ==========================================
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;
  
  try {
    // Build dynamic UPDATE query based on provided fields
    const updates = [];
    const values = [];
    
    // Only update fields that were provided
    if (title !== undefined) { 
      updates.push('title = ?'); 
      values.push(title); 
    }
    if (description !== undefined) { 
      updates.push('description = ?'); 
      values.push(description); 
    }
    if (status !== undefined) { 
      updates.push('status = ?'); 
      values.push(status); 
    }
    
    // Check if any fields were provided
    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }
    
    // Add ID to values array (for WHERE clause)
    values.push(id);
    
    // Execute UPDATE query
    const sql = `UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`;
    const [result] = await db.query(sql, values);
    
    // Check if task existed
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    // Fetch and return updated task
    const [updated] = await db.query('SELECT * FROM tasks WHERE id = ?', [id]);
    res.json(updated[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// ==========================================
// DELETE TASK
// ==========================================
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    // Execute DELETE query
    const [result] = await db.query('DELETE FROM tasks WHERE id = ?', [id]);
    
    // Check if task existed
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    // Return 204 No Content (successful deletion)
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

module.exports = router;