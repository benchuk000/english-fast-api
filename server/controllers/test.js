'use strict';

const Test = require('../models/test');
const User = require('../models/user');
const _ = require('lodash');

exports.createTest = (req, res, next) => {
  let body = req.body;
  const test = new Test(body);

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

  Test.findById(id).populate('questions').exec()
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
      if (test.isSkillsTest) {
        User.findById(req.user._id).exec()
          .then(user => {
            const result = Object.keys(body.answers).map(questionId => {
              const question = _.find(test.questions, question => question._id.equals(questionId));
              const answers = question.answers;
              const trueAnswer = [];

              for (let index = 0; index < answers.length; index++) {
                if (answers[index].isCorrect) {
                  trueAnswer.push(index);
                }
              }

              return {
                question: questionId,
                isCorrect: _.isEqual(trueAnswer, body.answers[questionId]),
                userAnswer: body.answers[questionId]
              }
            });

            const response = {
              testId: test._id,
              result
            };

            req.body = response;

            next();
          })
          .catch(err => next(err));
      }
    })
    .catch(err => next(err));
}

exports.getSkillsTest = (req, res, next) => {
  Test.findOne({ isSkillsTest: true }).populate('questions').exec()
    .then(test => res.send(test))
    .catch(err => next(err))
};