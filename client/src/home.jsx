import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './styles.css';

function Home() {
    const [idea, setIdea] = useState('');
    const navigate = useNavigate(); 

    const handleSubmission = () => {
        if (idea.trim()) {
            
            navigate('/create-book', { state: { idea } });
        } else {
            alert('Please enter your idea before submitting.');
        }
    };

    return (
        <div>
            <div className="container home-container">
                <div className="form-container">
                    <h2 className="description">Write your idea, and in one click, your project book is ready.</h2>
                    <input
                        type="text"
                        placeholder="Let's build the future..."
                        className="input-field"
                        value={idea}
                        onChange={(e) => setIdea(e.target.value)}
                    />
                    <button className="button" onClick={handleSubmission}>Make it Real</button>
                </div>
            </div>
        </div>
    );
}

export default Home;
