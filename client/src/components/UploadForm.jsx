import React from 'react';

function UploadForm() {
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const response = await fetch('http://localhost:3001/upload', {
      method: 'POST',
      body: formData,
    });
    if (response.ok) {
      alert('File uploaded successfully');
    } else {
      alert('Upload failed');
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
