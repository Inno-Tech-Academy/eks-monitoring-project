const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const pool = require('../models/db'); // Import the database connection

// Configure AWS SDK
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'AKIA2CUNLOMUT4I2FCGC',
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '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',
  region: process.env.AWS_REGION || 'us-east-1',
});

const s3 = new AWS.S3();
const bucketName = process.env.AWS_S3_BUCKET_NAME || 'paypall-bucket-01';

// Function to upload a file to S3
const uploadFile = async (req, res) => {
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
};

// Function to get files from the database
const getFiles = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM files');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching files:', err);
    res.status(500).json({ message: 'Error fetching files' });
  }
};

module.exports = {
  uploadFile,
  getFiles,
};