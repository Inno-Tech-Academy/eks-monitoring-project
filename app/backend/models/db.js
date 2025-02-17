require('dotenv').config();
const { Pool } = require('pg');

const { DB_USER, DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_SSL } = process.env;

const pool = new Pool({
    user: DB_USER || "postgres",
    host: DB_HOST || "postgres",
    database: DB_NAME || "postgres",
    password: DB_PASSWORD || "postgres",
    port: DB_PORT || 5432,
    ssl: DB_SSL === "true" ? { rejectUnauthorized: false } : false,
});

// Function to ensure database and table exist
const setupDatabase = async () => {
    const query = `
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    `;
    try {
        await pool.query(query);
        console.log("✅ Users table is ready!");
    } catch (err) {
        console.error("❌ Error ensuring users table exists:", err);
    }
};

// Run table setup on startup
setupDatabase();

module.exports = pool;
