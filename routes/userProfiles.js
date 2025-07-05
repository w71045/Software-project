const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../models/db');

const SECRET = 'your_jwt_secret';

// Auth middleware
function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: 'No token' });
  try {
    const token = auth.split(' ')[1];
    req.user = jwt.verify(token, SECRET);
    next();
  } catch (err) {
    console.error('Auth error:', err.message);
    res.status(401).json({ message: 'Invalid token' });
  }
}

// Get user profile for logged-in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT age, gender, activity_level, dietary_preferences FROM user_profiles WHERE user_id = $1',
      [req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('GET user profile error:', err.message);
    res.status(500).json({ message: 'Server error', detail: err.message });
  }
});

// Create user profile (only if it doesn't exist yet)
router.post('/', authMiddleware, async (req, res) => {
  const { age, gender, activity_level, dietary_preferences } = req.body;
  try {
    // Check if profile exists
    const existing = await db.query(
      'SELECT * FROM user_profiles WHERE user_id = $1',
      [req.user.id]
    );
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'Profile already exists' });
    }

    const result = await db.query(
      `INSERT INTO user_profiles (user_id, age, gender, activity_level, dietary_preferences)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [req.user.id, age, gender, activity_level, dietary_preferences]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('POST user profile error:', err.message);
    res.status(500).json({ message: 'Server error', detail: err.message });
  }
});

// Update user profile
router.put('/', authMiddleware, async (req, res) => {
  const { age, gender, activity_level, dietary_preferences } = req.body;
  try {
    const result = await db.query(
      `UPDATE user_profiles
       SET age = $1, gender = $2, activity_level = $3, dietary_preferences = $4
       WHERE user_id = $5 RETURNING *`,
      [age, gender, activity_level, dietary_preferences, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('PUT user profile error:', err.message);
    res.status(500).json({ message: 'Server error', detail: err.message });
  }
});

module.exports = router;
