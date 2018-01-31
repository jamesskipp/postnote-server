const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minLength: 1,
    trim: true,
  },
  body: {
    type: String,
    required: true,
    minLength: 1,
    trim: false,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  edits: {
    type: [Date],
    required: false,
  },
  _creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});

NoteSchema.index({
  _creator: 1,
  title: 1,
}, {
  unique: true,
});

const Note = mongoose.model('Note', NoteSchema);

module.exports = { Note };
