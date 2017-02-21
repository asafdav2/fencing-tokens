'use strict';

const knex = require('./knex');
const bookshelf = require('bookshelf')(knex);

const FencingToken = module.exports = bookshelf.Model.extend({
  tableName: 'fencing_tokens'
});

FencingToken.generate = function (name) {
  return knex('fencing_tokens')
    .where('name', name)
    .increment('token')
    .returning('token')
    .then(result => result[0]);
};

function initialize(table) {
  return knex.raw(`INSERT INTO fencing_tokens (name, token) VALUES ('${table}', 1) ON CONFLICT DO NOTHING`);
}

FencingToken.initializer = function () {
  const tables = ['books'];

  return Promise.all(tables.map(initialize));
};


