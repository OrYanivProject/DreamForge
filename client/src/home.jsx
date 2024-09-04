import React, { useState } from 'react';
import './styles.css';

function Home() {
    const [idea, setIdea] = useState('');

    const handleSubmission = () => {
        // Logic to handle submission, possibly sending data to backend
        console.log(idea); // Just a placeholder action
    };

    return (
        <div className="container">
            <div className="form-container">
                <h2 className="title">Write your idea, and in one click,<br/>your project book is ready.</h2>
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
    );
}

export default Home;
