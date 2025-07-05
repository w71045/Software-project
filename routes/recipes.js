const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const db = require('../models/db');

const SECRET = 'your_jwt_secret';

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: 'No token' });
  try {
    const token = auth.split(' ')[1];
    req.user = jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
}

// GET all recipes
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM recipes');
    res.json(result.rows);
  } catch (err) {
    console.error('DB error:', err.message);
    res.status(500).json({ message: 'Server error', detail: err.message });
  }
});

// POST create a new recipe
router.post('/', authMiddleware, async (req, res) => {
  const { name, description, ingredients } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO recipes (name, description, ingredients, user_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, description, JSON.stringify(ingredients), req.user.id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('DB error:', err.message);
    res.status(500).json({ message: 'Server error', detail: err.message });
  }
});

// PUT update a recipe
router.put('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { name, description, ingredients } = req.body;
  try {
    const result = await db.query(
      `UPDATE recipes 
       SET name = $1, description = $2, ingredients = $3 
       WHERE id = $4 AND user_id = $5 
       RETURNING *`,
      [name, description, JSON.stringify(ingredients), id, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Recipe not found or unauthorized' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('DB error:', err.message);
    res.status(500).json({ message: 'Server error', detail: err.message });
  }
});

// DELETE a recipe
router.delete('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      'DELETE FROM recipes WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Recipe not found or unauthorized' });
    }
    res.json({ message: 'Deleted', recipe: result.rows[0] });
  } catch (err) {
    console.error('DB error:', err.message);
    res.status(500).json({ message: 'Server error', detail: err.message });
  }
});

module.exports = router;
