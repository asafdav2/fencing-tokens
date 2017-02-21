'use strict';

process.env.NODE_ENV = 'test';

const knex = require('./../src/knex');
const FencingToken = require('./../src/fencing_token');
const expect = require('chai').expect;

describe('FencingToken', () => {
  beforeEach(() => FencingToken.query().delete().then(() => FencingToken.initializer()));

  describe('generate', () => {
    it('increments the token', () => {
      return FencingToken.generate('books').then(token => {
        expect(token).to.eql(2);
      });
    });
  });
});
