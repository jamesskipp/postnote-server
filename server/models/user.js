const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

const UserSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    minLength: 5,
    trim: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email',
    }
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
  tokens: [{
    access: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
  }],
});

UserSchema.methods.toJSON = function usersToJSON() {
  const user = this;
  const userObject = user.toObject();

  return _.pick(userObject, ['id', 'email']);
};

UserSchema.methods.generateAuthToken = function usersGenerateAuthToken() {
  const user = this;
  const access = 'auth';
  const token = jwt.sign({
    _id: user._id.toHexString(),
    access,
  }, process.env.JWT_SECRET).toString();

  user.tokens.push({ access, token });

  return user.save().then(() => token);
};

UserSchema.methods.removeToken = function usersRemoveToken(token) {
  const user = this;

  user.update({
    $pull: {
      tokens: { token },
    },
  });
};

UserSchema.statics.findByToken = function usersStaticFindByToken(token) {
  const User = this;
  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return Promise.reject(error);
  }

  return User.findOne({
    _id: decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth',
  });
}

UserSchema.statics.findByCredentials = function usersStaticFindByCredentials(email, password) {
  const User = this;

  return User.findOne({ email }).then((user) => {
    if (!user) {
      return Promise.reject();
    }

    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          resolve(user);
        } else {
          reject();
        }
      });
    });
  });
};

UserSchema.pre('save', function preSave(next) => {
  const user = this;

  if (user.isModified('password')) {
    bcrypt.genSalt(15, (error, salt) => {
      if (error) {
        console.log('Salt Error');
      }

      bcrypt.hash(user.password, salt, (hashError, hash) => {
        if (hashError) {
          console.log('Hash Error');
        }

        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = { User };
