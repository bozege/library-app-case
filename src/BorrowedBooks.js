import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button } from 'react-bootstrap';

const BorrowedBooks = ({ userId }) => {
    const [borrowedBooks, setBorrowedBooks] = useState([]);

    useEffect(() => {
        const fetchBorrowedBooks = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/users/${userId}`); // Fetch user details
                setBorrowedBooks(response.data.borrowedBooks || []); // Assuming the API provides this
            } catch (error) {
                console.error("Error fetching borrowed books:", error);
            }
        };

        fetchBorrowedBooks();
    }, [userId]);

    const handleReturnBook = async (bookId) => {
        const score = prompt("Please enter your rating (1-10):");
        if (score) {
            try {
                const response = await axios.post(`http://localhost:5000/users/${userId}/return/${bookId}`, { score });
                alert(response.data.message);
                // Refresh the borrowed books after returning
                fetchBorrowedBooks(); 
            } catch (error) {
                console.error("Error returning the book:", error);
                alert("Error returning the book. Please try again.");
            }
        }
    };

    return (
        <div>
            <h3>Currently Borrowed Books</h3>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Book ID</th>
                        <th>Book Name</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {borrowedBooks.map(book => (
                        <tr key={book.id}>
                            <td>{book.id}</td>
                            <td>{book.bookName}</td>
                            <td>
                                <Button onClick={() => handleReturnBook(book.id)}>Return</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default BorrowedBooks;
