exports.up = function(knex, Promise) {
  return knex.schema.createTable('books', table => {
    table.increments('id').primary();
    table.string('name');
    table.integer('price');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('books');
};
