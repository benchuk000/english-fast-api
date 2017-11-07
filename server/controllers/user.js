const User = require('../models/user');
const History = require('../models/history');
const AVERAGE_PERCENT_THRESHOLD = require('../constants/averagePercentThreshold');
const LEVEL_PRIORITY = require('../constants/levelPriority');

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

            user = user._doc;

            for (let key in user) {
              if (user.hasOwnProperty(key) && key !== 'password') {
                normalizedUser[key] = user[key];
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


exports.updateUserSkills = (req, res, next) => {
  let id = req.user._id;

  User.findById(id).exec()
    .then(user => {
      History.find({ user: id}).populate('questions.question').exec()
      .then(histories => {
        const result = {};
        const resultCount = {};
        histories.forEach(history => {
          Object.keys(history.result).forEach(level => {
            Object.keys(history.result[level]).forEach(type => {
              result[level] = Object.assign({}, result[level] || {}, {
                [type]: ((result[level] || {})[type] || 0) + history.result[level][type]
              });

              resultCount[level] = Object.assign({}, resultCount[level] || {}, {
                [type]: ((resultCount[level] || {})[type] || 0) + 1
              });
            });
          });
        });

        console.log('====================================');
        console.log(result);
        console.log('====================================');

        console.log('====================================');
        console.log(resultCount);
        console.log('====================================');

        const averageResult = {};
        Object.keys(result).forEach(level => {
          Object.keys(result[level]).forEach(type => {
            averageResult[level] = Object.assign({}, averageResult[level] || {}, {
              [type]: result[level][type] / resultCount[level][type]
            });
          });
        });

        console.log('====================================');
        console.log(averageResult);
        console.log('====================================');

        const passingLevel = {};
        Object.keys(averageResult).forEach(level => {
          const types = Object.keys(averageResult[level]);
          let percentSum = 0;

          types.forEach(type => {
            percentSum += averageResult[level][type];
          });

          passingLevel[level] = percentSum >= AVERAGE_PERCENT_THRESHOLD * types.length;
        });

        let level = LEVEL_PRIORITY[0];

        for (let levelIndex = 0; levelIndex < LEVEL_PRIORITY.length - 1; levelIndex++) {
          if (passingLevel[LEVEL_PRIORITY[levelIndex]]) {
            level = LEVEL_PRIORITY[levelIndex + 1];
            break;
          }
        }

        user.level = level;
        user.skills = averageResult[level];

        user.save();

        // next(req.body);
        res.send(req.body);
      })
      .catch(err => next(err));
    })
    .catch(err => next(err))
};

exports.deleteUserById = (req, res, next) => {
  let id = req.params.id;

  User.findByIdAndRemove(id).exec()
    .then(removedUser => res.send(removedUser))
    .catch(err => next(err));
}