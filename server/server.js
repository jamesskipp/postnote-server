require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const { ObjectId } = require('mongodb');

const { mongoose } = require('./db/mongoose');
const { Note } = require('./models/note');
const { User } = require('./models/user');

const { authenticate } = require('./middleware/authenticate.js');

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

/**
 * [user description]
 * @type {User}
 */
app.post('/users', async (req, res) => {
  const user = new User({
    email: req.body.email,
    password: req.body.password,
  });

  try {
    await user.save();
    const token = await user.generateAuthToken();

    return res.header('x-auth', token).send(user);
  } catch (error) {
    return res.status(400).send({
      'type': 'error',
      'message': error.message,
    });
  }
});

/**
 * Route: POST /notes
 *
 * Data Params:
 *  Type: JSON
 *  Content: {
 *    "title": [string],
 *    "body": [string]
 *  }
 *
 * Response:
 *  Success:
 *    Code: 200
 *    Content: {
 *      "__v": 0,
 *      "title": "string",
 *      "body": "string",
 *      "createdAt": "Date",
 *      "_id": "number",
 *      "edits": [Date, Date]
 *    }
 *  Error:
 *    Code: 400
 *
 */
app.post('/notes', async (req, res) => {
  const note = new Note({
    title: req.body.title,
    body: req.body.body,
    createdAt: new Date().getTime(),
    // edits: req.body.edits,
    // _creator: req.user._id,
  });

  try {
    const noteSave = await note.save();

    return res.send(noteSave);
  } catch (err) {
    return res.status(400).send({
      'type': 'error',
      'message': err.message,
    });
  }
});

/**
 * Route: GET /notes
 *
 * Data Params:
 *  None
 *
 * Response:
 *  Success:
 *    Code: 200
 *    Content: {
 *      notes: [{
 *        "__v": 0,
 *        "title": "string",
 *        "body": "string",
 *        "createdAt": "Date",
 *        "_id": "number",
 *        "edits": [Date, Date]
 *      }]
 *    }
 *  Error:
 *    Code: 400
 *
 */
app.get('/notes', async (req, res) => {
  try {
    const notes = await Note.find({});

    return res.send({ notes });
  } catch (err) {
    return res.send(err);
  }
});

/**
*
*/
app.patch('/notes/:id', async (req, res) => {
  const { id } = req.params;
  const body = req.body['body'];

  if (!ObjectId.isValid(id)) return res.status(404).send();

  try {
    const note = await Note.findOneAndUpdate({
      _id: id,
    }, {
      $set: {
        body: body,
      },
      $push: {
        edits: new Date().getTime(),
      },
    }, {
      new: true,
    });

    if (!note) return res.status(404).send('Note not found.');

    return res.send(note);
  } catch (err) {
    return res.status(400).send();
  }
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

module.exports = {
  app,
}
