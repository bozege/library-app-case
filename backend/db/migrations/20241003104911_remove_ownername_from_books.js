/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.table('books', (table) => {
      table.dropColumn('owner_name'); // Remove owner_name column
    });
  };

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.table('books', (table) => {
        table.string('owner_name'); // Re-add owner_name column in case of rollback
    });
  };
