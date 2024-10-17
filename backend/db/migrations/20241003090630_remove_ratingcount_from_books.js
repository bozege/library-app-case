/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.table('books', function(table) {
        table.dropColumn('rating_count');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.table('books', function(table) {
        table.integer('rating_count').defaultTo(0); // Re-add if rolling back
    });
};
