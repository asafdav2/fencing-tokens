'use strict';

process.env.NODE_ENV = 'test';

const _ = require('lodash');
const knex = require('./../src/knex');
const Book = require('./../src/book');
const BookService = require('./../src/book_service');
const FencingToken = require('./../src/fencing_token');
const expect = require('chai').expect;

describe('BookService', () => {
  let bookService, book;

  beforeEach(() => Promise.all([
    Book.query().delete(),
    FencingToken.query().delete()
  ]).then(() => {
    bookService = new BookService();
    return Promise.all([
      Book.forge({name: 'Lord of the Rings'}).save().then(_book => { book = _book; }),
      FencingToken.initializer()
    ]);
  }));

  describe('updatePrice', () => {
    it("increments book's fencing token", () => {
      return bookService.updatePrice(book.id, 20.0).then(() => {
        return FencingToken.where({name: 'books'}).fetch().then(token => {
          expect(token.get('token')).to.eql(2);
        });
      });
    });
  });

  describe('stress', () => {
    it ('determines the final price', function() {
      this.timeout(10000);

      const client = function(id) {
        return new Promise(resolve => {
          setTimeout(() => bookService.updatePrice(book.id, id).then(resolve).catch(resolve), id);
        });
      };

      const clients = 1000;
      return Promise.all(_.range(clients).map(id => client(id))).then(results => {
        const expectedPrice = _.maxBy(results, 'token').price;

        return book.refresh().then((book) => {
          expect(book.get('price')).to.eql(expectedPrice);
        });
      });
    });
  });
});
