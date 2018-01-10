const { Note } = require('./../../models/note');
const { ObjectId } = require('mongodb');

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

const populateNotes = (done) => {
  Note.remove({}).then(() => {
    Note.insertMany(notes);
  }).then(() => {
    done();
  }).catch(() => {});
};

module.exports = {
  populateNotes,
  notes
}
