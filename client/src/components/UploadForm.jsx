import React, { useState } from "react";
import { storage } from "../firebase"; // Adjust path if needed
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

function UploadForm() {
    const [userId, setUserId] = useState(localStorage.getItem('userId')); 
    const token = localStorage.getItem('token');

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const file = formData.get('file');

        if (!file) {
            alert('No file selected.');
            return;
        }

        const fileRef = ref(storage, `uploads/${file.name}`);
        try {
            // Upload the file
            await uploadBytes(fileRef, file);
            const fileURL = await getDownloadURL(fileRef);

            const response = await fetch(`http://localhost:3001/users/${userId}/books`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: formData.get('title'),
                    description: formData.get('description'),
                    pdfUrl: fileURL
                })
            });

            if (response.ok) {
                alert('File uploaded and book added successfully');
            } else {
                const errorMessage = await response.text();
                alert('Upload failed: ' + errorMessage);
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('Upload failed: ' + error.message);
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
