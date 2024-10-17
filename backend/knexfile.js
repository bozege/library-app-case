// knexfile.js
module.exports = {
  client: 'pg', // Specify PostgreSQL as the client
  connection: {
    host: 'localhost', // Your PostgreSQL server address
    user: 'postgres', // Your PostgreSQL username
    password: 'admin', // Your PostgreSQL password
    database: 'test_db', // The name of your database
  },
  migrations: {
    tableName: 'knex_migrations', // Optional: specify the migrations table
  },
};
