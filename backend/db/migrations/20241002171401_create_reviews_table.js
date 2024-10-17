/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('reviews', (table) => {
      table.increments('id'); // Review ID
      table.integer('user_id').unsigned().notNullable(); // User ID
      table.integer('book_id').unsigned().notNullable(); // Book ID
      table.integer('user_review').notNullable(); // Rating from 1 to 10
  
      // Foreign key relations
      table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
      table.foreign('book_id').references('id').inTable('books').onDelete('CASCADE');
      
      table.timestamps(true, true); // Created at and updated at timestamps
    });
  };

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('reviews');
  };
