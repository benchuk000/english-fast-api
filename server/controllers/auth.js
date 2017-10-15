'use strict';

const UserModel = require('../models/user');
const config    = require('../config');
const jwt       = require('jsonwebtoken');

exports.signIn = function (req, res, next) {
  const body = req.body;

  if (!body.email || !body.password) {
      res.status(400).end('MUST_PROVIDE_EMAIL_OR_PASSWORD');
  }

  UserModel.findOne({ email: body.email }).exec()
    .then((user) => {
        if (!user) {
            return res.status(401).send('EMAIL_OR_PASSWORD_DONT_MATCH');
        }
        
        res.status(200).send({
            token: jwt.sign({ _id: user._id }, config.JWT_SECRET),
            user: user
        });
    })
    .catch((err) => next(err))
};

exports.signInByToken = function (req, res, next) {
    UserModel.findById(req.user._id).exec()
        .then((user) => {
            if (!user) {
                return res.status(401).send('USER_NOT_FOUND');
            }
            
            res.status(200).send({
                user: user
            });
        })
        .catch((err) => next(err))
  };