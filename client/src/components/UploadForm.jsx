import React, { useState } from 'react';

function UploadForm() {
    const [userId, setUserId] = useState(localStorage.getItem('userId')); // Retrieve userId stored in local storage
    const token = localStorage.getItem('token'); // Retrieve the JWT token from local storage

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);

        // Convert the formData fields to single values, ensuring title and description are strings
        const bookData = {
            title: formData.get('title'),  // Convert title to string
            description: formData.get('description'),  // Convert description to string
            file: formData.get('file')  // File stays as is
        };

        const uploadData = new FormData();
        uploadData.append('title', bookData.title);
        uploadData.append('description', bookData.description);
        uploadData.append('file', bookData.file);

        const response = await fetch(`http://localhost:3001/users/${userId}/upload`, {
            method: 'POST',
            body: uploadData,
            headers: {
                'Authorization': `Bearer ${token}`  // Ensure the token is sent in the Authorization header
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
            <input type="text" name="title" placeholder="Title" required />
            <input type="text" name="description" placeholder="Description" required />
            <input type="file" name="file" required />
            <button type="submit">Upload File</button>
        </form>
    );
}

export default UploadForm;
