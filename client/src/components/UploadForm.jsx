import React, { useState } from 'react';

function UploadForm() {
  const [userId, setUserId] = useState(localStorage.getItem('userId')); // Retrieve userId stored in local storage
  const token = localStorage.getItem('token'); // Retrieve the JWT token from local storage

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    // Include the Authorization header with the bearer token
    const response = await fetch(`http://localhost:3001/users/${userId}/upload`, {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${token}` // Ensure the token is sent in the Authorization header
      },
    });

    if (response.ok) {
      alert('File uploaded successfully');
    } else {
      const errorMessage = await response.text();
      alert('Upload failed: ' + errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" name="file" required />
      <button type="submit">Upload File</button>
    </form>
  );
}

export default UploadForm;
