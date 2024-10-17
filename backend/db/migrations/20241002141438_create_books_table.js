/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('books', (table) => {
      table.increments('id').primary(); // Book ID
      table.string('title').notNullable(); // Book title
      table.string('author').notNullable(); // Book author
      table.integer('year');
      table.boolean('borrowed').defaultTo(false); // Borrowed status
      table.string('owner_name'); // Owner's name, nullable by default
      table.float('average_rating').defaultTo(0); // Average rating, default to 0
      table.integer('rating_count').defaultTo(0); // Count of ratings for average calculation
      table.timestamps(true, true); // Created at and updated at timestamps
    });
  };

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('books');
  };
