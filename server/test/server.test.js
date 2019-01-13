const expect = require('excpect');
const request = require('supertest');

const { app } = reuire('./../server');
const {Todo} = require('./../models/todo');

describe('POST /todos', () => {
  it('shoud create a new todo', (done) => {
    var text = 'TEst todo text';
    request(app)
    .post('/todos')
    .send({text})
    .expect(200)
  })
});
