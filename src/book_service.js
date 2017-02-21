'use strict';

const Book = require('./book');
const FencingToken = require('./fencing_token');

class BookService {
  updatePrice(bookId, price) {
    return Promise.all([
      FencingToken.generate('books'),
      Book.forge({id: bookId}).fetch()
    ]).then(results => {
      const token = results[0];
      const book = results[1];
      return book
        .save({price, token})
        .then(() => ({price, token}));
    });
  }
}

module.exports = BookService;
