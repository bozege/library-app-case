import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Button, Spinner, Alert, Modal, Form, Card } from 'react-bootstrap';

function BooksDetail() {
    const { bookId } = useParams();
    const [bookDetails, setBookDetails] = useState(null);
    const [currentOwner, setCurrentOwner] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [userId, setUserId] = useState('');
    const [userIdError, setUserIdError] = useState('');

    const fetchBookDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/books/${bookId}`);
            setBookDetails(response.data);

            // Fetch the current owner's name using the user_id
            if (response.data.user_id){
                const ownerResponse = await axios.get(`http://localhost:5000/users/${response.data.user_id}`);
                setCurrentOwner(ownerResponse.data.name);
            }
            

        } catch (error) {
            console.error("Error fetching book details:", error);
            setError('Error fetching book details. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookDetails();
    }, [bookId]);

    const handleBorrowBook = () => {
        if (!userId) {
            setUserIdError('Please enter your User ID.');
        } else {
            borrowBook();
        }
    };

    const borrowBook = async () => {
        try {
            const response = await axios.post(`http://localhost:5000/users/${userId}/borrow/${bookId}`);
            alert(response.data.message);
            setShowModal(false);
            setUserId('');
            setUserIdError('');
        } catch (error) {
            console.error("Error borrowing book:", error);
            alert("Error borrowing book. Please try again.");
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

    // Display book details if everything is fine
    if (!bookDetails) return <div>Book details not found.</div>;

    return (
        <div className="container mt-5">
            <Card className="text-center">
                <Card.Header as="h2">{bookDetails.title}</Card.Header>
                <Card.Body>
                    <Card.Title>{bookDetails.author}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">Published: {bookDetails.year}</Card.Subtitle>
                    <Card.Text>
                        <strong>Current Owner:</strong> {currentOwner || "None"}<br />
                        <strong>Average Rating:</strong> {bookDetails.average_rating || "N/A"}
                    </Card.Text>
                    <Button 
                        variant="primary" 
                        disabled={bookDetails.borrowed} // Disable button if the book is borrowed
                        onClick={() => setShowModal(true)}
                    >
                        Borrow Book
                    </Button>
                </Card.Body>
                <Card.Footer className="text-muted">Enjoy your reading!</Card.Footer>
            </Card>

            {/* Modal for User ID input */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Borrow Book</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Please enter your User ID:</Form.Label>
                        <Form.Control
                            type="text"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            placeholder="User ID"
                        />
                        {userIdError && <Form.Text className="text-danger">{userIdError}</Form.Text>}
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleBorrowBook}>
                        Borrow
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default BooksDetail;
