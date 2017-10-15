'use strict';

const Test = require('../models/test');
const User = require('../models/user');
const _ = require('lodash');

exports.createTest = (req, res, next) => {
  let body = req.body;

  test.save()
    .then(savedTest => {
        savedTest.populate('questions').execPopulate()
          .then(populatedTest => res.send(populatedTest))
          .catch(err => next(err))
    })
    .catch(err => next(err))
};

exports.getTests = (req, res, next) => {
  Test.find()
    .populate('questions')
    .sort({[req.query.sort]: req.query.sortDir === 'ASC' ? 1 : -1})
    .exec()
    .then(tests => res.send(tests))
    .catch(err => next(err));
}

exports.getTestById = (req, res, next) => {
  let id = req.params.id;

  Test.find({ _id: id }).populate('questions').exec()
    .then(test => res.send(test))
    .catch(err => next(err))
};

exports.updateTestById = (req, res, next) => {
  let id = req.params.id;
  let body = req.body;

  Test.findByIdAndUpdate(id, { $set: body }).exec()
    .then(updatedTest => res.send(updatedTest))
    .catch(err => next(err));
}

exports.deleteTestById = (req, res, next) => {
  let id = req.params.id;

  Test.findByIdAndRemove(id).exec()
    .then(removedTest => res.send(removedTest))
    .catch(err => next(err));
}

exports.completeTestById = (req, res, next) => {
  let id = req.params.id;
  let body = req.body;

  Test.findById(id).populate('questions').exec()
    .then(test => {
      const result = body.answers.map((answer, answerIndex) => ({
        trueAnswer: test.questions[answerIndex].trueAnswer,
        isCorrect: _.isEqual(test.questions[answerIndex].trueAnswer, answer)
      }));

      let response = {
        testId: test._id,
        result
      };

      if (test.isSkillsTest) {
        User.findById(req.user._id).exec()
          .then(user => {
            // TODO: colculate user skills

            res.send(response);
          })
          .catch(err > next(err));
        user
      }
    })
    .catch(err => next(err));
}

exports.getSkillsTest = (req, res, next) => {
  Test.findOne({ isSkillsTest: true }).populate('questions').exec()
    .then(test => res.send(test))
    .catch(err => next(err))
};