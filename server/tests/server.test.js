const expect = require('expect');
const request = require('supertest');

const { app } = require('./../server');
const { Note } = require('./../models/note');

describe('POST /notes', () => {
  it('should save a new note', (done) => {
    const testNote = {
      title: 'Test Title 1',
      body: 'Test Body 1',
      edits: [],
    };

    request(app)
      .post('/notes')
      .send(testNote)
      .expect(200)
      .end(done);
  });
});
