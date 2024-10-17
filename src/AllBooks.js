import React, { useEffect, useState } from 'react';
import './App.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import axios from 'axios';

function AllBooks() {
    const [books, setBooks] = useState([]);
    const [users, setUsers] = useState({}); // Store all users by user id

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch all books
                const booksResponse = await axios.get('http://localhost:5000/books');
                setBooks(booksResponse.data);

                // Fetch all users once and store them by user_id for quick lookup
                const usersResponse = await axios.get('http://localhost:5000/users');
                const usersMap = usersResponse.data.reduce((acc, user) => {
                    acc[user.id] = user.name;
                    return acc;
                }, {});
                setUsers(usersMap);
            } catch (error) {
                console.error('Error fetching books or users:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <Container>
            <Row>
                {books.map((book) => (
                    <Col xs={12} sm={6} md={4} lg={3} key={book.id}>
                        <Card 
                            className={`book-card ${book.borrowed ? 'borrowed' : 'available'}`}
                            onClick={() => window.location.href = `/books/${book.id}`}
                        >
                            <Card.Body>
                                <Card.Title>{book.title}</Card.Title>
                                <Card.Text>Author: {book.author}</Card.Text>
                                <Card.Text>Year: {book.year}</Card.Text>
                                <Card.Text>
                                    {book.borrowed
                                        ? `Borrowed by: ${users[book.user_id] || 'Unknown'}`
                                        : 'Available'}
                                </Card.Text>
                                <Card.Text>Average Rating: {book.average_rating.toFixed(2)}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
}

export default AllBooks;









/* 
function AllBooks() {
  const [books, setBooks] = useState([]);

  // Fetch book data from the API when the component mounts
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/books'); // Adjust the API URL as per your backend
        setBooks(response.data);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks();
  }, []); // Empty dependency array means this useEffect runs only once

  return (
    <Container>
      <Row>
        {books.map((book) => (
          <Col xs key={book.id}>
            <Card style={{ width: '18rem', marginTop: '15px' }}>
              <Card.Body>
                <Card.Title>{book.title}</Card.Title>
                <Card.Text>
                  Author: {book.author} <br />
                  Year: {book.year} <br />
                  Average Rating: {book.average_rating}
                </Card.Text>
                <Link to={`/Details/${book.id}`} state={book.id}>Next page</Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default AllBooks;
*/