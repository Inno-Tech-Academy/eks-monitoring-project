const express = require('express');
const router = express.Router();
const multer = require('multer');
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const pool = require('../models/db'); // Import the database connection

// Configure AWS SDK
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();
const bucketName = process.env.AWS_S3_BUCKET_NAME;

const upload = multer({ storage: multer.memoryStorage() });

// Route to upload a file
router.post('/', upload.single('file'), async (req, res) => {
  const { file } = req;
  if (!file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const fileKey = `${uuidv4()}-${file.originalname}`;

  const params = {
    Bucket: bucketName,
    Key: fileKey,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  try {
    const data = await s3.upload(params).promise();
    const result = await pool.query(
      'INSERT INTO files (name, path, url) VALUES ($1, $2, $3) RETURNING *',
      [file.originalname, fileKey, data.Location]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error uploading file:', err);
    res.status(500).json({ message: 'Error uploading file' });
  }
});

module.exports = router;