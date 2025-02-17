const pool = require('./db');

exports.createUser = async (name, email, password) => {
    return pool.query('INSERT INTO users (name, email, password) VALUES ($1, $2, $3)', [name, email, password]);
};

exports.getUserByEmail = async (email) => {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
};

