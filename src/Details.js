import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from './Header';
import axios from 'axios';
import { Tab, Tabs, Table, Button, Alert, Spinner, Modal, Form } from 'react-bootstrap';

function Details() {
    const { userId } = useParams(); // Get userId from URL params
    const [userDetails, setUserDetails] = useState(null);
    const [returnedBooks, setReturnedBooks] = useState([]); 
    const [borrowedBooks, setBorrowedBooks] = useState([]); 
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state
    const [showModal, setShowModal] = useState(false); // State for modal visibility
    const [selectedBookId, setSelectedBookId] = useState(null); // Store the selected book ID
    const [rating, setRating] = useState(''); // Store the rating
    const [ratingError, setRatingError] = useState(''); // Store rating error

    const fetchUserDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/users/${userId}`); // Fetch user details
            setUserDetails(response.data);

            // Fetch borrowed books based on user ID
            const borrowedResponse = await axios.get(`http://localhost:5000/users/${userId}/borrowedBooks`);
            setBorrowedBooks(borrowedResponse.data || []);

            // Fetch previously returned books along with ratings from the reviews table
            const returnedResponse = await axios.get(`http://localhost:5000/users/${userId}/returnedBooks`);
            setReturnedBooks(returnedResponse.data || []);
        } catch (error) {
            console.error("Error fetching user details:", error);
            setError('Error fetching user details. Please try again later.'); // Set error message
        } finally {
            setLoading(false); // End loading state
        }
    };

    useEffect(() => {
        fetchUserDetails(); // Call the function when the component mounts
    }, [userId]);

    const handleReturnBook = (bookId) => {
        setSelectedBookId(bookId);
        setShowModal(true); // Show the modal
    };

    const handleRatingChange = (e) => {
        const value = e.target.value;

        // Allow only numbers between 1 and 10
        if (value === '' || (Number(value) >= 1 && Number(value) <= 10)) {
            setRating(value);
        }
    };

    const submitRating = async () => {
        if (rating === '' || Number(rating) < 1 || Number(rating) > 10) {
            setRatingError('Please enter a valid rating between 1 and 10.');
            return;
        }

        try {
            const response = await axios.post(`http://localhost:5000/users/${userId}/return/${selectedBookId}`, { score: rating });
            alert(response.data.message);
            setShowModal(false); // Close the modal
            setRating(''); // Clear the rating
            setRatingError(''); // Clear any previous errors
            fetchUserDetails(); // Call the function to refresh user details
        } catch (error) {
            console.error("Error returning the book:", error);
            alert("Error returning the book. Please try again.");
        }
    };

    // Display loading state
    if (loading) {
        return (
            <div className="text-center mt-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    // Display error state
    if (error) {
        return (
            <div className="text-center mt-5">
                <Alert variant="danger">{error}</Alert>
            </div>
        );
    }

    // Display user details if everything is fine
    if (!userDetails) return <div>User details not found.</div>; // User not found

    return (
        <>
            <Header title={`Details of ${userDetails.name}`} description={"World of Books"} />
            <Tabs defaultActiveKey="borrowed" id="justify-tab-example" className="mb-3" justify>
                <Tab eventKey="borrowed" title="Currently Borrowed Books"> 
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Book ID</th>
                                <th>Title</th>
                                <th>Author</th>
                                <th>Year</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {borrowedBooks.map(book => (
                                <tr key={book.id}>
                                    <td>{book.id}</td>
                                    <td>{book.title}</td> {/* Using title from books */}
                                    <td>{book.author}</td>
                                    <td>{book.year}</td>
                                    <td>
                                        <Button onClick={() => handleReturnBook(book.id)}>Return Book</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Tab>
                <Tab eventKey="returned" title="Past Borrowals & Reviews">
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Book ID</th>
                                <th>Title</th>
                                <th>Author</th>
                                <th>Year</th>
                                <th>Average Rating</th>
                                <th>User's Rating</th>
                            </tr>
                        </thead>
                        <tbody>
                            {returnedBooks.map(book => (
                                <tr key={book.id}>
                                    <td>{book.id}</td>
                                    <td>{book.title}</td> {/* Using title from books */}
                                    <td>{book.author}</td>
                                    <td>{book.year}</td>
                                    <td>{book.average_rating}</td>
                                    <td>{book.user_review}</td> {/* User review from reviews table */}
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Tab>
            </Tabs>

            {/* Modal for rating input */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Return Book</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Please enter your rating (1-10):</Form.Label>
                        <Form.Control
                            type="number"
                            min="1"
                            max="10"
                            value={rating}
                            onChange={handleRatingChange}
                        />
                        {ratingError && <Form.Text className="text-danger">{ratingError}</Form.Text>}
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={submitRating}>
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default Details;
