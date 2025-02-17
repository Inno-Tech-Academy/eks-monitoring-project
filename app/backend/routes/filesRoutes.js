const express = require('express');
const router = express.Router();
const pool = require('../models/db'); // Import the database connection

// Route to get files
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM files');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching files:', err);
        res.status(500).json({ message: 'Error fetching files' });
    }
});

module.exports = router;