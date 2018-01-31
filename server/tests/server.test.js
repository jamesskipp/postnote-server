const expect = require('expect');
const request = require('supertest');
const jwt = require('jsonwebtoken');

const { app } = require('./../server');
const { Note } = require('./../models/note');
const { User } = require('./../models/user');
const { populateNotes, populateUsers, notes, users } = require('./seed/seed');

beforeEach(populateNotes);
beforeEach(populateUsers);

const testNote = {
  title: 'Test Title 1',
  body: 'Test Body 1',
};

const badToken = jwt.sign({
  _id: users[0]._id.toHexString(),
  access: 'auth',
}, process.env.JWT_SECRET + 1).toString();

describe('POST /notes', () => {
  it('should save a new note', (done) => {
    request(app)
      .post('/notes')
      .set('x-auth', users[0].tokens[0].token)
      .send(testNote)
      .expect(200)
      .expect((res) => {
        expect(res.body.title).toBe(testNote.title);
        expect(res.body.body).toBe(testNote.body);
      })
      .end(done);
  });

  it('shouldn\'t save a note with a bad token', (done) => {
    request(app)
      .post('/notes')
      .set('x-auth', badToken)
      .send(testNote)
      .expect(401)
      .end(done);
  });
});

describe('GET /notes', () => {
  it('Should get the user\'s notes', (done) => {
    request(app)
      .get('/notes')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.notes[0].title).toBe(notes[0].title);
      })
      .end(done);
  });

  it('shouldn\'t get any notes with a bad token', (done) => {
    request(app)
      .get('/notes')
      .set('x-auth', badToken)
      .expect(401)
      .end(done);
  });
});

describe('PATCH /notes/:title', () => {
  it('should update an existing note', (done) => {
    request(app)
      .patch('/notes/' + notes[0].title)
      .set('x-auth', users[0].tokens[0].token)
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

  // it('shoudln\'t update any notes with a bad token', (done) => {
  //   request(app)
  //     .patch('/notes/' + notes[0].title)
  //     .set('x-auth', badToken)
  //     .send({
  //       body: 'New Text',
  //     })
  //     .expect(401)
  //     .end(done);
  // });
});

describe('POST /users', () => {
  it('should post a new user', (done) => {
    const testUser3 = {
      email: 'TestUser3@email.com',
      password: 'TestPassword3',
    };

    request(app)
      .post('/users')
      .send(testUser3)
      .expect(200)
      .expect((res) => {
        expect(res.body.email).toBe(testUser3.email);
      })
      .end(done);
  });
});
