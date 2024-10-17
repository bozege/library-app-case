// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const knex = require('knex')(require('./knexfile')); // Initialize Knex with the configuration

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// CRUD Operations go here...

// Create a book
app.post('/books', async (req, res) => {
  const { title, author, year } = req.body;

  try {
    const newBook = {
      title,
      author,
      year
    };
    await knex('books').insert(newBook);
    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ error: 'Error creating book' });
  }
});

// Read all books
app.get('/books', async (req, res) => {
  try {
    const books = await knex('books').select('*');
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching books' });
  }
});

// Read a book by ID
app.get('/books/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const book = await knex('books').where({ id }).first(); // Use `first()` to get a single record
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching book' });
  }
});

// Update a book
app.put('/books/:id', async (req, res) => {
  const { id } = req.params;
  const updatedFields = req.body;

  try {
    await knex('books').where({ id }).update(updatedFields);
    res.status(200).json({ message: 'Book updated' });
  } catch (error) {
    res.status(500).json({ error: 'Error updating book' });
  }
});

// Delete a book
app.delete('/books/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await knex('books').where({ id }).del();
    res.status(200).json({ message: `Book with ID ${id} deleted.` });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting book' });
  }
});

// ------------- END OF BOOKS CRUD -------------------//

// Create a user
app.post('/users', async (req, res) => {
  const { name } = req.body;

  try {
    const newUser = {
      name,
    };
    const [userId] = await knex('users').insert(newUser).returning('id'); // Insert and return the new user's ID
    res.status(201).json({ id: userId, ...newUser });
  } catch (error) {
    res.status(500).json({ error: 'Error creating user' });
  }
});

// Read all users
app.get('/users', async (req, res) => {
  try {
    const users = await knex('users').select('*');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching users' });
  }
});

// Read a user by ID
app.get('/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const user = await knex('users').where({ id }).first();
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user' });
  }
});

// Update a user
app.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const updatedFields = req.body;

  try {
    const updatedRows = await knex('users').where({ id }).update(updatedFields);
    if (updatedRows) {
      res.status(200).json({ message: 'User updated' });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error updating user' });
  }
});

// Delete a user
app.delete('/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedRows = await knex('users').where({ id }).del();
    if (deletedRows) {
      res.status(200).json({ message: `User with ID ${id} deleted.` });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error deleting user' });
  }
});

// ------------- END OF USERS CRUD -------------------//

app.get('/books/:book_id/reviews', async (req, res) => {
  const { book_id } = req.params;

  try {
    const reviews = await knex('reviews').where({ book_id }).select('*');
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching reviews' });
  }
});

// ------------- END OF REVIEWS CRUD -------------------//

// Borrow a book
// Updated borrow book logic
app.post('/users/:user_id/borrow/:book_id', async (req, res) => {
  const { user_id, book_id } = req.params;

  try {
      // Check if the book is available for borrowing
      const book = await knex('books').where({ id: book_id }).first();
      if (!book) {
          return res.status(404).json({ message: 'Book not found' });
      }

      if (book.borrowed) {
          return res.status(400).json({ message: 'Book is already borrowed' });
      }

      // Fetch the user info to update user_id
      const user = await knex('users').where({ id: user_id }).first();
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Update the book's borrowed status and user_id, without owner_name
      await knex('books')
          .where({ id: book_id })
          .update({
              borrowed: true,
              user_id: user.id // Store the user's ID who borrowed the book
          });

      res.json({ message: 'Book successfully borrowed', book_id, user_id });
  } catch (error) {
      console.error('Error borrowing book:', error);
      res.status(500).json({ message: 'Error borrowing book' });
  }
});

// Return a book
app.post('/users/:user_id/return/:book_id', async (req, res) => {
  const { user_id, book_id } = req.params;
  const { score } = req.body;

  try {
    // Fetch the user who is returning the book
    const user = await knex('users').where({ id: user_id }).first();
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Fetch the book being returned
    const book = await knex('books').where({ id: book_id }).first();
    if (!book || !book.borrowed || book.user_id !== parseInt(user_id)) {
      return res.status(400).json({ error: 'Book is not borrowed by this user' });
    }

    // Insert the review into the 'reviews' table
    await knex('reviews').insert({
      book_id: book_id,
      user_id: user_id,
      user_review: score
    });

    // Calculate the new average rating
    const reviews = await knex('reviews')
      .where({ book_id: book_id })
      .select('user_review');

    const totalRating = reviews.reduce((sum, review) => sum + review.user_review, 0);
    const averageRating = totalRating / reviews.length;

    // Update the book's borrowed status and average rating
    await knex('books').where({ id: book_id }).update({
      borrowed: false,
      user_id: null, // Clear the user_id as well since the book is returned
      average_rating: averageRating
    });

    res.status(200).json({ message: 'Book returned successfully', average_rating: averageRating });
  } catch (error) {
    res.status(500).json({ error: 'Error returning the book' });
  }
});

// Get borrowed books for a specific user
app.get('/users/:user_id/borrowedBooks', async (req, res) => {
  const { user_id } = req.params;
  try {
      const borrowedBooks = await knex('books').where({ user_id, borrowed: true });
      res.json(borrowedBooks); // This will now include the title
  } catch (error) {
      res.status(500).json({ error: 'Error fetching borrowed books' });
  }
});

// Get previously returned books with ratings
app.get('/users/:user_id/returnedBooks', async (req, res) => {
  const { user_id } = req.params; // Use user_id from request params
  console.log(`Fetching returned books for user ID: ${user_id}`); // Log user ID for debugging

  try {
      const returnedBooks = await knex('reviews')
          .join('books', 'reviews.book_id', '=', 'books.id')
          .select('books.id', 'books.title', 'books.author', 'books.year', 'books.average_rating','reviews.user_review') // Include attributes of books.
          .where('reviews.user_id', user_id); // Specify the table for user_id

      // Check if returnedBooks is empty
      if (returnedBooks.length === 0) {
          console.log(`No returned books found for user ID: ${user_id}`);
      }

      res.json(returnedBooks); // Return the books (empty array if none found)
  } catch (error) {
      console.error('Error fetching returned books:', error); // Log the error for debugging
      res.status(500).json({ error: 'Error fetching returned books' });
  }
});











/*
// Return a book
app.post('/users/:user_id/return/:book_id', async (req, res) => {
  const { user_id, book_id } = req.params;
  const { score } = req.body; // Get score from the body

  // Validate the score
  if (score < 1 || score > 10) {
    return res.status(400).json({ error: 'Score must be between 1 and 10.' });
  }

  try {
    const book = await knex('books').where({ id: book_id }).first();
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    if (!book.borrowed) {
      return res.status(400).json({ error: 'Book is not currently borrowed' });
    }

    // Get user information
    const user = await knex('users').where({ id: user_id }).first();
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update the book's borrowed status and owner name
    await knex('books').where({ id: book_id }).update({
      borrowed: false,
      owner_name: null, // Reset the owner_name when the book is returned
    });

    // Calculate the new average rating
    const totalRating = book.average_rating * (book.rating_count || 0) + score; // Old total rating
    const newRatingCount = (book.rating_count || 0) + 1; // Increment the rating count
    const newAverageRating = totalRating / newRatingCount;

    // Update the book's average rating and rating count
    await knex('books').where({ id: book_id }).update({
      average_rating: newAverageRating,
      rating_count: newRatingCount, // Keep track of the number of ratings
    });

    res.status(200).json({ message: `Book with ID ${book_id} returned by ${user.name}.` });
  } catch (error) {
    res.status(500).json({ error: 'Error returning book' });
  }
});
*/










// -------------- END OF OPERATIONS --------------------//

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Test the database connection
knex.raw('SELECT 1+1 AS result')
  .then(() => {
    console.log('Connected to PostgreSQL database.');
  })
  .catch((error) => {
    console.error('Error connecting to PostgreSQL database:', error);
  });


