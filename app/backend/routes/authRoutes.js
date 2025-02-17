const express = require('express');
const router = express.Router();
const pool = require('../models/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// ✅ Debug log
console.log("✅ Loading authRoutes.js...");

// Register route
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (name, email, password, registration_date) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, hashedPassword, new Date()]
    );

    const user = result.rows[0];
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ message: "Registration successful!", token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error registering user' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  console.log("📢 /auth/login route hit!");
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({ message: "Login successful!", token });
  } catch (err) {
    console.error("❌ Error during login:", err);
    res.status(500).json({ message: "Error logging in" });
  }
});

// ✅ Debug log
console.log("✅ authRoutes.js is exporting routes...");


module.exports = router;
