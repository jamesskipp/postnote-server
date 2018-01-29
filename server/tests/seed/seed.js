const { Note } = require('./../../models/note');
const { User } = require('./../../models/user');
const { ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');

const notes = [{
  title: 'Test Note 1',
  body: 'Test Body 1',
  createdAt: new Date().getTime(),
  edits: [],
  _id: new ObjectId(),
}, {
  title: 'Test Note 2',
  body: 'Test Body 2',
  createdAt: new Date().getTime(),
  edits: [],
}];

const testUser1ID = new ObjectId();
const testUser2ID = new ObjectId();
const users = [{
  email: 'TestUser1@email.com',
  password: 'TestPassword1',
  tokens: [{
    access: 'auth',
    token: jwt.sign({
      _id: testUser1ID,
      access: 'auth',
    }, process.env.JWT_SECRET).toString(),
  }],
}, {
  email: 'TestUser2@email.com',
  password: 'TestPassword2',
  tokens: [{
    access: 'auth',
    token: jwt.sign({
      _id: testUser2ID,
      access: 'auth',
    }, process.env.JWT_SECRET).toString(),
  }],
}];

const populateNotes = (done) => {
  Note.remove({}).then(() => {
    Note.insertMany(notes);
  }).then(() => {
    done();
  }).catch(() => {});
};

const populateUsers = (done) => {
  User.remove({}).then(() => {
    User.insertMany(users);
  }).then(() => {
    done();
  }).catch(() => {});
};

module.exports = {
  populateNotes,
  populateUsers,
  notes,
  users
}
