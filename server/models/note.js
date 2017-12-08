const mongoose = require('mongoose');

const Note = mongoose.model('Note', {
  title: {
    type: String,
    required: true,
    minLength: 0,
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
    require: true,
  },
});

module.exports = { Note };
