import React, { useEffect, useState } from 'react';
import './App.css'; 
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Spinner from 'react-bootstrap/Spinner'; // Importing Spinner component for loading state
import Alert from 'react-bootstrap/Alert'; // Importing Alert component for error messages

function AllUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const navigate = useNavigate();

  // Fetch user data from the API
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true); // Start loading
      setError(null); // Reset error state
      try {
        const response = await axios.get('http://localhost:5000/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Failed to load users. Please try again later.'); // Set error message
      } finally {
        setLoading(false); // End loading
      }
    };
    fetchUsers();
  }, []);

  // Handle card click to navigate to the user's details page
  const handleCardClick = (userId) => {
    navigate(`/Details/${userId}`, { state: userId });
  };

  return (
    <Container>
      {loading ? ( // Show loading spinner while fetching data
        <div className="text-center mt-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : error ? ( // Show error message if there's an error
        <Alert variant="danger" className="mt-3">
          {error}
        </Alert>
      ) : (
        <Row>
          {users.map((user) => (
            <Col xs={12} sm={6} md={4} lg={3} key={user.id} className="mb-4">
              <Card
                className="user-card shadow-sm p-3 bg-white rounded h-100"
                onClick={() => handleCardClick(user.id)}
              >
                <Card.Body>
                  <Card.Title>{user.id}</Card.Title>
                  <Card.Text>{user.name}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default AllUsers;
