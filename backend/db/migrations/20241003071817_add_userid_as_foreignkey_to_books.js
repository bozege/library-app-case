/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.table('books', (table) => {
      table.integer('user_id').unsigned(); // Add user_id column
      table.foreign('user_id').references('id').inTable('users'); // Set foreign key to users table
    });
  };

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.table('books', (table) => {
      table.dropColumn('user_id');
    });
  };
