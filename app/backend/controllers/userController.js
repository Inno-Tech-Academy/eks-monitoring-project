const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DB_CONNECTION_STRING });

exports.getUsers = async (req, res) => {
    const users = (await pool.query('SELECT id, name, email FROM users')).rows;
    res.json(users);
};

