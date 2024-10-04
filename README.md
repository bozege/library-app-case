LIBRARY APP CASE PROJECT

This app is built with Node.js and Express for the back end, React.js for the front end and PostgreSQL with Knex.js for database operations. The application allows viewing the users, the books, borrowal and returning operations.

SETUP

    * Clone git repository.
        - git clone https://github.com/bozege/library-app-case.git
        - cd library-case-app
    * Install dependencies.
        - npm install
    * Set up database
    * Run db migrations
        - npx knex migrate:latest
    * Start the server
        - node server.js
    * Start client
        ! Navigate to the React app directory and run the command below.
        -
    * Run SQL file
        - psql -U <username> -d <database_name> -f <path_to_sql_file>
    * Testing
        ! Import the postman collection that I have sent via email. There are a few additional endpoints to what you have provided with the case, and they are used to add book and user data to the db. Feel free to ignore those if you already have a db ready to test this case.

Thank you!
