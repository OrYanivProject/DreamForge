import React, { useState, useEffect } from 'react';
import Header from './Header';

const Bookshelf = () => {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
        if (userId && token) {
            fetch(`http://localhost:3001/users/${userId}/books`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    console.error('Error fetching books:', data.message);
                } else {
                    setBooks(data);
                }
            })
            .catch(error => {
                console.error('Fetch error:', error);
            });
        } else {
            console.error('Token or userId missing');
        }
    }, []);
    
    

    const handleAction = (action, book) => {
        if (action === "Download" && book.pdfUrl) {
            // Adjust URL to ensure it forces download
            window.open(book.pdfUrl.replace('dl=0', 'dl=1'), '_blank');
        } else if (action === "View" && book.pdfUrl) {
            // Open the PDF URL in a new tab without forcing download
            window.open(book.pdfUrl.replace('dl=1', 'dl=0'), '_blank');
        } else if (action === "Remove") {
            const token = localStorage.getItem('token');
            fetch(`http://localhost:3001/users/${localStorage.getItem('userId')}/books/${book._id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to delete book');
                }
                setBooks(prevBooks => prevBooks.filter(b => b._id !== book._id));
            })
            .catch(error => console.error('Error removing book:', error));
        }
    };
    
    

    return (
        <div>
            <Header />
            <div className="bookshelf">
                <h2>Your Bookshelf: All Your Ideas Stored in One Place Where You Can View, Download, or Remove Your Project Books.</h2>
                <div className="books">
                    {Array.isArray(books) ? (
                        books.map(book => (
                            <div key={book._id} className="book">
                                <span className="book-title">{book.title}</span>
                                <div className="actions">
                                    <button onClick={() => handleAction("Download", book)}>Download</button>
                                    <button onClick={() => handleAction("View", book._id)}>View</button>
                                    <button onClick={() => handleAction("Remove", book)}>Remove</button>
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
    
}

export default Bookshelf;
