const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();


const authRoutes = require('./routes/authRoutes');
const filesRoutes = require('./routes/filesRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();

app.use(cors({ 
    origin: "*",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization"
}));

app.use(bodyParser.json());

// ✅ Mount the routes correctly
app.use('/auth', authRoutes);
app.use('/files', filesRoutes);
app.use('/upload', uploadRoutes);

// ✅ Health Check
app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

// ✅ Root Endpoint
app.get('/', (req, res) => {
    res.send('Welcome to the Backend API!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
