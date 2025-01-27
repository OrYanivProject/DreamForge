import React, { useState, useEffect } from 'react';

const Bookshelf = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    if (userId && token) {
      fetch(`http://localhost:3001/users/${userId}/books`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Error fetching books: ${response.statusText}`);
          }
          return response.json();
        })
        .then((data) => {
          if (data.message) {
            console.error('Error fetching books:', data.message);
          } else {
            setBooks(data);
          }
        })
        .catch((error) => {
          console.error('Fetch error:', error);
        });
    } else {
      console.error('Token or userId missing');
    }
  }, []);

  const handleAction = (action, book) => {
    if (action === 'Download' && book.pdfUrl) {
      fetch(book.pdfUrl)
        .then((response) => response.blob())
        .then((blob) => {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = book.title || 'download.pdf';
          document.body.appendChild(link);
          link.click();
          link.remove();
          window.URL.revokeObjectURL(url); 
        })
        .catch((error) => console.error('Error downloading file:', error));
    } else if (action === 'View' && book.pdfUrl) {
      sessionStorage.setItem('pdfUrl', book.pdfUrl);
      sessionStorage.setItem('bookId', book._id);
      const newTab = window.open('/documentEditor', '_blank');
      if (newTab) {
        newTab.focus();
      }
    } else if (action === 'Remove') {
      if (window.confirm('Are you sure you want to permanently remove this book?')) {
        const token = localStorage.getItem('token');
        fetch(`http://localhost:3001/users/${localStorage.getItem('userId')}/books/${book._id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error('Failed to delete book');
            }
            setBooks((prevBooks) => prevBooks.filter((b) => b._id !== book._id));
          })
          .catch((error) => console.error('Error removing book:', error));
      }
    }
  };

  return (
    <div>
      <div className="bookshelf">
        <div className='bookshelfTitle'>Your Bookshelf: All Your Ideas Stored in One Place Where You Can View, Download, or Remove Your Project Books.</div>
        <div className="books">
          {Array.isArray(books) ? (
            books.map((book) => (
              <div key={book._id} className="book">
                <span className="book-title">{book.title}</span>
                <div className="actions">
                  <button className="btn-download" onClick={() => handleAction('Download', book)}>Download</button>
                  <button className="btn-view" onClick={() => handleAction('View', book)}>View</button>
                  <button className="btn-remove" onClick={() => handleAction('Remove', book)}>Remove</button>
                </div>
              </div>
            ))
          ) : (
            <p>No books found or error fetching books.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Bookshelf;
