const expect = require('expect');
const request = require('supertest');

const { app } = require('./../server');
const { Note } = require('./../models/note');
const { populateNotes, notes } = require('./seed/seed');

const mongoose = require('mongoose');
mongoose.connect('PostNoteTest');

beforeEach(populateNotes);

describe('POST /notes', () => {
  it('should save a new note', (done) => {
    const testNote = {
      title: 'Test Title 1',
      body: 'Test Body 1',
      createdAt: new Date().getTime(),
      edits: [],
    };

    request(app)
      .post('/notes')
      .send(testNote)
      .expect(200)
      .expect((res) => {
        expect(res.body.title).toBe(testNote.title);
        expect(res.body.body).toBe(testNote.body);
      })
      .end(done);
  });
});

describe('GET /notes', () => {
  it('Should get all notes', (done) => {
    request(app)
      .get('/notes')
      .expect(200)
      .expect((res) => {
        expect(res.body.notes[0].title).toBe(notes[0].title);
        expect(res.body.notes[1].body).toBe(notes[1].body);
      })
      .end(done);
  });
});

describe('PATCH /notes/:id', () => {
  it('should update an existing note', (done) => {
    request(app)
      .patch('/notes/' + notes[0]._id)
      .send({
        body: 'New Text',
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.body).toBe('New Text');

        Note.findOne({
          _id: notes[0]._id,
        }, (result) => {
          expect(result.body).toBe('New Text');
        });
      })
      .end(done);
  });
});
