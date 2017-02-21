'use strict';

const knex = require('./knex');
const bookshelf = require('bookshelf')(knex);

const Book = module.exports = bookshelf.Model.extend({
  tableName: 'books',

  initialize: function () {
    this.on('updating', this.ensureFencingToken, this);
  },

  ensureFencingToken: function (model, attrs) {
    if (!attrs.token) {
      return Promise.resolve(false);
    }
    return knex('fencing_tokens').where('name', 'books').select('token').then(rows => {
      const token = rows[0].token;
      if (token > attrs.token) {
        throw new Error(`stale token provided (${attrs.token} vs ${token})`);
      }
      delete this.attributes.token;
    });
  }
});

