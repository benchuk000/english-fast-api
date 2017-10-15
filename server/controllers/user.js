const User = require('../models/user');

exports.createUser = (req, res, next) => {
  let body = req.body;

  if (!body.email || !body.password) {
    res.status(400).end('Must provide login or password');
  }

  User.findOne({ email: body.email }).exec()
    .then((user) => {
      if (user !== null && user.email === body.email) {
        res.status(401)
          .send('User with email exists');
      }
      else {
        user = new User({
          email: body.email,
          password: body.password
        });

        user.save()
          .then(user => {
            const normalizedUser = {};

            // Remove password from user data.
            user = user._doc

            for (let key in user) {
              if (user.hasOwnProperty(key) && key !== 'password') {
                normalizedUser[key] = user[key]
              }
            }

            res.send(normalizedUser);
          })
          .catch(err => next(err))

      }
    })
    .catch((err) => next(err))
}

exports.getUsers = (req, res, next) => {
  User.find()
    .sort({[req.query.sort]: req.query.sortDir === 'ASC' ? 1 : -1})
    .exec()
    .then(users => res.send(users))
    .catch(err => next(err));
}

exports.getUserById = (req, res, next) => {
  let id = req.params.id;

  User.find({ _id: id }).exec()
    .then(user => res.send(user))
    .catch(err => next(err))
};

exports.updateUserById = (req, res, next) => {
  let id = req.params.id;
  let body = req.body;

  User.findByIdAndUpdate(id, { $set: body }).exec()
    .then(updatedUser => res.send(updatedUser))
    .catch(err => next(err));
}

exports.deleteUserById = (req, res, next) => {
  let id = req.params.id;

  User.findByIdAndRemove(id).exec()
    .then(removedUser => res.send(removedUser))
    .catch(err => next(err));
}