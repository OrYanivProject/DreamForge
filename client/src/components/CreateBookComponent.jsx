import React, { useState, useEffect, useRef } from 'react';
import { Await, useLocation } from 'react-router-dom'; // Import useLocation to get passed state
import { useNavigate } from 'react-router-dom';
import loadingBook from '../images/loading.gif'

const CreateBookComponent = () => {
    const [loading, setLoading] = useState(false);
    const [fileUrl, setFileUrl] = useState(null);
    const [error, setError] = useState(null);
    const location = useLocation(); 
    const { idea } = location.state || {}; 
    const [userId, setUserId] = useState(localStorage.getItem('userId')); 
    const token = localStorage.getItem('token');

    const hasCalledAPI = useRef(false); 
    const navigate = useNavigate(); 
    
    const handleCreateBook = async () => {
        if (!idea) {
            setError('No idea provided.');
            return;
        }

        setLoading(true);
        setError(null);

        try {

            const response = await fetch(`http://localhost:3001/users/${userId}/createbook`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    prompt: idea, 
                }),
            });

            const data = await response.json();

            if (response.ok) {
                
                setFileUrl(data.fileURL);
                navigate('/bookshelf');
            } else {
                setError('Failed to generate project book.');
            }
        } catch (err) {
            setError('An error occurred while generating the project book.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!hasCalledAPI.current) {
            handleCreateBook();
            hasCalledAPI.current = true; 
        }
    }, []); 

    return (
        <div className ='loading'>
            <img src={loadingBook} alt = "Generating Project..."/>
            {loading && <p>Generating project book, please wait...</p>}
            {fileUrl && (
                <div>
                    <p>Project book created successfully!</p>
                    <a href={fileUrl} download>
                        Download the project book
                    </a>
                </div>
            )}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default CreateBookComponent;
