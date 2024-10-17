-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Create books table
CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    year INTEGER,
    borrowed BOOLEAN DEFAULT FALSE,
    average_rating FLOAT DEFAULT 0,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL -- Foreign key to users
);

-- Create reviews table
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    book_id INTEGER REFERENCES books(id) ON DELETE CASCADE, -- Foreign key to books
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE, -- Foreign key to users
    user_review INTEGER CHECK (user_review >= 1 AND user_review <= 10) -- Rating between 1-10
);
