exports.up = function (knex, Promise) {
  return knex.schema.createTable('fencing_tokens', table => {
    table.increments('id').primary();
    table.string('name');
    table.integer('token').default(1);
    table.unique('name');
  });
};

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('fencing_tokens');
};
