'use strict';

const History = require('../models/history');

exports.createHistory = (req, res, next) => {
  const body = req.body;

  const history = new History({ 
    user: req.user._id, 
    questions: body.result
  });

  history.save()
    .then(() => next())
    .catch(err => next(err))
};
