import React, { useRef, useEffect } from 'react';
import WebViewer from '@pdftron/webviewer';
import '../styles.css'; 
 
const DocumentEditor = () => {
  const viewer = useRef(null);
 
  const handleSubmit = async () => {
    const fileUrl = sessionStorage.getItem('pdfUrl'); 
    const userId = localStorage.getItem('userId'); 
    const bookId = sessionStorage.getItem('bookId'); 
 
    if (!userId || !bookId) {
      console.error('User ID or Book ID is missing');
      return;
    }
 
    try {
      const documentBuffer = await viewer.current.instance.Core.documentViewer.getDocument().getFileData();
      console.log(documentBuffer);
 
      const response = await fetch(`http://localhost:3001/users/${userId}/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify({
          bookId: bookId, 
          fileBuffer: documentBuffer 
        })
      });
 
      const data = await response.json();
 
      if (response.ok) {
        console.log('Book updated successfully:', data.fileURL);
        sessionStorage.setItem('pdfUrl', data.fileURL); 
        alert('Book saved and updated successfully!');
      } else {
        console.error('Failed to update Book:', data.message);
      }
    } catch (error) {
      console.error('Error during Book upload:', error);
    }
  };
 
  useEffect(() => {
    const initWebViewer = async () => {
      const fileUrl = sessionStorage.getItem('pdfUrl'); 
      if (!fileUrl || !viewer.current) return;
 
      try {
        const instance = await WebViewer.WebComponent(
          {
            path: '/webviewer/lib',
            initialDoc: fileUrl, 
            enableOfficeEditing: true,
            licenseKey: 'demo:1726777239664:7e23db2a0300000000531682c10987c23c859ef4edb37e7c2f83eeaeea',
          },
          viewer.current,
        );
 
        viewer.current.instance = instance;
 
        const { documentViewer, annotationManager, Annotations } = instance.Core;
 
      } catch (error) {
        console.error('Error initializing WebViewer:', error);
      }
    };
 
    initWebViewer();
 
    return () => {
      if (viewer.current) {
        viewer.current.innerHTML = ''; 
      }
    };
  }, []);
 
  return (
    <div className="DocumentEditor">
      <div className="webviewer" ref={viewer} style={{ height: '100vh', overflow: 'hidden' }}></div>
    </div>
  );
};
 
export default DocumentEditor;
 
 