import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css'; // Import the CSS file

const Dashboard = ({ token }) => {
  const [files, setFiles] = useState([]);
  const [file, setFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState('');
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get(`${API_URL}/files`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFiles(response.data);
      } catch (error) {
        console.error('Error fetching files:', error);
      }
    };
    fetchFiles();
  }, [token, API_URL]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!file) {
      setUploadMessage('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      setUploadMessage('File uploaded successfully!');
      setFiles([...files, response.data]);
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadMessage('Error uploading file.');
    }
  };
  
  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>

      <div className="upload-section">
        <h3>Upload a File</h3>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button onClick={handleFileUpload}>Upload</button>
        {uploadMessage && <p className="upload-message">{uploadMessage}</p>}
      </div>

      <div className="files-section">
        <h3>Your Files</h3>
        {files.length > 0 ? (
          <ul>
            {files.map((f) => (
              <li key={f.id}>
                <a href={f.url} target="_blank" rel="noopener noreferrer">{f.name}</a>
              </li>
            ))}
          </ul>
        ) : (
          <p>No files uploaded yet.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
