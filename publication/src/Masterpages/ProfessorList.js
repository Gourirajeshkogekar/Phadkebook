import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProfessorList = () => {
    const [professors, setProfessors] = useState([]);
    const [offset, setOffset] = useState(0);
    const [loading, setLoading] = useState(false);
    const limit = 100; // Number of records to fetch per call

    const fetchProfessors = async () => {
        // setLoading(true);
        try {
            const response = await axios.get(`https://publication.microtechsolutions.co.in/Professorget.php?limit=${limit}&offset=${offset}`);
            console.log('Response:', response.data); // Log to verify API response
            setProfessors(prevProfessors => [...prevProfessors, ...response.data]); // Adjust if response structure differs
            setOffset(prevOffset => prevOffset + limit);
        } catch (error) {
            console.error('Error fetching data', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchProfessors(); // Fetch initial data
    }, []);

    const handleScroll = () => {
        const bottom = document.documentElement.scrollHeight === window.scrollY + window.innerHeight;
        if (bottom && !loading) {
            fetchProfessors(); // Fetch more data when scrolled to bottom
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div>
            <h1>Professor List</h1>
            <ul>
                {professors.map((professor, index) => (
                    <li key={index}>{professor.ProfessorName}</li>
                ))}
            </ul>
            {loading && <p>Loading...</p>}
        </div>
    );
};

export default ProfessorList;
