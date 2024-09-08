import React, { useState, useEffect } from 'react';
import Header from './Header';

const Bookshelf = () => {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            import('jwt-decode').then(({ default: jwtDecode }) => {
                const decoded = jwtDecode(token);  // This decodes the token
                const userId = decoded.id;        // Assuming the ID is stored as 'id' in the token

                fetch(`http://localhost:3001/users/${userId}/books`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                .then(response => response.json())
                .then(setBooks)
                .catch(console.error);
            });
        }
    }, []);

    const handleAction = (action, bookId) => {
        const token = localStorage.getItem('token');
        import('jwt-decode').then(({ default: jwtDecode }) => {
            const userId = jwtDecode(token).id;
            if (action === "Remove") {
                fetch(`http://localhost:3001/users/${userId}/books/${bookId}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                .then(response => {
                    if (response.ok) setBooks(prevBooks => prevBooks.filter(book => book._id !== bookId));
                })
                .catch(error => console.error('Error removing book:', error));
            }
        });
    };

    return (
        <div>
            <Header /> 
        <div className="bookshelf">
            <h2>Your Bookshelf: All Your Ideas Stored in One Place Where You Can View, Download, or Remove Your Project Books.</h2>
            <div className="books">
                {books.map(book => (
                    <div key={book._id} className="book">
                        <span className="book-title">{book.title}</span>
                        <div className="actions">
                            <button onClick={() => handleAction("Download", book._id)}>Download</button>
                            <button onClick={() => handleAction("View", book._id)}>View</button>
                            <button onClick={() => handleAction("Remove", book._id)}>Remove</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        </div>
    );
};

export default Bookshelf;
