import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import axios from 'axios';
import './Details.css';

function ReturnedBooks() {
    const [returnedBooks, setReturnedBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const userId = 1; // Replace with actual user ID as necessary

    useEffect(() => {
        const fetchReturnedBooks = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:5000/users/${userId}/returnedBooks`);
                setReturnedBooks(response.data);
            } catch (error) {
                setError('Error fetching returned books. Please try again later.');
                console.error('Error fetching returned books:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchReturnedBooks();
    }, [userId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Book ID</th>
                    <th>Book Name</th>
                    <th>User Rating</th>
                </tr>
            </thead>
            <tbody>
                {returnedBooks.map(item => (
                    <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.title}</td>
                        <td>{item.user_review}</td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
}

export default ReturnedBooks;
